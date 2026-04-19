/**
 * Export/Import Utilities
 * Feature 9: Export/Import - Weekplanning, recepten, backup & restore
 */

import { Week, Meal, User } from '@/lib/types';

export interface BackupData {
  version: string;
  exportedAt: string;
  weeks: Week[];
  recipes: Meal[];
  user: User | null;
  settings: Record<string, unknown>;
}

export interface ExportOptions {
  includeWeeks: boolean;
  includeRecipes: boolean;
  includeUser: boolean;
  includeSettings: boolean;
  dateRange?: { from: string; to: string };
}

const CURRENT_VERSION = '2.0.0';

export function createBackup(
  weeks: Week[],
  recipes: Meal[],
  user: User | null,
  settings: Record<string, unknown> = {},
  options?: Partial<ExportOptions>
): BackupData {
  const opts: ExportOptions = {
    includeWeeks: true,
    includeRecipes: true,
    includeUser: true,
    includeSettings: true,
    ...options,
  };

  let filteredWeeks = weeks;
  if (opts.dateRange) {
    filteredWeeks = weeks.filter(
      w => w.startDate >= opts.dateRange!.from && w.endDate <= opts.dateRange!.to
    );
  }

  return {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    weeks: opts.includeWeeks ? filteredWeeks : [],
    recipes: opts.includeRecipes ? recipes : [],
    user: opts.includeUser ? user : null,
    settings: opts.includeSettings ? settings : {},
  };
}

export function exportToJSON(data: BackupData, filename?: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `rut-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportWeekToCSV(week: Week): string {
  const headers = ['Dag', 'Datum', 'Ontbijt', 'Lunch', 'Diner', 'Training', 'Notities'];
  const rows = week.days.map(day => [
    day.dayOfWeek,
    day.date,
    day.meals.breakfast.mealName,
    day.meals.lunch.mealName,
    day.meals.dinner.mealName,
    day.isTrainingDay ? 'Ja' : 'Nee',
    day.notes || '',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
}

export function exportShoppingListToCSV(week: Week): string {
  if (!week.shoppingList) return '';

  const headers = ['Winkel', 'Categorie', 'Product', 'Hoeveelheid', 'Geschatte prijs', 'Afgestreept'];
  const rows: string[][] = [];

  week.shoppingList.byStore.forEach(store => {
    store.categories.forEach(category => {
      category.items.forEach(item => {
        rows.push([
          store.store,
          category.category,
          item.name,
          `${item.amount} ${item.unit}`,
          `€${item.estimatedPrice.toFixed(2)}`,
          item.checked ? 'Ja' : 'Nee',
        ]);
      });
    });
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateBackup(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Ongeldig bestandsformaat' };
  }

  const backup = data as Partial<BackupData>;

  if (!backup.version) {
    return { valid: false, error: 'Geen versie informatie gevonden' };
  }

  if (!backup.exportedAt) {
    return { valid: false, error: 'Geen export datum gevonden' };
  }

  // Version compatibility check
  const majorVersion = backup.version.split('.')[0];
  const currentMajor = CURRENT_VERSION.split('.')[0];

  if (majorVersion !== currentMajor) {
    return {
      valid: false,
      error: `Versie niet compatibel: backup is v${backup.version}, app is v${CURRENT_VERSION}`,
    };
  }

  return { valid: true };
}

export function parseBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        const validation = validateBackup(data);

        if (!validation.valid) {
          reject(new Error(validation.error));
          return;
        }

        resolve(data as BackupData);
      } catch (error) {
        reject(new Error('Kon bestand niet parsen: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Kon bestand niet lezen'));
    };

    reader.readAsText(file);
  });
}

export function mergeBackups(existing: BackupData, imported: BackupData): BackupData {
  // Merge weeks (avoid duplicates by ID)
  const existingWeekIds = new Set(existing.weeks.map(w => w.id));
  const newWeeks = imported.weeks.filter(w => !existingWeekIds.has(w.id));

  // Merge recipes (avoid duplicates by ID)
  const existingRecipeIds = new Set(existing.recipes.map(r => r.id));
  const newRecipes = imported.recipes.filter(r => !existingRecipeIds.has(r.id));

  return {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    weeks: [...existing.weeks, ...newWeeks],
    recipes: [...existing.recipes, ...newRecipes],
    user: imported.user || existing.user,
    settings: { ...existing.settings, ...imported.settings },
  };
}

export function exportRecipesForSharing(recipes: Meal[]): string {
  const shareData = recipes.map(r => ({
    name: r.name,
    category: r.category,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    ingredients: r.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`),
    instructions: r.instructions,
    nutrition: r.nutrition,
    tags: r.tags,
  }));

  return JSON.stringify(shareData, null, 2);
}
