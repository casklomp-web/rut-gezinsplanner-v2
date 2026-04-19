/**
 * Zustand Store - Task State
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskStatus, TaskPriority, RecurrenceType, FamilyMember, TaskFilters, TaskStats, TaskCompletion, TaskReminder, TaskNotificationPrefs } from "@/lib/types/task";
import { uuidv4 } from "@/lib/utils";
import { 
  notifyTaskCreated, 
  notifyTaskUpdated, 
  notifyTaskDeleted, 
  notifyTaskCompleted, 
  notifyTaskReopened,
  notifyTaskArchived,
  validateTask,
  TaskError 
} from "@/lib/tasks/errors";

// Mock family members for development
const mockFamilyMembers: FamilyMember[] = [
  { id: "1", name: "Papa", color: "#4A90A4", role: "parent" },
  { id: "2", name: "Mama", color: "#E17055", role: "parent" },
  { id: "3", name: "Kids", color: "#7CB342", role: "child" },
];

// Mock tasks for development
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Boodschappen doen",
    description: "Groente, fruit en melk halen bij de Albert Heijn",
    status: "todo",
    priority: "high",
    assignedTo: "1",
    assignedBy: "2",
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    recurrence: { type: "none" },
    notifications: { push: true, telegram: false, email: false },
    completions: [],
    tags: ["boodschappen"],
    isArchived: false,
  },
  {
    id: "task-2",
    title: "Meal prep zondag",
    description: "Voorbereiden van maaltijden voor de hele week",
    status: "todo",
    priority: "medium",
    assignedTo: "2",
    assignedBy: "1",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    recurrence: { type: "weekly" },
    notifications: { push: true, telegram: false, email: false },
    completions: [],
    tags: ["meal-prep"],
    isArchived: false,
  },
  {
    id: "task-3",
    title: "Afval buiten zetten",
    description: "Grijze container aan de straat",
    status: "done",
    priority: "low",
    assignedTo: "1",
    assignedBy: "1",
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    recurrence: { type: "weekly" },
    notifications: { push: false, telegram: false, email: false },
    completions: [
      {
        id: "comp-1",
        completedAt: new Date(),
        completedBy: "1",
        notes: "Gedaan om 8:00",
      },
    ],
    tags: ["huishouden"],
    isArchived: false,
  },
];

interface TaskState {
  tasks: Task[];
  familyMembers: FamilyMember[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  
  // Actions
  createTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "completions">) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  completeTask: (taskId: string, notes?: string, completedBy?: string) => void;
  uncompleteTask: (taskId: string) => void;
  archiveTask: (taskId: string) => void;
  unarchiveTask: (taskId: string) => void;
  
  // Filters
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  
  // Family members
  addFamilyMember: (member: Omit<FamilyMember, "id">) => void;
  updateFamilyMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (memberId: string) => void;
  
  // Getters
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByAssignee: (assigneeId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getOverdueTasks: () => Task[];
  getTasksDueToday: () => Task[];
  getFilteredTasks: () => Task[];
  getTaskStats: () => TaskStats;
  getFamilyMemberById: (memberId: string) => FamilyMember | undefined;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      familyMembers: mockFamilyMembers,
      isLoading: false,
      error: null,
      filters: {},
      
      createTask: (taskData) => {
        // Validation
        const validationError = validateTask(taskData.title, taskData.assignedTo);
        if (validationError) {
          throw validationError;
        }

        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          completions: [],
        };
        
        set(state => ({
          tasks: [newTask, ...state.tasks],
        }));
        
        notifyTaskCreated(newTask.title);
        return newTask;
      },
      
      updateTask: (taskId, updates) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) {
          throw new TaskError('Taak niet gevonden', 'TASK_NOT_FOUND');
        }

        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));

        notifyTaskUpdated(task.title);
      },
      
      deleteTask: (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) {
          throw new TaskError('Taak niet gevonden', 'TASK_NOT_FOUND');
        }

        set(state => ({
          tasks: state.tasks.filter(task => task.id !== taskId),
        }));

        notifyTaskDeleted(task.title);
      },
      
      toggleTaskStatus: (taskId) => {
        set(state => ({
          tasks: state.tasks.map(task => {
            if (task.id !== taskId) return task;
            
            const statusOrder: TaskStatus[] = ["todo", "in-progress", "done"];
            const currentIndex = statusOrder.indexOf(task.status);
            const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
            
            return {
              ...task,
              status: nextStatus,
              updatedAt: new Date(),
            };
          }),
        }));
      },
      
      completeTask: (taskId, notes, completedBy = "1") => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) {
          throw new TaskError('Taak niet gevonden', 'TASK_NOT_FOUND');
        }

        const completion: TaskCompletion = {
          id: uuidv4(),
          completedAt: new Date(),
          completedBy,
          notes,
        };
        
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status: "done",
                  completions: [...task.completions, completion],
                  updatedAt: new Date(),
                }
              : task
          ),
        }));

        notifyTaskCompleted(task.title);
      },

      uncompleteTask: (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);

        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status: "todo",
                  completions: task.completions.slice(0, -1),
                  updatedAt: new Date(),
                }
              : task
          ),
        }));

        if (task) {
          notifyTaskReopened(task.title);
        }
      },

      archiveTask: (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);

        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? { ...task, isArchived: true, updatedAt: new Date() }
              : task
          ),
        }));

        if (task) {
          notifyTaskArchived(task.title);
        }
      },
      
      unarchiveTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? { ...task, isArchived: false, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      setFilters: (filters) => {
        set({ filters });
      },
      
      clearFilters: () => {
        set({ filters: {} });
      },
      
      addFamilyMember: (member) => {
        const newMember: FamilyMember = {
          ...member,
          id: uuidv4(),
        };
        
        set(state => ({
          familyMembers: [...state.familyMembers, newMember],
        }));
      },
      
      updateFamilyMember: (memberId, updates) => {
        set(state => ({
          familyMembers: state.familyMembers.map(member =>
            member.id === memberId ? { ...member, ...updates } : member
          ),
        }));
      },
      
      removeFamilyMember: (memberId) => {
        set(state => ({
          familyMembers: state.familyMembers.filter(member => member.id !== memberId),
          // Reassign tasks from removed member to first available member
          tasks: state.tasks.map(task =>
            task.assignedTo === memberId
              ? { ...task, assignedTo: state.familyMembers[0]?.id || "" }
              : task
          ),
        }));
      },
      
      getTaskById: (taskId) => {
        return get().tasks.find(task => task.id === taskId);
      },
      
      getTasksByAssignee: (assigneeId) => {
        return get().tasks.filter(
          task => task.assignedTo === assigneeId && !task.isArchived
        );
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter(
          task => task.status === status && !task.isArchived
        );
      },
      
      getOverdueTasks: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().tasks.filter(
          task =>
            task.dueDate &&
            task.dueDate < today &&
            task.status !== "done" &&
            !task.isArchived
        );
      },
      
      getTasksDueToday: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().tasks.filter(
          task => task.dueDate === today && !task.isArchived
        );
      },
      
      getFilteredTasks: () => {
        const { tasks, filters } = get();
        
        return tasks.filter(task => {
          if (task.isArchived) return false;
          
          if (filters.status?.length && !filters.status.includes(task.status)) {
            return false;
          }
          
          if (filters.assignedTo?.length && !filters.assignedTo.includes(task.assignedTo)) {
            return false;
          }
          
          if (filters.priority?.length && !filters.priority.includes(task.priority)) {
            return false;
          }
          
          if (filters.dueDateFrom && task.dueDate && task.dueDate < filters.dueDateFrom) {
            return false;
          }
          
          if (filters.dueDateTo && task.dueDate && task.dueDate > filters.dueDateTo) {
            return false;
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
              task.title.toLowerCase().includes(searchLower) ||
              task.description?.toLowerCase().includes(searchLower) ||
              task.tags.some(tag => tag.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;
          }
          
          if (filters.category?.length) {
            const hasCategory = task.tags.some(tag => filters.category?.includes(tag));
            if (!hasCategory) return false;
          }
          
          return true;
        });
      },
      
      getTaskStats: () => {
        const tasks = get().tasks.filter(t => !t.isArchived);
        const today = new Date().toISOString().split("T")[0];
        
        const byAssignee: Record<string, number> = {};
        tasks.forEach(task => {
          byAssignee[task.assignedTo] = (byAssignee[task.assignedTo] || 0) + 1;
        });
        
        return {
          total: tasks.length,
          todo: tasks.filter(t => t.status === "todo").length,
          inProgress: tasks.filter(t => t.status === "in-progress").length,
          done: tasks.filter(t => t.status === "done").length,
          overdue: tasks.filter(
            t => t.dueDate && t.dueDate < today && t.status !== "done"
          ).length,
          dueToday: tasks.filter(t => t.dueDate === today).length,
          byAssignee,
        };
      },
      
      getFamilyMemberById: (memberId) => {
        return get().familyMembers.find(member => member.id === memberId);
      },
    }),
    {
      name: "rut-task-storage",
    }
  )
);
