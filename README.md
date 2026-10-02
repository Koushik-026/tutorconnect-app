# TutorConnect — Personalized 1-on-1 Tuition Platform

TutorConnect connects school students (Classes 6–12) with verified educators in Hyderabad for 1-on-1 online learning and localized in-home tuition. Built with **Next.js 16 (Turbopack)**, **Tailwind CSS v4**, and **Supabase (PostgreSQL + RLS)** under the **Sunlit Grove** visual design identity.

---

## 1. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start local development server
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

---

## 2. Environment Variables Contract

Copy `.env.example` to `.env.local`. Never commit secret keys or `.env.local`.

```env
# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Site URL for Auth Redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 3. Backend Architecture: Supabase SSR & PostgreSQL

TutorConnect implements the official Supabase SSR architecture tailored for Next.js 16 App Router:

- **Browser Client (`src/lib/supabase/client.ts`):** Created via `createBrowserClient` for client components.
- **Server Client (`src/lib/supabase/server.ts`):** Created via `createServerClient` with cookie storage for server components, server actions, and route handlers.
- **Session Refresh Proxy (`src/lib/supabase/proxy.ts` & root `proxy.ts`):** Next.js 16 network-edge proxy for cookie rotation and route protection.
- **Verified Server Claims (`src/lib/supabase/auth.ts`):** Validates authenticated sessions using `supabase.auth.getClaims()` rather than trusting unverified client sessions.

---

## 4. Database Schema & Row Level Security (RLS)

All database changes are tracked in versioned SQL migrations under `supabase/migrations/`:

- `20261002000000_phase2_backend_foundation.sql`

### Core Entities:
1. **`profiles`:** 1:1 with `auth.users`. Automated user bootstrap trigger `on_auth_user_created` creates profiles securely without granting elevated privileges.
2. **`account_roles`:** Multi-role mapping supporting `parent`, `student`, `tutor`, and `admin`. Self-service onboarding restricted to non-admin roles.
3. **`student_profiles`:** Learner profiles owned by parent or student accounts. Full CRUD isolated strictly to `owner_user_id = auth.uid()`.
4. **`tutor_profiles`:** Educator profiles with public slug, subjects, boards, and delivery modes (online/home).
5. **`tutor_application_states`:** Privileged separation table managing tutor status (`pending`, `approved`, `rejected`, `suspended`). Applicants cannot self-approve.
6. **`subjects`:** Public course catalogue (Mathematics, Science, Physics, Chemistry, Biology, English, Computer Science).
7. **`tutor_subjects`:** Junction table linking approved tutor profiles with subjects.

---

## 5. Local Supabase & Migration Workflow

When Docker is available on your development workstation:

```bash
# Initialize and start local Supabase services
npx supabase start

# Apply migrations from scratch
npx supabase db reset

# Generate TypeScript types from active local database
npx supabase gen types typescript --local > src/lib/types/database.generated.ts
```

---

## 6. Authentication Flows

- **Google OAuth:** Initiated via `supabase.auth.signInWithOAuth` using PKCE code exchange in `/auth/callback`. Requires Google OAuth credentials configured in the Supabase Dashboard.
- **Email Magic Link:** Passwordless authentication initiated via `supabase.auth.signInWithOtp`. Handled in `/auth/callback` or confirmed via email OTP link.
- **Onboarding Flow (`/auth/onboarding`):** Directs new authenticated accounts without an established role to choose Parent, Student, or Tutor application.
- **Protected Student Workspace (`/dashboard/student`):** Server-side layout guard redirects unauthenticated users to `/auth?next=/dashboard/student` while preserving preview capability when Supabase is not yet connected.
- **Sign Out (`/auth/signout`):** Server route handler invalidates session cookies and redirects cleanly.

---

## 7. Quality & Verification Commands

```bash
# Lint audit (0 errors, 0 warnings required)
npm run lint -- --max-warnings=0

# Production build
npm run build
```
