```typescript
// src/hooks/useTasks.ts

import { useState, useEffect, useCallback } from 'react';

// Define Task type
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define filter options
export type TaskFilter = 'all' | 'active' | 'completed';

// Custom hook for managing tasks
const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('all');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        setLoading(true);
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
          const parsedTasks: Task[] = JSON.parse(storedTasks).map((task: Omit<Task, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          }));
          setTasks(parsedTasks);
        }
      } catch (err: any) {
        setError(`Failed to load tasks: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (err: any) {
      setError(`Failed to save tasks: ${err.message}`);
    }
  }, [tasks]);

  // Function to add a new task
  const addTask = useCallback((title: string, description?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  // Function to toggle task completion status
  const toggleTask = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
      )
    );
  }, []);

  // Function to delete a task
  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  // Function to update a task
  const updateTask = useCallback((id: string, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedTask, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  // Function to filter tasks based on the selected filter
  const filteredTasks = useCallback(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return {
    tasks: filteredTasks(),
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    filter,
    setFilter,
  };
};

export default useTasks;
```