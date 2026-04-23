/**
 * Simple in-app notification system
 * No browser push - only in-app toasts and inbox
 */

export interface Notification {
  id: string;
  type: 'task' | 'meal' | 'family' | 'system';
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export type NotificationType = Notification['type'];

export const NOTIFICATION_TEMPLATES = {
  taskAssigned: (taskTitle: string, assignerName: string): Omit<Notification, 'id' | 'userId' | 'createdAt'> => ({
    type: 'task',
    title: 'Nieuwe taak',
    message: `${assignerName} heeft je '${taskTitle}' toegewezen`,
    read: false,
    actionUrl: '/tasks',
  }),
  
  taskCompleted: (taskTitle: string, completerName: string): Omit<Notification, 'id' | 'userId' | 'createdAt'> => ({
    type: 'task',
    title: 'Taak voltooid',
    message: `${completerName} heeft '${taskTitle}' voltooid`,
    read: false,
    actionUrl: '/tasks',
  }),
  
  taskReminder: (taskTitle: string): Omit<Notification, 'id' | 'userId' | 'createdAt'> => ({
    type: 'task',
    title: 'Herinnering',
    message: `Vergeet niet: ${taskTitle}`,
    read: false,
    actionUrl: '/tasks',
  }),
  
  mealReminder: (mealName: string, mealType: string): Omit<Notification, 'id' | 'userId' | 'createdAt'> => ({
    type: 'meal',
    title: 'Eetmoment',
    message: `Vandaag: ${mealName} (${mealType})`,
    read: false,
    actionUrl: '/today',
  }),
  
  familyMemberAdded: (memberName: string): Omit<Notification, 'id' | 'userId' | 'createdAt'> => ({
    type: 'family',
    title: 'Nieuw gezinslid',
    message: `${memberName} is toegevoegd aan je gezin`,
    read: false,
    actionUrl: '/profile',
  }),
};
