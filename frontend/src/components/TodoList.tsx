"use client";

import {
  useTodos,
  useToggleTodoCompletion,
  useDeleteTodo,
} from "@/hooks/useTodos";
import { Todo } from "@/types";
import TodoItem from "./TodoItem";

type TodoListProps = {
  initialTodos: Todo[];
};

export default function TodoList({ initialTodos }: TodoListProps) {
  // Use React Query to fetch and manage todos
  // Pass the initialTodos as initialData for immediate UI rendering
  const todosQuery = useTodos();
  const toggleTodoMutation = useToggleTodoCompletion();
  const deleteTodoMutation = useDeleteTodo();

  // Use server-rendered data until the client query completes
  const todos = todosQuery.data ?? initialTodos;

  const toggleTodoStatus = async (id: number, completed: boolean) => {
    toggleTodoMutation.mutate({ id, completed });
  };

  const deleteTodo = async (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  // Show loading state if initialTodos is empty and we're still loading
  if (todos.length === 0 && todosQuery.isLoading) {
    return <p className="text-gray-500">Loading todos...</p>;
  }

  // Show error state
  if (todosQuery.isError) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-500">
          Error loading todos:{" "}
          {todosQuery.error instanceof Error
            ? todosQuery.error.message
            : "Unknown error"}
        </p>
        <button
          onClick={() => todosQuery.refetch()}
          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (todos.length === 0) {
    return <p className="text-gray-500">No todos yet. Add some!</p>;
  }

  return (
    <div>
      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodoStatus}
            onDelete={deleteTodo}
            isToggling={
              toggleTodoMutation.isPending &&
              toggleTodoMutation.variables?.id === todo.id
            }
            isDeleting={
              deleteTodoMutation.isPending &&
              deleteTodoMutation.variables === todo.id
            }
          />
        ))}
      </ul>
    </div>
  );
}
