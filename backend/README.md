# ProjectHub Backend

This is the backend server for the ProjectHub application. It provides APIs for user authentication, project management, team collaboration, and more.

## Features

- User authentication (register, login, profile)
- Project management (CRUD operations)
- Team management
- Real-time updates using Socket.IO
- MongoDB database integration
- JWT-based authentication
- Input validation using Zod

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/projecthub
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile (protected)

### Projects
- GET /api/projects - Get all projects
- GET /api/projects/:id - Get a specific project
- POST /api/projects - Create a new project (protected)
- PUT /api/projects/:id - Update a project (protected)
- DELETE /api/projects/:id - Delete a project (protected)
- POST /api/projects/:id/team - Add a team member (protected)
- DELETE /api/projects/:id/team - Remove a team member (protected)

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is enabled for the frontend origin
- Input validation using Zod
- Protected routes require authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 