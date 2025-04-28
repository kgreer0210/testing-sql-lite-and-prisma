import { Todo } from "@/types";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
};

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  isToggling = false,
  isDeleting = false,
}: TodoItemProps) {
  const priorityColors = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-red-100 text-red-800",
  };

  const formattedDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString()
    : null;

  return (
    <li
      className={`border rounded p-4 card shadow-sm ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => onToggle(todo.id, e.target.checked)}
            disabled={isToggling}
            className="mt-1"
          />

          <div>
            <h3
              className={`font-medium ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </h3>

            {todo.description && (
              <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
            )}

            <div className="flex gap-2 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  priorityColors[todo.priority as keyof typeof priorityColors]
                }`}
              >
                {todo.priority}
              </span>

              {formattedDate && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                  Due: {formattedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 disabled:text-red-300"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}
