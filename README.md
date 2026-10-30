# CIVICLENS AI — From Complaints to Action

> **AI-powered Civic Intelligence and Public Issue Resolution Platform**

CIVICLENS AI transforms scattered citizen complaints into prioritized, explainable, and trackable civic actions. It bridges the gap between public grievance submissions and municipal field interventions through an end-to-end intelligence lifecycle:

$$\text{CAPTURE} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{REVEAL} \longrightarrow \text{ACT} \longrightarrow \text{RESOLVE}$$

---

## 🏛️ Application Architecture & Navigation

The platform provides two integrated experiences:

### 1. Citizen Portal (Warm Neo-Minimalism Theme)
* Designed for 45–60 second complaint reporting, frictionless status lookup, and complete lifecycle transparency.
* **Routes:**
  * `/` : Citizen landing page featuring quick report CTAs, live city pulse, and real-time tracking box.
  * `/report` : Fast issue submission with interactive Leaflet location picker, client-side photo upload validation, and instant tracking token generation.
  * `/my-reports` : Citizen ledger of active complaints with token copy and status badges.
  * `/track/:token` & `/track` : Live complaint tracker with timeline, AI analysis brief, priority badge, and status history.
  * `/login` & `/register` : Dual-role citizen & municipal officer authentication portal.

### 2. Authority Command Centre (Restrained Dark Theme)
* Professional, analytical environment for municipal decision-makers, zonal commissioners, and field officers.
* **Routes:**
  * `/admin/overview` : Triage dashboard with real-time KPI metrics, category charts, and critical queue.
  * `/admin/complaints` : 50-record municipal complaint queue with search, category/priority/status filters, explainable priority calculation inspect, and manual authority override.
  * `/admin/map` : Leaflet OpenStreetMap GIS with priority-colored pins and DBSCAN hotspot circle overlays.
  * `/admin/intelligence` : AI Action Briefs identifying spatial/temporal patterns and inter-agency directives with human-in-the-loop guardrails.
  * `/admin/duplicates` : Semantic duplicate detection workbench with weighted scoring (60% text, 25% geo, 15% category) and non-destructive merge.
  * `/admin/hotspots` : Spatial clustering analysis grouping recurring civic infrastructure failures.
  * `/admin/assignments` : Inter-agency municipal dispatch board and workload management.
  * `/admin/analytics` : Recharts performance diagnostics (priority distribution, resolution velocity, SLAs).

---

## 🎨 Visual Design System

* **Primary Philosophy:** Neo-Minimalism with subtle Soft Neumorphism.
* **WCAG 2.2 AA Accessibility:** High-contrast text, 44x44px minimum touch targets, visible focus rings, and reduced motion support.
* **Bilingual Support:** Seamless toggling between **English** and **Kannada (ಕನ್ನಡ)** with Noto Sans Kannada font rendering.

| Color Token | Hex Code | Light Citizen Theme | Dark Admin Theme |
| :--- | :--- | :--- | :--- |
| **Warm Off-White** | `#F8F8F5` | Primary Page Background | — |
| **Pure White** | `#FFFFFF` | Content Cards | — |
| **Muted Navy** | `#294563` | Headings & Primary Buttons | — |
| **Dark Navy/Charcoal** | `#111A24` | — | Background |
| **Dark Sidebar** | `#172332` | — | Navigation Shell |
| **Dark Cards** | `#1C2C3D` | — | Metric Cards & Panels |
| **Accent Slate** | `#8EA8C2` | Secondary Details | Interactive Highlights |
| **Success Sage** | `#4F8665` / `#7C9B85` | Resolved Indicators | Success Badges |
| **Warning Ochre** | `#B9853F` / `#D1A15D` | Medium Priority | Warning Badges |
| **Critical Crimson**| `#B85D5D` / `#C77A7A` | Safety Alerts | Critical Triage |

---

## 🧠 Explainable Priority Engine

Deterministic priority scoring computed without black-box opacity (Section 8):

$$\text{Priority} = (\text{Severity} \times 0.35) + (\text{Impact} \times 0.30) + (\text{Duration} \times 0.20) + (\text{Recurrence} \times 0.15)$$

### Priority Bands
* **80–100:** **Critical** (Immediate life-safety response required within 2–4 hours)
* **60–79:** **High** (Expedited triage within 24 hours)
* **35–59:** **Medium** (Standard scheduled maintenance)
* **0–34:** **Low** (Routine observation)

Administrators have access to full factor breakdowns and manual override capabilities in the Command Centre.

---

## 🔍 Semantic Duplicate Detection Engine

Multi-factor duplicate matching model (Section 7):

$$\text{Combined Score} = (\text{Text Similarity} \times 0.60) + (\text{Geographic Proximity} \times 0.25) + (\text{Category Compatibility} \times 0.15)$$

* **Geographic Proximity:** Uses Haversine geodesic distance in meters mapped non-linearly to a 0–100 proximity score.
* **Non-Destructive Principle:** Citizen reports are never deleted. Merging consolidates operational field tickets while keeping all reporting citizens updated on their respective tokens.

---

## ⚡ Server-Side Supabase Edge Functions & Gemini AI

Privileged AI operations execute strictly server-side through Edge Functions in `supabase/functions/`:

1. `analyze-complaint`:
   * Calls Google Gemini API for automated categorization, summarization, severity scoring, and reasoning factors.
   * Generates 768-dimensional embeddings using `text-embedding-004`.
   * Upserts into `ai_analyses` and `report_embeddings` in Supabase PostgreSQL.
2. `match-duplicates`:
   * Uses pgvector cosine similarity and Haversine distance to discover candidates and populate `duplicate_candidates`.

---

## 🗄️ Database Schema & Migrations

Migrations in `supabase/migrations/`:
* `20261030000001_civiclens_schema.sql`: Full schema with `pgvector`, `profiles`, `departments`, `reports`, `ai_analyses`, `report_embeddings`, `duplicate_candidates`, `assignments`, `status_history`, `hotspots`, `activity_logs`, and Row Level Security (RLS) policies.
* `20261030000002_storage_and_functions.sql`: `report-images` storage bucket policies and `get_report_by_token` RPC function.

---

## 📊 Synthetic Demonstration Dataset

Includes 50 realistic records clustered around a municipal corporation grid:
* **12** Drainage and Waterlogging
* **10** Road Damage & Potholes
* **9** Garbage and Sanitation
* **7** Streetlight Failures
* **6** Water Supply Leaks
* **3** Electrical Hazards
* **3** Other Civic Issues
* **4 deliberate duplicate candidate pairs**
* **3 geographic hotspots / clusters** (Gandhi Bazaar, Indiranagar Flyover, Brigade Road)

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Production build
npm run build
```
