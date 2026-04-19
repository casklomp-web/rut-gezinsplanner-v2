/**
 * Supabase User Store
 * Database-backed user management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';

interface SupabaseUserState {
  users: User[];
  currentUserId: string | null;
  profile: any | null;
  preferences: any | null;
  household: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadUserData: (userId: string) => Promise<void>;
  loadHouseholdMembers: (householdId: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (updates: any) => Promise<void>;
  setCurrentUser: (userId: string) => void;
  createHousehold: (name: string) => Promise<string>;
  joinHousehold: (inviteCode: string) => Promise<void>;
  
  // Getters
  getCurrentUser: () => User | undefined;
  getPrimaryUser: () => User | undefined;
}

// Mock Supabase client for now - will be replaced with actual implementation
const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: async () => ({ data: [], error: null })
      }),
      order: async () => ({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: async () => ({ error: null })
    }),
    upsert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    delete: () => ({
      eq: async () => ({ error: null })
    })
  })
};

export const useSupabaseUserStore = create<SupabaseUserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      profile: null,
      preferences: null,
      household: null,
      isLoading: false,
      error: null,
      
      loadUserData: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // This is a placeholder - actual implementation will use real Supabase
          // For now, we'll just simulate loading
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({
            isLoading: false
          });
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ error: 'Failed to load user data', isLoading: false });
        }
      },
      
      loadHouseholdMembers: async (householdId: string) => {
        // Placeholder implementation
      },
      
      updateProfile: async (updates: Partial<User>) => {
        const { currentUserId, profile } = get();
        if (!currentUserId || !profile) return;
        
        try {
          set({ profile: { ...profile, ...updates } });
        } catch (error) {
          console.error('Error updating profile:', error);
          set({ error: 'Failed to update profile' });
        }
      },
      
      updatePreferences: async (updates: any) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, ...updates } });
      },
      
      setCurrentUser: (userId: string) => set({ currentUserId: userId }),
      
      createHousehold: async (name: string) => {
        const { currentUserId } = get();
        if (!currentUserId) throw new Error('No user');
        
        const mockHousehold = {
          id: `household_${Date.now()}`,
          name,
          invite_code: Math.random().toString(36).substring(2, 10).toUpperCase()
        };
        
        set({ household: mockHousehold });
        return mockHousehold.id;
      },
      
      joinHousehold: async (inviteCode: string) => {
        const mockHousehold = {
          id: `household_${Date.now()}`,
          name: 'Nieuw Huishouden',
          invite_code: inviteCode
        };
        
        set({ household: mockHousehold });
      },
      
      getCurrentUser: () => {
        const { users, currentUserId } = get();
        return users.find(u => u.id === currentUserId);
      },
      
      getPrimaryUser: () => {
        return get().users.find(u => u.role === 'primary');
      }
    }),
    {
      name: 'rut-supabase-user-storage'
    }
  )
);

// Helper functions
function transformProfileToUser(profile: any, preferences: any): User {
  return {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    goals: {
      weightCurrent: preferences?.weight_current || undefined,
      weightGoal: preferences?.weight_goal || undefined,
      calorieTarget: preferences?.calorie_target || undefined,
      proteinTarget: preferences?.protein_target || 120,
      trainingDaysPerWeek: preferences?.training_days_per_week || 2,
      stepsTarget: preferences?.steps_target || 7000
    },
    preferences: {
      dietary: preferences?.dietary || [],
      dislikes: preferences?.dislikes || [],
      allergies: preferences?.allergies || [],
      maxPrepTime: {
        breakfast: preferences?.max_prep_time_breakfast || 5,
        lunch: preferences?.max_prep_time_lunch || 10,
        dinner: preferences?.max_prep_time_dinner || 15
      },
      budgetLevel: preferences?.budget_level || 'moderate'
    },
    schedule: {
      trainingDays: preferences?.training_days || [],
      workBusyDays: preferences?.work_busy_days || []
    },
    notifications: {
      pushEnabled: preferences?.push_enabled || false,
      telegramEnabled: preferences?.telegram_enabled || false,
      telegramChatId: preferences?.telegram_chat_id,
      reminders: {
        breakfast: { 
          enabled: preferences?.reminder_breakfast_enabled ?? true, 
          time: preferences?.reminder_breakfast_time || '07:30' 
        },
        lunch: { 
          enabled: preferences?.reminder_lunch_enabled ?? true, 
          time: preferences?.reminder_lunch_time || '12:00' 
        },
        dinnerPrep: { 
          enabled: preferences?.reminder_dinner_enabled ?? true, 
          time: preferences?.reminder_dinner_time || '17:00' 
        },
        training: { 
          enabled: preferences?.reminder_training_enabled ?? false, 
          time: preferences?.reminder_training_time || '18:00' 
        },
        medication: { 
          enabled: preferences?.reminder_medication_enabled ?? true, 
          time: preferences?.reminder_medication_time || '08:00' 
        }
      }
    },
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at)
  };
}
