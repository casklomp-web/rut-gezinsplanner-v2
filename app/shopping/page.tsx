"use client";

import { useWeekStore } from "@/lib/store/weekStore";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { exportShoppingListAsText } from "@/lib/logic/shoppingList";

const storeNames: Record<string, string> = {
  aldi: "ALDI",
  lidl: "Lidl",
  ah: "Albert Heijn",
  jumbo: "Jumbo",
  dirk: "Dirk",
  market: "Markt",
  other: "Overig"
};

const categoryNames: Record<string, string> = {
  produce: "🥬 Groente & Fruit",
  bakery: "🍞 Brood & Bakker",
  meat: "🥩 Vlees & Vis",
  dairy: "🥛 Zuivel",
  frozen: "🧊 Diepvries",
  pantry: "🍚 Voorraad",
  drinks: "🥤 Drinken",
  household: "🧽 Huishoudelijk",
  snacks: "🍿 Snacks"
};

export default function ShoppingPage() {
  const { currentWeek } = useWeekStore();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  
  const shoppingList = currentWeek?.shoppingList;

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const copyToClipboard = () => {
    if (!shoppingList) return;
    const text = exportShoppingListAsText(shoppingList);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!shoppingList) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-[#2D3436] mb-4">
          Boodschappen
        </h1>
        <p className="text-gray-500 text-center py-8">
          Geen boodschappenlijst beschikbaar. Genereer eerst een week.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3436]">
            Boodschappen
          </h1>
          <p className="text-sm text-gray-500">
            Week {currentWeek?.weekNumber}
          </p>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-sm text-[#4A90A4] hover:text-[#3a7a8c]"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Gekopieerd!" : "Kopieer"}
        </button>
      </div>

      {/* Totaal */}
      <div className="bg-[#4A90A4]/10 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Geschat totaal:</span>
          <span className="text-2xl font-bold text-[#4A90A4]">
            €{shoppingList.estimatedTotal}
          </span>
        </div>
      </div>

      {/* Winkels */}
      <div className="space-y-6">
        {shoppingList.byStore.map((storeSection) => (
          <div key={storeSection.store} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-[#2D3436]">
                  🏪 {storeNames[storeSection.store]}
                </h2>
                <span className="text-sm text-gray-500">
                  €{storeSection.subtotal.toFixed(0)}
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {storeSection.categories.map((catSection) => (
                <div key={catSection.category} className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {categoryNames[catSection.category]}
                  </h3>
                  <div className="space-y-2">
                    {catSection.items.map((item) => {
                      const isChecked = checkedItems.has(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className="flex items-center gap-3 w-full text-left"
                        >
                          <div className={`
                            w-5 h-5 rounded border flex items-center justify-center transition-colors
                            ${isChecked 
                              ? "bg-[#7CB342] border-[#7CB342]" 
                              : "border-gray-300"
                            }
                          `}>
                            {isChecked && <Check size={12} className="text-white" />}
                          </div>
                          <span className={`
                            text-sm flex-1
                            ${isChecked ? "text-gray-400 line-through" : "text-[#2D3436]"}
                          `}>
                            {item.displayText}
                          </span>
                          {item.isFresh && (
                            <span className="text-xs text-[#4A90A4]">Vers</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
