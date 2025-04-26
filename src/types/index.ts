export type User = {
  id: number;
  email: string;
  name: string | null;
};

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
};
