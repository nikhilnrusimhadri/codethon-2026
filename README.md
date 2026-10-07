# CODETHON 2026

Production-ready event website and admin management system for CODETHON 2026 at Mother Teresa Institute of Science and Technology, organized by Abhiruchi Club.

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL + Prisma
- Zod validation
- JWT-based single-admin session
- Local private college-ID storage for development; S3-compatible storage can be added for production

## Setup
1. Install Node.js 20+ and PostgreSQL.
2. Create a PostgreSQL database named `codethon2026`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a long `JWT_SECRET`.
4. Run:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Admin: `http://localhost:3000/admin/login`.

## Event defaults
- Event: CODETHON 2026
- Organizer: Abhiruchi Club
- Institution: Mother Teresa Institute of Science and Technology
- Event: 14 October 2026, 10:00 AM–10:00 PM IST
- Registration deadline: 13 October 2026, 11:59 PM IST
- Eligible year: 3rd year
- Branches: CSE, CSM, EEE, ECE, Mechanical, Civil
- Team size: 4–6
- Coding platform: CodeTantra

## College ID storage
For local development, uploaded IDs are written to `./uploads` and served only through an authenticated admin route. For a serverless production deployment, implement the S3-compatible variables in `.env` and replace the local storage implementation in `app/api/register/route.ts` with private object storage + signed URLs. Never make college IDs public.

## Security
- Student registration is form-only; no student accounts.
- Roll number and college email are unique at the database level.
- Admin mutations are protected by session authentication.
- Uploads are restricted to JPG/PNG/PDF and 5 MB.
- Registration deadline is enforced server-side.
- Student private data and college IDs are not exposed publicly.

## Notes
Exact round timings, jury members, announcements, CodeTantra URL, contact details, and final results are admin-controlled and are not fabricated.
