```typescript
import React, { useState } from 'react';

// Define the Task interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Define the TaskItemProps interface
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

// Error Boundary Component
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  static getDerivedStateFromError = () => {
    return { hasError: true };
  };

  React.useEffect(() => {
    if (hasError) {
      console.error("Error caught in ErrorBoundary");
    }
  }, [hasError]);

  if (hasError) {
    return (
      <div className="text-red-500">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return children;
};


// TaskItem Component
const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onToggleComplete(task.id);
    } catch (error) {
      console.error("Failed to toggle complete:", error);
      // Optionally, display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Optionally, display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <li className="flex items-center justify-between py-2 px-4 rounded-md shadow-md bg-background dark:bg-gray-800">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`task-${task.id}`}
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isLoading}
            className="mr-2 accent-primary dark:accent-secondary focus:ring-primary dark:focus:ring-secondary"
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`text-foreground dark:text-gray-200 ${task.completed ? 'line-through opacity-50' : ''}`}
          >
            {task.text}
          </label>
        </div>
        <div>
          {isLoading ? (
            <span className="animate-pulse text-gray-500">Loading...</span>
          ) : (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 focus:outline-none"
              aria-label={`Delete task ${task.text}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </li>
    </ErrorBoundary>
  );
};

export default TaskItem;
```