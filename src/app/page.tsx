import prisma from "@/lib/prisma";
import HomePage from "@/components/HomePage";

export default async function Page() {
  // For simplicity, we'll hardcode a user ID
  // In a real app, this would come from authentication
  const userId = 1;

  // Create a default user if none exists
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    await prisma.user.create({
      data: {
        email: "user@example.com",
        name: "Demo User",
      },
    });
  }

  // Get the user (or the first user if multiple exist)
  const user = await prisma.user.findFirst();

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch todos for this user
  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Convert dates to strings for serialization
  const serializedTodos = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
  }));

  return <HomePage initialTodos={serializedTodos} userId={user.id} />;
}
