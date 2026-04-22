'use client';

import { useWeekStore } from "@/lib/store/weekStore";
import { ShoppingListSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/Button";
import { Check, Copy, ShoppingCart, CalendarDays, FileDown, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import { exportShoppingListAsText } from "@/lib/logic/shoppingList";
import { exportShoppingListToPDF } from "@/lib/logic/pdfExport";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import { SwipeableItem, PullToRefresh } from "@/components/ui/Swipeable";
import { useHaptic, HAPTIC_PATTERNS } from "@/components/providers/HapticProvider";
import { isFeatureEnabled } from "@/components/providers/FeatureProvider";
import { trackEvent, AnalyticsEvents } from "@/components/providers/FeatureProvider";
import { useOffline } from "@/components/providers/OfflineProvider";
import { Suspense } from "react";
import { PriceComparison } from "@/components/features/PriceComparison";
import { VoiceInputButton } from "@/components/features/VoiceInputButton";
import { AddIngredientModal } from "@/components/shopping/AddIngredientModal";
import { ShoppingItem, Ingredient } from "@/lib/types";

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

function ShoppingPageContent() {
  const { currentWeek, isLoading, generateShoppingList, updateShoppingItem } = useWeekStore();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { vibrate } = useHaptic();
  const { triggerSync } = useOffline();
  
  const shoppingList = currentWeek?.shoppingList;

  const handleRefresh = async () => {
    await triggerSync();
    return new Promise<void>((resolve) => setTimeout(resolve, 500));
  };

  const toggleItem = (itemId: string, itemName?: string) => {
    const newChecked = new Set(checkedItems);
    const isChecking = !newChecked.has(itemId);
    if (isChecking) {
      newChecked.add(itemId);
      vibrate(HAPTIC_PATTERNS.SUCCESS);
      trackEvent(AnalyticsEvents.SHOPPING_ITEM_CHECKED, {
        itemId,
        itemName,
        checked: true,
      });
    } else {
      newChecked.delete(itemId);
      vibrate(HAPTIC_PATTERNS.LIGHT);
    }
    setCheckedItems(newChecked);
  };

  const handleSwipeComplete = (itemId: string, itemName?: string) => {
    toggleItem(itemId, itemName);
  };

  const copyToClipboard = () => {
    if (!shoppingList) return;
    const text = exportShoppingListAsText(shoppingList);
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Gekopieerd naar klembord');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToPDF = () => {
    if (!shoppingList) return;
    exportShoppingListToPDF(shoppingList);
    toast.success('PDF gegenereerd');
    trackEvent(AnalyticsEvents.SHOPPING_LIST_EXPORTED, {
      format: 'pdf',
      weekNumber: currentWeek?.weekNumber,
    });
  };

  const clearAllChecked = () => {
    setCheckedItems(new Set());
    toast.success('Alle items vrijgegeven');
  };

  const handleVoiceSearch = useCallback((query: string) => {
    toast.info(`Zoeken naar: ${query}`);
    // Implement search logic
  }, []);

  const handleAddIngredient = (ingredient: Ingredient, amount: number, unit: string) => {
    // Add to shopping list - this would need to be implemented in the store
    toast.success(`${amount} ${unit} ${ingredient.name} toegevoegd`);
    trackEvent(AnalyticsEvents.SHOPPING_ITEM_CHECKED, {
      itemId: ingredient.id,
      itemName: ingredient.name,
      added: true,
    });
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 w-full">
        <ShoppingListSkeleton />
      </div>
    );
  }

  if (!shoppingList) {
    return (
      <div className="px-4 py-6 w-full">
        <EmptyState
          icon={ShoppingCart}
          title="Geen boodschappenlijst"
          description={currentWeek 
            ? "Er is iets mis gegaan bij het genereren. Probeer de week opnieuw te genereren."
            : "Genereer eerst een weekplanning om een boodschappenlijst te zien."
          }
          action={
            <Button onClick={() => window.location.href = '/week'}>
              <CalendarDays className="w-4 h-4 mr-2" />
              Naar weekoverzicht
            </Button>
          }
        />
      </div>
    );
  }

  const checkedCount = checkedItems.size;
  const totalCount = shoppingList.byStore.reduce(
    (sum, store) => sum + store.categories.reduce(
      (catSum, cat) => catSum + cat.items.length, 0
    ), 0
  );
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="px-4 py-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3436] dark:text-gray-100">
            Boodschappen
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Week {currentWeek?.weekNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="hidden sm:flex"
          >
            <Plus className="w-4 h-4 mr-1" />
            Toevoegen
          </Button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-8 h-8 bg-[#4A90A4] text-white rounded-full flex items-center justify-center sm:hidden"
            aria-label="Voeg ingrediënt toe"
          >
            <Plus className="w-5 h-5" />
          </button>
          <VoiceInputButton
            onSearch={handleVoiceSearch}
            size="sm"
          />
          <button
            onClick={exportToPDF}
            className="p-2 text-[#4A90A4] hover:bg-[#4A90A4]/10 rounded-lg transition-colors"
            title="Exporteer als PDF"
            aria-label="Exporteer als PDF"
          >
            <FileDown size={20} />
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-sm text-[#4A90A4] hover:text-[#3a7a8c]"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Gekopieerd!" : "Kopieer"}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Voortgang</span>
          <span className="text-sm font-medium text-[#4A90A4]">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div 
            className="h-full bg-[#4A90A4] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {checkedCount} van {totalCount} items
          </p>
          {checkedCount > 0 && (
            <button
              onClick={clearAllChecked}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <Trash2 size={12} />
              Wis selectie
            </button>
          )}
        </div>
      </div>

      {/* Price Comparison */}
      {currentWeek && (
        <PriceComparison
          week={currentWeek}
          priceHistory={[]}
          className="mb-6"
        />
      )}

      {/* Totaal */}
      <div className="bg-[#4A90A4]/10 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Geschat totaal:</span>
          <span className="text-2xl font-bold text-[#4A90A4]">
            €{shoppingList.estimatedTotal}
          </span>
        </div>
      </div>

      {/* Winkels */}
      <div className="space-y-6">
        {shoppingList.byStore.map((storeSection) => (
          <div key={storeSection.store} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-[#2D3436] dark:text-gray-200">
                  🏪 {storeNames[storeSection.store]}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  €{storeSection.subtotal.toFixed(0)}
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {storeSection.categories.map((catSection) => (
                <div key={catSection.category} className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {categoryNames[catSection.category]}
                  </h3>
                  <div className="space-y-2">
                    {catSection.items.map((item) => {
                      const isChecked = checkedItems.has(item.id);
                      const itemContent = (
                        <div className="flex items-center gap-3 w-full text-left py-2">
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                            isChecked 
                              ? "bg-[#7CB342] border-[#7CB342]" 
                              : "border-gray-300 dark:border-gray-600"
                          )}>
                            {isChecked && <Check size={12} className="text-white" />}
                          </div>
                          <span className={cn(
                            "text-sm flex-1",
                            isChecked ? "text-gray-400 line-through" : "text-[#2D3436] dark:text-gray-200"
                          )}>
                            {item.displayText}
                          </span>
                          {item.isFresh && (
                            <span className="text-xs text-[#4A90A4]">Vers</span>
                          )}
                        </div>
                      );

                      if (isFeatureEnabled('ENABLE_SWIPE_GESTURES')) {
                        return (
                          <SwipeableItem
                            key={item.id}
                            onSwipeLeft={() => handleSwipeComplete(item.id, item.displayText)}
                            onSwipeRight={() => handleSwipeComplete(item.id, item.displayText)}
                            leftAction={{
                              icon: <Check size={20} />,
                              label: isChecked ? 'Vrijgeven' : 'Afvinken',
                              color: isChecked ? '#9E9E9E' : '#7CB342',
                            }}
                            rightAction={{
                              icon: <Check size={20} />,
                              label: isChecked ? 'Vrijgeven' : 'Afvinken',
                              color: isChecked ? '#9E9E9E' : '#7CB342',
                            }}
                          >
                            <button
                              onClick={() => toggleItem(item.id, item.displayText)}
                              className="w-full bg-white dark:bg-gray-800"
                              aria-label={`${item.displayText} - ${isChecked ? 'Geselecteerd' : 'Niet geselecteerd'}`}
                              aria-pressed={isChecked}
                            >
                              {itemContent}
                            </button>
                          </SwipeableItem>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id, item.displayText)}
                          className="w-full"
                          aria-label={`${item.displayText} - ${isChecked ? 'Geselecteerd' : 'Niet geselecteerd'}`}
                          aria-pressed={isChecked}
                        >
                          {itemContent}
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

      {/* Add Ingredient Modal */}
      <AddIngredientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddIngredient}
      />
    </div>
    </PullToRefresh>
  );
}

export default function ShoppingPage() {
  return (
    <Suspense fallback={<ShoppingListSkeleton />}>
      <ShoppingPageContent />
    </Suspense>
  );
}
