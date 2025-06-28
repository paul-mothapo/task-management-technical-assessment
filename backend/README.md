# Task Management System - Backend

A RESTful API service built with TypeScript and Express.js for managing tasks and user authentication.

## Tech Stack

- **Node.js** (v20+)
- **Express.js** (v4+)
- **TypeScript** (v5+)
- **PostgreSQL** (v15+)
- **JWT** for authentication
- **bcrypt** for password hashing

## Getting Started

1. Clone and navigate to backend:

   ```bash
   git clone git@github.com:paul-mothapo/task-management-technical-assessment.git
   cd task-management-technical-assessment/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Database Setup:

   a. Create a PostgreSQL database:

   ```sql
   CREATE DATABASE task_management;
   ```

   b. Configure environment variables:
   Create a `.env` file in the backend directory:

   ```env
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task_management
   JWT_SECRET=your-secret-key
   PORT=5500
   ```

   c. Initialize database tables:

   ```bash
   npm run initdb
   ```

4. Start the server:

   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   npm run build && npm start
   ```

The API will be available at `http://localhost:5500`

## Development Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start production server
- `npm run initdb`: Initialize database tables

# Tables

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @create Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, user_id)
);

-- @create Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @create Task-Categories join table
CREATE TABLE task_categories (
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, category_id)
);

```
