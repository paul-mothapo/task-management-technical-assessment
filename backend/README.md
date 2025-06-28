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