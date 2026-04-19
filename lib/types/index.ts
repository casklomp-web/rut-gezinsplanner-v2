/**
 * Core TypeScript types for Rut App
 * Gezinsplanner voor vetverlies - Autismevriendelijk
 */

// ============================================================================
// ENUMS
// ============================================================================

export type DayOfWeek = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday";

export type MealCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export type MealType = "breakfast" | "lunch" | "dinner";

export type MealTag = 
  | "high-protein" 
  | "quick"                    // < 15 min
  | "ultra-quick"              // < 5 min
  | "budget"
  | "kid-friendly"
  | "meal-prep"
  | "one-pan"
  | "no-cook"
  | "vegetarian"
  | "freezer-friendly";

export type Store = 
  | "aldi" 
  | "lidl" 
  | "ah"                       // Albert Heijn
  | "jumbo"
  | "dirk"
  | "market"                   // markt/groenteboer
  | "other";

export type StoreCategory = 
  | "produce"                  // groente/fruit
  | "bakery"                   // brood/bakker
  | "meat"                     // vlees/vis
  | "dairy"                    // zuivel/eieren
  | "frozen"                   // diepvries
  | "pantry"                   // voorraadkast
  | "drinks"                   // drinken
  | "household"                // huishoudelijk
  | "snacks";                  // snoep/chips (minimaal)

// ============================================================================
// USER
// ============================================================================

export interface User {
  id: string;
  name: string;
  role: "primary" | "secondary";
  
  goals: {
    weightCurrent?: number;
    weightGoal?: number;
    calorieTarget?: number;
    proteinTarget?: number;
    trainingDaysPerWeek: number;
    stepsTarget: number;
  };
  
  preferences: {
    dietary: string[];
    dislikes: string[];
    allergies: string[];
    maxPrepTime: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    budgetLevel: "tight" | "moderate" | "flexible";
  };
  
  schedule: {
    trainingDays: DayOfWeek[];
    workBusyDays: DayOfWeek[];
  };
  
  notifications: {
    pushEnabled: boolean;
    telegramEnabled: boolean;
    telegramChatId?: string;
    reminders: {
      breakfast: { enabled: boolean; time: string };
      lunch: { enabled: boolean; time: string };
      dinnerPrep: { enabled: boolean; time: string };
      training: { enabled: boolean; time: string };
      medication: { enabled: boolean; time: string };
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MEAL (Template)
// ============================================================================

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  tags: MealTag[];
  prepTime: number;
  cookTime: number;
  ingredients: MealIngredient[];
  instructions: string[];
  variants: {
    family: MealVariant;
    primary: MealVariant;
    child?: MealVariant;
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isFavorite: boolean;
  frequency: "weekly" | "biweekly" | "monthly" | "occasional";
  season?: ("spring" | "summer" | "autumn" | "winter")[];
  isPrepFriendly: boolean;
  keepsForDays: number;
  shoppingCategory: StoreCategory;
  estimatedCost: number;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface MealVariant {
  portions: number;
  notes?: string;
  ingredientMods?: {
    ingredientId: string;
    multiplier: number;
  }[];
}

export interface MealIngredient {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  scalable: boolean;
  isOptional: boolean;
}

// ============================================================================
// INGREDIENT
// ============================================================================

export interface Ingredient {
  id: string;
  name: string;
  namePlural: string;
  category: StoreCategory;
  store: Store;
  shelfLife: number;
  storage: "room" | "fridge" | "freezer";
  estimatedPrice: number;
  priceUnit: string;
  isStaple: boolean;
  buyFrequency: "weekly" | "biweekly" | "monthly";
}

// ============================================================================
// WEEK & DAY
// ============================================================================

export interface Week {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  days: Day[];
  isGenerated: boolean;
  isLocked: boolean;
  shoppingList?: ShoppingList;
  stats: {
    mealsPlanned: number;
    trainingDays: number;
    estimatedCost: number;
    prepMoments: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Day {
  id: string;
  date: string;
  dayOfWeek: DayOfWeek;
  meals: {
    breakfast: MealInstance;
    lunch: MealInstance;
    dinner: MealInstance;
    snacks: MealInstance[];
  };
  training?: {
    scheduled: boolean;
    time?: string;
    description?: string;
    completed: boolean;
  };
  checkins: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    training: boolean;
    walking: boolean;
    stepsActual?: number;
    medication: boolean;
    sleepRoutine: boolean;
  };
  isTrainingDay: boolean;
  isMealPrepDay: boolean;
  isLeftoverDay: boolean;
  notes: string;
}

export interface MealInstance {
  id: string;
  mealId: string;
  mealName: string;
  variant: "family" | "primary" | "child";
  portions: number;
  completed: boolean;
  completedAt?: Date;
  isLeftover: boolean;
  fromPrepDay?: string;
  isModified: boolean;
  notes?: string;
}

// ============================================================================
// SHOPPING LIST
// ============================================================================

export interface ShoppingList {
  id: string;
  weekId: string;
  generatedAt: Date;
  byStore: StoreSection[];
  estimatedTotal: number;
  actualTotal?: number;
  status: "generated" | "in-progress" | "completed";
}

export interface StoreSection {
  store: Store;
  order: number;
  categories: CategorySection[];
  subtotal: number;
}

export interface CategorySection {
  category: StoreCategory;
  order: number;
  items: ShoppingItem[];
}

export interface ShoppingItem {
  id: string;
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  displayText: string;
  checked: boolean;
  checkedAt?: Date;
  isFresh: boolean;
  buyThisWeek: boolean;
  estimatedPrice: number;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface ReminderMessage {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "training" | "medication" | "prep" | "weekly";
  title: string;
  body: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  channel: "push" | "telegram" | "both";
}

// ============================================================================
// TASKS
// ============================================================================

export * from "./task";
