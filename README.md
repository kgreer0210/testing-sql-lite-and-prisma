# Todo List Application

A full-stack Todo List application built with Next.js, Prisma, and SQLite.

## Features

- Create, read, update, and delete todos
- Assign priorities (Low, Medium, High) to todos
- Set due dates for task management
- User management system
- Responsive design with Tailwind CSS

## Technologies Used

- [Next.js](https://nextjs.org) - React framework for frontend and API routes
- [Prisma](https://prisma.io) - ORM for database access
- [SQLite](https://sqlite.org) - Embedded database
- [React Query](https://tanstack.com/query) - Data fetching and state management
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up your environment variables:

   - Create a `.env` file in the root directory
   - Add `DATABASE_URL="file:./prisma/dev.db"`

4. Set up the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses two main models:

### User

- Properties: id, email, name, todos, createdAt, updatedAt
- Relationships: One-to-many with Todo

### Todo

- Properties: id, title, description, completed, dueDate, priority, userId, createdAt, updatedAt
- Priorities: LOW, MEDIUM, HIGH
- Relationships: Many-to-one with User

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The easiest way to deploy this application is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
