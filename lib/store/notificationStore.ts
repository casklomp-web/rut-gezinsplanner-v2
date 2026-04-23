/**
 * Zustand Store - Notification State
 * In-app only, no browser push
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification, NotificationType, NOTIFICATION_TEMPLATES } from "@/lib/types/notification";
import { uuidv4 } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

interface NotificationState {
  notifications: Notification[];
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (notificationId: string) => void;
  clearOldNotifications: (days: number) => void;
  
  // Getters
  getUnreadCount: (userId: string) => number;
  getNotificationsForUser: (userId: string) => Notification[];
  getUnreadNotifications: (userId: string) => Notification[];
  
  // Helpers with toast
  notifyTaskAssigned: (taskTitle: string, assignerName: string, userId: string) => void;
  notifyTaskCompleted: (taskTitle: string, completerName: string, userId: string) => void;
  notifyTaskReminder: (taskTitle: string, userId: string) => void;
  notifyMealReminder: (mealName: string, mealType: string, userId: string) => void;
  notifyFamilyMemberAdded: (memberName: string, userId: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: uuidv4(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
        
        // Show toast for new notification
        toast.success(newNotification.title, {
          description: newNotification.message,
        });
      },
      
      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }));
      },
      
      markAllAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        }));
      },
      
      deleteNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notificationId),
        }));
      },
      
      clearOldNotifications: (days) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        set((state) => ({
          notifications: state.notifications.filter(
            (n) => n.createdAt > cutoff
          ),
        }));
      },
      
      getUnreadCount: (userId) => {
        return get().notifications.filter(
          (n) => n.userId === userId && !n.read
        ).length;
      },
      
      getNotificationsForUser: (userId) => {
        return get().notifications
          .filter((n) => n.userId === userId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      },
      
      getUnreadNotifications: (userId) => {
        return get().notifications.filter(
          (n) => n.userId === userId && !n.read
        );
      },
      
      // Helper methods with toast
      notifyTaskAssigned: (taskTitle, assignerName, userId) => {
        const template = NOTIFICATION_TEMPLATES.taskAssigned(taskTitle, assignerName);
        get().addNotification({ ...template, userId });
      },
      
      notifyTaskCompleted: (taskTitle, completerName, userId) => {
        const template = NOTIFICATION_TEMPLATES.taskCompleted(taskTitle, completerName);
        get().addNotification({ ...template, userId });
      },
      
      notifyTaskReminder: (taskTitle, userId) => {
        const template = NOTIFICATION_TEMPLATES.taskReminder(taskTitle);
        get().addNotification({ ...template, userId });
      },
      
      notifyMealReminder: (mealName, mealType, userId) => {
        const template = NOTIFICATION_TEMPLATES.mealReminder(mealName, mealType);
        get().addNotification({ ...template, userId });
      },
      
      notifyFamilyMemberAdded: (memberName, userId) => {
        const template = NOTIFICATION_TEMPLATES.familyMemberAdded(memberName);
        get().addNotification({ ...template, userId });
      },
    }),
    {
      name: "rut-notifications",
    }
  )
);
