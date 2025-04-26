const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      todos: {
        create: [
          {
            title: "Learn SQLite",
            description: "Understand how SQLite works with Prisma",
            priority: "HIGH",
          },
        ],
      },
    },
  });

  console.log("Created user with ID:", user.id);

  // Fetch all users with their todos
  const users = await prisma.user.findMany({
    include: {
      todos: true,
    },
  });

  // Log the result in a nicely formatted way
  console.log("Database contents:");
  console.log(JSON.stringify(users, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
