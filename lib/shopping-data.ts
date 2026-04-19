export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  checked: boolean
  fromMeal?: string
}

export interface ShoppingCategory {
  id: string
  name: string
  icon: string
  items: ShoppingItem[]
}

export const weekContext = {
  weekNumber: 16,
  dateRange: '14 - 20 april',
  plannedMeals: 5,
}

export const mockShoppingData: ShoppingCategory[] = [
  {
    id: 'groente',
    name: 'Groente & Fruit',
    icon: '🥬',
    items: [
      { id: '1', name: 'Tomaten', quantity: 4, unit: 'stuks', checked: false, fromMeal: 'Pasta Primavera' },
      { id: '2', name: 'Courgette', quantity: 2, unit: 'stuks', checked: false, fromMeal: 'Pasta Primavera' },
      { id: '3', name: 'Citroen', quantity: 1, unit: 'stuk', checked: true, fromMeal: 'Gegrilde Zalm' },
    ],
  },
  {
    id: 'vlees',
    name: 'Vlees & Vis',
    icon: '🥩',
    items: [
      { id: '4', name: 'Kipfilet', quantity: 400, unit: 'gram', checked: false, fromMeal: 'Kip Curry' },
      { id: '5', name: 'Zalmfilet', quantity: 300, unit: 'gram', checked: false, fromMeal: 'Gegrilde Zalm' },
    ],
  },
  {
    id: 'zuivel',
    name: 'Zuivel & Eieren',
    icon: '🥛',
    items: [
      { id: '6', name: 'Eieren', quantity: 6, unit: 'stuks', checked: false },
      { id: '7', name: 'Griekse yoghurt', quantity: 500, unit: 'gram', checked: true },
    ],
  },
  {
    id: 'overig',
    name: 'Overig',
    icon: '📦',
    items: [
      { id: '8', name: 'Pasta', quantity: 500, unit: 'gram', checked: false, fromMeal: 'Pasta Primavera' },
      { id: '9', name: 'Rijst', quantity: 300, unit: 'gram', checked: false, fromMeal: 'Kip Curry' },
    ],
  },
]