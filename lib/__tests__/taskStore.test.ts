import { renderHook, act } from '@testing-library/react';
import { useTaskStore, taskStoreMock } from '@/lib/store/taskStore';
import { mockTasks, mockFamilyMembers, resetTaskStoreMock } from './__mocks__/taskStore';

describe('TaskStore', () => {
  beforeEach(() => {
    resetTaskStoreMock();
  });

  describe('State', () => {
    it('should have initial tasks', () => {
      const store = taskStoreMock();
      expect(store.tasks).toHaveLength(3);
      expect(store.familyMembers).toHaveLength(3);
    });

    it('should have correct initial loading state', () => {
      const store = taskStoreMock();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const store = taskStoreMock();
      const newTask = {
        title: 'Nieuwe taak',
        assignedTo: '1',
        assignedBy: '1',
        status: 'todo' as const,
        priority: 'medium' as const,
        recurrence: { type: 'none' as const },
        notifications: { push: true, telegram: false, email: false },
        tags: [],
        isArchived: false,
      };

      const result = store.createTask(newTask);
      
      expect(store.createTask).toHaveBeenCalledWith(newTask);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Nieuwe taak');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const store = taskStoreMock();
      const updates = { title: 'Gewijzigde titel' };
      
      store.updateTask('task-1', updates);
      
      expect(store.updateTask).toHaveBeenCalledWith('task-1', updates);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      const store = taskStoreMock();
      
      store.deleteTask('task-1');
      
      expect(store.deleteTask).toHaveBeenCalledWith('task-1');
    });
  });

  describe('toggleTaskStatus', () => {
    it('should toggle task status', () => {
      const store = taskStoreMock();
      
      store.toggleTaskStatus('task-1');
      
      expect(store.toggleTaskStatus).toHaveBeenCalledWith('task-1');
    });
  });

  describe('completeTask', () => {
    it('should mark task as complete', () => {
      const store = taskStoreMock();
      
      store.completeTask('task-1', 'Test notities', '1');
      
      expect(store.completeTask).toHaveBeenCalledWith('task-1', 'Test notities', '1');
    });
  });

  describe('archiveTask', () => {
    it('should archive a task', () => {
      const store = taskStoreMock();
      
      store.archiveTask('task-1');
      
      expect(store.archiveTask).toHaveBeenCalledWith('task-1');
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', () => {
      const store = taskStoreMock();
      
      store.getTaskById('task-1');
      
      expect(store.getTaskById).toHaveBeenCalledWith('task-1');
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks by status', () => {
      const store = taskStoreMock();
      
      const result = store.getTasksByStatus('todo');
      
      expect(store.getTasksByStatus).toHaveBeenCalledWith('todo');
      expect(result).toBeDefined();
    });
  });

  describe('getOverdueTasks', () => {
    it('should return overdue tasks', () => {
      const store = taskStoreMock();
      
      const result = store.getOverdueTasks();
      
      expect(store.getOverdueTasks).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getTaskStats', () => {
    it('should return task statistics', () => {
      const store = taskStoreMock();
      
      const result = store.getTaskStats();
      
      expect(store.getTaskStats).toHaveBeenCalled();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('todo');
      expect(result).toHaveProperty('done');
      expect(result).toHaveProperty('overdue');
    });
  });

  describe('getFamilyMemberById', () => {
    it('should return family member by id', () => {
      const store = taskStoreMock();
      
      const result = store.getFamilyMemberById('1');
      
      expect(store.getFamilyMemberById).toHaveBeenCalledWith('1');
      expect(result).toBeDefined();
    });
  });

  describe('setFilters', () => {
    it('should set filters', () => {
      const store = taskStoreMock();
      const filters = { status: ['todo' as const], priority: ['high' as const] };
      
      store.setFilters(filters);
      
      expect(store.setFilters).toHaveBeenCalledWith(filters);
    });
  });

  describe('clearFilters', () => {
    it('should clear filters', () => {
      const store = taskStoreMock();
      
      store.clearFilters();
      
      expect(store.clearFilters).toHaveBeenCalled();
    });
  });
});
