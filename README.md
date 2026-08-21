# Pyramid — Task Management System

A full-stack task and project management app built for a Full Stack Developer (Fresher) technical assessment. Backend in NestJS + TypeORM, frontend in Next.js + Tailwind CSS, with guest authentication, a Kanban task board, project-scoped views, and a light/dark × 6-accent-color theme system.

## Live URLs

- **Frontend (app):** https://task-management-system-iota-liart-77.vercel.app
- **Backend (API):** https://task-management-system-r4oy.onrender.com/api/v1

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-60 seconds to respond while the server wakes up.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend:** NestJS, TypeORM, SQLite (via better-sqlite3)
- **Auth:** JWT-based guest login (Passport)
- **Deployment:** Vercel (frontend), Render (backend)

## Project Structure

This is a monorepo with two independent apps:


task-management-system/
├── backend/ — NestJS API (auth, users, projects, labels, tasks)
└── frontend/ — Next.js app (UI, consumes the backend API)




## Running Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in a JWT_SECRET
npm run start
```
Runs on `http://localhost:4000/api/v1`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` in a `.env.local` file if pointing at a non-default backend URL.

## Features Implemented

- Guest login (JWT-based, no password required)
- Kanban task board (To Do / Doing / Completed / On Hold columns)
- Task detail view: editable title, description, status, priority, assignee, and linked project
- Projects: create, list, and view project-scoped task boards
- Light/Dark theme + 6 accent colors (Amber, Blue, Pink, Rose, Emerald, Black), persisted per user
- Settings page for profile and theme preferences

## Known Deviations from the Figma Design

Built under significant time constraints; the following are intentional simplifications, all backed by fully working, tested API endpoints even where the UI doesn't yet expose them:

- **Google login** is UI/API-stubbed only (returns a "not implemented" response) — guest login is the supported path, per assessment scope.
- **Task List view** (grouped table with Fields/column-visibility toggle) is not implemented; only Board view is available. The `Fields` and `List/Board` toggle shown in Figma are not present.
- **Labels, Subtasks, Comments, and the Activity/Updates log** are fully implemented and tested on the backend (including a genuine many-to-many label system and an automatic change-log on status/priority updates) but are not yet exposed in the task detail UI.
- **Task cards** show the assignee but not due dates or labels, unlike the Figma cards.
- **Projects list** shows name and priority only, not a Lead avatar or due date column.
- Theme switching is available from the **Settings page** rather than a dropdown menu in the sidebar, as shown in Figma.
- **Due dates** on tasks use a native date input rather than the custom calendar/date-range picker in the Figma.
- Known cosmetic bug: theme *mode* (light/dark) can revert to light on a hard browser refresh (F5) in some cases; accent color and all task/project data persist correctly regardless.

## Architecture Notes

- **ORM:** TypeORM was used instead of Prisma after Prisma's engine-binary download was unreachable in the original development environment; TypeORM's decorator syntax also maps closely to JPA/Hibernate.
- **Response format:** all API responses follow a consistent `{ success, message, data }` envelope via a global NestJS interceptor and exception filter.
- **Auth:** stateless JWT via Passport's JWT strategy; guest accounts require no password.