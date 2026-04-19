import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskModal } from '@/components/tasks/TaskModal';
import { mockFamilyMembers } from '@/lib/__tests__/__mocks__/taskStore';

describe('TaskModal', () => {
  const mockOnClose = jest.fn();
  const mockTask = {
    id: 'task-1',
    title: 'Test taak',
    description: 'Test beschrijving',
    status: 'todo' as const,
    priority: 'medium' as const,
    assignedTo: '1',
    assignedBy: '1',
    dueDate: '2025-01-20',
    recurrence: { type: 'none' as const },
    notifications: { push: true, telegram: false, email: false },
    completions: [],
    tags: [],
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render create modal when no task provided', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Nieuwe taak')).toBeInTheDocument();
  });

  it('should render edit modal when task provided', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} task={mockTask} />);
    
    expect(screen.getByText('Taak bewerken')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<TaskModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Nieuwe taak')).not.toBeInTheDocument();
  });

  it('should have title input', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByLabelText(/Titel/i)).toBeInTheDocument();
  });

  it('should have description textarea', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByLabelText(/Beschrijving/i)).toBeInTheDocument();
  });

  it('should have assignee select', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByLabelText(/Toewijzen aan/i)).toBeInTheDocument();
  });

  it('should have due date input', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByLabelText(/Deadline/i)).toBeInTheDocument();
  });

  it('should have priority buttons', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Laag')).toBeInTheDocument();
    expect(screen.getByText('Normaal')).toBeInTheDocument();
    expect(screen.getByText('Hoog')).toBeInTheDocument();
  });

  it('should show validation error for empty title', async () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    const submitButton = screen.getByText('Taak aanmaken');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Titel is verplicht')).toBeInTheDocument();
    });
  });

  it('should close on cancel button click', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} />);
    
    const cancelButton = screen.getByText('Annuleren');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should pre-fill form when editing', () => {
    render(<TaskModal isOpen={true} onClose={mockOnClose} task={mockTask} />);
    
    const titleInput = screen.getByLabelText(/Titel/i) as HTMLInputElement;
    expect(titleInput.value).toBe('Test taak');
  });
});
