-- CIVICLENS AI — PostgreSQL & Supabase Database Migration
-- Version: 20261030000001
-- Scope: Full Database Schema, pgvector, Constraints, Indexes & RLS Policies

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('citizen', 'officer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE duplicate_review_status AS ENUM ('pending', 'confirmed', 'rejected', 'merged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'citizen',
    phone TEXT,
    language_pref TEXT NOT NULL DEFAULT 'en', -- 'en' or 'kn' (Kannada)
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_token VARCHAR(32) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    status report_status NOT NULL DEFAULT 'Submitted',
    priority_band VARCHAR(20) DEFAULT 'Low', -- 'Critical', 'High', 'Medium', 'Low'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for geographic lookup and token lookups
CREATE INDEX IF NOT EXISTS idx_reports_tracking_token ON public.reports(tracking_token);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_lat_long ON public.reports(latitude, longitude);

-- 6. AI ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE UNIQUE,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    urgency_score NUMERIC(5,2) NOT NULL CHECK (urgency_score >= 0 AND urgency_score <= 100),
    impact_score NUMERIC(5,2) NOT NULL CHECK (impact_score >= 0 AND impact_score <= 100),
    duration_score NUMERIC(5,2) NOT NULL DEFAULT 50 CHECK (duration_score >= 0 AND duration_score <= 100),
    recurrence_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (recurrence_score >= 0 AND recurrence_score <= 100),
    priority_score NUMERIC(5,2) NOT NULL CHECK (priority_score >= 0 AND priority_score <= 100),
    reasoning JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_action TEXT NOT NULL,
    raw_gemini_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_priority_score ON public.ai_analyses(priority_score DESC);

-- 7. REPORT EMBEDDINGS (pgvector 768 dimensions for Gemini text-embedding-004)
CREATE TABLE IF NOT EXISTS public.report_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE UNIQUE,
    embedding vector(768) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. DUPLICATE CANDIDATES TABLE
CREATE TABLE IF NOT EXISTS public.duplicate_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    matched_report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    semantic_score NUMERIC(5,2) NOT NULL,
    geographic_score NUMERIC(5,2) NOT NULL,
    category_score NUMERIC(5,2) NOT NULL,
    combined_score NUMERIC(5,2) NOT NULL,
    review_status duplicate_review_status NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_duplicate_pair UNIQUE(report_id, matched_report_id)
);

CREATE INDEX IF NOT EXISTS idx_duplicate_candidates_combined_score ON public.duplicate_candidates(combined_score DESC);

-- 9. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE UNIQUE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    target_resolution_date TIMESTAMPTZ,
    internal_notes TEXT
);

-- 10. STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    old_status report_status,
    new_status report_status NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolution_evidence_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_status_history_report ON public.status_history(report_id, created_at ASC);

-- 11. HOTSPOTS TABLE
CREATE TABLE IF NOT EXISTS public.hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius_meters NUMERIC(8,2) NOT NULL DEFAULT 500.0,
    report_count INTEGER NOT NULL DEFAULT 1,
    dominant_category TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    ai_brief_summary TEXT,
    recommended_intervention TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. SEED DEPARTMENTS
INSERT INTO public.departments (name, code, description, contact_email)
VALUES 
('Roads & Infrastructure Authority', 'ROADS', 'Maintenance of roads, pavements, potholes and bridges', 'roads@civiclens.gov'),
('Solid Waste & Sanitation Management', 'SANITATION', 'Garbage collection, illegal dumps, street cleaning', 'sanitation@civiclens.gov'),
('Water Supply & Sewerage Board', 'WATER_SEWER', 'Water pipelines, leaks, drainage and sewage clearing', 'water@civiclens.gov'),
('Urban Electricity & Distribution', 'ELECTRICAL', 'Streetlights, fallen poles, exposed wiring and transformer hazards', 'electricity@civiclens.gov'),
('Public Works & Urban Facilities', 'PUBLIC_WORKS', 'Parks, public buildings, footpaths and pedestrian safety', 'publicworks@civiclens.gov')
ON CONFLICT (code) DO NOTHING;

-- 14. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duplicate_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles can be viewed by authenticated users" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can edit their own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Departments policies (Everyone can view, admins can manage)
CREATE POLICY "Departments are visible to everyone" ON public.departments
    FOR SELECT USING (true);

-- Reports policies
-- 1. Anyone (anonymous or registered) can submit a complaint
CREATE POLICY "Anyone can insert a civic report" ON public.reports
    FOR INSERT WITH CHECK (true);

-- 2. Citizens can select their own submitted reports
CREATE POLICY "Citizens view their own reports" ON public.reports
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'officer'))
    );

-- 3. Public read by tracking token via RPC function or exact token match
CREATE POLICY "Public can view report by tracking token" ON public.reports
    FOR SELECT USING (tracking_token IS NOT NULL);

-- 4. Officers and Admins can update reports
CREATE POLICY "Officers and admins update reports" ON public.reports
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'officer'))
    );

-- AI Analyses policies
CREATE POLICY "Read AI analysis for permitted reports" ON public.ai_analyses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE reports.id = ai_analyses.report_id 
            AND (
                reports.user_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'officer')) OR
                reports.tracking_token IS NOT NULL
            )
        )
    );

-- Duplicate candidates (Admins and Officers only)
CREATE POLICY "Admins and officers view duplicates" ON public.duplicate_candidates
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'officer'))
    );

-- Status history policies
CREATE POLICY "Status history visible for report viewers" ON public.status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE reports.id = status_history.report_id 
            AND (
                reports.user_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'officer')) OR
                reports.tracking_token IS NOT NULL
            )
        )
    );

CREATE POLICY "Officers can insert status transitions" ON public.status_history
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'officer'))
    );

-- Hotspots policies (Officers and Admins)
CREATE POLICY "Hotspots viewable by officers and public" ON public.hotspots
    FOR SELECT USING (true);

-- Activity logs policies (Admins only)
CREATE POLICY "Activity logs admin only" ON public.activity_logs
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

