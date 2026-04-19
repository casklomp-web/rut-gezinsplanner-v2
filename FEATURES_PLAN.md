# 10 Extra Features Implementation Plan

## Features Overview

1. **Social Sharing** - Deel recepten (native share API), deel weekmenu als afbeelding/PDF, uitnodigingslinks voor huishouden
2. **Meal Prep Mode** - Batch cooking planning, prep dag indicator, bewaartips per recept
3. **Smart Suggestions** - AI suggesties op basis van voorkeuren, "Meer van dit" suggesties, seizoensgebonden recepten
4. **Price Tracking** - Ingrediënt prijzen bijhouden, goedkoopste supermarkt suggestie, budget overzicht per week
5. **Nutrition Info** - Calorieën per recept, macro's, dagelijkse voedingswaarden overzicht
6. **Voice Input** - Spraak naar tekst voor zoeken, voice commands
7. **Barcode Scanner** - Scan producten voor boodschappenlijst, auto-aanvullen van ingrediënten
8. **Dark Mode Toggle** - System preference respecteren, manual toggle, smooth transition
9. **Export/Import** - Weekplanning exporteren (JSON/CSV), recepten importeren, backup & restore
10. **Collaborative Editing** - Real-time sync tussen huishouden leden, conflict resolution UI, activity log

## Implementation Order

1. Dark Mode (foundation)
2. Nutrition Info (extends existing types)
3. Export/Import (utility features)
4. Social Sharing (uses existing data)
5. Meal Prep Mode (extends week planning)
6. Smart Suggestions (AI integration)
7. Price Tracking (new data layer)
8. Voice Input (new input method)
9. Barcode Scanner (hardware integration)
10. Collaborative Editing (most complex, Supabase realtime)

## File Structure

```
lib/
  features/
    socialSharing.ts
    mealPrep.ts
    smartSuggestions.ts
    priceTracking.ts
    nutrition.ts
    voiceInput.ts
    barcodeScanner.ts
    darkMode.ts
    exportImport.ts
    collaborativeEditing.ts
  hooks/
    useDarkMode.ts
    useVoiceInput.ts
    useBarcodeScanner.ts
    useSocialShare.ts
    useMealPrep.ts
    useNutrition.ts
    useCollaborative.ts
components/
  features/
    SocialShareButtons.tsx
    MealPrepIndicator.tsx
    SmartSuggestionCard.tsx
    PriceComparison.tsx
    NutritionPanel.tsx
    VoiceInputButton.tsx
    BarcodeScanner.tsx
    DarkModeToggle.tsx
    ExportImportPanel.tsx
    CollaborativeStatus.tsx
    ActivityLog.tsx
```

## Dependencies to Add

- html2canvas (for image export)
- @zxing/browser (for barcode scanning)
