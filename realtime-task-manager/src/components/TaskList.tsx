```typescript
// src/components/TaskList.tsx
import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  createdAt: number; // Timestamp
}

interface TaskListProps {
  tasks: Task[];
  filterStatus: 'To Do' | 'In Progress' | 'Done' | 'All';
  onTaskUpdate: (taskId: string, newStatus: 'To Do' | 'In Progress' | 'Done') => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, filterStatus, onTaskUpdate, onTaskDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      let filtered: Task[] = [];

      if (filterStatus === 'All') {
        filtered = tasks;
      } else {
        filtered = tasks.filter((task) => task.status === filterStatus);
      }

      setFilteredTasks(filtered);
    } catch (err: any) {
      setError(err.message || 'Failed to filter tasks.');
    } finally {
      setLoading(false);
    }
  }, [tasks, filterStatus]);

  const handleStatusChange = (taskId: string, newStatus: 'To Do' | 'In Progress' | 'Done') => {
    try {
      onTaskUpdate(taskId, newStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to update task status.');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    try {
      onTaskDelete(taskId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task.');
    }
  };

  if (loading) {
    return <div className="text-center text-foreground">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!filteredTasks || filteredTasks.length === 0) {
    return <div className="text-center text-foreground">No tasks found for the selected status.</div>;
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <div key={task.id} className="bg-background rounded-md shadow-md p-4 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <label htmlFor={`status-${task.id}`} className="mr-2 text-sm text-foreground">
                Status:
              </label>
              <select
                id={`status-${task.id}`}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as 'To Do' | 'In Progress' | 'Done')}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleDeleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
```