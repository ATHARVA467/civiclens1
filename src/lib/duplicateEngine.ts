import { Report, DuplicateCandidate, ReportCategory } from '@/types';

/**
 * Calculates geographic distance between two points in meters using Haversine formula
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Maps geographic distance in meters to a 0-100 proximity score
 */
export function distanceToProximityScore(distanceMeters: number): number {
  if (distanceMeters <= 30) return 100;
  if (distanceMeters <= 75) return 95;
  if (distanceMeters <= 150) return 90;
  if (distanceMeters <= 300) return 80;
  if (distanceMeters <= 500) return 65;
  if (distanceMeters <= 1000) return 40;
  if (distanceMeters <= 2000) return 15;
  return 0;
}

/**
 * Tokenize and calculate cosine similarity between two text strings
 */
export function calculateTextSimilarityScore(text1: string, text2: string): number {
  const cleanTokens = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['the', 'and', 'with', 'for', 'this', 'that', 'near'].includes(w));
  };

  const tokens1 = cleanTokens(text1);
  const tokens2 = cleanTokens(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  let intersectionCount = 0;
  for (const t of set1) {
    if (set2.has(t)) intersectionCount++;
  }

  // Jaccard + token overlap blended similarity
  const unionCount = new Set([...tokens1, ...tokens2]).size;
  const jaccard = intersectionCount / unionCount;

  // Keyword boost for high-salience civic terms
  const criticalKeywords = ['pothole', 'overflow', 'drain', 'burst', 'pipe', 'flyover', 'wire', 'transformer', 'garbage', 'dump', 'manhole'];
  let keywordBoost = 0;
  for (const kw of criticalKeywords) {
    if (set1.has(kw) && set2.has(kw)) keywordBoost += 0.12;
  }

  const rawScore = (jaccard * 0.75 + keywordBoost) * 100;
  return Math.min(100, Math.round(rawScore));
}

/**
 * Evaluates category compatibility score (0 - 100)
 */
export function calculateCategoryCompatibility(cat1: ReportCategory, cat2: ReportCategory): number {
  if (cat1 === cat2) return 100;

  // Correlated cross-categories
  const correlatedPairs = [
    ['Drainage & Waterlogging', 'Roads & Potholes'],
    ['Water Supply', 'Drainage & Waterlogging'],
    ['Electrical Hazards', 'Streetlights'],
    ['Garbage & Sanitation', 'Drainage & Waterlogging'],
    ['Public Infrastructure', 'Roads & Potholes']
  ];

  for (const [a, b] of correlatedPairs) {
    if ((cat1 === a && cat2 === b) || (cat1 === b && cat2 === a)) {
      return 60;
    }
  }

  return 10;
}

/**
 * Full Multi-Factor Duplicate Matching (Section 7)
 *
 * Weighted Model:
 * Text similarity: 60%
 * Geographic proximity: 25%
 * Category compatibility: 15%
 */
export function evaluateDuplicatePair(
  target: Report,
  candidate: Report
): {
  candidatePair: DuplicateCandidate;
  distanceMeters: number;
  recommendation: 'strong_duplicate' | 'possible_relationship' | 'low_similarity';
  explanation: string;
} {
  const distanceMeters = calculateHaversineDistanceMeters(
    target.latitude,
    target.longitude,
    candidate.latitude,
    candidate.longitude
  );

  const geographicScore = distanceToProximityScore(distanceMeters);

  const text1 = `${target.title} ${target.description} ${target.address || ''}`;
  const text2 = `${candidate.title} ${candidate.description} ${candidate.address || ''}`;
  const semanticScore = calculateTextSimilarityScore(text1, text2);

  const categoryScore = calculateCategoryCompatibility(target.category, candidate.category);

  // Combined score formula
  const combinedScore = Math.round(
    (semanticScore * 0.60 + geographicScore * 0.25 + categoryScore * 0.15) * 10
  ) / 10;

  let recommendation: 'strong_duplicate' | 'possible_relationship' | 'low_similarity' = 'low_similarity';
  if (combinedScore >= 80) {
    recommendation = 'strong_duplicate';
  } else if (combinedScore >= 60) {
    recommendation = 'possible_relationship';
  }

  const explanation = `Score ${combinedScore}% = Text (${semanticScore} × 0.60) + Proximity (${geographicScore} × 0.25, ~${distanceMeters}m) + Category (${categoryScore} × 0.15).`;

  const candidatePair: DuplicateCandidate = {
    id: `dup-${target.id}-${candidate.id}`,
    report_id: candidate.id,
    matched_report_id: target.id,
    semantic_score: semanticScore,
    geographic_score: geographicScore,
    category_score: categoryScore,
    combined_score: combinedScore,
    review_status: 'pending',
    notes: `${recommendation.replace('_', ' ').toUpperCase()}: Located ${distanceMeters}m apart.`,
    created_at: new Date().toISOString(),
    report: candidate,
    matched_report: target,
  };

  return {
    candidatePair,
    distanceMeters,
    recommendation,
    explanation,
  };
}
