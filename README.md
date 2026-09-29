# Zoom Clone

A video conferencing web app modeled on the Zoom web client. You can start instant meetings, join by meeting ID or invite link, schedule meetings for later, and manage participants from inside the meeting room.

## Tech Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 16 (App Router, TypeScript), Tailwind CSS 4, lucide-react |
| Backend  | Python 3.10+, FastAPI, SQLAlchemy 2, Pydantic 2   |
| Database | SQLite                                            |

## Features

- **Dashboard**: navbar with profile and settings, plus New meeting / Join / Schedule actions, live clock, upcoming meetings grouped by day, and recent meetings.
- **Instant meeting**: generates a unique 11-digit meeting ID and a shareable invite link (`/j/<meeting id>`), then takes the host straight into the room.
- **Join meeting**: accepts a meeting ID (with or without spaces) or a full invite link. You enter a display name first, and the meeting's existence is checked before joining. Invite links open a pre-join screen with a camera and mic preview.
- **Schedule meeting**: topic, description, date and time pickers, and duration. The meeting ID and link are generated automatically, the meeting is stored in SQLite, and it appears under Upcoming meetings. After saving you can copy the invitation.
- **Meeting room**: local camera and microphone preview, mute and video toggles, participant grid, participants panel, meeting info with a copy-link button, and leave / end meeting.
- **Host controls**: mute all, remove a participant, and end the meeting for everyone. If the host leaves, host is passed to the next participant.
- **Responsive**: works on mobile, tablet and desktop.

## Project Structure

```
backend/
  app/
    core/          config, database session, dependencies, error handlers
    models/        SQLAlchemy models (User, Meeting, Participant)
    schemas/       Pydantic request/response models
    controllers/   business logic
    routes/        FastAPI routers (thin HTTP layer)
    utils/         meeting-code generation, time helpers
    seed.py        sample data loaded on first start
    main.py        app entrypoint
frontend/
  src/
    app/           routes: / (dashboard), /j/[code] (pre-join), /wc/[code] (meeting room)
    components/    ui, layout, dashboard, modals, prejoin, room
    hooks/         data fetching, polling, media, clipboard helpers
    lib/           API client, formatting, meeting-code parsing
    types/         shared TypeScript types
```

The backend follows an MVC split. **Models** hold the schema, **schemas** are the views that shape API input and output, and **controllers** hold all business rules. Routes only wire HTTP to controllers. Controllers raise domain errors (`NotFoundError`, `ForbiddenError`, `MeetingEndedError`, …), and one handler turns them into HTTP responses.

## Database Schema

```
users
  id PK, name, email UNIQUE, avatar_color, created_at

meetings
  id PK, meeting_code UNIQUE (11 digits), title, description,
  meeting_type (instant | scheduled), status (scheduled | live | ended),
  host_id FK -> users.id (CASCADE),
  scheduled_start, duration_minutes, started_at, ended_at, created_at
  INDEX (host_id, status)

participants
  id PK, meeting_id FK -> meetings.id (CASCADE), user_id FK -> users.id (SET NULL, nullable for guests),
  display_name, role (host | attendee), status (active | left | removed),
  is_muted, is_video_on, joined_at, left_at
  INDEX (meeting_id, status)
```

- A user hosts many meetings, and a meeting has many participants.
- Participants are separate rows for each join, so meeting history (who joined, when, and whether they left or were removed) is kept.
- The invite link is not stored. The API builds it from the address the app was opened on (the frontend sends it in an `X-Public-Origin` header) and the meeting code, so links stay correct on localhost, behind a tunnel, or on a deployed domain. `FRONTEND_URL` is the fallback.
- All timestamps are stored in UTC and returned as ISO 8601 strings with a `Z` suffix.

## API

Base URL: `/api`. Interactive docs are at `/docs` once the backend is running.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/users/me` | Current (default) user |
| GET    | `/meetings/upcoming` | Scheduled meetings that haven't finished yet |
| GET    | `/meetings/recent` | Meetings the user has hosted that have started |
| POST   | `/meetings/instant` | Create and start an instant meeting |
| POST   | `/meetings` | Schedule a meeting |
| GET    | `/meetings/{code}` | Check that a meeting exists and can be joined |
| POST   | `/meetings/{code}/start` | Host starts or rejoins a meeting |
| POST   | `/meetings/{code}/join` | Join with a display name |
| POST   | `/meetings/{code}/end` | Host ends the meeting for everyone |
| GET    | `/meetings/{code}/state` | Room state: meeting, self, active participants |
| GET    | `/meetings/{code}/participants` | Active participants |
| PATCH  | `/meetings/{code}/participants/{id}` | Update own mute/video state |
| POST   | `/meetings/{code}/participants/{id}/leave` | Leave the meeting |
| POST   | `/meetings/{code}/participants/mute-all` | Host mutes everyone else |
| DELETE | `/meetings/{code}/participants/{id}` | Host removes a participant |

In-room actions identify the caller with the `X-Participant-Id` header. The ID comes from the join/start response and is kept in the browser's `sessionStorage`.

## Setup

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

On first start the database is created and seeded with a default user (Alex Johnson), 4 upcoming meetings and 5 past meetings with participants. To reset, delete `zoom.db` and restart.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000.

### Environment Variables

| Variable | Where | Default |
| -------- | ----- | ------- |
| `DATABASE_URL` | backend | `sqlite:///./zoom.db` |
| `FRONTEND_URL` | backend (fallback base for invite links) | `http://localhost:3000` |
| `CORS_ORIGINS` | backend, comma separated | `http://localhost:3000` |
| `BACKEND_URL` | frontend, build time (target of the `/api` proxy) | `http://localhost:8000` |
| `NEXT_PUBLIC_API_URL` | frontend, optional (call the API directly instead of through the proxy) | empty |

The frontend calls the API on its own origin at `/api/*`, and Next.js forwards those requests to `BACKEND_URL`. The browser never makes a cross-origin request, so the app works behind port forwarding or a tunnel with only port 3000 exposed. Invite links automatically use whichever URL the app was opened on.

## Deployment

- **Backend (Render/Railway)**: root directory `backend`, build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `FRONTEND_URL` and `CORS_ORIGINS` to the deployed frontend URL.
- **Frontend (Vercel)**: root directory `frontend`. Set `BACKEND_URL` to the deployed backend URL.

On free hosting tiers the SQLite file lives on ephemeral disk, so it is re-seeded whenever the service restarts.

## Assumptions

- There is no login. A default seeded user is always signed in and owns the dashboard, as the assignment requires.
- Anyone with a meeting ID or invite link can join as an attendee. Joining a scheduled meeting before the host starts it makes the meeting live.
- The room shows your own camera and microphone. Video is not streamed between participants. Participants, mute/video status and host actions sync through the API, which the room polls every 2 seconds.
- A meeting ends when the host ends it for everyone, or when the last participant leaves. Ended meetings can't be joined again and show up under Recent meetings.
- Features not in the assignment (chat, screen share, recording, reactions, other navbar tabs) appear as disabled buttons to keep the Zoom layout, but they have no functionality.
- Scheduled meetings must start in the future and last between 15 minutes and 24 hours.
