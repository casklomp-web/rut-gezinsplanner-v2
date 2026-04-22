/**
 * Zustand Store - Week State
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Week, Day, MealInstance, ShoppingList } from "@/lib/types";
import { generateWeek, swapMeal } from "@/lib/logic/weekGenerator";
import { generateShoppingList as generateShoppingListLogic } from "@/lib/logic/shoppingList";
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
  swapMealBetweenDays: (sourceDayId: string, sourceMealType: "breakfast" | "lunch" | "dinner", targetDayId: string, targetMealType: "breakfast" | "lunch" | "dinner") => void;
  generateShoppingList: () => void;
  updateShoppingItem: (itemId: string, checked: boolean) => void;
  addShoppingItem: (item: { name: string; amount: number; unit: string; estimatedPrice: number }) => void;
  removeShoppingItem: (itemId: string) => void;
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
        if (!primaryUser) {
          set({ error: 'Geen gebruiker gevonden', isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const newWeek = generateWeek(new Date(), primaryUser);

          // Auto-generate shopping list for new week
          const shoppingList = generateShoppingListLogic(newWeek);
          const weekWithShopping = { ...newWeek, shoppingList };

          set(state => ({
            currentWeek: weekWithShopping,
            weekHistory: state.currentWeek
              ? [state.currentWeek, ...state.weekHistory].slice(0, 4)
              : state.weekHistory,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Week generation error:', error);
          set({
            error: error instanceof Error ? error.message : 'Kon week niet genereren',
            isLoading: false
          });
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

        const updatedWeek = { ...week, days: updatedDays, updatedAt: new Date() };

        // Auto-regenerate shopping list when meals change
        const shoppingList = generateShoppingListLogic(updatedWeek);

        set({
          currentWeek: { ...updatedWeek, shoppingList }
        });
      },
      
      swapMealBetweenDays: (sourceDayId: string, sourceMealType: "breakfast" | "lunch" | "dinner", targetDayId: string, targetMealType: "breakfast" | "lunch" | "dinner") => {
        const week = get().currentWeek;
        if (!week) return;

        const sourceDay = week.days.find(d => d.id === sourceDayId);
        const targetDay = week.days.find(d => d.id === targetDayId);
        if (!sourceDay || !targetDay) return;

        const sourceMeal = sourceDay.meals[sourceMealType];
        const targetMeal = targetDay.meals[targetMealType];

        const updatedDays = week.days.map(d => {
          if (d.id === sourceDayId) {
            return {
              ...d,
              meals: {
                ...d.meals,
                [sourceMealType]: {
                  ...targetMeal,
                  completed: false,
                  completedAt: undefined
                }
              }
            };
          }
          if (d.id === targetDayId) {
            return {
              ...d,
              meals: {
                ...d.meals,
                [targetMealType]: {
                  ...sourceMeal,
                  completed: false,
                  completedAt: undefined
                }
              }
            };
          }
          return d;
        });

        const updatedWeek = { ...week, days: updatedDays, updatedAt: new Date() };

        // Auto-regenerate shopping list when meals change
        const shoppingList = generateShoppingListLogic(updatedWeek);

        set({
          currentWeek: { ...updatedWeek, shoppingList }
        });
      },
      
      generateShoppingList: () => {
        const week = get().currentWeek;
        if (!week) return;
        
        const shoppingList = generateShoppingListLogic(week);
        
        set({
          currentWeek: { ...week, shoppingList, updatedAt: new Date() }
        });
      },

      updateShoppingItem: (itemId: string, checked: boolean) => {
        const week = get().currentWeek;
        if (!week || !week.shoppingList) return;

        const updatedShoppingList: ShoppingList = {
          ...week.shoppingList,
          byStore: week.shoppingList.byStore.map(store => ({
            ...store,
            categories: store.categories.map(cat => ({
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, checked } : item
              )
            }))
          }))
        };

        set({
          currentWeek: { ...week, shoppingList: updatedShoppingList, updatedAt: new Date() }
        });
      },

      addShoppingItem: (item) => {
        const week = get().currentWeek;
        if (!week || !week.shoppingList) return;

        const newItem = {
          id: `manual_${Date.now()}`,
          ingredientId: `manual_${Date.now()}`,
          name: item.name,
          amount: item.amount,
          unit: item.unit,
          displayText: `${item.name} (${item.amount} ${item.unit})`,
          checked: false,
          isFresh: false,
          buyThisWeek: true,
          estimatedPrice: item.estimatedPrice,
        };

        // Add to "other" store, "pantry" category
        const updatedShoppingList: ShoppingList = {
          ...week.shoppingList,
          estimatedTotal: week.shoppingList.estimatedTotal + item.estimatedPrice,
          byStore: week.shoppingList.byStore.map(store => {
            if (store.store === 'other') {
              return {
                ...store,
                subtotal: store.subtotal + item.estimatedPrice,
                categories: store.categories.map(cat => {
                  if (cat.category === 'pantry') {
                    return {
                      ...cat,
                      items: [...cat.items, newItem],
                    };
                  }
                  return cat;
                }),
              };
            }
            return store;
          }),
        };

        set({
          currentWeek: { ...week, shoppingList: updatedShoppingList, updatedAt: new Date() }
        });
      },

      removeShoppingItem: (itemId: string) => {
        const week = get().currentWeek;
        if (!week || !week.shoppingList) return;

        let removedPrice = 0;

        const updatedShoppingList: ShoppingList = {
          ...week.shoppingList,
          byStore: week.shoppingList.byStore.map(store => ({
            ...store,
            categories: store.categories.map(cat => ({
              ...cat,
              items: cat.items.filter(item => {
                if (item.id === itemId) {
                  removedPrice = item.estimatedPrice;
                  return false;
                }
                return true;
              }),
            })),
          })),
        };

        updatedShoppingList.estimatedTotal = Math.max(0, updatedShoppingList.estimatedTotal - removedPrice);

        set({
          currentWeek: { ...week, shoppingList: updatedShoppingList, updatedAt: new Date() }
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
