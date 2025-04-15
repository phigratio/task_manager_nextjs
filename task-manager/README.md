# Task Management System

A comprehensive task management application with user authentication, built with Next.js, MongoDB, and NextAuth.js.

## Features

- **User Authentication**
  - Registration with email verification
  - Login with JWT
  - Role-based access (admin, user)
  - Secure password hashing

- **Task Management**
  - Create, read, update, and delete tasks
  - Task details: title, description, due date, priority, status
  - Task categorization
  - Task filtering and sorting

- **Dashboard**
  - Task statistics
  - Calendar view
  - Category management

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB database

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Email (for verification)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@example.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=your_email@example.com
\`\`\`

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── verify-email/     # Email verification page
├── components/           # React components
├── lib/                  # Utility functions and models
│   ├── auth.ts           # Authentication configuration
│   ├── email.ts          # Email sending functionality
│   ├── models.ts         # MongoDB models
│   └── mongodb.ts        # Database connection
└── public/               # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/verify-email` - Verify user email

### Tasks
- `GET /api/tasks` - Get all tasks for the current user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Categories
- `GET /api/categories` - Get all categories for the current user
- `POST /api/categories` - Create a new category
- `PATCH /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## License

This project is licensed under the MIT License.
