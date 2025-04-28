import HomePage from "@/components/HomePage";
import { API_BASE_URL } from "@/config";
import { Todo } from "@/types";

export default async function Page() {
  // Fetch initial user and todos data from backend
  // For simplicity, we'll use a default user ID
  const userId = 1;

  // Fetch user data from the backend
  const userResponse = await fetch(`${API_BASE_URL}/api/users`);
  if (!userResponse.ok) {
    throw new Error("Failed to fetch users");
  }

  const users = await userResponse.json();
  let user = users.length > 0 ? users[0] : null;

  // If no users exist, we'll need to create one through the API
  if (!user) {
    const createUserResponse = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "user@example.com",
        name: "Demo User",
      }),
    });

    if (!createUserResponse.ok) {
      throw new Error("Failed to create user");
    }

    // Set user to the newly created user
    user = await createUserResponse.json();
  }

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch todos for this user from the backend
  const todosResponse = await fetch(`${API_BASE_URL}/api/todos`);
  if (!todosResponse.ok) {
    throw new Error("Failed to fetch todos");
  }

  const todos = await todosResponse.json();

  // Filter todos for the current user and sort by createdAt
  const userTodos: Todo[] = todos
    .filter((todo: Todo) => todo.userId === user.id)
    .sort(
      (a: Todo, b: Todo) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return <HomePage initialTodos={userTodos} userId={user.id} />;
}
