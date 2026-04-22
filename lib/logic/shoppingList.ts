/**
 * Shopping List Generator
 * Maakt boodschappenlijst van weekmenu
 */

import { Week, ShoppingList, StoreSection, CategorySection, ShoppingItem, Store, StoreCategory } from "@/lib/types";
import { ingredients } from "@/lib/data/ingredients";
import { meals } from "@/lib/data/meals";

// Volgorde van winkels (prioriteit)
const STORE_ORDER: Store[] = ["aldi", "lidl", "ah", "jumbo", "market", "other"];

// Volgorde van categorieën in winkel (looproute)
const CATEGORY_ORDER: StoreCategory[] = [
  "produce",      // Groente/fruit eerst
  "bakery",       // Brood
  "meat",         // Vlees
  "dairy",        // Zuivel
  "frozen",       // Diepvries
  "pantry",       // Voorraad
  "drinks",       // Drinken
  "household",    // Huishoudelijk
  "snacks"        // Snoep (laatst)
];

// Helper: sommeer ingrediënten
function aggregateIngredients(week: Week): Map<string, { amount: number; unit: string; isFresh: boolean }> {
  const aggregated = new Map<string, { amount: number; unit: string; isFresh: boolean }>();
  
  for (const day of week.days) {
    const mealInstances = [day.meals.breakfast, day.meals.lunch, day.meals.dinner];
    
    for (const instance of mealInstances) {
      const meal = meals.find(m => m.id === instance.mealId);
      if (!meal) continue;
      
      for (const mi of meal.ingredients) {
        if (mi.isOptional) continue;
        
        const ingredient = ingredients.find(i => i.id === mi.ingredientId);
        if (!ingredient) continue;
        
        const current = aggregated.get(mi.ingredientId);
        const amount = mi.scalable ? mi.amount * instance.portions : mi.amount;
        
        if (current) {
          current.amount += amount;
        } else {
          aggregated.set(mi.ingredientId, {
            amount,
            unit: mi.unit,
            isFresh: ingredient.shelfLife <= 5
          });
        }
      }
    }
  }
  
  return aggregated;
}

// Helper: formatteer hoeveelheid voor weergave
function formatAmount(amount: number, unit: string, name: string): string {
  if (amount >= 1000 && unit === "g") {
    return `${(amount / 1000).toFixed(1)} kg`;
  }
  if (unit === "stuk" && amount > 1) {
    return `${Math.ceil(amount)} stuks`;
  }
  return `${Math.ceil(amount)} ${unit}`;
}

// Genereer boodschappenlijst
export function generateShoppingList(week: Week): ShoppingList {
  const aggregated = aggregateIngredients(week);
  
  // Groepeer per winkel en categorie
  const byStoreMap = new Map<Store, Map<StoreCategory, ShoppingItem[]>>();
  let totalCost = 0;
  
  aggregated.forEach((data, ingredientId) => {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;
    
    // Bereken prijs (veilig)
    let price = ingredient.estimatedPrice;
    
    // Alleen converteren als eenheden logisch zijn
    if (data.unit === "g" && ingredient.priceUnit === "kg") {
      price = (data.amount / 1000) * ingredient.estimatedPrice;
    } else if (data.unit === "ml" && ingredient.priceUnit === "liter") {
      price = (data.amount / 1000) * ingredient.estimatedPrice;
    } else if (data.unit === ingredient.priceUnit) {
      // Zelfde eenheid: direct vermenigvuldigen
      price = data.amount * ingredient.estimatedPrice;
    } else {
      // Verschillende eenheden: gebruik geschatte prijs als basis
      // en voeg een kleine multiplier toe voor hoeveelheid
      price = ingredient.estimatedPrice * Math.min(data.amount, 5);
    }
    
    // Cap prijs op €50 per item (veiligheidsmaatregel)
    price = Math.min(price, 50);
    
    totalCost += price;
    
    // Maak item
    const item: ShoppingItem = {
      id: `si_${ingredientId}_${week.id}`,
      ingredientId,
      name: ingredient.name,
      amount: data.amount,
      unit: data.unit,
      displayText: `${ingredient.name} (${formatAmount(data.amount, data.unit, ingredient.name)})`,
      checked: false,
      isFresh: data.isFresh,
      buyThisWeek: !ingredient.isStaple,
      estimatedPrice: price
    };
    
    // Voeg toe aan juiste winkel en categorie
    const store = ingredient.store;
    const category = ingredient.category;
    
    if (!byStoreMap.has(store)) {
      byStoreMap.set(store, new Map());
    }
    
    const storeMap = byStoreMap.get(store)!;
    if (!storeMap.has(category)) {
      storeMap.set(category, []);
    }
    
    storeMap.get(category)!.push(item);
  });
  
  // Converteer naar array structuur
  const byStore: StoreSection[] = [];
  
  for (const store of STORE_ORDER) {
    const storeMap = byStoreMap.get(store);
    if (!storeMap) continue;
    
    const categories: CategorySection[] = [];
    let storeTotal = 0;
    
    for (const category of CATEGORY_ORDER) {
      const items = storeMap.get(category);
      if (!items || items.length === 0) continue;
      
      categories.push({
        category,
        order: CATEGORY_ORDER.indexOf(category),
        items
      });
      
      storeTotal += items.reduce((sum, item) => sum + item.estimatedPrice, 0);
    }
    
    if (categories.length > 0) {
      byStore.push({
        store,
        order: STORE_ORDER.indexOf(store),
        categories,
        subtotal: storeTotal
      });
    }
  }
  
  return {
    id: `sl_${week.id}`,
    weekId: week.id,
    generatedAt: new Date(),
    byStore,
    estimatedTotal: Math.round(totalCost),
    status: "generated"
  };
}

// Exporteer als platte tekst (voor kopiëren)
export function exportShoppingListAsText(list: ShoppingList): string {
  let text = `🛒 Boodschappenlijst\n`;
  text += `==================\n\n`;
  
  for (const storeSection of list.byStore) {
    text += `🏪 ${storeSection.store.toUpperCase()}\n`;
    text += `-------------------\n`;
    
    for (const catSection of storeSection.categories) {
      text += `\n${catSection.category}:\n`;
      
      for (const item of catSection.items) {
        const checkbox = item.checked ? "[x]" : "[ ]";
        text += `  ${checkbox} ${item.displayText}\n`;
      }
    }
    
    text += `\nSubtotaal: €${storeSection.subtotal.toFixed(2)}\n\n`;
  }
  
  text += `==================\n`;
  text += `Totaal: €${list.estimatedTotal.toFixed(2)}\n`;
  
  return text;
}
