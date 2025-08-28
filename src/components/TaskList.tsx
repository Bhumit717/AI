```typescript
import React, { useState, useEffect, Suspense } from 'react';
import { useTodoStore } from '../store/todoStore';
import { TaskItem } from './TaskItem';
import { ErrorBoundary } from './ErrorBoundary';
import { Todo } from '../types/todo';

interface TaskListProps {
  filter: 'all' | 'active' | 'completed';
}

const TaskList: React.FC<TaskListProps> = ({ filter }) => {
  const todos = useTodoStore((state) => state.todos);
  const loading = useTodoStore((state) => state.loading);
  const error = useTodoStore((state) => state.error);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    let newFilteredTodos: Todo[] = [];

    switch (filter) {
      case 'active':
        newFilteredTodos = todos.filter((todo) => !todo.completed);
        break;
      case 'completed':
        newFilteredTodos = todos.filter((todo) => todo.completed);
        break;
      default:
        newFilteredTodos = todos;
    }

    setFilteredTodos(newFilteredTodos);
  }, [todos, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error.message || 'Failed to load todos'}
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="text-gray-500 text-center">
        No tasks yet. Add some!
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {filteredTodos.map((todo) => (
        <ErrorBoundary key={todo.id} fallback={<div className="text-red-500">Error rendering task.</div>}>
          <Suspense fallback={<div className="animate-pulse">Loading Task...</div>}>
            <TaskItem todo={todo} />
          </Suspense>
        </ErrorBoundary>
      ))}
    </ul>
  );
};

export default TaskList;
```