/**
 * Zustand Store - User State
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";

interface UserState {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  getPrimaryUser: () => User | undefined;
  
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Default user for initial state
const createDefaultUser = (): User => ({
  id: 'default-user',
  name: 'Gebruiker',
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
});

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isLoading: false,
      _hasHydrated: false,
      
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
        return state.users.find(u => u.role === 'primary') || state.currentUser || createDefaultUser();
      },
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "rut-user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
