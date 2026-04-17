"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { useWeekStore } from "@/lib/store/weekStore";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { 
  isPushSupported, 
  requestNotificationPermission, 
  testNotification,
  scheduleDailyReminders 
} from "@/lib/logic/notifications";
import { sendTestMessage, sendWeekToTelegram } from "@/lib/logic/telegram";
import { Bell, MessageCircle, Send, TestTube } from "lucide-react";

export default function SettingsPage() {
  const { users, currentUserId, setCurrentUser, updateUser } = useUserStore();
  const { currentWeek } = useWeekStore();
  const currentUser = users.find(u => u.id === currentUserId);
  
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");
  const [telegramToken, setTelegramToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState(currentUser?.notifications.telegramChatId || "");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setPushSupported(isPushSupported());
    if ("Notification" in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  const enableNotifications = async () => {
    const permission = await requestNotificationPermission();
    setPushPermission(permission);
    
    if (permission === "granted" && currentUser) {
      scheduleDailyReminders(currentUser);
      testNotification();
    }
  };

  const saveTelegramSettings = () => {
    if (currentUser) {
      updateUser(currentUser.id, {
        notifications: {
          ...currentUser.notifications,
          telegramChatId
        }
      });
    }
  };

  const testTelegram = async () => {
    if (!telegramChatId) return;
    setSending(true);
    
    // In productie: gebruik je eigen bot token
    const success = await sendTestMessage("YOUR_BOT_TOKEN", telegramChatId);
    
    setSending(false);
    if (success) {
      alert("Test bericht verstuurd! Check je Telegram.");
    } else {
      alert("Kon geen bericht versturen. Check je Chat ID.");
    }
  };

  const sendWeekToTelegramNow = async () => {
    if (!telegramChatId || !currentWeek) return;
    setSending(true);
    
    const success = await sendWeekToTelegram("YOUR_BOT_TOKEN", telegramChatId, currentWeek);
    
    setSending(false);
    if (success) {
      alert("Weekoverzicht verstuurd naar Telegram!");
    } else {
      alert("Kon weekoverzicht niet versturen.");
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-[#2D3436] mb-6">
        Instellingen
      </h1>

      {/* Gebruikers */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Gezinsprofielen
        </h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id}
              onClick={() => setCurrentUser(user.id)}
              className={`
                bg-white rounded-xl p-4 border cursor-pointer transition-all
                ${currentUserId === user.id 
                  ? "border-[#4A90A4] ring-1 ring-[#4A90A4]" 
                  : "border-gray-200"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#2D3436]">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.role === "primary" ? "Hoofdgebruiker" : "Partner"}
                  </p>
                </div>
                {currentUserId === user.id && (
                  <span className="text-[#4A90A4]">✓</span>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                <p className="text-gray-600">
                  Doel: {user.goals.weightGoal 
                    ? `${user.goals.weightGoal} kg` 
                    : user.goals.calorieTarget 
                      ? `${user.goals.calorieTarget} kcal`
                      : "Vetverlies"
                  }
                </p>
                {user.schedule.trainingDays.length > 0 && (
                  <p className="text-gray-600">
                    Training: {user.schedule.trainingDays.join(", ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Push Notificaties */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Bell size={16} />
          Push Notificaties
        </h2>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {!pushSupported ? (
            <p className="text-gray-500 text-sm">
              Push notificaties worden niet ondersteund op dit apparaat.
            </p>
          ) : pushPermission !== "granted" ? (
            <div>
              <p className="text-gray-600 mb-3">
                Ontvang herinneringen op je telefoon voor maaltijden en training.
              </p>
              <Button onClick={enableNotifications} className="w-full">
                <Bell size={16} className="mr-2" />
                Schakel notificaties in
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-[#7CB342] mb-3">
                <span>✓</span>
                <span>Notificaties ingeschakeld</span>
              </div>
              <Button variant="outline" size="sm" onClick={testNotification}>
                <TestTube size={16} className="mr-2" />
                Test notificatie
              </Button>
            </div>
          )}
        </div>
        
        {pushPermission === "granted" && currentUser && (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mt-3">
            {Object.entries(currentUser.notifications.reminders).map(([key, reminder]) => (
              <div key={key} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#2D3436] capitalize">
                    {key === "breakfast" && "Ontbijt"}
                    {key === "lunch" && "Lunch"}
                    {key === "dinnerPrep" && "Diner prep"}
                    {key === "training" && "Training"}
                    {key === "medication" && "Medicatie"}
                  </p>
                  <p className="text-sm text-gray-500">{reminder.time}</p>
                </div>
                <Toggle 
                  checked={reminder.enabled}
                  onChange={() => {
                    const newReminders = { ...currentUser.notifications.reminders };
                    newReminders[key as keyof typeof newReminders] = {
                      ...reminder,
                      enabled: !reminder.enabled
                    };
                    updateUser(currentUser.id, {
                      notifications: {
                        ...currentUser.notifications,
                        reminders: newReminders
                      }
                    });
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Telegram */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <MessageCircle size={16} />
          Telegram
        </h2>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chat ID
            </label>
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="-1001234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
            />
            <p className="text-xs text-gray-500 mt-1">
              ID van je "Gezinsplanner" groep
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveTelegramSettings}>
              Opslaan
            </Button>
            <Button 
              variant="outline" 
              onClick={testTelegram}
              disabled={!telegramChatId || sending}
            >
              <Send size={16} className="mr-1" />
              Test
            </Button>
          </div>
          
          {currentWeek && telegramChatId && (
            <Button 
              onClick={sendWeekToTelegramNow}
              disabled={sending}
              className="w-full"
            >
              <MessageCircle size={16} className="mr-2" />
              Stuur week naar Telegram
            </Button>
          )}
        </div>
      </section>

      {/* Over */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Over
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[#2D3436] font-medium">Rut - Gezinsplanner</p>
          <p className="text-sm text-gray-500">Versie 1.0</p>
          <p className="text-sm text-gray-500 mt-2">
            Eenvoudige planning voor vetverlies
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Gebouwd met ❤️ voor drukke gezinnen
          </p>
        </div>
      </section>
    </div>
  );
}
