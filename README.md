# Real-Time Interview Platform

A platform for scheduling and conducting live video interviews, complete with real-time chat and structured feedback.

**Live demo:** https://realtimeinterviewplatform.vercel.app

## Features

- **Flexible, per-interview roles.** Any signed-in user can schedule an interview and invite a candidate by email. Authorization is enforced per interview (interviewer vs. candidate), not through fixed account roles.
- **Interview management.** Create, view, update, cancel and delete interviews. The dashboard splits them into Current, Upcoming and Past tabs with pagination.
- **Guarded lifecycle.** Interviews move through `SCHEDULED` → `IN_PROGRESS` → `COMPLETED` (or `CANCELLED`). The server prevents invalid transitions and the status is persisted in PostgreSQL.
- **Live video interviews.** Stream Video powers a lobby with camera/microphone preview and toggles, a permission check, and an in-call experience with layout switching and mute/camera controls. The interviewer can end the call for everyone, and the UI handles participants joining or leaving and connection loss.
- **In-call chat.** Stream Chat provides a text chat panel beside the video, with one channel per interview.
- **Structured feedback.** Interviewers submit technical, communication and overall ratings, a hiring recommendation and notes. Feedback is visible only to the interviewer, and a Feedback page lists past feedback with candidate search.
- **Real-time presence and status.** A NestJS WebSocket gateway shows whether the other participant is online and updates interview status live across clients.
- **User sync.** A Clerk webhook keeps names and emails in sync, with idempotent event processing so duplicate deliveries are safe.
- **Invite link.** Copy a direct link to an interview. Signed-out users are sent to sign in and then returned to the interview.
- **Polish.** Loading, empty and error states, custom 404 and unauthorized pages, toast notifications, and a responsive layout.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, class-validator |
| Database | PostgreSQL (Supabase), Prisma |
| Auth | Clerk |
| Video and chat | Stream Video SDK, Stream Chat SDK |
| Real-time | Socket.IO (NestJS WebSocket gateway) |
| Hosting | Vercel (frontend), Render (backend) |

## Architecture

```text
real-time-interview-platform/
├── backend/                 # NestJS API
│   ├── prisma/              # Schema and migrations
│   └── src/
│       ├── interviews/      # Interview CRUD, lifecycle, Stream tokens
│       ├── feedback/        # Feedback submit/get/list
│       ├── stream/          # Stream Video service
│       ├── chat/            # Stream Chat service
│       ├── events/          # WebSocket gateway (presence, live events)
│       ├── webhooks/        # Clerk webhook handler
│       ├── guards/          # Clerk auth and roles guards
│       └── prisma/          # Prisma module and service
└── frontend/                # Next.js app
    └── src/
        ├── app/             # Routes: dashboard, interviews, feedback, room
        ├── components/      # Interview cards, call UI, chat panel, toasts
        ├── hooks/           # Video client, chat client, socket hooks
        └── lib/             # API client and helpers
```

How the pieces fit together:

- The frontend authenticates with Clerk and calls the NestJS API with a Clerk session token.
- The backend verifies the token, creates the matching `User` row on first request, and checks per-interview access.
- When an interview is created, the backend registers both participants with Stream and creates the video call and chat channel, using the interview ID as the call and channel ID.
- Stream API secrets never leave the backend. The frontend only receives short-lived user tokens from the backend's token endpoints.
- The WebSocket gateway authenticates sockets with the same Clerk token and scopes presence to a room per interview.

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (a Supabase project works)
- A [Clerk](https://clerk.com) application
- A [Stream](https://getstream.io) app with **Video** and **Chat** enabled

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Create `backend/.env`:

```env
DATABASE_URL=
DIRECT_URL=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_WEBHOOK_SECRET=
STREAM_API_KEY=
STREAM_API_SECRET=
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=
```

Open http://localhost:3000.

### Clerk webhook (optional locally)

The webhook keeps user profile data in sync. Clerk needs a public URL to reach it, so it is easiest to register after deploying:

1. In the Clerk Dashboard, add an endpoint at `https://<your-backend>/webhooks/clerk`.
2. Subscribe to `user.created`, `user.updated` and `user.deleted`.
3. Copy the signing secret into `CLERK_WEBHOOK_SECRET`.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/interviews` | Create an interview (candidate by email) |
| `GET` | `/interviews/me` | List the current user's interviews |
| `GET` | `/interviews/:id` | Get an interview (participants only) |
| `PATCH` | `/interviews/:id` | Update an interview (interviewer) |
| `PATCH` | `/interviews/:id/cancel` | Cancel an interview |
| `PATCH` | `/interviews/:id/start` | Mark an interview in progress |
| `PATCH` | `/interviews/:id/complete` | Mark an interview completed |
| `DELETE` | `/interviews/:id` | Delete an interview (interviewer) |
| `GET` | `/interviews/:id/stream-token` | Stream Video token for a participant |
| `GET` | `/interviews/:id/chat-token` | Stream Chat token for a participant |
| `POST` | `/interviews/:id/feedback` | Submit or update feedback (interviewer) |
| `GET` | `/interviews/:id/feedback` | Get feedback (interviewer) |
| `GET` | `/feedback/me` | List feedback written by the current user |
| `POST` | `/webhooks/clerk` | Clerk webhook (signature verified) |

## Deployment

- **Frontend:** Vercel, with the root directory set to `frontend` and the framework preset set to Next.js. Set `NEXT_PUBLIC_API_URL` to the backend's public URL.
- **Backend:** Render, with the root directory set to `backend`.
  - Build command: `npm install && npx prisma generate && npm run build`
  - Start command: `npm run start:prod`
  - Set `FRONTEND_URL` to the exact frontend origin, with no trailing slash, so CORS and the WebSocket gateway accept it.

Render's free tier spins the backend down after about 15 minutes without traffic, so the first request after a quiet period can take 30 to 60 seconds. The in-memory presence state also resets on restart.

## Known Limitations

- **Microsoft Edge sign-in loop.** The site uses a sign-in service that Edge treats differently from other browsers, which can cause a login loop. It works in Chrome and Firefox. Technically, Clerk's default shared domain sets its session cookie as a third-party cookie, which Edge's tracking prevention blocks. Running Clerk on a custom domain would fix it.
- **Single-instance presence.** Presence is held in memory, so scaling the backend to multiple instances would require a shared adapter such as Redis.
- **Candidates must already have an account.** Interviews are created against the candidate's email, and the candidate must have signed up first.
- **One interviewer per interview.** Feedback assumes a single interviewer, so panel interviews are not supported yet.
- **Unused schema tables.** `Invitation` and `AuditLog` exist in the schema but are not used by the application.

## Possible Next Steps

- Run Clerk on a custom domain to resolve the Edge limitation
- Add audit logging
- Add panel interviews with multiple interviewers
- Add recording and playback of interviews