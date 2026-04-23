/**
 * Zustand Store - User State with Secure Auth
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";
import { hashPassword, verifyPassword, generateSecureId, generateSessionToken } from "@/lib/auth/password";

interface Session {
  token: string;
  expiresAt: number; // timestamp
}

interface UserState {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  session: Session | null;
  
  // Auth actions
  registerUser: (name: string, email: string, password: string, familyName: string) => Promise<{ success: boolean; error?: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  isAuthenticated: () => boolean;
  
  // User actions
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  getPrimaryUser: () => User | undefined;
  
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Extended User type with auth fields
type UserWithAuth = User & {
  email: string;
  passwordHash: string;
  familyName: string;
};

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isLoading: false,
      session: null,
      _hasHydrated: false,
      
      registerUser: async (name, email, password, familyName) => {
        const state = get();
        
        // Check if email already exists
        const existingUser = state.users.find(u => (u as UserWithAuth).email === email);
        if (existingUser) {
          return { success: false, error: 'Dit e-mailadres is al in gebruik' };
        }
        
        // Validate password
        if (password.length < 6) {
          return { success: false, error: 'Wachtwoord moet minimaal 6 tekens bevatten' };
        }
        
        try {
          const passwordHash = await hashPassword(password);
          
          const newUser: UserWithAuth = {
            id: generateSecureId(),
            name,
            email,
            passwordHash,
            familyName,
            role: 'primary',
            goals: {
              trainingDaysPerWeek: 3,
              stepsTarget: 10000,
            },
            preferences: {
              dietary: [],
              dislikes: [],
              allergies: [],
              maxPrepTime: {
                breakfast: 15,
                lunch: 20,
                dinner: 45,
              },
              budgetLevel: 'moderate',
            },
            schedule: {
              trainingDays: ['monday', 'wednesday', 'friday'],
              workBusyDays: [],
            },
            notifications: {
              pushEnabled: false,
              telegramEnabled: false,
              reminders: {
                breakfast: { enabled: false, time: '08:00' },
                lunch: { enabled: false, time: '12:00' },
                dinnerPrep: { enabled: false, time: '17:00' },
                training: { enabled: false, time: '18:00' },
                medication: { enabled: false, time: '09:00' },
              },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          const session: Session = {
            token: generateSessionToken(),
            expiresAt: Date.now() + SESSION_DURATION,
          };
          
          set({
            users: [...state.users, newUser],
            currentUser: newUser,
            session,
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Er is iets misgegaan bij het aanmaken van je account' };
        }
      },
      
      loginUser: async (email, password) => {
        const state = get();
        
        const user = state.users.find(u => (u as UserWithAuth).email === email) as UserWithAuth | undefined;
        
        if (!user) {
          return { success: false, error: 'Ongeldig e-mailadres of wachtwoord' };
        }
        
        try {
          const isValid = await verifyPassword(password, user.passwordHash);
          
          if (!isValid) {
            return { success: false, error: 'Ongeldig e-mailadres of wachtwoord' };
          }
          
          const session: Session = {
            token: generateSessionToken(),
            expiresAt: Date.now() + SESSION_DURATION,
          };
          
          set({
            currentUser: user,
            session,
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Er is iets misgegaan bij het inloggen' };
        }
      },
      
      logoutUser: () => {
        set({
          currentUser: null,
          session: null,
        });
      },
      
      isAuthenticated: () => {
        const state = get();
        if (!state.session || !state.currentUser) return false;
        
        // Check if session is expired
        if (Date.now() > state.session.expiresAt) {
          // Auto logout
          state.logoutUser();
          return false;
        }
        
        return true;
      },
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      addUser: (user) => set((state) => ({ 
        users: [...state.users, user],
        currentUser: state.currentUser || user
      })),
      
      updateUser: (userId, updates) => set((state) => ({
        users: state.users.map(u => 
          u.id === userId ? { ...u, ...updates, updatedAt: new Date() } : u
        ),
        currentUser: state.currentUser?.id === userId 
          ? { ...state.currentUser, ...updates, updatedAt: new Date() }
          : state.currentUser
      })),
      
      getPrimaryUser: () => {
        const state = get();
        return state.users.find(u => u.role === 'primary') || state.currentUser || undefined;
      },
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "rut-user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        
        // Check session expiry on rehydrate
        if (state?.session && Date.now() > state.session.expiresAt) {
          state.logoutUser();
        }
      },
    }
  )
);
