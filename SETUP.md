# ChatApp Setup Guide

## Prerequisites
- Node.js >= 18
- PostgreSQL database
- pnpm package manager

## Database Setup

1. Create a PostgreSQL database
2. Create a `.env` file in `packages/db/` with your database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"
   ```

3. Run Prisma migrations:
   ```bash
   cd packages/db
   pnpm prisma migrate dev
   pnpm prisma generate
   cd ../..
   ```

## Environment Setup

Create `.env` file in `packages/backend-common/` (if not exists):
```
JWT_SECRET="your-secret-key-here"
```

## Installation

```bash
pnpm install
```

## Running the Application

### Option 1: Run All Services (Recommended)
```bash
pnpm dev
```

This will start:
- Frontend (Next.js) on http://localhost:3000
- HTTP Backend (Express) on http://localhost:3001
- WebSocket Backend on ws://localhost:8080

### Option 2: Run Services Individually

**Terminal 1 - HTTP Backend:**
```bash
cd apps/http-backend
pnpm dev
```

**Terminal 2 - WebSocket Backend:**
```bash
cd apps/ws-backend
pnpm dev
```

**Terminal 3 - Frontend:**
```bash
cd apps/web
pnpm dev
```

## Application Features

### 1. **Landing Page** (`/`)
- Welcome page with feature highlights
- Navigation to Sign In / Sign Up

### 2. **Sign Up** (`/signup`)
- Create a new account
- Fields: Name, Email, Password
- Auto-login after signup

### 3. **Sign In** (`/signin`)
- Login to existing account
- JWT token-based authentication

### 4. **Dashboard** (`/dashboard`)
- Create new chat rooms
- Join existing rooms by slug
- Protected route (requires authentication)

### 5. **Chat Room** (`/room/[slug]`)
- Real-time messaging via WebSocket
- See all messages in the room
- Leave room functionality
- Auto-scroll to latest messages

## API Endpoints

### HTTP Backend (Port 3001)
- `POST /signup` - Create new user
- `POST /signin` - User login
- `POST /room` - Create new room (requires auth)
- `GET /room/:slug` - Get room by slug
- `GET /chats/:roomId` - Get chat history

### WebSocket Backend (Port 8080)
Messages:
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `chat` - Send a message

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Express, Node.js, WebSocket
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: CSS Modules with professional design system
- **Authentication**: JWT tokens

## Design Features
- Professional color scheme (Blue primary, Green secondary)
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Real-time updates
- Clean and modern UI

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Run `pnpm prisma migrate dev` to sync schema

### WebSocket Connection Issues
- Ensure WebSocket backend is running on port 8080
- Check browser console for connection errors
- Verify JWT token is valid

### Port Already in Use
- Kill existing processes on ports 3000, 3001, 8080
- Or modify ports in respective config files
