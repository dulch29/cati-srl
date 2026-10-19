---
version: 1.0.0
name: Cati-SRL-Design-System
description: "A near-black metacognitive learning canvas built around #090D14 (the deep obsidian base), crisp silver typography (#F1F5F9), and a calibrated triad: Indigo (#6366F1) for focus, Amber (#F59E0B) for developing friction/misconception, and Emerald (#10B981) for verified mastery. Grounded in Barry Zimmerman's Self-Regulated Learning (SRL) cyclical phases, the design embodies epistemic cartography: dense, architectural, and quietly rigorous. Cards live as obsidian panels (#0D121C) with hairline borders (#1E293B). Rhythm leans on authentic student reflection evidence, balance beams, and dynamic knowledge circuits rather than decorative fluff."

colors:
  primary: "#6366F1"
  on-primary: "#ffffff"
  primary-hover: "#4F46E5"
  primary-subtle: "rgba(99, 102, 241, 0.12)"
  canvas: "#090D14"
  surface-1: "#0D121C"
  surface-2: "#131A29"
  surface-3: "#1E293B"
  hairline: "#1E293B"
  hairline-strong: "#334155"
  ink: "#F1F5F9"
  ink-muted: "#94A3B8"
  ink-subtle: "#64748B"
  semantic-weak: "#F43F5E"
  semantic-developing: "#F59E0B"
  semantic-mastered: "#10B981"
  semantic-weak-subtle: "rgba(244, 63, 94, 0.12)"
  semantic-developing-subtle: "rgba(245, 158, 11, 0.12)"
  semantic-mastered-subtle: "rgba(16, 185, 129, 0.12)"

typography:
  display-xl:
    fontFamily: Outfit, sans-serif
    fontSize: 72px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -2.5px
  display-lg:
    fontFamily: Outfit, sans-serif
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.10
    letterSpacing: -1.8px
  headline:
    fontFamily: Outfit, sans-serif
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.6px
  card-title:
    fontFamily: Outfit, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: -0.3px
  body:
    fontFamily: Plus Jakarta Sans, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.05px
  mono:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
    letterSpacing: 0

rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  full: 9999px

elevation:
  surface-flat: "none"
  surface-raised: "0 4px 20px -2px rgba(0, 0, 0, 0.5)"
  surface-overlay: "0 10px 30px -10px rgba(0, 0, 0, 0.6)"

antislop:
  mode: during
  source: global preference
  em_dash_ban: enforced
  buzzword_ban: enforced
  emoji_decoration_ban: enforced
  purpose_gate: enforced
---

# Cati SRL Design System

Grounded in **Barry Zimmerman's Self-Regulated Learning (SRL)** framework and the craftsmanship guidelines of `anti-slop` and `awesome-design-md`.

## 1. Core Principles

### C-1 — Intentionality
Every visual and copy decision serves an articulated purpose. Color is reserved for semantic calibration:
- **Emerald (#10B981)**: Verified conceptual mastery (> 0.70).
- **Amber (#F59E0B)**: Active learning frontier, developing concepts (0.40 to 0.70), or overconfidence warnings.
- **Coral/Rose (#F43F5E)**: Prerequisite breakdown, detected misconceptions, or weak mastery (< 0.40).
- **Indigo (#6366F1)**: Active focus, navigational destination, primary action.

### C-2 — Architectural Geometry
Surfaces are anchored on a crisp Cartesian coordinate matrix (`.bg-cartesian-grid`, 36px x 36px) with a radial vignette. No arbitrary decorative gradient blobs or fuzzy neon orbs.

### C-3 — Content-Driven Composition
Layouts follow the authentic student reflection loop:
1. **Forethought & Reflection** (`/journal/new`): Structured capture with 5-stage calibration dial.
2. **Metacognitive Diagnosis** (`/insights/[entryId]`): Real verbatim quotation evidence and delta balance beam.
3. **Epistemic Cartography** (`/knowledge-map`): Prerequisite dependency graphs color-coded by Bayesian mastery.
4. **Adaptive Review** (`/review`): 3-question spaced repetition testing the exact identified misconception.
5. **Micro-Quests** (`/quests/[questId]`): Concrete, time-boxed 10-minute actions with XP rewards.

### C-4 — Copywriting Craft
- Zero em dashes (`—`). Commas, colons, or parentheses are used instead.
- Zero empty buzzwords (*seamless, unlock, elevate, robust, game-changer*).
- Zero decorative emojis in headings, CTAs, and labels.
- Zero fake testimonials or unverifiable trust badges.

## 2. Component Standards

### Buttons & Controls
- Height: 44px minimum touch target for primary touchpoints.
- Active feedback: `active:scale-[0.98]` tactile press.
- Focus: `focus-visible:ring-2 focus-visible:ring-indigo-500/50`.

### Metacognitive Calibration Instrument
Replaces arbitrary emoji sliders with a calibrated 5-level cognitive dial:
- Level 1: `Fundamental Confusion`
- Level 2: `Shaky Application`
- Level 3: `Working Mental Model`
- Level 4: `Articulated Competence`
- Level 5: `Fluent & Teachable`

### Resilient States
Every data-driven surface includes complete Empty, Loading, and Error states.
