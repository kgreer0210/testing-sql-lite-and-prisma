"use client";

import { Suspense } from "react";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import { Todo } from "@/types";

type HomePageProps = {
  initialTodos: Todo[];
  userId: number;
};

// Client component that uses React Query
function Home({ initialTodos, userId }: HomePageProps) {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Todo List</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <TodoForm userId={userId} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Todos</h2>
          <Suspense
            fallback={<p className="text-gray-500">Loading todos...</p>}
          >
            <TodoList initialTodos={initialTodos} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default Home;
