# ProjectHub

A platform for connecting developers, mentors, and projects.

## Features

- User authentication (signup, login, profile)
- Project management (create, update, delete)
- Team collaboration
- Mentor matching
- Funding campaigns
- Real-time messaging
- Notifications

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- React Router for navigation
- React Query for data fetching
- Tailwind CSS for styling
- Shadcn UI components

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Socket.IO for real-time features

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/projecthub
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project (protected)
- `PUT /api/projects/:id` - Update a project (protected)
- `DELETE /api/projects/:id` - Delete a project (protected)
- `POST /api/projects/:id/team` - Add a team member (protected)
- `DELETE /api/projects/:id/team` - Remove a team member (protected)

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get a specific team
- `POST /api/teams` - Create a new team (protected)
- `PUT /api/teams/:id` - Update a team (protected)
- `DELETE /api/teams/:id` - Delete a team (protected)
- `POST /api/teams/:id/members` - Add a team member (protected)
- `DELETE /api/teams/:id/members` - Remove a team member (protected)

### Funding
- `GET /api/funding` - Get all funding campaigns
- `GET /api/funding/:id` - Get a specific funding campaign
- `POST /api/funding` - Create a new funding campaign (protected)
- `PUT /api/funding/:id` - Update a funding campaign (protected)
- `DELETE /api/funding/:id` - Delete a funding campaign (protected)
- `POST /api/funding/:id/back` - Back a funding campaign (protected)

### Messages
- `GET /api/messages/conversations` - Get all conversations (protected)
- `GET /api/messages/:userId` - Get messages with a specific user (protected)
- `POST /api/messages` - Send a message (protected)
- `PUT /api/messages/:userId/read` - Mark messages as read (protected)

### Notifications
- `GET /api/notifications` - Get all notifications (protected)
- `POST /api/notifications` - Create a notification (protected)
- `PUT /api/notifications/:id/read` - Mark a notification as read (protected)
- `PUT /api/notifications/all/read` - Mark all notifications as read (protected)
- `DELETE /api/notifications/:id` - Delete a notification (protected)

## License

MIT
