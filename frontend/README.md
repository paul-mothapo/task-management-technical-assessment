# Task Management Frontend

## Prerequisites

- React (v18+)
- TypeScript
- Modern CSS (CSS Modules, Styled Components, & Tailwind)
- Axios for HTTP requests
- Backend API running (default: http://localhost:5500)

## Getting Started

1. Clone the repository and navigate to frontend:
   ```bash
   git clone git@github.com:paul-mothapo/task-management-technical-assessment.git
   cd task-management-technical-assessment/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Environment Setup:
   Create a `.env` file in the frontend directory:
   ```env
   VITE_BACKEND_API_URL=http://localhost:5500
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build

## Technologies Used

- **React (v18+)** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Axios** - API requests
- **Vite** - Build tool
- **React Hot Toast** - Toast notifications
- **Modern CSS** - CSS Modules, Styled Components, & Tailwind

## API Integration

The frontend communicates with the backend API using Axios. The base URL is configured in `main.tsx` and can be customized using the `VITE_BACKEND_API_URL` environment variable.

Default endpoints:
- Authentication: `/api/auth/*`
- Tasks: `/api/tasks/*`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain component modularity
- Write descriptive commit messages
- Update documentation as needed

## Environment Variables

- `VITE_BACKEND_API_URL`: Backend API URL (default: http://localhost:5500)

