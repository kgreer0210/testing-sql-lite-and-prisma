const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./src/generated/prisma");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Todo routes
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      include: { user: true },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const { title, userId, description, dueDate, priority } = req.body;
    const todo = await prisma.todo.create({
      data: {
        title,
        completed: false,
        userId,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
      },
      include: { user: true },
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/todos/:id", async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true },
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/todos/:id", async (req, res) => {
  try {
    const { title, completed, description, dueDate, priority } = req.body;
    const todo = await prisma.todo.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        completed,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      },
      include: { user: true },
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    await prisma.todo.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
