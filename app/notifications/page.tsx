'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import Link from 'next/link';

export default function NotificationsPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserStore();
  const { 
    notifications, 
    getNotificationsForUser, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A90A4]">Laden...</div>
      </div>
    );
  }

  const userNotifications = getNotificationsForUser(currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'task': return '✅';
      case 'meal': return '🍽️';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#4A90A4]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Meldingen</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount === 0 
                    ? 'Geen nieuwe meldingen' 
                    : `${unreadCount} ongelezen`
                  }
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead(currentUser.id)}
                className="text-sm text-[#4A90A4] font-medium hover:text-[#3a7a8c]"
              >
                Alles gelezen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {userNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Geen meldingen</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {userNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`bg-white rounded-xl p-4 shadow-sm border ${
                    notification.read ? 'border-gray-100' : 'border-[#4A90A4]/30 bg-[#4A90A4]/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), { 
                              addSuffix: true, 
                              locale: nl 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-[#4A90A4] hover:bg-[#4A90A4]/10 rounded-lg"
                              title="Markeer als gelezen"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            title="Verwijder"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center text-sm text-[#4A90A4] font-medium mt-3 hover:underline"
                        >
                          Bekijken
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
