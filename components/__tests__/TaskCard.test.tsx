import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { mockTasks, mockFamilyMembers } from '@/lib/__tests__/__mocks__/taskStore';

describe('TaskCard', () => {
  const mockTask = mockTasks[0];
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);
    
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  it('should render status badge', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('Te doen')).toBeInTheDocument();
  });

  it('should render priority indicator', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('Hoog')).toBeInTheDocument();
  });

  it('should render assignee', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('Papa')).toBeInTheDocument();
  });

  it('should render due date', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('Vandaag')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} expanded />);
    
    const editButton = screen.getByText('Bewerken');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should show recurrence badge for recurring tasks', () => {
    const recurringTask = mockTasks[1]; // Weekly task
    render(<TaskCard task={recurringTask} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('Wekelijks')).toBeInTheDocument();
  });

  it('should expand to show details', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />);
    
    const expandButton = screen.getByLabelText('Uitklappen');
    fireEvent.click(expandButton);
    
    expect(screen.getByText('Beschrijving')).toBeInTheDocument();
  });

  it('should show completed state correctly', () => {
    const completedTask = mockTasks[2]; // Done task
    render(<TaskCard task={completedTask} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('Klaar')).toBeInTheDocument();
  });
});
