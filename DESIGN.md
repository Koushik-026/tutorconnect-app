# TutorConnect Design System: Paper Bloom — Airy Learning Canvas

## 1. Product Identity & Philosophy

TutorConnect is a personalized education marketplace built on the philosophy of **calm, intentional learning**.
It is designed to feel like a crafted, thoughtful consumer product rather than a generic SaaS application.

### Quality Benchmark & Inspiration Principles
The visual grammar draws inspiration from modern, airy digital experiences (such as Google Stitch concepts):
- **Spatial Rhythm:** Generous vertical rhythm (~96–120px desktop section gaps, ~48–64px mobile), base 8px grid, giving every core idea room to breathe.
- **Architectural Color Fields:** Color is used structurally in large, low-saturation, atmospheric fields (pale lilac, sage field, peach field, soft sky) rather than scattered decorative confetti.
- **Selective Glassmorphism:** Subtle translucent surfaces with 10–16% soft borders and gentle backdrop blur, reserved for floating navigation, composers, and sticky action surfaces.
- **Restrained Elevation:** Shadows are nearly imperceptible (`0 8px 32px rgba(0, 0, 0, 0.03–0.05)`), avoiding harsh dark drop shadows.
- **Typography as Architecture:** Bold, editorial Manrope display headings strongly tracked (-0.035em to -0.04em) paired with highly legible, generous-line-height Inter body text.

*Note: External design references serve strictly as a quality benchmark. TutorConnect maintains its own original brand, assets, educational workflows, and visual identity.*

---

## 2. Color System

TutorConnect is **strictly light-theme first**. Dark mode sections, black full-screen blocks, or dark dashboards are forbidden.

### 2.1 Foundational Surfaces
| Token Name | Hex / Value | Purpose |
| :--- | :--- | :--- |
| `canvas` | `#FCFBF8` | Overall page canvas; warm, airy unbleached paper foundation. |
| `surface` | `#FFFFFF` | Primary content panels, reading blocks, input controls. |
| `surface-warm` | `#FFFDF9` | Warm off-white surface for secondary containers. |
| `surface-glass` | `rgba(255, 255, 255, 0.85)` | Translucent floating navigation and interactive composer surfaces. |
| `border` | `rgba(54, 48, 60, 0.10)` | Subtle structural borders (10% opacity). |
| `border-strong` | `rgba(54, 48, 60, 0.16)` | Defined active borders and input focus boundaries. |

### 2.2 Text & Ink Tokens
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `ink` | `#20221F` | Primary headings, values, key labels, deep charcoal ink. |
| `ink-secondary` | `#6D706A` | Body descriptions, secondary labels, editorial subheadings. |
| `ink-faint` | `#969991` | Metadata, inactive labels, timestamps, placeholders. |

### 2.3 Architectural Color Fields & Accents
| Name | Accent Hex | Atmospheric Field Hex | Semantic / Subject Role |
| :--- | :--- | :--- | :--- |
| **Primary Plum** | `#7257A5` | `#EEE7FF` (Lilac Field) | Primary brand accent, CTA buttons, hero atmosphere, physics. |
| **Deep Plum** | `#594282` | `#F4F0FF` (Soft Lavender) | Hover states, active buttons, mathematics motif. |
| **Sage** | `#5D806F` | `#E5F0EA` (Sage Field) | Verified status, in-person tuition, science motif, progress. |
| **Peach** | `#EFA17F` | `#FCE7DE` (Peach Field) | Chemistry motif, trial demo narrative, warm alerts. |
| **Soft Sky** | `#3B6FA6` | `#E4F1FA` (Sky Field) | Scheduling timelines, calendar dates, digital whiteboard. |
| **Blush** | `#C4658B` | `#F6E1EB` (Blush Field) | Student learning milestones, human guidance accents. |
| **Butter** | `#D9B85F` | `#F7E9BE` (Butter Field) | Rating stars, English literature, pending notices. |

---

## 3. Containment & Anti-Generic Rules

### 3.1 Containment Philosophy
Before wrapping content in a card, verify whether containment is functionally necessary.
- Prefer **whitespace, typography, subtle rules, and tinted atmospheric fields** over boxed containers.
- Avoid repetitive grids of identical cards.
- Where containment is required, use generous internal padding (32–40px desktop, 20–24px mobile) and soft radii (20–30px).

### 3.2 Anti-Generic Guardrails
- **NO** endless 3-card white box grids with icons.
- **NO** generic SaaS bento grids or KPI dashboard metric tiles.
- **NO** neon gradient text or huge colorful blobs behind headings.
- **NO** badge or pill overload; limit decorative tags.
- **NO** AI-generated stock photography or fake educator faces.
- **NO** dark landing sections, black headers, or dark dashboards. (Only the active video viewport is dark/neutral for video fidelity; all surrounding UI remains light).

---

## 4. Typography Scale

- **Display Hero:** 56–64px desktop / 38–44px mobile (`tracking-[-0.035em]` to `tracking-[-0.04em]`, line-height `1.08`).
- **Section Statement:** 44–56px desktop / 30–36px mobile (`tracking-[-0.03em]`, line-height `1.15`).
- **Product Section Titles:** 28–36px desktop / 22–26px mobile.
- **Body Text:** 16–18px desktop / 15–16px mobile (`leading-relaxed`, text color `#6D706A`).
- **Metadata / Eyebrow:** 11–13px uppercase, bold (`tracking-[0.08em]`).

---

## 5. Shape Language & Geometry

- **Floating Navigation & Hero Composers:** Full pill or large squircle (24–32px radius).
- **Major Feature Panels & Visual Stages:** 24–32px radius (`rounded-3xl`).
- **Standard Action Buttons:** 14–18px radius (`rounded-2xl`).
- **Metadata & Input Controls:** 10–14px radius (`rounded-xl`).
- **Subject Motif Tiles:** Asymmetric or organic squircle shapes.

---

## 6. Glassmorphism & Elevation

- **Translucency:** `bg-white/85` to `bg-white/92` with `backdrop-blur-md`.
- **Structural Border:** `1px solid rgba(54, 48, 60, 0.10)`.
- **Soft Shadow:** `box-shadow: 0 8px 32px rgba(54, 48, 60, 0.04)`.
- Glass is applied selectively to:
  1. Floating public navigation
  2. Hero Tutor Requirement Composer
  3. Floating classroom bottom controls
  4. Sticky booking & checkout summary surfaces

---

## 7. Public vs. Authenticated Composition

### 7.1 Public Experience (Landing, Discovery, Profile)
- Floating pill-like navigation separated from viewport boundaries.
- Single dominant focal interaction in hero (Tutor Requirement / Match Composer).
- Asymmetric storytelling layouts with large negative space.
- Horizontal subject showcase strips.

### 7.2 Authenticated Experience (Student Dashboard)
- Task-first "My Learning Space" hierarchy: Next class → Weekly rhythm → Learning progress → Lesson notes & homework.
- One dominant next-class stage rather than equal card piles.
- Quiet, light desktop navigation sidebar and integrated mobile bottom bar.

---

## 8. Claim Safety & Product Rules

All frontend copy must adhere strictly to verified capabilities:
- **Free Demo:** 30 minutes, Online only, 1-on-1, zero payment required.
- **Class Packages:** 8 classes (₹3,200), 12 classes (₹4,500), 15 classes (₹5,400) — all 60 min/class, 45-day package validity.
- **No Recurring Subscriptions:** Clear one-time package payments.
- **Home Tuition:** Subject to tutor availability and location/radius eligibility in Hyderabad.
- **Verified Language:** "Verified tutor profile", "Identity verified", "Qualification reviewed", "Teaching profile reviewed".
- **Notes Wording:** "Digital lesson notes when shared by the tutor".
- **Receipts:** "Prototype receipt shown for this simulated transaction".

---

## 9. Iconography & Assets

- **Icons:** Project-specific lightweight SVG icon primitives in `@/components/ui/icons.tsx`. Zero external icon package dependencies (e.g. no Lucide, FontAwesome, etc.).
- **Product Visuals:** Lightweight CSS/SVG illustrations and miniature UI mockups representing tutor match, weekly schedule, and lesson notes. Zero fake stock photography.

---

## 10. Motion & Microinteractions

- Native CSS transitions only (140ms–240ms duration, `cubic-bezier(0.16, 1, 0.3, 1)`).
- Full support for `prefers-reduced-motion: reduce`.
- Zero parallax, ambient canvas loops, or cursor tracking effects.
