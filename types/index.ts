export interface Household {
  id: string
  name: string
  created_at: string
}

export interface HouseholdMember {
  id: string
  household_id: string
  name: string
  role: 'admin' | 'member'
  created_at: string
}

export interface Meal {
  id: string
  name: string
  category: 'breakfast' | 'lunch' | 'dinner'
  ingredients: string[]
}

export interface MealPlan {
  id: string
  household_id: string
  week_starting: string
  days: MealPlanDay[]
  generated_at: string
}

export interface MealPlanDay {
  date: string
  breakfast_meal_id: string | null
  lunch_meal_id: string | null
  dinner_meal_id: string | null
}

export interface ShoppingList {
  id: string
  meal_plan_id: string
  items: ShoppingItem[]
  created_at: string
}

export interface ShoppingItem {
  name: string
  amount: string
  category: 'produce' | 'pantry' | 'dairy' | 'meat' | 'other'
  checked: boolean
}
