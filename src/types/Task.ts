```typescript
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export const createTask = (title: string): Task => {
  const now = new Date();
  return {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: now,
  };
};
```