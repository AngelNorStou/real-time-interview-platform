# Real-Time Interview Platform

A full-stack platform for scheduling, conducting, and reviewing structured video interviews.

## Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Clerk (auth)
- **Backend**: NestJS 12, Prisma 7, PostgreSQL (Supabase)
- **Video/Chat**: Stream Video & Stream Chat
- **Real-time presence**: NestJS WebSocket Gateway (Socket.IO)

## Features

- Clerk-authenticated accounts; any user can interview or be interviewed (per-interview roles, not fixed account roles)
- Create, schedule, cancel, and manage interviews
- Live video calls with device controls, in-call chat, and connection-state handling
- Structured feedback (technical/communication/overall ratings, notes) per interview
- Real-time presence and status updates via WebSocket
- Clerk webhook keeps user profile data in sync

## Local setup

### Backend
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

Required env vars (`backend/.env`):


### Frontend
```bash
cd frontend
npm install
npm run dev
```

Required env vars (`frontend/.env.local`):



## Deployment

- **Frontend**: Vercel
- **Backend**: Render (free tier — cold starts after 15 min idle; see notes in project history)
- Database and Prisma migrations run against the same Supabase instance in both environments.