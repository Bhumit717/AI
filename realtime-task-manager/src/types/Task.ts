```typescript
// src/types/Task.ts

/**
 * @file Defines the Task interface and related types for the real-time task manager application.
 * This file ensures type safety and reusability across the application.
 */

/**
 * Represents the possible statuses of a task.
 */
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

/**
 * Represents a single task in the task management application.
 */
export interface Task {
  /**
   * The unique identifier for the task.
   */
  id: string;
  /**
   * The title of the task.
   */
  title: string;
  /**
   * A detailed description of the task.
   */
  description: string;
  /**
   * The current status of the task.
   */
  status: TaskStatus;
  /**
   * The user ID of the person assigned to the task.  Can be null if unassigned.
   */
  assigneeId: string | null;
  /**
   * The date and time the task was created.
   */
  createdAt: string; // ISO string
  /**
   * The date and time the task was last updated.
   */
  updatedAt: string; // ISO string
}

/**
 * Represents the shape of the task data when creating a new task.  Excludes the ID, createdAt, and updatedAt fields.
 */
export type CreateTaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Represents the shape of the task data when updating an existing task.  All fields are optional.
 */
export type UpdateTaskData = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Represents a generic type for handling API responses.
 * @template T The type of the data returned in the response.
 */
export interface ApiResponse<T> {
  /**
   * Indicates whether the API request was successful.
   */
  success: boolean;
  /**
   * The data returned by the API, if the request was successful.
   */
  data?: T;
  /**
   * An error message, if the request failed.
   */
  error?: string;
}
```