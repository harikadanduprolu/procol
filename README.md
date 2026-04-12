# ProjectHub (ProCollab)

Full-stack collaboration platform for students and teams:

- Authentication and profiles
- Projects, teams, mentors, and funding workflows
- Real-time chat and notifications (Socket.IO)
- AI task summarization using LangChain + OpenAI

## Tech Stack

### Frontend (`frontend`)
- React + TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS + shadcn/ui
- Socket.IO client

### Backend (`backend`)
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT auth
- Socket.IO server
- LangChain (`@langchain/openai`, `@langchain/classic`)

## Project Structure

- `backend/` main API and realtime server
- `frontend/` web client
- `chatbot/` separate chatbot prototype area

## Local Setup

### 1) Backend

```bash
cd backend
npm install
```

Create `backend/.env` with at least:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/projecthub
JWT_SECRET=replace_with_secure_secret
FRONTEND_URL=http://localhost:8080
SOCKET_CORS_ORIGIN=http://localhost:8080
OPENAI_API_KEY=replace_with_valid_key
```

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

## Backend Scripts

From `backend/`:

- `npm run dev` start dev server
- `npm run build` compile TypeScript (uses increased heap for Render stability)
- `npm start` run compiled server
- `npm run seed` seed sample data
- `npm run clear:chat` clear messages + message notifications
- `npm run clear:db` clear full database (destructive)

## AI Summarizer

### Endpoint

- `POST /api/ai/summarize` (protected)

Request body:

```json
{
  "tasks": [
    "Finalize scope",
    "Review blockers",
    "Prepare demo"
  ]
}
```

Response:

```json
{
  "success": true,
  "data": "1. Summary ..."
}
```

Notes:

- Requires valid `OPENAI_API_KEY` on backend.
- AI memory is process-local and resets on restart/redeploy.

## API Summary

### Auth
- `POST /api/auth/otp`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)
- `PUT /api/auth/profile` (protected)
- `GET /api/auth/search` (protected)
- `GET /api/auth/users`
- `GET /api/auth/users/:id` (protected)

### Projects
- `GET /api/projects`
- `GET /api/projects/user/projects` (protected)
- `GET /api/projects/:id`
- `POST /api/projects` (protected)
- `PUT /api/projects/:id` (protected)
- `DELETE /api/projects/:id` (protected)

### Messages
- `GET /api/messages/conversations` (protected)
- `GET /api/messages/:recipientId` (protected)
- `POST /api/messages` (protected)
- `PUT /api/messages/:recipientId/read` (protected)

## Deployment Notes (Render)

Backend environment variables (minimum):

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `SOCKET_CORS_ORIGIN`
- `OPENAI_API_KEY`

Frontend environment variables:

- `VITE_API_URL=https://<your-backend>.onrender.com/api`
- `VITE_SOCKET_URL=https://<your-backend>.onrender.com`

## Security

- Never commit `.env` files.
- Rotate any key if it was ever exposed.
- Keep production secrets only in your hosting provider's environment settings.


