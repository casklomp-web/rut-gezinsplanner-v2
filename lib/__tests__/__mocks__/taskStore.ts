import { Task, TaskStatus, TaskPriority, FamilyMember } from '@/lib/types/task';

export const mockFamilyMembers: FamilyMember[] = [
  { id: '1', name: 'Papa', color: '#4A90A4', role: 'parent' },
  { id: '2', name: 'Mama', color: '#E17055', role: 'parent' },
  { id: '3', name: 'Kids', color: '#7CB342', role: 'child' },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Boodschappen doen',
    description: 'Groente, fruit en melk halen',
    status: 'todo' as TaskStatus,
    priority: 'high' as TaskPriority,
    assignedTo: '1',
    assignedBy: '2',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    recurrence: { type: 'none' },
    notifications: { push: true, telegram: false, email: false },
    completions: [],
    tags: ['boodschappen'],
    isArchived: false,
  },
  {
    id: 'task-2',
    title: 'Meal prep zondag',
    description: 'Voorbereiden van maaltijden',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignedTo: '2',
    assignedBy: '1',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    recurrence: { type: 'weekly' },
    notifications: { push: true, telegram: false, email: false },
    completions: [],
    tags: ['meal-prep'],
    isArchived: false,
  },
  {
    id: 'task-3',
    title: 'Afval buiten zetten',
    status: 'done' as TaskStatus,
    priority: 'low' as TaskPriority,
    assignedTo: '1',
    assignedBy: '1',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    recurrence: { type: 'weekly' },
    notifications: { push: false, telegram: false, email: false },
    completions: [
      {
        id: 'comp-1',
        completedAt: new Date(),
        completedBy: '1',
        notes: 'Gedaan om 8:00',
      },
    ],
    tags: ['huishouden'],
    isArchived: false,
  },
];

// Mock store state
const mockState = {
  tasks: mockTasks,
  familyMembers: mockFamilyMembers,
  isLoading: false,
  error: null,
  filters: {},
};

// Mock store actions
const mockActions = {
  createTask: jest.fn((data) => {
    const newTask = { ...data, id: 'new-task-id', createdAt: new Date(), updatedAt: new Date() };
    mockState.tasks.push(newTask);
    return newTask;
  }),
  updateTask: jest.fn((id, updates) => {
    const task = mockState.tasks.find(t => t.id === id);
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date() });
    }
  }),
  deleteTask: jest.fn((id) => {
    mockState.tasks = mockState.tasks.filter(t => t.id !== id);
  }),
  toggleTaskStatus: jest.fn((id) => {
    const task = mockState.tasks.find(t => t.id === id);
    if (task) {
      const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'done'];
      const currentIndex = statusOrder.indexOf(task.status);
      task.status = statusOrder[(currentIndex + 1) % statusOrder.length];
    }
  }),
  completeTask: jest.fn((id, notes, completedBy = '1') => {
    const task = mockState.tasks.find(t => t.id === id);
    if (task) {
      task.status = 'done';
      task.completions.push({
        id: 'new-completion',
        completedAt: new Date(),
        completedBy,
        notes,
      });
    }
  }),
  uncompleteTask: jest.fn((id) => {
    const task = mockState.tasks.find(t => t.id === id);
    if (task) {
      task.status = 'todo';
      task.completions.pop();
    }
  }),
  archiveTask: jest.fn((id) => {
    const task = mockState.tasks.find(t => t.id === id);
    if (task) task.isArchived = true;
  }),
  unarchiveTask: jest.fn((id) => {
    const task = mockState.tasks.find(t => t.id === id);
    if (task) task.isArchived = false;
  }),
  setFilters: jest.fn((filters) => {
    mockState.filters = filters;
  }),
  clearFilters: jest.fn(() => {
    mockState.filters = {};
  }),
  addFamilyMember: jest.fn(),
  updateFamilyMember: jest.fn(),
  removeFamilyMember: jest.fn(),
  getTaskById: jest.fn((id) => mockState.tasks.find(t => t.id === id)),
  getTasksByAssignee: jest.fn((id) => mockState.tasks.filter(t => t.assignedTo === id && !t.isArchived)),
  getTasksByStatus: jest.fn((status) => mockState.tasks.filter(t => t.status === status && !t.isArchived)),
  getOverdueTasks: jest.fn(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockState.tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done' && !t.isArchived);
  }),
  getTasksDueToday: jest.fn(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockState.tasks.filter(t => t.dueDate === today && !t.isArchived);
  }),
  getFilteredTasks: jest.fn(() => mockState.tasks.filter(t => !t.isArchived)),
  getTaskStats: jest.fn(() => ({
    total: mockState.tasks.filter(t => !t.isArchived).length,
    todo: mockState.tasks.filter(t => t.status === 'todo' && !t.isArchived).length,
    inProgress: mockState.tasks.filter(t => t.status === 'in-progress' && !t.isArchived).length,
    done: mockState.tasks.filter(t => t.status === 'done' && !t.isArchived).length,
    overdue: 0,
    dueToday: 0,
    byAssignee: {},
  })),
  getFamilyMemberById: jest.fn((id) => mockState.familyMembers.find(m => m.id === id)),
};

// Combined mock
export const taskStoreMock = jest.fn(() => ({
  ...mockState,
  ...mockActions,
}));

// Reset function for tests
export const resetTaskStoreMock = () => {
  mockState.tasks = [...mockTasks];
  mockState.filters = {};
  jest.clearAllMocks();
};
