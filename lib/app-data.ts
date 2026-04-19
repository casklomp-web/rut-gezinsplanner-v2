// Types
export interface Recipe {
  id: string
  name: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'makkelijk' | 'gemiddeld' | 'moeilijk'
  tags: string[]
  isFavorite: boolean
}

export interface DayPlan {
  date: string
  dayName: string
  dayShort: string
  meals: {
    dinner?: Recipe
  }
}

export interface WeeklyFocus {
  id: string
  label: string
}

export interface Household {
  name: string
  adults: number
  children: number
}

// Mock Recipes
export const mockRecipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Pasta Primavera',
    description: 'Kleurrijke pasta met seizoensgroenten en een lichte citroensaus',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'makkelijk',
    tags: ['vegetarisch', 'pasta', 'snel'],
    isFavorite: true,
  },
  {
    id: 'r2',
    name: 'Gegrilde Zalm',
    description: 'Mals gegrilde zalm met asperges en citroen',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'gemiddeld',
    tags: ['vis', 'gezond', 'glutenvrij'],
    isFavorite: false,
  },
  {
    id: 'r3',
    name: 'Kip Curry',
    description: 'Romige kip curry met groenten en basmatirijst',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'gemiddeld',
    tags: ['kip', 'curry', 'rijst'],
    isFavorite: true,
  },
  {
    id: 'r4',
    name: 'Ratatouille',
    description: 'Franse groenteschotel met aubergine, courgette en paprika',
    prepTime: 25,
    cookTime: 40,
    servings: 4,
    difficulty: 'gemiddeld',
    tags: ['vegetarisch', 'frans', 'gezond'],
    isFavorite: false,
  },
  {
    id: 'r5',
    name: 'Biefstuk met Groenten',
    description: 'Malse biefstuk met gegrilde groenten en kruidenboter',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: 'moeilijk',
    tags: ['vlees', 'biefstuk', 'speciaal'],
    isFavorite: false,
  },
  {
    id: 'r6',
    name: 'Tomatensoep',
    description: 'Romige tomatensoep met basilicum en croutons',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'makkelijk',
    tags: ['soep', 'vegetarisch', 'snel'],
    isFavorite: true,
  },
]

// Mock Week Plan
export const mockWeekPlan: DayPlan[] = [
  {
    date: '2025-04-14',
    dayName: 'Maandag',
    dayShort: 'Ma',
    meals: {
      dinner: mockRecipes[0],
    },
  },
  {
    date: '2025-04-15',
    dayName: 'Dinsdag',
    dayShort: 'Di',
    meals: {
      dinner: mockRecipes[1],
    },
  },
  {
    date: '2025-04-16',
    dayName: 'Woensdag',
    dayShort: 'Wo',
    meals: {},
  },
  {
    date: '2025-04-17',
    dayName: 'Donderdag',
    dayShort: 'Do',
    meals: {
      dinner: mockRecipes[2],
    },
  },
  {
    date: '2025-04-18',
    dayName: 'Vrijdag',
    dayShort: 'Vr',
    meals: {
      dinner: mockRecipes[4],
    },
  },
  {
    date: '2025-04-19',
    dayName: 'Zaterdag',
    dayShort: 'Za',
    meals: {},
  },
  {
    date: '2025-04-20',
    dayName: 'Zondag',
    dayShort: 'Zo',
    meals: {
      dinner: mockRecipes[3],
    },
  },
]

// Mock Current Week
export const currentWeek = {
  weekNumber: 16,
  dateRange: '14 - 20 april',
}

// Mock Weekly Focus Options
export const weeklyFocusOptions: WeeklyFocus[] = [
  { id: 'meer-rust', label: 'Meer rust' },
  { id: 'budget', label: 'Budget' },
  { id: 'meer-groente', label: 'Meer groente' },
  { id: 'geen-voorkeur', label: 'Geen voorkeur' },
]

// Mock Household
export const mockHousehold: Household = {
  name: 'De Jansen Familie',
  adults: 2,
  children: 2,
}

// Recipe Ingredients (mock data - in real app this comes from database)
export interface Ingredient {
  name: string
  amount: number
  unit: string
  category: 'groente' | 'vlees' | 'zuivel' | 'overig'
}

export const recipeIngredients: Record<string, Ingredient[]> = {
  'r1': [
    { name: 'Pasta', amount: 400, unit: 'g', category: 'overig' },
    { name: 'Cherry tomaten', amount: 300, unit: 'g', category: 'groente' },
    { name: 'Courgette', amount: 2, unit: 'stuks', category: 'groente' },
    { name: 'Knoflook', amount: 3, unit: 'teentjes', category: 'groente' },
    { name: 'Olijfolie', amount: 3, unit: 'el', category: 'overig' },
    { name: 'Parmezaan', amount: 50, unit: 'g', category: 'zuivel' },
    { name: 'Basilicum', amount: 1, unit: 'handje', category: 'groente' },
  ],
  'r2': [
    { name: 'Zalmfilet', amount: 400, unit: 'g', category: 'vlees' },
    { name: 'Groene asperges', amount: 300, unit: 'g', category: 'groente' },
    { name: 'Citroen', amount: 1, unit: 'stuk', category: 'groente' },
    { name: 'Olijfolie', amount: 2, unit: 'el', category: 'overig' },
    { name: 'Dille', amount: 1, unit: 'el', category: 'groente' },
  ],
  'r3': [
    { name: 'Kipfilet', amount: 500, unit: 'g', category: 'vlees' },
    { name: 'Curry pasta', amount: 2, unit: 'el', category: 'overig' },
    { name: 'Kokosmelk', amount: 400, unit: 'ml', category: 'overig' },
    { name: 'Paprika', amount: 2, unit: 'stuks', category: 'groente' },
    { name: 'Ui', amount: 1, unit: 'stuk', category: 'groente' },
    { name: 'Basmatirijst', amount: 300, unit: 'g', category: 'overig' },
  ],
  'r4': [
    { name: 'Aubergine', amount: 2, unit: 'stuks', category: 'groente' },
    { name: 'Courgette', amount: 2, unit: 'stuks', category: 'groente' },
    { name: 'Paprika', amount: 2, unit: 'stuks', category: 'groente' },
    { name: 'Tomatenblokjes', amount: 400, unit: 'g', category: 'groente' },
    { name: 'Knoflook', amount: 4, unit: 'teentjes', category: 'groente' },
    { name: 'Tijm', amount: 2, unit: 'takjes', category: 'groente' },
  ],
  'r5': [
    { name: 'Biefstuk', amount: 400, unit: 'g', category: 'vlees' },
    { name: 'Champignons', amount: 250, unit: 'g', category: 'groente' },
    { name: 'Sperziebonen', amount: 300, unit: 'g', category: 'groente' },
    { name: 'Boter', amount: 50, unit: 'g', category: 'zuivel' },
    { name: 'Tijm', amount: 2, unit: 'takjes', category: 'groente' },
  ],
  'r6': [
    { name: 'Tomaten', amount: 1, unit: 'kg', category: 'groente' },
    { name: 'Ui', amount: 2, unit: 'stuks', category: 'groente' },
    { name: 'Knoflook', amount: 3, unit: 'teentjes', category: 'groente' },
    { name: 'Bouillon', amount: 500, unit: 'ml', category: 'overig' },
    { name: 'Room', amount: 100, unit: 'ml', category: 'zuivel' },
    { name: 'Basilicum', amount: 1, unit: 'handje', category: 'groente' },
  ],
}

// Generate shopping list from week plan
export function generateShoppingListFromWeekPlan(weekPlan: DayPlan[]) {
  const ingredients: Map<string, { name: string; amount: number; unit: string; category: string; fromMeals: string[] }> = new Map()

  weekPlan.forEach((day) => {
    if (day.meals.dinner) {
      const recipe = day.meals.dinner
      const recipeIngs = recipeIngredients[recipe.id] || []
      
      recipeIngs.forEach((ing) => {
        const key = `${ing.name}-${ing.unit}`
        if (ingredients.has(key)) {
          const existing = ingredients.get(key)!
          existing.amount += ing.amount
          if (!existing.fromMeals.includes(recipe.name)) {
            existing.fromMeals.push(recipe.name)
          }
        } else {
          ingredients.set(key, {
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            category: ing.category,
            fromMeals: [recipe.name],
          })
        }
      })
    }
  })

  // Group by category
  const categories = {
    groente: { id: 'groente', name: 'Groente & Fruit', icon: '🥬', items: [] as any[] },
    vlees: { id: 'vlees', name: 'Vlees & Vis', icon: '🥩', items: [] as any[] },
    zuivel: { id: 'zuivel', name: 'Zuivel & Eieren', icon: '🥛', items: [] as any[] },
    overig: { id: 'overig', name: 'Overig', icon: '📦', items: [] as any[] },
  }

  let idCounter = 1
  ingredients.forEach((ing) => {
    const category = categories[ing.category as keyof typeof categories]
    category.items.push({
      id: String(idCounter++),
      name: ing.name,
      quantity: ing.amount,
      unit: ing.unit,
      checked: false,
      fromMeal: ing.fromMeals.length === 1 ? ing.fromMeals[0] : `${ing.fromMeals.length} maaltijden`,
    })
  })

  return Object.values(categories).filter((cat) => cat.items.length > 0)
}