/**
 * Zustand Store - User State
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";

interface UserState {
  users: User[];
  currentUserId: string | null;
  
  // Actions
  setUsers: (users: User[]) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  setCurrentUser: (userId: string) => void;
  
  // Getters
  getCurrentUser: () => User | undefined;
  getPrimaryUser: () => User | undefined;
}

// Default users voor Cas en partner
const defaultUsers: User[] = [
  {
    id: "user_cas",
    name: "Cas",
    role: "secondary",
    goals: {
      weightCurrent: 103,
      weightGoal: 88,
      proteinTarget: 150,
      trainingDaysPerWeek: 0,
      stepsTarget: 7000
    },
    preferences: {
      dietary: ["high-protein"],
      dislikes: ["pizza"],
      allergies: [],
      maxPrepTime: {
        breakfast: 5,
        lunch: 10,
        dinner: 15
      },
      budgetLevel: "moderate"
    },
    schedule: {
      trainingDays: [],
      workBusyDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
    },
    notifications: {
      pushEnabled: true,
      telegramEnabled: true,
      telegramChatId: undefined,
      reminders: {
        breakfast: { enabled: true, time: "07:30" },
        lunch: { enabled: true, time: "12:00" },
        dinnerPrep: { enabled: true, time: "17:00" },
        training: { enabled: false, time: "18:00" },
        medication: { enabled: true, time: "08:00" }
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "user_partner",
    name: "Partner",
    role: "primary",
    goals: {
      weightCurrent: undefined,
      weightGoal: undefined,
      calorieTarget: 1800,
      proteinTarget: 120,
      trainingDaysPerWeek: 2,
      stepsTarget: 7000
    },
    preferences: {
      dietary: ["high-protein"],
      dislikes: [],
      allergies: [],
      maxPrepTime: {
        breakfast: 5,
        lunch: 10,
        dinner: 15
      },
      budgetLevel: "moderate"
    },
    schedule: {
      trainingDays: ["tuesday", "thursday"],
      workBusyDays: ["monday", "wednesday", "friday"]
    },
    notifications: {
      pushEnabled: true,
      telegramEnabled: false,
      reminders: {
        breakfast: { enabled: true, time: "07:30" },
        lunch: { enabled: true, time: "12:00" },
        dinnerPrep: { enabled: true, time: "17:00" },
        training: { enabled: true, time: "18:00" },
        medication: { enabled: true, time: "08:00" }
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      currentUserId: "user_cas",
      
      setUsers: (users) => set({ users }),
      
      updateUser: (userId, updates) => {
        const users = get().users.map(u => 
          u.id === userId ? { ...u, ...updates, updatedAt: new Date() } : u
        );
        set({ users });
      },
      
      setCurrentUser: (userId) => set({ currentUserId: userId }),
      
      getCurrentUser: () => {
        const { users, currentUserId } = get();
        return users.find(u => u.id === currentUserId);
      },
      
      getPrimaryUser: () => {
        return get().users.find(u => u.role === "primary");
      }
    }),
    {
      name: "rut-user-storage"
    }
  )
);
