/**
 * Social Sharing Utilities
 * Feature 1: Social Sharing - Deel recepten, weekmenu als afbeelding/PDF, uitnodigingslinks
 */

import { Week, Meal, Day } from '@/lib/types';

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

export async function shareNative(data: ShareData): Promise<boolean> {
  if (!canUseNativeShare()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    return false;
  }
}

export function shareToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        resolve(true);
      } catch {
        resolve(false);
      }
      document.body.removeChild(textarea);
    }
  });
}

export function generateRecipeShareText(meal: Meal): string {
  const ingredients = meal.ingredients
    .map(i => `• ${i.amount} ${i.unit} ${i.name}`)
    .join('\n');

  return `🍽️ ${meal.name}\n\n⏱️ ${meal.prepTime + meal.cookTime} minuten\n🔥 ${meal.nutrition.calories} kcal | ${meal.nutrition.protein}g eiwit\n\nIngrediënten:\n${ingredients}\n\nGedeeld via Rut - Gezinsplanner`;
}

export function generateWeekMenuText(week: Week): string {
  const days = week.days.map(day => {
    const meals = [
      `🌅 ${day.meals.breakfast.mealName}`,
      `🌞 ${day.meals.lunch.mealName}`,
      `🌙 ${day.meals.dinner.mealName}`,
    ].join('\n');
    return `📅 ${formatDayName(day.dayOfWeek)}\n${meals}`;
  }).join('\n\n');

  return `🗓️ Weekmenu Week ${week.weekNumber}\n\n${days}\n\nGedeeld via Rut - Gezinsplanner`;
}

export function generateShoppingListText(week: Week): string {
  if (!week.shoppingList) {
    return 'Geen boodschappenlijst beschikbaar';
  }

  const sections = week.shoppingList.byStore.map(store => {
    const items = store.categories
      .flatMap(cat => cat.items)
      .map(item => `☐ ${item.displayText}`)
      .join('\n');
    return `🏪 ${store.store}\n${items}`;
  }).join('\n\n');

  return `🛒 Boodschappenlijst Week ${week.weekNumber}\n\n${sections}\n\nGedeeld via Rut - Gezinsplanner`;
}

export function generateInviteLink(householdId: string, inviteCode: string): string {
  // In production, this would be your actual app URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/join?household=${householdId}&code=${inviteCode}`;
}

export function generateInviteMessage(inviteLink: string, inviterName: string): string {
  return `👋 ${inviterName} nodigt je uit om deel te nemen aan het huishouden in Rut!\n\nKlik op de link om mee te doen:\n${inviteLink}\n\nMet Rut plan je samen gezonde maaltijden voor het hele gezin.`;
}

export async function captureElementAsImage(element: HTMLElement): Promise<string | null> {
  try {
    // Dynamically import html2canvas to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to capture element:', error);
    return null;
  }
}

export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatDayName(dayOfWeek: string): string {
  const days: Record<string, string> = {
    monday: 'Maandag',
    tuesday: 'Dinsdag',
    wednesday: 'Woensdag',
    thursday: 'Donderdag',
    friday: 'Vrijdag',
    saturday: 'Zaterdag',
    sunday: 'Zondag',
  };
  return days[dayOfWeek] || dayOfWeek;
}

// Social media share URLs
export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function getTelegramShareUrl(text: string, url?: string): string {
  const shareText = url ? `${text}\n${url}` : text;
  return `https://t.me/share/url?text=${encodeURIComponent(shareText)}`;
}

export function getEmailShareUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
