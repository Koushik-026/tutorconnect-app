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
# Supabase API Configuration (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

---

## 3. Backend Architecture: Supabase SSR & PostgreSQL

TutorConnect implements the official Supabase SSR architecture tailored for Next.js 16 App Router:

- **Configuration Helper (`src/lib/supabase/config.ts`):** Centralizes `isSupabaseConfigured()` and `getSupabaseConfig()` to prevent accidental network calls against fake URLs.
- **Browser Client (`src/lib/supabase/client.ts`):** Created via `createBrowserClient` inside event handlers only when Supabase is configured.
- **Server Client (`src/lib/supabase/server.ts`):** Created via `createServerClient` with Next.js 16 async `cookies()` API.
- **Session Refresh Proxy (`src/lib/supabase/proxy.ts` & root `proxy.ts`):** Next.js 16 network-edge proxy for cookie rotation and token validation.
- **Verified Server Claims (`src/lib/supabase/auth.ts`):** Validates authenticated sessions using `supabase.auth.getClaims()` rather than trusting unverified client sessions.
- **Role Verification Helpers (`src/lib/supabase/auth.ts`):** `getAccountRoles(userId)` and `hasAnyRole(userId, allowedRoles)` for server-side authorization.

---

## 4. Database Schema & Row Level Security (RLS)

All database changes are tracked in versioned SQL migrations under `supabase/migrations/`:

- `20261002000000_phase2_backend_foundation.sql`

### Core Entities:
1. **`profiles`:** 1:1 with `auth.users`. Automated user bootstrap trigger `on_auth_user_created` creates profiles securely without granting elevated privileges. Strictly private: readable only by account owner or admin.
2. **`account_roles`:** Multi-role mapping supporting `parent`, `student`, `tutor`, and `admin`. Direct inserts/updates restricted to admin; users onboard safely via the atomic `complete_onboarding` RPC.
3. **`student_profiles`:** Learner profiles owned by parent or student accounts. Full CRUD isolated strictly to `owner_user_id = auth.uid()`.
4. **`tutor_profiles`:** Educator profiles with public slug, subjects, boards, and delivery modes (online/home). Public read is guarded via `is_tutor_approved(profile_id)` to eliminate RLS recursion/invisibility.
5. **`tutor_application_states`:** Privileged separation table managing tutor status (`pending`, `approved`, `rejected`, `suspended`). Initial pending state is provisioned atomically by `complete_onboarding`. Applicants cannot self-approve.
6. **`subjects`:** Public course catalogue (Mathematics, Science, Physics, Chemistry, Biology, English, Computer Science).
7. **`tutor_subjects`:** Junction table linking approved tutor profiles with subjects. Public read is restricted to approved tutors.

### Security Functions:
- **`is_admin()`:** `SECURITY DEFINER STABLE` check against `account_roles`.
- **`is_tutor_approved(profile_id uuid)`:** `SECURITY DEFINER STABLE` check resolving tutor visibility without leaking reviewer data.
- **`complete_onboarding(chosen_role, p_display_name)`:** Atomic `SECURITY DEFINER` onboarding transaction: updates profile display name, assigns `parent`/`student`/`tutor` role, creates tutor profile & pending application state. Strictly rejects `admin`.

---

## 5. Supabase Magic Link Email Template Configuration

For Supabase SSR with Next.js App Router, the Email Magic Link must route through the server-side confirmation endpoint (`/auth/confirm`).

In your **Supabase Project Dashboard -> Authentication -> Email Templates -> Magic Link**:

### Recommended SSR Template:
```html
<h2>Log in to TutorConnect</h2>
<p>Click the link below to securely sign in to your TutorConnect account:</p>
<p>
  <a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">
    Sign in to TutorConnect
  </a>
</p>
```

Alternatively, if using `{{ .ConfirmationURL }}`:
```html
<h2>Log in to TutorConnect</h2>
<p><a href="{{ .ConfirmationURL }}">Sign in to TutorConnect</a></p>
```
*(Ensure Site URL in Supabase Auth settings is set to `http://localhost:3000` or your production domain).*

---

## 6. Authentication Flows

- **Google OAuth:** Initiated via `supabase.auth.signInWithOAuth` using PKCE code exchange in `/auth/callback`.
- **Email Magic Link:** Passwordless authentication initiated via `supabase.auth.signInWithOtp`. Handled in dedicated `/auth/confirm` route via `verifyOtp({ type, token_hash })`.
- **Safe Internal Redirects (`src/lib/utils/redirect.ts`):** `sanitizeInternalRedirect` rejects protocol-relative, backslash, external, or malformed URLs to prevent open-redirect vulnerabilities.
- **Atomic Onboarding (`/auth/onboarding`):** New authenticated accounts select Parent, Student, or Tutor. Calls `complete_onboarding()` PostgreSQL RPC in a single transaction.
- **Role-Aware Student Workspace (`/dashboard/student`):** Server-side layout guard validates authenticated identity and checks for `parent` or `student` role. Accounts with only a `tutor` role receive a polite role-restricted screen with options to add a learner profile.
- **Secure Sign Out (`/auth/signout`):** Dedicated `POST` endpoint that invalidates session cookies and redirects to `/auth`. `GET` requests return HTTP 405 Method Not Allowed.

---

## 7. Quality & Verification Commands

```bash
# Security & RLS verification suites
node scripts/test_security_static.js
node scripts/test_live_rls.js
node scripts/test_authenticated_proof.js

# Lint audit (0 errors, 0 warnings required)
npm run lint -- --max-warnings=0

# Production build
npm run build
```
