-- CIVICLENS AI — Storage Buckets, Functions & Seed Data
-- Version: 20261030000002

-- 1. Storage bucket for complaint photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'report-images',
    'report-images',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Public can read images from report-images
CREATE POLICY "Public Read Report Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'report-images');

-- Anyone can upload images to report-images
CREATE POLICY "Public Insert Report Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'report-images');

-- 2. Fast tracking token lookup RPC (Security Definer to safely bypass complex joins for public tracking)
CREATE OR REPLACE FUNCTION public.get_report_by_token(token_lookup TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'report', to_jsonb(r),
        'analysis', to_jsonb(a),
        'history', coalesce(jsonb_agg(to_jsonb(h) ORDER BY h.created_at ASC) FILTER (WHERE h.id IS NOT NULL), '[]'::jsonb),
        'department', to_jsonb(d)
    )
    INTO result
    FROM public.reports r
    LEFT JOIN public.ai_analyses a ON a.report_id = r.id
    LEFT JOIN public.status_history h ON h.report_id = r.id
    LEFT JOIN public.assignments ass ON ass.report_id = r.id
    LEFT JOIN public.departments d ON d.id = ass.department_id
    WHERE r.tracking_token = token_lookup
    GROUP BY r.id, a.id, d.id;

    RETURN result;
END;
$$;
