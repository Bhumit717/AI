```typescript
import { useState } from 'react';
import { useTasksStore } from '../store/tasksStore';
import { Task } from '../types/Task';
import { toast } from 'react-toastify';

interface UseTaskActions {
  handleEditTask: (task: Task) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for handling task actions (edit, delete).
 * @returns {UseTaskActions} An object containing the action handlers, loading state, and error state.
 */
const useTaskActions = (): UseTaskActions => {
  const { updateTask, deleteTask } = useTasksStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the editing of a task.
   * @param {Task} task The task object to be updated.
   */
  const handleEditTask = async (task: Task): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await updateTask(task);
      toast.success('Task updated successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        className: 'dark:bg-secondary dark:text-foreground',
      });
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task.');
      toast.error(`Error updating task: ${err.message || 'Unknown error'}`, {
        position: toast.POSITION.TOP_RIGHT,
        className: 'dark:bg-secondary dark:text-foreground',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the deletion of a task.
   * @param {string} taskId The ID of the task to be deleted.
   */
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        className: 'dark:bg-secondary dark:text-foreground',
      });
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task.');
      toast.error(`Error deleting task: ${err.message || 'Unknown error'}`, {
        position: toast.POSITION.TOP_RIGHT,
        className: 'dark:bg-secondary dark:text-foreground',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleEditTask,
    handleDeleteTask,
    isLoading,
    error,
  };
};

export default useTaskActions;
```