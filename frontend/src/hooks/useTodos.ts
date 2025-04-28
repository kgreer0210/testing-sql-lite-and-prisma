"use client";

import { Todo } from "@/types";
import { API_BASE_URL } from "@/config";
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";

// Query keys for better cache management
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

// Hook to fetch all todos
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/todos`);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      return response.json() as Promise<Todo[]>;
    },
  });
}

// Hook to fetch a single todo
export function useTodo(id: number) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch todo");
      }
      return response.json() as Promise<Todo>;
    },
  });
}

// Hook to add a new todo
export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newTodo: Omit<Todo, "id" | "createdAt" | "updatedAt">
    ) => {
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      return response.json() as Promise<Todo>;
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch after mutation
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

// Hook to update a todo
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Todo> & { id: number }) => {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      return response.json() as Promise<Todo>;
    },
    onSuccess: (updatedTodo) => {
      // Update the specific todo in the cache and invalidate the list
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

// Hook for optimistic updates on todo completion toggle
export function useToggleTodoCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: number;
      completed: boolean;
    }) => {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo status");
      }

      return response.json() as Promise<Todo>;
    },
    // Enable optimistic updates for better UX
    onMutate: async ({ id, completed }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.lists());

      // Optimistically update the todos list
      if (previousTodos) {
        queryClient.setQueryData(
          todoKeys.lists(),
          previousTodos.map((todo) =>
            todo.id === id ? { ...todo, completed } : todo
          )
        );
      }

      // Also update the individual todo if it's in the cache
      const previousTodo = queryClient.getQueryData<Todo>(todoKeys.detail(id));
      if (previousTodo) {
        queryClient.setQueryData(todoKeys.detail(id), {
          ...previousTodo,
          completed,
        });
      }

      return { previousTodos, previousTodo };
    },
    onError: (_error, _variables, context) => {
      // Roll back to the previous value if there's an error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
      if (context?.previousTodo) {
        queryClient.setQueryData(
          todoKeys.detail(_variables.id),
          context.previousTodo
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Invalidate queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
    },
  });
}

// Hook to delete a todo
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      return { id };
    },
    // Enable optimistic updates for better UX
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.lists());

      // Optimistically remove the todo from the list
      if (previousTodos) {
        queryClient.setQueryData(
          todoKeys.lists(),
          previousTodos.filter((todo) => todo.id !== id)
        );
      }

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      // Roll back to the previous value if there's an error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
    },
    onSettled: () => {
      // Invalidate the todos list query to ensure data consistency
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}
