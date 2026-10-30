# CIVICLENS AI — From Complaints to Action

> **AI-powered Civic Intelligence and Public Issue Resolution Platform**

CIVICLENS AI transforms scattered citizen complaints into prioritized, explainable, and trackable civic actions. It supports the complete grievance lifecycle:

$$\text{CAPTURE} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{REVEAL} \longrightarrow \text{ACT} \longrightarrow \text{RESOLVE}$$

---

## 🏛️ Application Architecture & Routes

CIVICLENS AI delivers two dedicated, unified user experiences:

### 1. Citizen Portal (Light Neo-Minimalism Theme)
* Designed for 45–60 second complaint reporting, frictionless status lookup, and complete lifecycle transparency.
* **Routes:**
  * `/` : Citizen landing page featuring quick report CTAs, live city pulse, and real-time tracking box.
  * `/report` : Fast issue submission with category selection, image upload preview, and simulated GPS pinning.
  * `/my-reports` : Citizen ledger of active complaints with token copy and status badges.
  * `/track/:token` & `/track` : Live complaint tracker with timeline, AI analysis brief, priority badge, and status history.
  * `/login` & `/register` : Dual-role citizen & municipal officer authentication portal.

### 2. Authority Command Centre (Restrained Dark Theme)
* Professional, analytical environment for municipal decision-makers, zonal commissioners, and field officers.
* **Routes:**
  * `/admin/overview` : Triage dashboard with real-time KPI metrics, category charts, and critical queue.
  * `/admin/complaints` : 50-record municipal complaint queue with search, category/priority/status filters, and status transitions.
  * `/admin/map` : Leaflet OpenStreetMap GIS with priority-colored pins and DBSCAN hotspot circle overlays.
  * `/admin/intelligence` : AI Action Briefs identifying spatial/temporal patterns and inter-agency directives.
  * `/admin/duplicates` : Semantic duplicate detection workbench with weighted scoring (60% text, 25% geo, 15% category).
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

## 🗄️ Database Architecture & Migrations

All PostgreSQL migrations and Row Level Security (RLS) policies are version-controlled in `supabase/migrations/`:

* `20261030000001_civiclens_schema.sql`:
  * Extensions: `uuid-ossp`, `vector` (pgvector 768 dimensions for Gemini Embeddings).
  * Tables: `profiles`, `departments`, `reports`, `ai_analyses`, `report_embeddings`, `duplicate_candidates`, `assignments`, `status_history`, `hotspots`, `activity_logs`.
  * RLS Policies for citizens, officers, and tracking token lookups.
  * Seed data for municipal departments.
* `20261030000002_storage_and_functions.sql`:
  * Storage Bucket: `report-images` for citizen photo uploads with public read access.
  * Fast RPC function `get_report_by_token` for real-time tracking lookups.

---

## 📊 Synthetic Demonstration Dataset

The application includes 50 synthetic records that match the required municipal distribution:
* **12** Drainage and Waterlogging
* **10** Road Damage & Potholes
* **9** Garbage and Sanitation
* **7** Streetlight Failures
* **6** Water Supply Leaks
* **3** Electrical Hazards
* **3** Other Civic Issues
* **4 deliberate duplicate pairs** with combined similarity scores > 90%.
* **3 spatial clusters / hotspots** (Gandhi Bazaar, Indiranagar Flyover, Brigade Road).

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ or v24+
* npm

### Installation & Run
```bash
# Clone or navigate to the project directory
cd "CIVILIANS  AI"

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

### Supabase Connection (Optional)
The system operates seamlessly in **Synthetic Demonstration Mode** out of the box. To connect a live Supabase database:
1. Copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. Run the SQL files in `supabase/migrations/` inside your Supabase project's SQL Editor.
3. The in-app **Database Status Pill** in the top navigation will automatically switch to **"Supabase Connected"**.
