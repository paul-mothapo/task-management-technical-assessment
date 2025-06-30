# Docker Deployment for Task Management App

This directory contains the Docker deployment configuration for the Task Management application, including both the frontend (React) and backend (Node.js/Express) services, as well as a PostgreSQL database.

## Overview

- **Frontend**: Built with React, served via Nginx
- **Backend**: Node.js/Express API, built with TypeScript
- **Database**: PostgreSQL, initialized with a schema
- **Orchestration**: All services are managed using Docker Compose

## Directory Structure

- `backend.Dockerfile` – Dockerfile for building and running the backend service
- `frontend.Dockerfile` – Dockerfile for building and serving the frontend
- `nginx.conf` – Nginx configuration for serving the frontend
- `docker-compose.yml` – Compose file to orchestrate all services
- `.env.example` – Example environment file for required variables

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) installed

## Setup Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd task-management-technical-assessment
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env` in the `deploy` directory:
     ```bash
     cp deploy/.env.example deploy/.env
     ```
   - Edit `deploy/.env` and set secure values for:
     - `DB_PORT`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_NAME`
     - `DB_HOST`
     - `JWT_SECRET`
     - `PORT`
     - `FRONTEND_URL`
     - `NODE_ENV`
     


3. **Build and start all services**
   From the project root, run:
   ```bash
   docker compose -f deploy/docker-compose.yml up --build -d
   ```
   This will:
   - Build and start the frontend (on port 3000)
   - Build and start the backend (on port 5500)
   - Start PostgreSQL (on port 5432)
   - Initialize the database using the provided SQL script

4. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5500](http://localhost:5500)

## Service Details

### Frontend
- Built using Node.js, served with Nginx for production
- Uses a custom Nginx config for SPA routing and asset caching

### Backend
- Runs on Node.js 20 (alpine)
- Exposes port 5500
- Connects to the PostgreSQL service using environment variables

### Database
- Uses the official `postgres:16-alpine` image
- Data is persisted in a Docker volume (`postgres_data`)
- Schema is initialized from `backend/src/utils/init.sql`

## Stopping and Cleaning Up
To stop all services:
```bash
docker compose -f deploy/docker-compose.yml down
```
To remove all data (including the database volume):
```bash
docker compose -f deploy/docker-compose.yml down -v
```

## Notes
- Ensure ports 3000, 5500, and 5432 are available on your host.
- The backend and frontend communicate via Docker network; update API URLs in the frontend if needed for production.
- For production, use strong secrets and secure your environment variables.

## Running Images Directly (Without Docker Compose)

If you prefer to run the containers individually using `docker run`, follow these steps:

### 1. Build the Images
From the project root, build each image:

```bash
# Build backend image
docker build -f deploy/backend.Dockerfile -t task-backend .

# Build frontend image
docker build -f deploy/frontend.Dockerfile -t task-frontend .
```

### 2. Run PostgreSQL
```bash
docker run -d \
  --name task-postgres \
  -e POSTGRES_USER=<your_db_user> \
  -e POSTGRES_PASSWORD=<your_db_password> \
  -e POSTGRES_DB=<your_db_name> \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -v $(pwd)/backend/src/utils/init.sql:/docker-entrypoint-initdb.d/init.sql \
  postgres:16-alpine
```

### 3. Run Backend
```bash
docker run -d \
  --name task-backend \
  -e NODE_ENV=production \
  -e PORT=5500 \
  -e JWT_SECRET=<your_jwt_secret> \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=<your_db_user> \
  -e DB_PASSWORD=<your_db_password> \
  -e DB_NAME=<your_db_name> \
  -p 5500:5500 \
  --link task-postgres:postgres \
  task-backend
```

### 4. Run Frontend
```bash
docker run -d \
  --name task-frontend \
  -p 3000:80 \
  task-frontend
```

- The frontend will be available at [http://localhost:3000](http://localhost:3000)
- The backend API will be available at [http://localhost:5500](http://localhost:5500)

> **Note:**
> - Adjust environment variables as needed for your setup.
> - Use `host.docker.internal` for `DB_HOST` if running containers separately on your local machine. If running all containers in the same Docker network, use the service name (e.g., `postgres`).
> - The `--link` flag is deprecated but works for simple local setups. For production, use Docker networks.

---

For any issues, please refer to the main project README or open an issue in the repository. 