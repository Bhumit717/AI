```typescript
import React, { useState, useEffect, useCallback } from 'react';

interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, onCancel }) => {
  const [title, setTitle] = useState<string>(initialTask?.title || '');
  const [description, setDescription] = useState<string>(initialTask?.description || '');
  const [dueDate, setDueDate] = useState<string>(initialTask?.dueDate || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask?.priority || 'medium');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setDueDate(initialTask.dueDate);
      setPriority(initialTask.priority);
    }
  }, [initialTask]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newTask: Task = {
        title,
        description,
        dueDate,
        priority,
        completed: initialTask?.completed || false, // Preserve completed status if editing
      };

      if (initialTask?.id) {
        newTask.id = initialTask.id; // Preserve ID for updates
      }

      onSubmit(newTask);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, [title, description, dueDate, priority, onSubmit, initialTask]);

  return (
    <div className="bg-background dark:bg-gray-800 p-4 rounded shadow-md">
      <h2 className="text-foreground dark:text-gray-100 text-lg font-semibold mb-4">
        {initialTask ? 'Edit Task' : 'Create New Task'}
      </h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-foreground dark:text-gray-200 text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-foreground dark:text-gray-200 text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-foreground dark:text-gray-200 text-sm font-medium mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-foreground dark:text-gray-200 text-sm font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
```