/**
 * Maaltijden Database - Eiwitrijke, snelle recepten
 */

import { Meal } from "@/lib/types";

export const meals: Meal[] = [
  // ONTBIJT
  {
    id: "meal_oats_banana",
    name: "Havermout met banaan",
    category: "breakfast",
    tags: ["high-protein", "ultra-quick", "budget", "meal-prep"],
    prepTime: 5,
    cookTime: 0,
    ingredients: [
      { ingredientId: "ing_oats", name: "Havermout", amount: 60, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_milk", name: "Melk", amount: 200, unit: "ml", scalable: true, isOptional: false },
      { ingredientId: "ing_banana", name: "Banaan", amount: 1, unit: "stuk", scalable: false, isOptional: false },
      { ingredientId: "ing_quark", name: "Kwark", amount: 100, unit: "g", scalable: true, isOptional: true },
    ],
    instructions: ["Doe havermout in kom", "Voeg melk toe", "Snijd banaan erover", "Roer kwark erdoor", "Laat 2 minuten staan"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Extra kwark" },
      child: { portions: 1, notes: "Minder havermout" }
    },
    nutrition: { calories: 350, protein: 20, carbs: 50, fat: 8 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: true,
    keepsForDays: 3,
    shoppingCategory: "pantry",
    estimatedCost: 1.50
  },
  {
    id: "meal_yogurt_muesli",
    name: "Yoghurt met muesli",
    category: "breakfast",
    tags: ["quick", "budget", "no-cook"],
    prepTime: 3,
    cookTime: 0,
    ingredients: [
      { ingredientId: "ing_yogurt", name: "Yoghurt", amount: 200, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_muesli", name: "Muesli", amount: 50, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_banana", name: "Banaan", amount: 0.5, unit: "stuk", scalable: false, isOptional: true },
    ],
    instructions: ["Doe yoghurt in kom", "Schep muesli erop", "Snijd banaan erover"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Voeg kwark toe" },
      child: { portions: 1, notes: "Meer banaan" }
    },
    nutrition: { calories: 300, protein: 12, carbs: 45, fat: 10 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "dairy",
    estimatedCost: 1.20
  },
  {
    id: "meal_eggs_toast",
    name: "Eieren met toast",
    category: "breakfast",
    tags: ["high-protein", "quick", "budget"],
    prepTime: 10,
    cookTime: 5,
    ingredients: [
      { ingredientId: "ing_eggs", name: "Eieren", amount: 2, unit: "stuk", scalable: true, isOptional: false },
      { ingredientId: "ing_bread", name: "Brood", amount: 2, unit: "snede", scalable: true, isOptional: false },
      { ingredientId: "ing_butter", name: "Boter", amount: 5, unit: "g", scalable: true, isOptional: true },
    ],
    instructions: ["Bak eieren", "Rooster brood", "Smeer boter", "Serveer"],
    variants: {
      family: { portions: 3, notes: "2 eieren pp" },
      primary: { portions: 1, notes: "3 eieren" },
      child: { portions: 1, notes: "1 ei" }
    },
    nutrition: { calories: 400, protein: 22, carbs: 35, fat: 18 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "dairy",
    estimatedCost: 2.00
  },
  {
    id: "meal_french_toast",
    name: "Wentelteefjes",
    category: "breakfast",
    tags: ["kid-friendly", "quick"],
    prepTime: 15,
    cookTime: 10,
    ingredients: [
      { ingredientId: "ing_bread", name: "Brood", amount: 4, unit: "snede", scalable: true, isOptional: false },
      { ingredientId: "ing_eggs", name: "Eieren", amount: 2, unit: "stuk", scalable: true, isOptional: false },
      { ingredientId: "ing_milk", name: "Melk", amount: 100, unit: "ml", scalable: true, isOptional: false },
      { ingredientId: "ing_cinnamon", name: "Kaneel", amount: 1, unit: "tl", scalable: false, isOptional: true },
      { ingredientId: "ing_butter", name: "Boter", amount: 10, unit: "g", scalable: true, isOptional: false },
    ],
    instructions: ["Klop ei met melk", "Week brood", "Bak in boter", "Serveer"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Kwark topping" },
      child: { portions: 1, notes: "Geen kaneel" }
    },
    nutrition: { calories: 450, protein: 18, carbs: 55, fat: 15 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "bakery",
    estimatedCost: 2.50
  },
  // LUNCH
  {
    id: "meal_wrap_chicken",
    name: "Wrap met kip",
    category: "lunch",
    tags: ["high-protein", "quick", "budget", "kid-friendly"],
    prepTime: 10,
    cookTime: 5,
    ingredients: [
      { ingredientId: "ing_wraps", name: "Wraps", amount: 1, unit: "stuk", scalable: true, isOptional: false },
      { ingredientId: "ing_chicken_breast", name: "Kipfilet", amount: 100, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_lettuce", name: "Sla", amount: 0.5, unit: "stuk", scalable: false, isOptional: false },
      { ingredientId: "ing_hummus", name: "Hummus", amount: 2, unit: "el", scalable: true, isOptional: true },
    ],
    instructions: ["Bak kip", "Smeer hummus", "Beleg wrap", "Rol op"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Extra kip" },
      child: { portions: 1, notes: "Kip apart" }
    },
    nutrition: { calories: 350, protein: 30, carbs: 35, fat: 10 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "meat",
    estimatedCost: 3.00
  },
  {
    id: "meal_wrap_beef",
    name: "Wrap met gehakt",
    category: "lunch",
    tags: ["high-protein", "quick", "budget"],
    prepTime: 10,
    cookTime: 8,
    ingredients: [
      { ingredientId: "ing_wraps", name: "Wraps", amount: 1, unit: "stuk", scalable: true, isOptional: false },
      { ingredientId: "ing_ground_beef", name: "Rundergehakt", amount: 100, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_pepper", name: "Paprika", amount: 0.5, unit: "stuk", scalable: false, isOptional: false },
      { ingredientId: "ing_spices", name: "Kruiden", amount: 1, unit: "tl", scalable: false, isOptional: true },
    ],
    instructions: ["Bak gehakt", "Snijd paprika", "Beleg wrap", "Rol op"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Extra gehakt" },
      child: { portions: 1, notes: "Mild" }
    },
    nutrition: { calories: 400, protein: 28, carbs: 30, fat: 18 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "meat",
    estimatedCost: 3.50
  },
  {
    id: "meal_soup_bread",
    name: "Soep met brood",
    category: "lunch",
    tags: ["quick", "budget", "kid-friendly"],
    prepTime: 5,
    cookTime: 5,
    ingredients: [
      { ingredientId: "ing_soup", name: "Soep", amount: 1, unit: "pak", scalable: true, isOptional: false },
      { ingredientId: "ing_bread", name: "Brood", amount: 2, unit: "snede", scalable: true, isOptional: false },
      { ingredientId: "ing_cheese", name: "Kaas", amount: 30, unit: "g", scalable: true, isOptional: true },
    ],
    instructions: ["Warm soep", "Rooster brood", "Beleg met kaas", "Serveer"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Kwark in soep" },
      child: { portions: 1, notes: "Milde soep" }
    },
    nutrition: { calories: 300, protein: 12, carbs: 40, fat: 10 },
    isFavorite: false,
    frequency: "biweekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "pantry",
    estimatedCost: 2.50
  },
  // DINER
  {
    id: "meal_rice_bowl",
    name: "Rijstbowl met kip",
    category: "dinner",
    tags: ["high-protein", "quick", "budget", "meal-prep", "one-pan"],
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      { ingredientId: "ing_rice", name: "Rijst", amount: 200, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_chicken_breast", name: "Kipfilet", amount: 400, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_broccoli", name: "Broccoli", amount: 1, unit: "stuk", scalable: false, isOptional: false },
      { ingredientId: "ing_soy_sauce", name: "Sojasaus", amount: 3, unit: "el", scalable: true, isOptional: false },
      { ingredientId: "ing_garlic", name: "Knoflook", amount: 2, unit: "teen", scalable: false, isOptional: true },
    ],
    instructions: ["Kook rijst", "Bak kip", "Voeg broccoli toe", "Schep saus erdoor"],
    variants: {
      family: { portions: 4, notes: "Kook 4 porties" },
      primary: { portions: 1, notes: "Meer kip" },
      child: { portions: 1, notes: "Kip apart" }
    },
    nutrition: { calories: 500, protein: 40, carbs: 55, fat: 12 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: true,
    keepsForDays: 3,
    shoppingCategory: "meat",
    estimatedCost: 6.00
  },
  {
    id: "meal_pasta_bolognese",
    name: "Pasta bolognese",
    category: "dinner",
    tags: ["high-protein", "quick", "budget", "kid-friendly", "meal-prep"],
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      { ingredientId: "ing_pasta", name: "Pasta", amount: 300, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_ground_beef", name: "Rundergehakt", amount: 400, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_passata", name: "Passata", amount: 500, unit: "ml", scalable: true, isOptional: false },
      { ingredientId: "ing_onion", name: "Ui", amount: 1, unit: "stuk", scalable: false, isOptional: false },
      { ingredientId: "ing_garlic", name: "Knoflook", amount: 2, unit: "teen", scalable: false, isOptional: true },
      { ingredientId: "ing_spices", name: "Kruiden", amount: 1, unit: "el", scalable: false, isOptional: true },
    ],
    instructions: ["Fruit ui", "Bak gehakt", "Voeg saus toe", "Kook pasta", "Meng"],
    variants: {
      family: { portions: 4, notes: "Dubbele saus" },
      primary: { portions: 1, notes: "Meer gehakt" },
      child: { portions: 1, notes: "Saus apart" }
    },
    nutrition: { calories: 600, protein: 35, carbs: 70, fat: 20 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: true,
    keepsForDays: 3,
    shoppingCategory: "meat",
    estimatedCost: 5.50
  },
  {
    id: "meal_cauliflower_sausage",
    name: "Bloemkool met worst",
    category: "dinner",
    tags: ["kid-friendly", "quick", "budget", "one-pan"],
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      { ingredientId: "ing_cauliflower", name: "Bloemkool", amount: 1, unit: "stuk", scalable: false, isOptional: false },
      { ingredientId: "ing_sausages", name: "Worst", amount: 6, unit: "stuk", scalable: true, isOptional: false },
      { ingredientId: "ing_potato", name: "Aardappel", amount: 600, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_butter", name: "Boter", amount: 20, unit: "g", scalable: true, isOptional: true },
    ],
    instructions: ["Kook aardappels", "Kook bloemkool", "Bak worst", "Serveer"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Meer groente" },
      child: { portions: 1, notes: "Apart" }
    },
    nutrition: { calories: 550, protein: 25, carbs: 60, fat: 22 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "meat",
    estimatedCost: 5.00
  },
  {
    id: "meal_chicken_sweet_potato",
    name: "Kip met zoete aardappel",
    category: "dinner",
    tags: ["high-protein", "quick", "one-pan"],
    prepTime: 10,
    cookTime: 20,
    ingredients: [
      { ingredientId: "ing_chicken_breast", name: "Kipfilet", amount: 400, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_sweet_potato", name: "Zoete aardappel", amount: 600, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_spinach", name: "Spinazie", amount: 200, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_olive_oil", name: "Olijfolie", amount: 2, unit: "el", scalable: true, isOptional: false },
      { ingredientId: "ing_spices", name: "Kruiden", amount: 1, unit: "tl", scalable: false, isOptional: true },
    ],
    instructions: ["Schil aardappels", "Bak kip", "Voeg aardappel toe", "Voeg spinazie toe"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Meer kip" },
      child: { portions: 1, notes: "Normale aardappel" }
    },
    nutrition: { calories: 480, protein: 42, carbs: 45, fat: 15 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "meat",
    estimatedCost: 7.00
  },
  {
    id: "meal_wraps_beans",
    name: "Wraps met bonen",
    category: "dinner",
    tags: ["high-protein", "quick", "budget", "vegetarian"],
    prepTime: 10,
    cookTime: 10,
    ingredients: [
      { ingredientId: "ing_wraps", name: "Wraps", amount: 4, unit: "stuk", scalable: true, isOptional: false },
      { ingredientId: "ing_beans", name: "Bonen", amount: 2, unit: "blik", scalable: true, isOptional: false },
      { ingredientId: "ing_cheese", name: "Kaas", amount: 100, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_pepper", name: "Paprika", amount: 2, unit: "stuk", scalable: false, isOptional: false },
      { ingredientId: "ing_spices", name: "Kruiden", amount: 1, unit: "tl", scalable: false, isOptional: true },
    ],
    instructions: ["Warm bonen", "Snijd paprika", "Beleg wraps", "Rol op"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Extra kaas" },
      child: { portions: 1, notes: "Mild" }
    },
    nutrition: { calories: 450, protein: 22, carbs: 50, fat: 18 },
    isFavorite: false,
    frequency: "biweekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "pantry",
    estimatedCost: 4.50
  },
  {
    id: "meal_salmon_potato",
    name: "Zalm met aardappel",
    category: "dinner",
    tags: ["high-protein", "kid-friendly"],
    prepTime: 10,
    cookTime: 20,
    ingredients: [
      { ingredientId: "ing_salmon", name: "Zalmfilet", amount: 400, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_potato", name: "Aardappel", amount: 600, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_frozen_veg", name: "Diepvriesgroente", amount: 300, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_butter", name: "Boter", amount: 20, unit: "g", scalable: true, isOptional: true },
    ],
    instructions: ["Kook aardappels", "Bak zalm", "Warm groente", "Serveer"],
    variants: {
      family: { portions: 3, notes: "Standaard" },
      primary: { portions: 1, notes: "Meer zalm" },
      child: { portions: 1, notes: "Zalm apart" }
    },
    nutrition: { calories: 520, protein: 38, carbs: 50, fat: 20 },
    isFavorite: false,
    frequency: "weekly",
    isPrepFriendly: false,
    keepsForDays: 0,
    shoppingCategory: "meat",
    estimatedCost: 10.00
  },
  {
    id: "meal_stamppot",
    name: "Stamppot boerenkool",
    category: "dinner",
    tags: ["kid-friendly", "budget", "meal-prep"],
    prepTime: 15,
    cookTime: 20,
    ingredients: [
      { ingredientId: "ing_potato", name: "Aardappel", amount: 800, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_kale", name: "Boerenkool", amount: 300, unit: "g", scalable: true, isOptional: false },
      { ingredientId: "ing_meatball", name: "Gehaktbal", amount: 6, unit: "stuk", scalable: true, isOptional: false },
      { ingredientId: "ing_butter", name: "Boter", amount: 30, unit: "g", scalable: true, isOptional: true },
    ],
    instructions: ["Kook aardappels", "Voeg boerenkool toe", "Stamp", "Bak gehaktballen"],
    variants: {
      family: { portions: 4, notes: "Dubbele portie" },
      primary: { portions: 1, notes: "Meer boerenkool" },
      child: { portions: 1, notes: "Zonder boerenkool" }
    },
    nutrition: { calories: 580, protein: 28, carbs: 65, fat: 22 },
    isFavorite: true,
    frequency: "weekly",
    isPrepFriendly: true,
    keepsForDays: 2,
    shoppingCategory: "meat",
    estimatedCost: 6.50
  },
];

// Helper functies
export function getMeal(id: string): Meal | undefined {
  return meals.find(m => m.id === id);
}

export function getMealsByCategory(category: string): Meal[] {
  return meals.filter(m => m.category === category);
}

export function getMealsByTag(tag: string): Meal[] {
  return meals.filter(m => m.tags.includes(tag as any));
}

export function getFavoriteMeals(): Meal[] {
  return meals.filter(m => m.isFavorite);
}
