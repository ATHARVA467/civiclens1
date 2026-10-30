// CIVICLENS AI — Supabase Edge Function: match-duplicates
// Computes semantic text similarity (60%), geographic proximity (25%), and category compatibility (15%).
// Populates duplicate_candidates table with candidate pairs above 60% combined threshold.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const { report_id } = await req.json();
    if (!report_id) {
      return new Response(
        JSON.stringify({ error: 'report_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, message: 'Supabase credentials not configured in Edge environment' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch target report
    const { data: targetReport, error: targetError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', report_id)
      .single();

    if (targetError || !targetReport) {
      return new Response(
        JSON.stringify({ error: 'Target report not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch potential nearby reports within same municipal area
    const { data: candidateReports } = await supabaseAdmin
      .from('reports')
      .select('*')
      .neq('id', report_id)
      .limit(50);

    const matches = [];

    if (candidateReports && candidateReports.length > 0) {
      for (const cand of candidateReports) {
        // Haversine formula
        const R = 6371e3;
        const φ1 = (targetReport.latitude * Math.PI) / 180;
        const φ2 = (cand.latitude * Math.PI) / 180;
        const Δφ = ((cand.latitude - targetReport.latitude) * Math.PI) / 180;
        const Δλ = ((cand.longitude - targetReport.longitude) * Math.PI) / 180;
        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMeters = Math.round(R * c);

        // Proximity score
        let geoScore = 0;
        if (distanceMeters <= 50) geoScore = 100;
        else if (distanceMeters <= 150) geoScore = 90;
        else if (distanceMeters <= 300) geoScore = 80;
        else if (distanceMeters <= 600) geoScore = 60;
        else if (distanceMeters <= 1200) geoScore = 30;

        // Category compatibility
        let catScore = targetReport.category === cand.category ? 100 : 20;

        // Basic semantic token matching
        const words1 = new Set(targetReport.title.toLowerCase().split(/\s+/));
        const words2 = new Set(cand.title.toLowerCase().split(/\s+/));
        let common = 0;
        words1.forEach((w) => { if (words2.has(w)) common++; });
        const semanticScore = Math.min(100, Math.round((common / Math.max(1, words1.size)) * 100));

        // Combined weighted score
        const combined = (semanticScore * 0.60) + (geoScore * 0.25) + (catScore * 0.15);

        if (combined >= 60) {
          matches.push({
            report_id: cand.id,
            matched_report_id: targetReport.id,
            semantic_score: semanticScore,
            geographic_score: geoScore,
            category_score: catScore,
            combined_score: Math.round(combined * 10) / 10,
            review_status: 'pending',
            notes: `Candidate pair located ~${distanceMeters}m apart with ${Math.round(combined)}% combined score.`
          });
        }
      }

      if (matches.length > 0) {
        await supabaseAdmin.from('duplicate_candidates').upsert(matches, {
          onConflict: 'report_id,matched_report_id'
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, count: matches.length, matches }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown Edge Function Error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
