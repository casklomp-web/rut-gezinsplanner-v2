/**
 * Supabase Week Store
 * Database-backed week management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Week, Day, MealInstance } from '@/lib/types';
import { generateWeek, swapMeal } from '@/lib/logic/weekGenerator';
import { generateShoppingList } from '@/lib/logic/shoppingList';

interface SupabaseWeekState {
  currentWeek: Week | null;
  weekHistory: Week[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadCurrentWeek: (householdId: string) => Promise<void>;
  generateNewWeek: (user: any) => Promise<void>;
  saveWeekToDatabase: (week: Week, householdId: string) => Promise<void>;
  setCurrentWeek: (week: Week) => void;
  updateDay: (dayId: string, updates: Partial<Day>) => void;
  toggleMealComplete: (dayId: string, mealType: 'breakfast' | 'lunch' | 'dinner') => Promise<void>;
  toggleTrainingComplete: (dayId: string) => Promise<void>;
  toggleCheckin: (dayId: string, checkinType: keyof Day['checkins']) => Promise<void>;
  swapMeal: (dayId: string, mealType: 'breakfast' | 'lunch' | 'dinner', newMealId: string) => void;
  generateShoppingListForWeek: () => void;
  deleteWeek: (weekId: string) => Promise<void>;
  
  // Getters
  getToday: () => Day | undefined;
  getDay: (dayId: string) => Day | undefined;
}

export const useSupabaseWeekStore = create<SupabaseWeekState>()(
  persist(
    (set, get) => ({
      currentWeek: null,
      weekHistory: [],
      isLoading: false,
      error: null,
      
      loadCurrentWeek: async (householdId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Placeholder - will be replaced with actual Supabase query
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ isLoading: false });
        } catch (error) {
          console.error('Error loading week:', error);
          set({ error: 'Failed to load week', isLoading: false });
        }
      },
      
      generateNewWeek: async (user: any) => {
        const newWeek = generateWeek(new Date(), user);
        
        set(state => ({
          currentWeek: newWeek,
          weekHistory: state.currentWeek 
            ? [state.currentWeek, ...state.weekHistory].slice(0, 4)
            : state.weekHistory
        }));
      },
      
      saveWeekToDatabase: async (week: Week, householdId: string) => {
        // Placeholder implementation
        console.log('Saving week to database:', week.id);
      },
      
      setCurrentWeek: (week) => set({ currentWeek: week }),
      
      updateDay: (dayId, updates) => {
        const week = get().currentWeek;
        if (!week) return;
        
        const updatedDays = week.days.map(d => 
          d.id === dayId ? { ...d, ...updates } : d
        );
        
        set({
          currentWeek: { ...week, days: updatedDays, updatedAt: new Date() }
        });
      },
      
      toggleMealComplete: async (dayId, mealType) => {
        const week = get().currentWeek;
        if (!week) return;
        
        const updatedDays = week.days.map(d => {
          if (d.id !== dayId) return d;
          
          const meal = d.meals[mealType];
          const newCompleted = !meal.completed;
          
          return {
            ...d,
            meals: {
              ...d.meals,
              [mealType]: {
                ...meal,
                completed: newCompleted,
                completedAt: newCompleted ? new Date() : undefined
              }
            },
            checkins: {
              ...d.checkins,
              [mealType]: newCompleted
            }
          };
        });
        
        set({
          currentWeek: { ...week, days: updatedDays, updatedAt: new Date() }
        });
      },
      
      toggleTrainingComplete: async (dayId) => {
        const week = get().currentWeek;
        if (!week) return;
        
        const updatedDays = week.days.map(d => {
          if (d.id !== dayId || !d.training) return d;
          
          return {
            ...d,
            training: {
              ...d.training,
              completed: !d.training.completed
            },
            checkins: {
              ...d.checkins,
              training: !d.training.completed
            }
          };
        });
        
        set({
          currentWeek: { ...week, days: updatedDays, updatedAt: new Date() }
        });
      },
      
      toggleCheckin: async (dayId, checkinType) => {
        const week = get().currentWeek;
        if (!week) return;
        
        const updatedDays = week.days.map(d => {
          if (d.id !== dayId) return d;
          
          return {
            ...d,
            checkins: {
              ...d.checkins,
              [checkinType]: !d.checkins[checkinType]
            }
          };
        });
        
        set({
          currentWeek: { ...week, days: updatedDays, updatedAt: new Date() }
        });
      },
      
      swapMeal: (dayId, mealType, newMealId) => {
        const week = get().currentWeek;
        if (!week) return;
        
        const updatedDays = week.days.map(d => {
          if (d.id !== dayId) return d;
          return swapMeal(d, mealType, newMealId);
        });
        
        set({
          currentWeek: { ...week, days: updatedDays, updatedAt: new Date() }
        });
      },
      
      generateShoppingListForWeek: () => {
        const week = get().currentWeek;
        if (!week) return;
        
        const shoppingList = generateShoppingList(week);
        
        set({
          currentWeek: { ...week, shoppingList, updatedAt: new Date() }
        });
      },
      
      deleteWeek: async (weekId: string) => {
        set(state => ({
          currentWeek: state.currentWeek?.id === weekId ? null : state.currentWeek,
          weekHistory: state.weekHistory.filter(w => w.id !== weekId)
        }));
      },
      
      getToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().currentWeek?.days.find(d => d.date === today);
      },
      
      getDay: (dayId) => {
        return get().currentWeek?.days.find(d => d.id === dayId);
      }
    }),
    {
      name: 'rut-supabase-week-storage'
    }
  )
);
