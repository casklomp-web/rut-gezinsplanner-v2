/**
 * Zustand Store - Week State
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Week, Day, MealInstance } from "@/lib/types";
import { generateWeek, swapMeal } from "@/lib/logic/weekGenerator";
import { generateShoppingList } from "@/lib/logic/shoppingList";
import { useUserStore } from "./userStore";

interface WeekState {
  currentWeek: Week | null;
  weekHistory: Week[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  generateNewWeek: () => void;
  setCurrentWeek: (week: Week) => void;
  updateDay: (dayId: string, updates: Partial<Day>) => void;
  toggleMealComplete: (dayId: string, mealType: "breakfast" | "lunch" | "dinner") => void;
  toggleTrainingComplete: (dayId: string) => void;
  toggleCheckin: (dayId: string, checkinType: keyof Day["checkins"]) => void;
  swapMeal: (dayId: string, mealType: "breakfast" | "lunch" | "dinner", newMealId: string) => void;
  generateShoppingList: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getToday: () => Day | undefined;
  getDay: (dayId: string) => Day | undefined;
}

export const useWeekStore = create<WeekState>()(
  persist(
    (set, get) => ({
      currentWeek: null,
      weekHistory: [],
      isLoading: false,
      error: null,
      
      generateNewWeek: () => {
        const primaryUser = useUserStore.getState().getPrimaryUser();
        if (!primaryUser) return;
        
        set({ isLoading: true });
        
        try {
          const newWeek = generateWeek(new Date(), primaryUser);
          
          set(state => ({
            currentWeek: newWeek,
            weekHistory: state.currentWeek 
              ? [state.currentWeek, ...state.weekHistory].slice(0, 4)
              : state.weekHistory,
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to generate week', isLoading: false });
        }
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
      
      toggleMealComplete: (dayId, mealType) => {
        const week = get().currentWeek;
        if (!week) return;
        
        const updatedDays = week.days.map(d => {
          if (d.id !== dayId) return d;
          
          const meal = d.meals[mealType];
          return {
            ...d,
            meals: {
              ...d.meals,
              [mealType]: {
                ...meal,
                completed: !meal.completed,
                completedAt: !meal.completed ? new Date() : undefined
              }
            },
            checkins: {
              ...d.checkins,
              [mealType]: !meal.completed
            }
          };
        });
        
        set({
          currentWeek: { ...week, days: updatedDays, updatedAt: new Date() }
        });
      },
      
      toggleTrainingComplete: (dayId) => {
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
      
      toggleCheckin: (dayId, checkinType) => {
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
      
      generateShoppingList: () => {
        const week = get().currentWeek;
        if (!week) return;
        
        const shoppingList = generateShoppingList(week);
        
        set({
          currentWeek: { ...week, shoppingList, updatedAt: new Date() }
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      getToday: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().currentWeek?.days.find(d => d.date === today);
      },
      
      getDay: (dayId) => {
        return get().currentWeek?.days.find(d => d.id === dayId);
      }
    }),
    {
      name: "rut-week-storage"
    }
  )
);
