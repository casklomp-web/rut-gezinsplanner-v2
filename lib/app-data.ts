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