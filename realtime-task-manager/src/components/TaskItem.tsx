```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/Task';
import { useTaskStore } from '../store/taskStore';
import { formatDate } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  }, [task]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setError(null);
  };

  const handleSaveClick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await updateTask({ ...task, title, description, status });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update task.');
    } finally {
      setLoading(false);
    }
  }, [task, title, description, status, updateTask]);

  const handleDeleteClick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(task.id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task.');
    } finally {
      setLoading(false);
    }
  }, [task.id, deleteTask]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  if (loading) {
    return (
      <div className="p-4 rounded shadow-md bg-background dark:bg-gray-800 animate-pulse">
        Loading task...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded shadow-md bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 rounded shadow-md bg-background dark:bg-gray-800">
      {isEditing ? (
        <div>
          <div className="mb-2">
            <label htmlFor="title" className="block text-foreground dark:text-gray-200 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-background dark:bg-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="block text-foreground dark:text-gray-200 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-background dark:bg-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="status" className="block text-foreground dark:text-gray-200 text-sm font-bold mb-2">
              Status:
            </label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-background dark:bg-gray-700"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-secondary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={handleSaveClick}
            >
              Save
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-gray-100">{task.title}</h3>
          <p className="text-sm text-foreground dark:text-gray-300">{task.description}</p>
          <p className="text-xs text-foreground dark:text-gray-400">
            Created: {formatDate(task.createdAt)}
          </p>
          <p className="text-xs text-foreground dark:text-gray-400">
            Status: {task.status}
          </p>
          <div className="flex justify-end mt-2">
            <button
              className="bg-secondary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={handleEditClick}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
```