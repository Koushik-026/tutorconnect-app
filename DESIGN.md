# TUTORCONNECT DESIGN SYSTEM: PAPER BLOOM
**Version:** 2.0  
**Status:** Canonical Visual Identity Contract  
**Concept Name:** Paper Bloom  

---

## 1. Product Personality & Philosophy

TutorConnect connects ambitious secondary and high-school students (Classes 6–12) with vetted, high-empathy tutors for 1-on-1 online classes and local in-home tuition in Hyderabad.

The visual identity must feel like a **crafted, thoughtful consumer learning product**—warm, intellectually stimulating, human, and encouraging. It is expressly **not** an enterprise SaaS dashboard, not an aggressive corporate ed-tech platform, and not an AI-generated template.

### Core Character Traits
- **Calm & Focused:** Generous negative space, warm paper-toned backgrounds, low-stress cognitive load.
- **Thoughtful & Academic:** Editorial hierarchy, structured typographical anchors, stationery and notebook nuances without feeling archaic.
- **Youthful & Friendly:** Warm accents (plum, sage, peach, lavender, butter) that feel motivating to teenagers and reassuring to parents.
- **Crafted & Tactile:** Varied geometry, purposeful borders, asymmetric rhythm, and controlled physical depth.
- **Light & Airy:** Light-theme-first throughout every user journey; zero oppressive dark panels.

---

## 2. Color System

The Paper Bloom palette replaces ubiquitous digital "tech blue" with an organic, editorial collection of botanical, ink, and warm paper tones.

### 2.1 Foundational Surfaces
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `canvas` | `#F7F4EE` | Overall page backdrop; warm, tactile unbleached paper tone. |
| `surface` | `#FFFEFB` | Primary content panels, editorial reading blocks, form fields. |
| `surface-elevated` | `#FFFFFF` | Lifted cards, floating action bars, dropdowns, modal windows. |
| `border-warm` | `#E4DED4` | Standard structural borders and dividing rules. |
| `border-soft` | `#ECE6DC` | Subtle dividers, inset table borders, and nested elements. |

### 2.2 Text & Ink Tokens
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `ink` | `#232520` | Primary headings, values, key labels, active icons (deep charcoal ink). |
| `ink-muted` | `#676B64` | Body descriptions, secondary labels, metadata, captions. |
| `ink-faint` | `#989C94` | Inactive states, timestamps, placeholder text. |

### 2.3 Accent & Expression Palette
| Name | Base Hex | Soft Background | Semantic / Subject Association |
| :--- | :--- | :--- | :--- |
| **Primary Plum** | `#66518A` | `#EFEAF8` | Primary brand accent, primary CTA, header highlights. |
| **Primary Deep** | `#4E3C70` | `#E3D8F2` | Hover states, active buttons, high-contrast headings. |
| **Sage** | `#4F7867` | `#E6F0EA` | Science, verified status, home tuition indicator, growth. |
| **Peach** | `#E99873` | `#FBE9DF` | Chemistry, conversational alerts, booking milestones. |
| **Lavender** | `#B7A5DE` | `#F4F0FB` | Mathematics, logic, abstract reasoning motifs. |
| **Butter** | `#D9B85F` | `#F8EFCF` | English, language arts, editorial bookmarks, reviews. |

### 2.4 Functional Feedback Tokens
| Purpose | Solid Hex | Soft Background |
| :--- | :--- | :--- |
| **Success** | `#2E7D5B` | `#E9F5EF` |
| **Warning** | `#C27A1B` | `#FDF4E5` |
| **Danger** | `#C84B31` | `#FCEEEA` |
| **Info / Tech Blue** | `#3B6FA6` | `#EBF2F9` | *(Strictly reserved for technical system statuses; never used as default brand accent)* |

---

## 3. Light-Theme Requirement

TutorConnect is **strictly a light-themed interface**.
- No dark landing page sections.
- No black full-screen headers or footers.
- No dark dashboard layouts or dark auth screens.
- In virtual demo sessions, only the raw video camera stream viewport is dark/neutral for video fidelity; all surrounding toolbars, headers, controls, and chat drawers must maintain the light Paper Bloom shell.

---

## 4. Typography

### 4.1 Typefaces
- **Headings & Display:** `Manrope` (Variable, weights 600, 700, 800)
  - Characterized by round, human geometric letterforms with tight tracking (`tracking-tight` / `-0.025em`).
- **Body & Interface:** `Inter` (Variable, weights 400, 500, 600)
  - Optimized for exceptional micro-legibility, generous line-height (`leading-relaxed`), and precise tabular numbers.

### 4.2 Hierarchy Standards
- **Hero Title:** `text-4xl sm:text-5xl lg:text-6xl`, line-height `1.08`, tracking `-0.035em`.
- **Section Heading:** `text-2xl sm:text-3xl lg:text-4xl`, line-height `1.15`, tracking `-0.025em`.
- **Panel Title:** `text-xl sm:text-2xl`, font-bold, tracking `-0.02em`.
- **Card Title:** `text-base sm:text-lg`, font-bold, line-height `1.3`.
- **Body Text:** `text-sm sm:text-base`, text color `#676B64`, line-height `1.65`.
- **Metadata / Eyebrow:** `text-[11px] sm:text-xs`, font-bold, uppercase, tracking `0.08em`.

---

## 5. Shape Language & Geometry

Avoid uniform corner radii across everything. Hierarchy dictates geometry:
- **Primary Actions / Buttons:** `14px – 18px` (`rounded-xl` to `rounded-2xl`).
- **Major Feature Panels & Cards:** `20px – 28px` (`rounded-2xl` to `rounded-3xl`).
- **Small Metadata & Form Inputs:** `10px – 12px` (`rounded-lg` to `rounded-xl`).
- **Subject Badges & Tags:** `9999px` (`rounded-full`).
- **Subject Icons / Illustrations:** Asymmetric or organic squircle geometry (`rounded-2xl` to `rounded-3xl` with organic SVG frames).

---

## 6. Layout Character & Anti-Generic Rules

### 6.1 Layout Character
- **Asymmetric Balance:** Avoid rigid symmetry; balance large editorial type blocks with contextual learning widgets.
- **Varied Containment:** Do not place every thought into a white rectangle. Use typographic groupings, tinted backdrop panels, and subtle borders.
- **Intentional Breathing Space:** Give concepts room to breathe; generous vertical padding (`py-16` to `py-24` on desktop).

### 6.2 Forbidden Patterns
- NO endless 3-card pricing columns with blue checkmarks.
- NO floating glass rectangles with rainbow drop shadows.
- NO huge blue/purple gradient blobs behind text.
- NO blue gradient headline text.
- NO generic SaaS dashboard metric boxes with generic percentage arrows.
- NO AI-generated stock photos or fake educator faces.
- NO dark mode sections or muddy gray backgrounds.

---

## 7. Subject Visual System

Each core subject receives a signature visual identity and subtle accent pairing:

| Subject | Accent Color | Soft Tint | Signature Motif |
| :--- | :--- | :--- | :--- |
| **Mathematics** | Lavender (`#B7A5DE`) | `#F4F0FB` | Precision geometric coordinates, compass curves, calculus integrals. |
| **Science** | Sage (`#4F7867`) | `#E6F0EA` | Molecular lattices, plant cell structures, leaf venation. |
| **Physics** | Primary Plum (`#66518A`) | `#EFEAF8` | Planetary orbital lines, wave frequencies, vectors. |
| **Chemistry** | Peach (`#E99873`) | `#FBE9DF` | Erlenmeyer vessels, hexagonal carbon rings, valence bonds. |
| **English** | Butter (`#D9B85F`) | `#F8EFCF` | Editorial quotation marks, book leaves, quill accents. |
| **Computer Science** | Slate Sage (`#486B67`) | `#E8F0EE` | Matrix coordinates, circuit traces, logical branch trees. |

---

## 8. Component Design Language

### 8.1 Buttons
- **Primary:** Background `#66518A` (Plum), Text `#FFFFFF`. Hover: `#4E3C70`. Subtle warm shadow: `0 4px 14px rgba(102, 81, 138, 0.22)`.
- **Secondary:** Background `#FFFEFB`, Border `1px solid #E4DED4`, Text `#232520`. Hover: Border `#66518A`, Text `#66518A`, Background `#EFEAF8`.
- **Sage Action:** Background `#4F7867`, Text `#FFFFFF`. Hover: `#3E6153`.
- **Ghost:** Transparent background, Text `#676B64`, Hover background `#ECE6DC`.

### 8.2 Input Fields
- Background `#FFFFFF` or `#FFFEFB`.
- Border `1px solid #E4DED4`. Hover: `#66518A`.
- Focus ring: `3px solid rgba(102, 81, 138, 0.15)`.

### 8.3 Badges & Chips
- Soft-tinted background matching semantic context.
- Border `1px solid currentColor` with `0.2` opacity.
- High-contrast text matching the primary accent.

---

## 9. Mobile & Responsive Principles

- **Viewport Targets:** 390px (Mobile), 834px (Tablet), 1440px (Desktop).
- **Touch Targets:** Minimum 48px × 48px touch bounding box for all interactive elements.
- **Sticky Actions:** Elevated `#FFFEFB` surface with `#E4DED4` top border and soft backdrop blur.
- **Thumb Zone Ergonomics:** Primary booking and filter CTAs anchored within natural thumb reach.

---

## 10. Iconography
TutorConnect uses a project-specific custom SVG icon system defined in `@/components/ui/icons.tsx`.
- Clean geometric single-path or double-path line styling.
- Scalable vector rendering (`currentColor` fills/strokes).
- Zero third-party icon bundle dependencies (e.g. no Lucide or external icon packages).

---

## 11. Motion & Microinteractions

- Native CSS transitions only (duration: `140ms – 220ms`, easing: `cubic-bezier(0.16, 1, 0.3, 1)`).
- Full compliance with `prefers-reduced-motion: reduce`.
- Subtle elevation shifts (`translateY(-1.5px)` on hover, `scale(0.98)` on active press).
