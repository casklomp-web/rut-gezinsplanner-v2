import { generateWeek } from '../logic/weekGenerator';
import { generateShoppingList } from '../logic/shoppingList';
import { DayOfWeek, MealCategory, User } from '../types';

// Mock user for testing
const mockUser: User = {
  id: 'test-user',
  name: 'Test',
  role: 'primary',
  goals: {
    trainingDaysPerWeek: 3,
    stepsTarget: 10000,
  },
  preferences: {
    dietary: [],
    dislikes: [],
    allergies: [],
    maxPrepTime: {
      breakfast: 15,
      lunch: 20,
      dinner: 45,
    },
    budgetLevel: 'moderate',
  },
  schedule: {
    trainingDays: ['monday', 'wednesday', 'friday'] as DayOfWeek[],
    workBusyDays: [],
  },
  notifications: {
    pushEnabled: false,
    telegramEnabled: false,
    reminders: {
      breakfast: { enabled: false, time: '08:00' },
      lunch: { enabled: false, time: '12:00' },
      dinnerPrep: { enabled: false, time: '17:00' },
      training: { enabled: false, time: '18:00' },
      medication: { enabled: false, time: '09:00' },
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('weekGenerator', () => {
  it('should generate a week with 7 days', () => {
    const week = generateWeek(new Date(), mockUser);
    
    expect(week).toBeDefined();
    expect(week.days).toHaveLength(7);
  });

  it('should have correct week structure', () => {
    const week = generateWeek(new Date(), mockUser);
    
    expect(week.weekNumber).toBeGreaterThan(0);
    expect(week.year).toBe(new Date().getFullYear());
    expect(week.days[0].dayOfWeek).toBe('monday');
    expect(week.days[6].dayOfWeek).toBe('sunday');
  });

  it('should mark training days correctly', () => {
    const week = generateWeek(new Date(), mockUser);
    
    const monday = week.days.find(d => d.dayOfWeek === 'monday');
    const tuesday = week.days.find(d => d.dayOfWeek === 'tuesday');
    
    expect(monday?.isTrainingDay).toBe(true);
    expect(tuesday?.isTrainingDay).toBe(false);
  });

  it('should have meals for each day', () => {
    const week = generateWeek(new Date(), mockUser);
    
    week.days.forEach(day => {
      expect(day.meals.breakfast).toBeDefined();
      expect(day.meals.lunch).toBeDefined();
      expect(day.meals.dinner).toBeDefined();
    });
  });
});

describe('shoppingList', () => {
  it('should generate shopping list from week', () => {
    const week = generateWeek(new Date(), mockUser);
    const shoppingList = generateShoppingList(week);
    
    expect(shoppingList).toBeDefined();
    expect(shoppingList.weekId).toBe(week.id);
    expect(shoppingList.byStore).toBeDefined();
    expect(shoppingList.byStore.length).toBeGreaterThan(0);
  });

  it('should calculate estimated total', () => {
    const week = generateWeek(new Date(), mockUser);
    const shoppingList = generateShoppingList(week);
    
    expect(shoppingList.estimatedTotal).toBeGreaterThan(0);
  });

  it('should organize items by store', () => {
    const week = generateWeek(new Date(), mockUser);
    const shoppingList = generateShoppingList(week);
    
    shoppingList.byStore.forEach(storeSection => {
      expect(storeSection.store).toBeDefined();
      expect(storeSection.categories).toBeDefined();
      expect(storeSection.categories.length).toBeGreaterThan(0);
    });
  });
});
