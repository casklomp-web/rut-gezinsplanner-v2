/**
 * Meal Database - 20+ eiwitrijke, snelle maaltijden
 * Focus: budget, <15min, autismevriendelijk (voorspelbaar)
 */

import { Meal, Ingredient } from "@/lib/types";

// ============================================================================
// INGREDIENTEN DATABASE
// ============================================================================

export const ingredients: Ingredient[] = [
  // Groente/Fruit
  { id: "ing_banana", name: "Banaan", namePlural: "Bananen", category: "produce", store: "aldi", shelfLife: 5, storage: "room", estimatedPrice: 0.25, priceUnit: "stuk", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_apple", name: "Appel", namePlural: "Appels", category: "produce", store: "aldi", shelfLife: 14, storage: "room", estimatedPrice: 0.30, priceUnit: "stuk", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_broccoli", name: "Broccoli", namePlural: "Broccoli's", category: "produce", store: "aldi", shelfLife: 5, storage: "fridge", estimatedPrice: 1.50, priceUnit: "stuk", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_spinach", name: "Spinazie", namePlural: "Spinazie", category: "produce", store: "aldi", shelfLife: 5, storage: "fridge", estimatedPrice: 2.00, priceUnit: "zak", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_pepper", name: "Paprika", namePlural: "Paprika's", category: "produce", store: "aldi", shelfLife: 7, storage: "fridge", estimatedPrice: 0.80, priceUnit: "stuk", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_lettuce", name: "Sla", namePlural: "Slakoppen", category: "produce", store: "aldi", shelfLife: 5, storage: "fridge", estimatedPrice: 1.20, priceUnit: "stuk", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_tomato", name: "Tomaat", namePlural: "Tomaten", category: "produce", store: "market", shelfLife: 5, storage: "room", estimatedPrice: 0.40, priceUnit: "stuk", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_onion", name: "Ui", namePlural: "Uien", category: "produce", store: "aldi", shelfLife: 21, storage: "room", estimatedPrice: 0.20, priceUnit: "stuk", isStaple: true, buyFrequency: "biweekly" },
  { id: "ing_garlic", name: "Knoflook", namePlural: "Knoflook", category: "produce", store: "aldi", shelfLife: 30, storage: "room", estimatedPrice: 0.50, priceUnit: "bol", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_potato", name: "Aardappel", namePlural: "Aardappels", category: "produce", store: "aldi", shelfLife: 14, storage: "room", estimatedPrice: 2.00, priceUnit: "kg", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_sweet_potato", name: "Zoete aardappel", namePlural: "Zoete aardappels", category: "produce", store: "aldi", shelfLife: 14, storage: "room", estimatedPrice: 2.50, priceUnit: "kg", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_cauliflower", name: "Bloemkool", namePlural: "Bloemkool", category: "produce", store: "aldi", shelfLife: 7, storage: "fridge", estimatedPrice: 2.00, priceUnit: "stuk", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_kale", name: "Boerenkool", namePlural: "Boerenkool", category: "produce", store: "aldi", shelfLife: 7, storage: "fridge", estimatedPrice: 2.50, priceUnit: "zak", isStaple: false, buyFrequency: "weekly" },
  
  // Vlees/Vis
  { id: "ing_chicken_breast", name: "Kipfilet", namePlural: "Kipfilets", category: "meat", store: "aldi", shelfLife: 2, storage: "fridge", estimatedPrice: 8.00, priceUnit: "kg", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_ground_beef", name: "Rundergehakt", namePlural: "Rundergehakt", category: "meat", store: "aldi", shelfLife: 2, storage: "fridge", estimatedPrice: 6.00, priceUnit: "kg", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_sausages", name: "Worst", namePlural: "Worsten", category: "meat", store: "aldi", shelfLife: 5, storage: "fridge", estimatedPrice: 3.00, priceUnit: "pak", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_salmon", name: "Zalmfilet", namePlural: "Zalmfilets", category: "meat", store: "aldi", shelfLife: 2, storage: "fridge", estimatedPrice: 12.00, priceUnit: "kg", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_meatball", name: "Gehaktbal", namePlural: "Gehaktballen", category: "meat", store: "aldi", shelfLife: 2, storage: "fridge", estimatedPrice: 4.00, priceUnit: "pak", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_bacon", name: "Spek", namePlural: "Spek", category: "meat", store: "aldi", shelfLife: 5, storage: "fridge", estimatedPrice: 3.50, priceUnit: "pak", isStaple: false, buyFrequency: "weekly" },
  
  // Zuivel
  { id: "ing_quark", name: "Kwark", namePlural: "Kwark", category: "dairy", store: "aldi", shelfLife: 7, storage: "fridge", estimatedPrice: 1.50, priceUnit: "pak", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_yogurt", name: "Yoghurt", namePlural: "Yoghurt", category: "dairy", store: "aldi", shelfLife: 14, storage: "fridge", estimatedPrice: 1.80, priceUnit: "pak", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_cheese", name: "Kaas", namePlural: "Kaas", category: "dairy", store: "aldi", shelfLife: 14, storage: "fridge", estimatedPrice: 4.00, priceUnit: "stuk", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_cottage_cheese", name: "Cottage cheese", namePlural: "Cottage cheese", category: "dairy", store: "aldi", shelfLife: 7, storage: "fridge", estimatedPrice: 2.00, priceUnit: "pak", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_eggs", name: "Ei", namePlural: "Eieren", category: "dairy", store: "aldi", shelfLife: 14, storage: "fridge", estimatedPrice: 3.00, priceUnit: "doos", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_milk", name: "Melk", namePlural: "Melk", category: "dairy", store: "aldi", shelfLife: 7, storage: "fridge", estimatedPrice: 1.20, priceUnit: "liter", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_butter", name: "Boter", namePlural: "Boter", category: "dairy", store: "aldi", shelfLife: 30, storage: "fridge", estimatedPrice: 2.00, priceUnit: "pak", isStaple: true, buyFrequency: "biweekly" },
  
  // Voorraad
  { id: "ing_oats", name: "Havermout", namePlural: "Havermout", category: "pantry", store: "aldi", shelfLife: 180, storage: "room", estimatedPrice: 2.00, priceUnit: "pak", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_muesli", name: "Muesli", namePlural: "Muesli", category: "pantry", store: "aldi", shelfLife: 180, storage: "room", estimatedPrice: 3.00, priceUnit: "pak", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_pasta", name: "Pasta", namePlural: "Pasta", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 1.50, priceUnit: "pak", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_rice", name: "Rijst", namePlural: "Rijst", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 2.00, priceUnit: "pak", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_wraps", name: "Wraps", namePlural: "Wraps", category: "pantry", store: "aldi", shelfLife: 14, storage: "room", estimatedPrice: 2.50, priceUnit: "pak", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_bread", name: "Brood", namePlural: "Brood", category: "bakery", store: "aldi", shelfLife: 3, storage: "room", estimatedPrice: 2.00, priceUnit: "stuk", isStaple: true, buyFrequency: "weekly" },
  { id: "ing_passata", name: "Passata", namePlural: "Passata", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 1.00, priceUnit: "pak", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_soy_sauce", name: "Sojasaus", namePlural: "Sojasaus", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 2.00, priceUnit: "fles", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_olive_oil", name: "Olijfolie", namePlural: "Olijfolie", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 4.00, priceUnit: "fles", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_spices", name: "Kruiden", namePlural: "Kruiden", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 1.00, priceUnit: "pot", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_hummus", name: "Hummus", namePlural: "Hummus", category: "pantry", store: "aldi", shelfLife: 7, storage: "fridge", estimatedPrice: 2.00, priceUnit: "bak", isStaple: false, buyFrequency: "weekly" },
  { id: "ing_beans", name: "Bonen", namePlural: "Bonen", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 1.00, priceUnit: "blik", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_soup", name: "Soep", namePlural: "Soep", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 2.00, priceUnit: "pak", isStaple: true, buyFrequency: "monthly" },
  
  // Diepvries
  { id: "ing_frozen_veg", name: "Diepvriesgroente", namePlural: "Diepvriesgroente", category: "frozen", store: "aldi", shelfLife: 180, storage: "freezer", estimatedPrice: 2.00, priceUnit: "zak", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_frozen_fish", name: "Diepvriesvis", namePlural: "Diepvriesvis", category: "frozen", store: "aldi", shelfLife: 90, storage: "freezer", estimatedPrice: 5.00, priceUnit: "pak", isStaple: false, buyFrequency: "monthly" },
  
  // Noten/Zaden
  { id: "ing_nuts", name: "Notenmix", namePlural: "Notenmix", category: "pantry", store: "aldi", shelfLife: 90, storage: "room", estimatedPrice: 3.00, priceUnit: "zak", isStaple: true, buyFrequency: "monthly" },
  { id: "ing_cinnamon", name: "Kaneel", namePlural: "Kaneel", category: "pantry", store: "aldi", shelfLife: 365, storage: "room", estimatedPrice: 1.50, priceUnit: "pot", isStaple: true, buyFrequency: "monthly" },
];

// Helper functie om ingredient op te halen
export function getIngredient(id: string): Ingredient | undefined {
  return ingredients.find(i => i.id === id);
}
