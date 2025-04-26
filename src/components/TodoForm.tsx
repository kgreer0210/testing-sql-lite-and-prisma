"use client";

import { useState, FormEvent } from "react";
import { useAddTodo } from "@/hooks/useTodos";

type TodoFormProps = {
  userId: number;
};

export default function TodoForm({ userId }: TodoFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string;
  }>({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  const addTodoMutation = useAddTodo();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    addTodoMutation.mutate(
      {
        ...formData,
        userId,
        completed: false,
      },
      {
        onSuccess: () => {
          // Reset form on success
          setFormData({
            title: "",
            description: "",
            priority: "MEDIUM",
            dueDate: "",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 rounded shadow">
      <div className="mb-4">
        <label htmlFor="title" className="block mb-1 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-1 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="priority" className="block mb-1 font-medium">
          Priority
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) =>
            setFormData({
              ...formData,
              priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
            })
          }
          className="w-full p-2 border rounded"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="dueDate" className="block mb-1 font-medium">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={addTodoMutation.isPending}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {addTodoMutation.isPending ? "Adding..." : "Add Todo"}
      </button>

      {addTodoMutation.isError && (
        <p className="mt-2 text-red-500 text-sm">
          Error:{" "}
          {addTodoMutation.error instanceof Error
            ? addTodoMutation.error.message
            : "An error occurred"}
        </p>
      )}
    </form>
  );
}
