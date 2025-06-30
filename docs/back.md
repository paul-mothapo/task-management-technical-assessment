# Backend Design Pattern and Rationale

## Overview
The backend of the Task Management application is built using a **Node.js/Express** REST API, written in **TypeScript** and connected to a **PostgreSQL** database. The architecture follows a modular, layered pattern to ensure maintainability, scalability, and testability.

---

## Folder Structure & Responsibilities

```
backend/
  src/
    constants/    # Shared constants (e.g., API response messages)
    controllers/  # Route handlers, business logic orchestration
    middleware/   # Express middleware (auth, validation, error handling)
    models/       # Database models and data access logic
    routes/       # API route definitions and endpoint mapping
    types/        # TypeScript type definitions and interfaces
    utils/        # Utility functions, DB initialization scripts
    server.ts     # Entry point, app setup, middleware registration
```

### Directory Details
- **constants/**: Centralizes static values (e.g., error messages, status codes) for consistency and easy updates.
- **controllers/**: Each file corresponds to a resource (e.g., `task.controller.ts`). Controllers receive HTTP requests, invoke business logic, and return responses. They do not directly access the database.
- **middleware/**: Contains reusable logic for request validation, authentication (e.g., JWT), and error handling. Middleware is registered in a specific order in `server.ts` to ensure security and data integrity.
- **models/**: Encapsulates all database interactions. Each model defines the schema and provides methods for CRUD operations, keeping data access logic separate from business logic.
- **routes/**: Maps HTTP endpoints to controller methods and applies relevant middleware. This keeps routing logic clean and maintainable.
- **types/**: Houses TypeScript interfaces and types for strong typing across the codebase, reducing bugs and improving code intelligence.
- **utils/**: Utility functions and scripts, such as database initialization (`initDb.ts`, `init.sql`), are placed here for reuse and clarity.
- **server.ts**: The main entry point. Sets up the Express app, applies middleware, registers routes, and starts the server.

---

## Design Principles & Patterns

- **Layered Architecture**: Clear separation between routing, business logic, data access, and utilities.
- **Separation of Concerns**: Each module has a single responsibility, making the codebase easier to test and maintain.
- **Type Safety**: TypeScript is used throughout for compile-time error checking and better developer tooling.
- **Environment Configuration**: Sensitive data and environment-specific settings are managed via environment variables, loaded with `dotenv`.
- **Error Handling**: Centralized error middleware ensures consistent error responses and logging. Custom error classes can be used for more granular control.
- **Validation**: Request validation middleware ensures only well-formed data reaches controllers, reducing runtime errors and security risks.
- **Authentication & Authorization**: JWT-based authentication middleware protects sensitive routes and ensures only authorized users can access/modify data.
- **Database Access Pattern**: Models encapsulate all SQL queries and data manipulation, keeping controllers agnostic of database details. This makes it easier to swap or refactor the data layer if needed.

---

## Why This Pattern?
- **Maintainability**: The modular, layered approach makes it easy to locate and update specific logic without affecting unrelated parts of the codebase. For example, updating validation rules only requires changes in the middleware layer.
- **Testability**: Clear separation allows for targeted unit and integration testing. Each layer can be tested in isolation or as part of the whole system.
- **Scalability**: New features or modules (e.g., new resources, authentication strategies) can be added with minimal impact on existing code. The structure supports growth as the application evolves.
- **Security**: Middleware for authentication, validation, and error handling enforces security best practices and reduces the risk of vulnerabilities.
- **Community Standards**: Node.js/Express with TypeScript and PostgreSQL is a widely adopted stack, ensuring good documentation, community support, and access to best practices.

---

## Benefits
- **Clear Structure**: Developers can quickly onboard and contribute, thanks to the predictable organization.
- **Reduced Bugs**: TypeScript and modularity help catch errors early and prevent regressions.
- **Easy Refactoring**: Isolated layers mean changes in one area rarely break others. For example, switching from PostgreSQL to another database would mostly affect the `models/` layer.
- **Performance**: Express is lightweight and efficient for REST APIs, and the separation of concerns allows for targeted performance optimizations.
- **Extensibility**: New endpoints, middleware, or database models can be added with minimal friction. The codebase is ready for future enhancements (e.g., adding GraphQL, WebSockets, etc.).

---

## Example: Request Lifecycle
1. **Incoming Request**: Hits an endpoint defined in `routes/`.
2. **Validation Middleware**: Checks request data for correctness.
3. **Authentication Middleware**: Verifies JWT and user permissions.
4. **Controller**: Processes the request, orchestrates business logic.
5. **Model**: Handles all database interactions.
6. **Response**: Controller sends a response or passes errors to error middleware.
7. **Error Middleware**: Formats and sends error responses if needed.
