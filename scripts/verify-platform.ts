// CIVICLENS AI — Platform Automated Verification Suite
// Validates:
// 1. Synthetic dataset count and category distribution (Section 14)
// 2. Deterministic priority scoring algorithm (Section 8)
// 3. Multi-factor duplicate candidate calculations (Section 7)
// 4. Hotspot spatial clustering integrity (Section 9)

import { SYNTHETIC_REPORTS, SYNTHETIC_DUPLICATES, SYNTHETIC_HOTSPOTS } from '../src/lib/syntheticData.ts';
import { calculatePriorityScore } from '../src/lib/priorityEngine.ts';
import { calculateHaversineDistanceMeters, distanceToProximityScore, calculateCategoryCompatibility } from '../src/lib/duplicateEngine.ts';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('\n========================================');
console.log('CIVICLENS AI PLATFORM VERIFICATION SUITE');
console.log('========================================\n');

// 1. DATASET INTEGRITY
console.log('1. Checking Synthetic Dataset Breakdown (Section 14)...');
assert(SYNTHETIC_REPORTS.length === 50, `Total reports must be exactly 50 (got ${SYNTHETIC_REPORTS.length})`);

const counts = {};
SYNTHETIC_REPORTS.forEach(r => {
  counts[r.category] = (counts[r.category] || 0) + 1;
});

assert(counts['Drainage & Waterlogging'] === 12, `Drainage & Waterlogging: expected 12, got ${counts['Drainage & Waterlogging']}`);
assert(counts['Roads & Potholes'] === 10, `Roads & Potholes: expected 10, got ${counts['Roads & Potholes']}`);
assert(counts['Garbage & Sanitation'] === 9, `Garbage & Sanitation: expected 9, got ${counts['Garbage & Sanitation']}`);
assert(counts['Streetlights'] === 7, `Streetlights: expected 7, got ${counts['Streetlights']}`);
assert(counts['Water Supply'] === 6, `Water Supply: expected 6, got ${counts['Water Supply']}`);
assert(counts['Electrical Hazards'] === 3, `Electrical Hazards: expected 3, got ${counts['Electrical Hazards']}`);
assert(counts['Other Civic Issues'] === 3, `Other Civic Issues: expected 3, got ${counts['Other Civic Issues']}`);

// 2. EXPLAINABLE PRIORITY ENGINE
console.log('\n2. Testing Deterministic Priority Engine (Section 8)...');
// Test Case 1: Critical life-safety hazard
const criticalTest = calculatePriorityScore({
  severity: 95,
  impactScore: 90,
  durationScore: 80,
  recurrenceScore: 70
});
// (95 * 0.35) + (90 * 0.30) + (80 * 0.20) + (70 * 0.15) = 33.25 + 27.0 + 16.0 + 10.5 = 86.75 -> 86.8
assert(criticalTest.priorityScore >= 80, `Critical score must be >= 80 (got ${criticalTest.priorityScore})`);
assert(criticalTest.priorityBand === 'Critical', `Priority band must be 'Critical' (got ${criticalTest.priorityBand})`);

// Test Case 2: Low priority routine observation
const lowTest = calculatePriorityScore({
  severity: 20,
  impactScore: 25,
  durationScore: 20,
  recurrenceScore: 10
});
// (20 * 0.35) + (25 * 0.30) + (20 * 0.20) + (10 * 0.15) = 7.0 + 7.5 + 4.0 + 1.5 = 20.0
assert(lowTest.priorityScore < 35, `Low priority score must be < 35 (got ${lowTest.priorityScore})`);
assert(lowTest.priorityBand === 'Low', `Priority band must be 'Low' (got ${lowTest.priorityBand})`);

// 3. HAVERSINE & PROXIMITY SCORING
console.log('\n3. Testing Haversine Geodesic Proximity Engine...');
// Test distance between Gandhi Bazaar coords (approx 40 meters)
const dist = calculateHaversineDistanceMeters(12.9745, 77.6082, 12.9748, 77.6085);
assert(dist > 0 && dist < 100, `Haversine distance between adjacent pins must be ~40m (got ${dist}m)`);
const proxScore = distanceToProximityScore(dist);
assert(proxScore >= 90, `Proximity score for ${dist}m must be >= 90 (got ${proxScore})`);

// 4. DUPLICATE PAIRS WEIGHTED MODEL
console.log('\n4. Validating Duplicate Candidate Pairs (Section 7)...');
assert(SYNTHETIC_DUPLICATES.length >= 4, `Expected at least 4 duplicate pairs (got ${SYNTHETIC_DUPLICATES.length})`);
SYNTHETIC_DUPLICATES.forEach((dup) => {
  const expectedCombined = Math.round((dup.semantic_score * 0.60 + dup.geographic_score * 0.25 + dup.category_score * 0.15) * 10) / 10;
  assert(Math.abs(dup.combined_score - expectedCombined) <= 0.5, `Pair ${dup.id} combined score ${dup.combined_score} matches weighted formula (${expectedCombined})`);
  assert(dup.combined_score >= 80, `Pair ${dup.id} qualifies as strong duplicate candidate (score ${dup.combined_score} >= 80)`);
});

// 5. SPATIAL HOTSPOTS & CLUSTERS
console.log('\n5. Validating Spatial Hotspots & Clusters (Section 9 & 10)...');
assert(SYNTHETIC_HOTSPOTS.length >= 3, `Expected at least 3 spatial hotspot clusters (got ${SYNTHETIC_HOTSPOTS.length})`);
SYNTHETIC_HOTSPOTS.forEach(h => {
  assert(h.report_count >= 5, `Hotspot "${h.name}" contains >= 5 clustered reports (got ${h.report_count})`);
  assert(Boolean(h.ai_brief_summary), `Hotspot "${h.name}" contains an actionable AI brief summary`);
});

console.log('\n----------------------------------------');
console.log(`VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED.`);
console.log('----------------------------------------\n');

