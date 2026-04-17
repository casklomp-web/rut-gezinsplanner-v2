/**
 * Telegram Bot Integration
 * Stuur notificaties naar Telegram groep
 */

import { Week, Day } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

// Telegram Bot API endpoint (via je OpenClaw setup)
const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: "HTML" | "Markdown";
  disable_notification?: boolean;
}

// Stuur bericht naar Telegram
export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML"
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true
      })
    });
    
    if (!response.ok) {
      console.error("Telegram API error:", await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Telegram send error:", error);
    return false;
  }
}

// Format weekoverzicht voor Telegram
export function formatWeekForTelegram(week: Week): string {
  let text = `🗓️ <b>Week ${week.weekNumber} staat klaar!</b>\n\n`;
  
  for (const day of week.days) {
    const date = parseISO(day.date);
    const dayName = format(date, "EEEE", { locale: nl });
    const dayDate = format(date, "d/M", { locale: nl });
    
    // Emoji's voor speciale dagen
    let prefix = "";
    if (day.isTrainingDay) prefix += "🏋️ ";
    if (day.isMealPrepDay) prefix += "🔥 ";
    
    text += `<b>${dayName} ${dayDate}</b> ${prefix}\n`;
    text += `🍳 ${day.meals.breakfast.mealName}\n`;
    text += `🥗 ${day.meals.lunch.mealName}\n`;
    text += `🍽️ ${day.meals.dinner.mealName}\n\n`;
  }
  
  // Stats
  const trainingDays = week.days.filter(d => d.isTrainingDay).length;
  const prepDays = week.days.filter(d => d.isMealPrepDay).length;
  
  text += `\n📊 <b>Samenvatting:</b>\n`;
  text += `• ${trainingDays}x training\n`;
  text += `• ${prepDays}x meal prep\n`;
  text += `• Geschat budget: €${week.stats.estimatedCost || 45}\n\n`;
  
  text += `💪 Je got this!`;
  
  return text;
}

// Format dagoverzicht voor Telegram
export function formatDayForTelegram(day: Day): string {
  const date = parseISO(day.date);
  const dayName = format(date, "EEEE d MMMM", { locale: nl });
  
  let text = `🌅 <b>Goedemorgen!</b>\n\n`;
  text += `<b>${dayName}</b>\n\n`;
  
  text += `Vandaag op het menu:\n`;
  text += `🍳 ${day.meals.breakfast.mealName}\n`;
  text += `🥗 ${day.meals.lunch.mealName}\n`;
  text += `🍽️ ${day.meals.dinner.mealName}\n\n`;
  
  if (day.training?.scheduled) {
    text += `🏋️ <b>Training vandaag!</b>\n`;
    text += `${day.training.time} - ${day.training.description}\n\n`;
  }
  
  text += `Je dagdoelen:\n`;
  text += `□ Eiwitrijk eten\n`;
  text += `□ ${day.training?.scheduled ? "Training" : "Beweging"}\n`;
  text += `□ 7.000+ stappen\n\n`;
  
  text += `Fijne dag! 💪`;
  
  return text;
}

// Format boodschappenlijst voor Telegram
export function formatShoppingListForTelegram(week: Week): string {
  if (!week.shoppingList) return "Geen boodschappenlijst beschikbaar.";
  
  let text = `🛒 <b>Boodschappenlijst Week ${week.weekNumber}</b>\n\n`;
  
  for (const storeSection of week.shoppingList.byStore) {
    text += `🏪 <b>${storeSection.store.toUpperCase()}</b> (€${storeSection.subtotal.toFixed(0)})\n`;
    text += `━━━━━━━━━━━━━━\n`;
    
    for (const catSection of storeSection.categories) {
      text += `\n<i>${catSection.category}:</i>\n`;
      
      for (const item of catSection.items) {
        const checkbox = item.checked ? "☑" : "☐";
        text += `${checkbox} ${item.displayText}\n`;
      }
    }
    
    text += `\n`;
  }
  
  text += `━━━━━━━━━━━━━━\n`;
  text += `<b>Totaal: €${week.shoppingList.estimatedTotal.toFixed(2)}</b>`;
  
  return text;
}

// Stuur weekoverzicht naar Telegram
export async function sendWeekToTelegram(
  botToken: string,
  chatId: string,
  week: Week
): Promise<boolean> {
  const text = formatWeekForTelegram(week);
  return sendTelegramMessage(botToken, chatId, text);
}

// Stuur dagoverzicht naar Telegram
export async function sendDayToTelegram(
  botToken: string,
  chatId: string,
  day: Day
): Promise<boolean> {
  const text = formatDayForTelegram(day);
  return sendTelegramMessage(botToken, chatId, text);
}

// Stuur boodschappenlijst naar Telegram
export async function sendShoppingListToTelegram(
  botToken: string,
  chatId: string,
  week: Week
): Promise<boolean> {
  const text = formatShoppingListForTelegram(week);
  return sendTelegramMessage(botToken, chatId, text);
}

// Test bericht
export async function sendTestMessage(
  botToken: string,
  chatId: string
): Promise<boolean> {
  const text = `🎉 <b>Rut is verbonden!</b>\n\nJe ontvangt nu automatisch:\n• Weekoverzichten\n• Dagelijkse herinneringen\n• Boodschappenlijsten\n\n💪 Laten we deze week knallen!`;
  
  return sendTelegramMessage(botToken, chatId, text);
}
