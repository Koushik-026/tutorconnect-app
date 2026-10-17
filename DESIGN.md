# TutorConnect Design System: Sunlit Grove — Warm Educational Identity

## 1. Product Identity & Philosophy

TutorConnect is a personalized education marketplace built on the philosophy of **warm, calm, intentional learning**.
It is designed to feel like a crafted, thoughtful consumer product rather than a generic SaaS application.

### Visual Identity
- **Spatial Rhythm:** Generous vertical rhythm (~96–120px desktop section gaps, ~48–64px mobile), base 8px grid, giving every core idea room to breathe.
- **Architectural Color Fields:** Color is used structurally in large, low-saturation, atmospheric fields (Forest Soft, Peach Field, Apricot Field, Moss Field) rather than scattered decorative confetti.
- **Selective Glassmorphism:** Subtle translucent surfaces with 10–17% soft borders and gentle backdrop blur, reserved for floating navigation, composers, and sticky action surfaces.
- **Restrained Elevation:** Soft, warm shadows (`0 8px 32px rgba(55, 48, 40, 0.04)`), avoiding harsh dark drop shadows.
- **Typography as Architecture:** Bold, editorial Manrope display headings strongly tracked (-0.03em to -0.04em) paired with highly legible, generous-line-height Inter body text.

---

## 2. Color System: "Sunlit Grove"

TutorConnect is **strictly light-theme first**. Dark mode sections, black full-screen blocks, or dark dashboards are forbidden. Blue is banned as a primary visual language.

### 2.1 Foundational Surfaces
| Token Name | Hex / Value | Purpose |
| :--- | :--- | :--- |
| `canvas` | `#FFFBF5` | Overall page canvas; warm, airy sunlit paper foundation. |
| `surface` | `#FFFFFF` | Primary content panels, reading blocks, input controls. |
| `surface-warm` | `#FFF7ED` | Warm off-white surface for secondary containers and inputs. |

### 2.2 Text / Ink Hierarchy
| Token Name | Hex / Value | Purpose |
| :--- | :--- | :--- |
| `ink` | `#25231F` | Primary headers, body text, strong contrast (`> 12:1` against canvas). |
| `ink-secondary` | `#6F6A62` | Supporting copy, form labels, card descriptions, timestamps. |
| `ink-faint` | `#9B958C` | Inactive controls, placeholder text, secondary metadata. |

### 2.3 Brand & Emotional Accents
| Token Name | Hex / Value | Role | Usage Rule |
| :--- | :--- | :--- | :--- |
| `forest` | `#315F52` | **Primary Action / Trust** | Primary buttons, active tabs, major brand anchors. |
| `forest-hover` | `#244A40` | Interactive hover state | Darker forest hover on primary CTAs. |
| `forest-soft` | `#E4EEE9` | Trust background field | Badges, soft highlight tiles, active pills. |
| `coral` | `#DE765D` | Warmth & emphasis | Accent buttons, key attention callouts (not default CTA). |
| `coral-deep` | `#BA5945` | Deep coral text/hover | High-contrast label color on peach surfaces. |
| `peach-field` | `#FBE2D8` | Warm atmosphere field | Warm hero washes, home-tuition chips, accent backgrounds. |
| `apricot` | `#F1B777` | Warmth & vitality | Rating stars, subject highlights. |
| `apricot-field` | `#FCEBD5` | Subject field | Mathematics subject cards, highlight containers. |
| `moss-field` | `#E3EADD` | Education & progress | Science subject cards, learning progress indicators. |
| `butter-field` | `#F8EAC3` | Supporting warmth | English subject cards, secondary highlight chips. |
| `rose-field` | `#F5DEE4` | Supporting warmth | Biology subject cards, subtle warm fields. |
| `lavender-field`| `#EEEAF4` | Optional differentiation | Restricted to tiny subject tag differentiation only. |

### 2.4 Color Distribution
- **65–75%:** White / warm canvas (`#FFFBF5`, `#FFFFFF`, `#FFF7ED`)
- **10–15%:** Forest / Forest Soft (`#315F52`, `#E4EEE9`)
- **5–10%:** Peach / Coral / Apricot (`#DE765D`, `#FBE2D8`, `#F1B777`)
- **Supporting small amounts:** Moss (`#E3EADD`), Rose (`#F5DEE4`), Butter (`#F8EAC3`), Lavender (`#EEEAF4`)

---

## 3. Button System: Two Intentional Families

### Family 1: Marketing / High-Level CTA
Used for high-intent conversion points:
- *Examples:* "Find Tutors", "Book Free Demo", "Explore Tutors", "Join Demo", "Join Class"
- *Geometry:* `48–52px` minimum height, capsule / `rounded-full`, primary forest fill (`#315F52`), white text, soft shadow (`rgba(49, 95, 82, 0.20)`), max 1px hover translation.

### Family 2: Product / Form Actions
Used for workflow actions, scheduling, filters, forms:
- *Examples:* "Select Date", "Choose Time", "Apply Filter", "Payment Method", "Save", "View Profile"
- *Geometry:* `44–48px` minimum interactive target, `12–16px` radius (`rounded-2xl` / `rounded-xl`), not automatically pill-shaped, clear selected state, minimal shadow.

---

## 4. Business Rules & Claim Safety
- **Free Demo:** 30 minutes, online only, ₹0.
- **Tuition Packages:** 8 classes (₹3,200), 12 classes (₹4,500), 15 classes (₹5,400); 60 min/class; 45-day validity.
- **Home Tuition:** Eligible Hyderabad delivery areas only.
- **Safe Claims:** Verified profiles, reviewed credentials, suggested matches. No unverified claims ("guaranteed", "certified", "background checked", "SMS", "WhatsApp").
