// CIVICLENS AI — Synthetic Demonstration Dataset
// Exactly 50 structured civic reports matching the exact required category breakdown:
// 12 drainage and waterlogging
// 10 road damage
// 9 garbage and sanitation
// 7 streetlight failures
// 6 water supply
// 3 electrical hazards
// 3 other civic issues
//
// All coordinates are clustered realistically around a sample municipal corporation area (Bangalore Central / Indiranagar / MG Road coordinates: ~12.9716 N, 77.5946 E).
// All records are explicitly identified with is_synthetic: true.

import { Report, AIAnalysis, Department, Hotspot, DuplicateCandidate } from '@/types';

export const SYNTHETIC_DEPARTMENTS: Department[] = [
  {
    id: 'dept-roads',
    name: 'Roads & Infrastructure Authority',
    code: 'ROADS',
    description: 'Maintenance of municipal roads, asphalt patching, potholes, pedestrian bridges and footpaths.',
    contact_email: 'roads@civiclens.gov'
  },
  {
    id: 'dept-water',
    name: 'Water Supply & Sewerage Board',
    code: 'WATER_SEWER',
    description: 'Underground drainage, stormwater channels, water distribution mains and pipeline bursts.',
    contact_email: 'water@civiclens.gov'
  },
  {
    id: 'dept-sanitation',
    name: 'Solid Waste & Sanitation Management',
    code: 'SANITATION',
    description: 'Daily municipal garbage collection, community dump clearance, and biomethanation plants.',
    contact_email: 'sanitation@civiclens.gov'
  },
  {
    id: 'dept-electrical',
    name: 'Urban Electricity & Distribution',
    code: 'ELECTRICAL',
    description: 'Streetlight maintenance, high-voltage transformers, sagging wires and public electrical safety.',
    contact_email: 'electrical@civiclens.gov'
  },
  {
    id: 'dept-publicworks',
    name: 'Public Works & Urban Facilities',
    code: 'PUBLIC_WORKS',
    description: 'Parks, public restrooms, encroachment removal and municipal market upkeep.',
    contact_email: 'publicworks@civiclens.gov'
  }
];

export const SYNTHETIC_REPORTS: Report[] = [
  // --- 12 DRAINAGE AND WATERLOGGING ---
  {
    id: 'rep-drain-01',
    tracking_token: 'CLK-DRN-8201',
    title: 'Severe Stormwater Drain Clog near Market Circle',
    description: 'Storm drain completely choked with silt and plastic bottles. During morning rain, water spilled over the sidewalk into market stalls.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9745,
    longitude: 77.6082,
    address: '4th Cross, Gandhi Bazaar Market Circle',
    status: 'In Progress',
    priority_band: 'Critical',
    created_at: '2026-10-28T09:15:00Z',
    updated_at: '2026-10-29T14:20:00Z'
  },
  {
    id: 'rep-drain-02',
    tracking_token: 'CLK-DRN-8202',
    title: 'Overflowing Sewage Channel near Gandhi Bazaar',
    description: 'Water drain blocked with trash; black dirty water overflowing onto pedestrian path. People cannot access shops.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9748,
    longitude: 77.6085,
    address: 'Opposite State Bank, Gandhi Bazaar',
    status: 'Verified',
    priority_band: 'Critical', // Duplicate candidate with rep-drain-01
    created_at: '2026-10-28T11:40:00Z',
    updated_at: '2026-10-28T12:00:00Z'
  },
  {
    id: 'rep-drain-03',
    tracking_token: 'CLK-DRN-8203',
    title: 'Waterlogging at Metro Station Underpass',
    description: 'Knee-deep standing water accumulated after 30 minutes of rain. Two two-wheelers broke down attempting to pass.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9712,
    longitude: 77.6120,
    address: 'East Metro Station Exit 2 Underpass',
    status: 'Assigned',
    priority_band: 'High',
    created_at: '2026-10-27T16:20:00Z',
    updated_at: '2026-10-28T08:30:00Z'
  },
  {
    id: 'rep-drain-04',
    tracking_token: 'CLK-DRN-8204',
    title: 'Broken Culvert Slab Causing Drainage Backflow',
    description: 'RCC culvert slab collapsed inward, crushing the drain pipe beneath and diverting dirty runoff into residential compound.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9690,
    longitude: 77.6050,
    address: '12th Main, 3rd Block residential lane',
    status: 'In Progress',
    priority_band: 'High',
    created_at: '2026-10-26T10:00:00Z',
    updated_at: '2026-10-27T11:15:00Z'
  },
  {
    id: 'rep-drain-05',
    tracking_token: 'CLK-DRN-8205',
    title: 'Stagnant Water Pool Breeding Mosquitos near School',
    description: 'Uncovered storm drain stagnant for over 10 days. Strong foul stench and thick swarm of mosquitos endangering nearby primary school kids.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9655,
    longitude: 77.6010,
    address: 'Govt Model Primary School perimeter, 7th Cross',
    status: 'Verified',
    priority_band: 'High',
    created_at: '2026-10-25T14:45:00Z',
    updated_at: '2026-10-26T09:00:00Z'
  },
  {
    id: 'rep-drain-06',
    tracking_token: 'CLK-DRN-8206',
    title: 'Collapsed Drain Grating on Main Road',
    description: 'Cast iron drain grating has fallen through leaving a 3-foot deep open hole in the road gutter lane.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9780,
    longitude: 77.6150,
    address: 'MG Road intersection corner',
    status: 'Assigned',
    priority_band: 'Critical',
    created_at: '2026-10-29T07:10:00Z',
    updated_at: '2026-10-29T08:00:00Z'
  },
  {
    id: 'rep-drain-07',
    tracking_token: 'CLK-DRN-8207',
    title: 'Rainwater Retention Sump Jammed with Mud',
    description: 'Community park percolation pit is silted up. Excessive runoff flowing into the street during showers.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9620,
    longitude: 77.6180,
    address: 'Rose Garden Park North Gate',
    status: 'Submitted',
    priority_band: 'Medium',
    created_at: '2026-10-29T13:00:00Z',
    updated_at: '2026-10-29T13:00:00Z'
  },
  {
    id: 'rep-drain-08',
    tracking_token: 'CLK-DRN-8208',
    title: 'Water Accumulation at Bus Stop Platform',
    description: 'Drain inlet is raised higher than road level, causing a 6-inch puddle where passengers board buses.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9730,
    longitude: 77.5990,
    address: 'City Corporation Central Bus Bay 4',
    status: 'In Progress',
    priority_band: 'Medium',
    created_at: '2026-10-24T08:10:00Z',
    updated_at: '2026-10-26T17:00:00Z'
  },
  {
    id: 'rep-drain-09',
    tracking_token: 'CLK-DRN-8209',
    title: 'Illegal Concrete Discharge into Stormwater Drain',
    description: 'Nearby construction site washed cement slurry directly into public gutter, hardening and blocking half the cross-section.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9670,
    longitude: 77.6220,
    address: '5th Main commercial zone, Site 44',
    status: 'Submitted',
    priority_band: 'High',
    created_at: '2026-10-29T15:30:00Z',
    updated_at: '2026-10-29T15:30:00Z'
  },
  {
    id: 'rep-drain-10',
    tracking_token: 'CLK-DRN-8210',
    title: 'Backwater Seepage into Basement Parking',
    description: 'Main drainage line surcharge forcing sewage backwards through inspection chamber into apartment basement.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9760,
    longitude: 77.6070,
    address: 'Silver Oak Apartments, 8th Main',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-28T20:10:00Z',
    updated_at: '2026-10-29T06:30:00Z'
  },
  {
    id: 'rep-drain-11',
    tracking_token: 'CLK-DRN-8211',
    title: 'Missing Manhole Cover in Flooded Street',
    description: 'Open sewer hole completely submerged by 4 inches of brown floodwater. Extremely dangerous for pedestrians.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9740,
    longitude: 77.6090,
    address: 'Corner of 2nd Cross, Gandhi Bazaar',
    status: 'In Progress',
    priority_band: 'Critical',
    created_at: '2026-10-28T18:00:00Z',
    updated_at: '2026-10-29T07:45:00Z'
  },
  {
    id: 'rep-drain-12',
    tracking_token: 'CLK-DRN-8212',
    title: 'Persistent Water Seepage Weakening Retaining Wall',
    description: 'Slow continuous drainage leak saturating stone retaining wall adjacent to municipal footbridge.',
    category: 'Drainage & Waterlogging',
    latitude: 12.9600,
    longitude: 77.6040,
    address: 'Canal Road Footbridge abutment',
    status: 'Resolved',
    priority_band: 'Medium',
    created_at: '2026-10-20T11:00:00Z',
    updated_at: '2026-10-27T16:00:00Z'
  },

  // --- 10 ROAD DAMAGE ---
  {
    id: 'rep-road-01',
    tracking_token: 'CLK-ROD-9101',
    title: 'Deep Crater Pothole on Flyover Descent',
    description: 'Huge pothole approx 2.5 feet wide and 7 inches deep right on vehicle wheel track descending the flyover.',
    category: 'Roads & Potholes',
    latitude: 12.9790,
    longitude: 77.6110,
    address: 'Indiranagar 100ft Road Flyover down ramp',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-29T06:00:00Z',
    updated_at: '2026-10-29T08:30:00Z'
  },
  {
    id: 'rep-road-02',
    tracking_token: 'CLK-ROD-9102',
    title: 'Dangerous Pothole on 100ft Road Flyover',
    description: 'Large broken asphalt pothole on flyover descent. Cars swerving into opposing lane to avoid damaging rims.',
    category: 'Roads & Potholes',
    latitude: 12.9792,
    longitude: 77.6112,
    address: 'Indiranagar 100ft Road Flyover near ramp exit',
    status: 'Submitted',
    priority_band: 'Critical', // Duplicate candidate with rep-road-01
    created_at: '2026-10-29T07:45:00Z',
    updated_at: '2026-10-29T07:45:00Z'
  },
  {
    id: 'rep-road-03',
    tracking_token: 'CLK-ROD-9103',
    title: 'Unfinished Cable Trench Across Both Lanes',
    description: 'Utility company dug a 1-foot wide trench across the carriageway and left it loosely backfilled with loose gravel.',
    category: 'Roads & Potholes',
    latitude: 12.9705,
    longitude: 77.6040,
    address: '14th Cross Road near Post Office',
    status: 'Assigned',
    priority_band: 'High',
    created_at: '2026-10-27T12:00:00Z',
    updated_at: '2026-10-28T10:00:00Z'
  },
  {
    id: 'rep-road-04',
    tracking_token: 'CLK-ROD-9104',
    title: 'Sunken Asphalt Ridge Damaging Small Cars',
    description: 'Heavy bus traffic has caused longitudinal rutting and asphalt buckling near the traffic signal.',
    category: 'Roads & Potholes',
    latitude: 12.9725,
    longitude: 77.6095,
    address: 'Hosur Road Junction lane 2',
    status: 'In Progress',
    priority_band: 'Medium',
    created_at: '2026-10-25T08:30:00Z',
    updated_at: '2026-10-27T14:00:00Z'
  },
  {
    id: 'rep-road-05',
    tracking_token: 'CLK-ROD-9105',
    title: 'Crumbling Speed Breaker with Exposed Rebars',
    description: 'Concrete speed hump is worn down to rusted metal dowels sticking up 2 inches above the asphalt.',
    category: 'Roads & Potholes',
    latitude: 12.9660,
    longitude: 77.6130,
    address: 'Opposite Community Hall, 6th Main',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-28T14:10:00Z',
    updated_at: '2026-10-29T09:20:00Z'
  },
  {
    id: 'rep-road-06',
    tracking_token: 'CLK-ROD-9106',
    title: 'Multiple Cluster Potholes near School Gate',
    description: 'Series of 5 consecutive potholes stretching across 20 metres directly outside school gate.',
    category: 'Roads & Potholes',
    latitude: 12.9645,
    longitude: 77.6005,
    address: 'National Public School approach road',
    status: 'In Progress',
    priority_band: 'High',
    created_at: '2026-10-26T16:00:00Z',
    updated_at: '2026-10-28T11:00:00Z'
  },
  {
    id: 'rep-road-07',
    tracking_token: 'CLK-ROD-9107',
    title: 'Broken Paver Blocks Along Pedestrian Crossing',
    description: 'Interlocking concrete pavers displaced and scattered; senior citizens tripping frequently.',
    category: 'Roads & Potholes',
    latitude: 12.9735,
    longitude: 77.6065,
    address: 'Zebra crossing in front of Public Library',
    status: 'Submitted',
    priority_band: 'Low',
    created_at: '2026-10-29T10:15:00Z',
    updated_at: '2026-10-29T10:15:00Z'
  },
  {
    id: 'rep-road-08',
    tracking_token: 'CLK-ROD-9108',
    title: 'Eroded Road Shoulder Creating 10-inch Drop',
    description: 'Monsoon runoff has eroded road shoulder entirely. Vehicles forced to drop into unpaved muddy gully.',
    category: 'Roads & Potholes',
    latitude: 12.9610,
    longitude: 77.6160,
    address: 'Lake Perimeter Ring Road bypass',
    status: 'Assigned',
    priority_band: 'Medium',
    created_at: '2026-10-26T09:40:00Z',
    updated_at: '2026-10-27T15:00:00Z'
  },
  {
    id: 'rep-road-09',
    tracking_token: 'CLK-ROD-9109',
    title: 'Cave-in Cavity Forming Under Tar Surface',
    description: 'Hollow void underneath bitumen layer; asphalt is visibly sagging under truck weight. Impending sinkhole.',
    category: 'Roads & Potholes',
    latitude: 12.9775,
    longitude: 77.6080,
    address: 'Commercial Street intersection near jeweler row',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-29T11:00:00Z',
    updated_at: '2026-10-29T11:30:00Z'
  },
  {
    id: 'rep-road-10',
    tracking_token: 'CLK-ROD-9110',
    title: 'Resurfacing Asphalt Debris Left on Curve',
    description: 'Contractors scraped old tar and dumped loose crushed gravel on a sharp turn without warning sign.',
    category: 'Roads & Potholes',
    latitude: 12.9680,
    longitude: 77.6105,
    address: 'Curve before Railway Underbridge',
    status: 'Resolved',
    priority_band: 'Medium',
    created_at: '2026-10-22T14:00:00Z',
    updated_at: '2026-10-25T17:30:00Z'
  },

  // --- 9 GARBAGE AND SANITATION ---
  {
    id: 'rep-garb-01',
    tracking_token: 'CLK-GRB-7301',
    title: 'Overflowing Community Dustbin on Main Promenade',
    description: 'Municipal garbage bin overflowing onto sidewalk. Stray cattle and dogs scattering rotting food waste.',
    category: 'Garbage & Sanitation',
    latitude: 12.9750,
    longitude: 77.6060,
    address: 'Brigade Road Promenade corner',
    status: 'In Progress',
    priority_band: 'High',
    created_at: '2026-10-28T10:00:00Z',
    updated_at: '2026-10-29T08:00:00Z'
  },
  {
    id: 'rep-garb-02',
    tracking_token: 'CLK-GRB-7302',
    title: 'Huge Garbage Pile Blocking Brigade Road Footpath',
    description: 'Trash has not been cleared for 4 days. Waste spread across 15 meters of pedestrian footpath with foul odor.',
    category: 'Garbage & Sanitation',
    latitude: 12.9752,
    longitude: 77.6063,
    address: 'Brigade Road near shopping complex',
    status: 'Verified',
    priority_band: 'High', // Duplicate candidate with rep-garb-01
    created_at: '2026-10-28T14:30:00Z',
    updated_at: '2026-10-28T15:00:00Z'
  },
  {
    id: 'rep-garb-03',
    tracking_token: 'CLK-GRB-7303',
    title: 'Illegal Dumping of Commercial Meat Waste in Vacant Plot',
    description: 'Unidentified lorry dumped slaughterhouse offal in open plot overnight. Unbearable stench and serious biohazard.',
    category: 'Garbage & Sanitation',
    latitude: 12.9635,
    longitude: 77.6195,
    address: 'Plot 88, 1st Cross, Industrial Layout',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-29T05:30:00Z',
    updated_at: '2026-10-29T07:00:00Z'
  },
  {
    id: 'rep-garb-04',
    tracking_token: 'CLK-GRB-7304',
    title: 'Uncollected Wet Waste Bags in Residential Area',
    description: 'Sanitation truck missed collection round for three consecutive days. Waste decomposing in heat.',
    category: 'Garbage & Sanitation',
    latitude: 12.9698,
    longitude: 77.6025,
    address: 'Greenwood Colony, 5th Cross',
    status: 'Assigned',
    priority_band: 'Medium',
    created_at: '2026-10-27T17:15:00Z',
    updated_at: '2026-10-28T09:00:00Z'
  },
  {
    id: 'rep-garb-05',
    tracking_token: 'CLK-GRB-7305',
    title: 'Public Urinal Damaged and Overflowing onto Lane',
    description: 'Municipal e-toilet plumbing broken. Waste leaking into street gutter creating public health risk.',
    category: 'Garbage & Sanitation',
    latitude: 12.9720,
    longitude: 77.6080,
    address: 'City Market Taxi Stand facility',
    status: 'In Progress',
    priority_band: 'High',
    created_at: '2026-10-26T11:20:00Z',
    updated_at: '2026-10-27T13:40:00Z'
  },
  {
    id: 'rep-garb-06',
    tracking_token: 'CLK-GRB-7306',
    title: 'Construction Debris Dumped on Storm Drain Berm',
    description: 'Multiple truckloads of concrete rubble dumped on drain bank, partially falling into watercourse.',
    category: 'Garbage & Sanitation',
    latitude: 12.9768,
    longitude: 77.6140,
    address: 'Koramangala link road storm drain bank',
    status: 'Submitted',
    priority_band: 'Medium',
    created_at: '2026-10-29T12:00:00Z',
    updated_at: '2026-10-29T12:00:00Z'
  },
  {
    id: 'rep-garb-07',
    tracking_token: 'CLK-GRB-7307',
    title: 'Plastic Waste Burning at Roadside Dump',
    description: 'Local shopkeepers burning dry plastic trash to get rid of accumulation. Choking acrid fumes spreading to flats.',
    category: 'Garbage & Sanitation',
    latitude: 12.9675,
    longitude: 77.6115,
    address: 'Behind Vegetable Wholesale Market',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-28T19:30:00Z',
    updated_at: '2026-10-28T20:15:00Z'
  },
  {
    id: 'rep-garb-08',
    tracking_token: 'CLK-GRB-7308',
    title: 'Damaged Compactor Bin Leaking Leachate',
    description: 'Municipal hydraulic bin bottom rusted through. Dark foul liquid pooling on roadway.',
    category: 'Garbage & Sanitation',
    latitude: 12.9710,
    longitude: 77.6015,
    address: 'Opposite Sub-Registrar Office',
    status: 'Submitted',
    priority_band: 'Medium',
    created_at: '2026-10-29T08:50:00Z',
    updated_at: '2026-10-29T08:50:00Z'
  },
  {
    id: 'rep-garb-09',
    tracking_token: 'CLK-GRB-7309',
    title: 'Littered Glass Bottles around Children Park',
    description: 'Broken liquor bottles and glass shards scattered across toddler play lawn area.',
    category: 'Garbage & Sanitation',
    latitude: 12.9640,
    longitude: 77.6070,
    address: 'Shivaji Children Play Park',
    status: 'Resolved',
    priority_band: 'High',
    created_at: '2026-10-23T07:00:00Z',
    updated_at: '2026-10-24T12:00:00Z'
  },

  // --- 7 STREETLIGHT FAILURES ---
  {
    id: 'rep-lite-01',
    tracking_token: 'CLK-LGT-6401',
    title: 'Complete Blackout on 100-Metre School Stretch',
    description: 'Five consecutive LED streetlights non-functional for past 6 days. Female evening commuters and school children feel unsafe.',
    category: 'Streetlights',
    latitude: 12.9685,
    longitude: 77.6030,
    address: 'St. Anne Girls High School perimeter road',
    status: 'In Progress',
    priority_band: 'High',
    created_at: '2026-10-27T19:00:00Z',
    updated_at: '2026-10-28T11:00:00Z'
  },
  {
    id: 'rep-lite-02',
    tracking_token: 'CLK-LGT-6402',
    title: 'Flickering Strobe Streetlight near Blind Corner',
    description: 'High pressure sodium bulb rapidly flashing like a strobe, disorienting motorists turning into the colony.',
    category: 'Streetlights',
    latitude: 12.9738,
    longitude: 77.6102,
    address: 'Corner of 9th Cross and 3rd Main',
    status: 'Assigned',
    priority_band: 'Medium',
    created_at: '2026-10-28T21:10:00Z',
    updated_at: '2026-10-29T09:00:00Z'
  },
  {
    id: 'rep-lite-03',
    tracking_token: 'CLK-LGT-6403',
    title: 'Streetlight Pole Hit by Vehicle Leaning at 45 Degrees',
    description: 'Galvanized streetlight pole struck by unknown truck. Pole leaning precariously over pedestrian footpath supported only by overhead wiring.',
    category: 'Streetlights',
    latitude: 12.9770,
    longitude: 77.6090,
    address: 'Near Old Airport Road Junction',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-29T04:20:00Z',
    updated_at: '2026-10-29T06:45:00Z'
  },
  {
    id: 'rep-lite-04',
    tracking_token: 'CLK-LGT-6404',
    title: 'Streetlights Burning All Day due to Timer Failure',
    description: 'Row of 12 streetlights remain continuously powered on throughout noon and afternoon, wasting public power.',
    category: 'Streetlights',
    latitude: 12.9615,
    longitude: 77.6150,
    address: 'Outer Ring feeder road Sector 4',
    status: 'Submitted',
    priority_band: 'Low',
    created_at: '2026-10-29T11:45:00Z',
    updated_at: '2026-10-29T11:45:00Z'
  },
  {
    id: 'rep-lite-05',
    tracking_token: 'CLK-LGT-6405',
    title: 'Dark Zone Under Foot Overbridge',
    description: 'Underbridge lighting fixtures vandalized. Completely dark corridor creating mugging hotspot.',
    category: 'Streetlights',
    latitude: 12.9715,
    longitude: 77.6135,
    address: 'City Railway Station skywalk ground level',
    status: 'Verified',
    priority_band: 'High',
    created_at: '2026-10-28T22:00:00Z',
    updated_at: '2026-10-29T08:15:00Z'
  },
  {
    id: 'rep-lite-06',
    tracking_token: 'CLK-LGT-6406',
    title: 'Loose Glass Diffuser Ready to Fall on Traffic',
    description: 'Heavy glass casing of high-mast lighting luminaire hanging loose by single screw directly above traffic lane.',
    category: 'Streetlights',
    latitude: 12.9755,
    longitude: 77.6045,
    address: 'Mayo Hall Junction mast light #2',
    status: 'Assigned',
    priority_band: 'Critical',
    created_at: '2026-10-29T09:30:00Z',
    updated_at: '2026-10-29T10:00:00Z'
  },
  {
    id: 'rep-lite-07',
    tracking_token: 'CLK-LGT-6407',
    title: 'Defective Solar Streetlight in Public Park',
    description: 'Solar battery discharged and failing to ignite after sunset. Park jogging track pitch black.',
    category: 'Streetlights',
    latitude: 12.9630,
    longitude: 77.6080,
    address: 'Coles Park East Jogging Trail',
    status: 'Resolved',
    priority_band: 'Low',
    created_at: '2026-10-21T18:00:00Z',
    updated_at: '2026-10-25T14:30:00Z'
  },

  // --- 6 WATER SUPPLY ---
  {
    id: 'rep-wat-01',
    tracking_token: 'CLK-WAT-5501',
    title: 'High-Pressure Water Main Burst Flooding Street',
    description: 'Underground drinking water main ruptured. Geyser of clean water shooting 4 feet into the air; hundreds of thousands of liters lost.',
    category: 'Water Supply',
    latitude: 12.9700,
    longitude: 77.6075,
    address: 'Junction of 8th Main and 4th Cross',
    status: 'In Progress',
    priority_band: 'Critical',
    created_at: '2026-10-29T06:30:00Z',
    updated_at: '2026-10-29T07:15:00Z'
  },
  {
    id: 'rep-wat-02',
    tracking_token: 'CLK-WAT-5502',
    title: 'Major Water Pipe Leakage near 8th Main Junction',
    description: 'Massive drinking water pipe burst flooding road and low-lying front yards. Clean potable water wasting heavily.',
    category: 'Water Supply',
    latitude: 12.9702,
    longitude: 77.6077,
    address: '8th Main Road, near Water Board valve station',
    status: 'Verified',
    priority_band: 'Critical', // Duplicate candidate with rep-wat-01
    created_at: '2026-10-29T08:00:00Z',
    updated_at: '2026-10-29T08:30:00Z'
  },
  {
    id: 'rep-wat-03',
    tracking_token: 'CLK-WAT-5503',
    title: 'Contaminated Tap Water with Sewage Odor',
    description: 'Municipal tap supply in entire lane coming out murky yellow with pungent sewer smell. Residents getting gastrointestinal illness.',
    category: 'Water Supply',
    latitude: 12.9650,
    longitude: 77.6020,
    address: 'Houses 14 through 32, Vinayaka Layout',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-28T07:30:00Z',
    updated_at: '2026-10-28T09:00:00Z'
  },
  {
    id: 'rep-wat-04',
    tracking_token: 'CLK-WAT-5504',
    title: 'No Municipal Water Supply for Past 5 Days',
    description: 'Scheduled twice-a-week piped water has not arrived for 5 days. Low-income tenements relying on expensive private water tankers.',
    category: 'Water Supply',
    latitude: 12.9765,
    longitude: 77.6165,
    address: 'Labor Colony Block C, Austin Town',
    status: 'Assigned',
    priority_band: 'High',
    created_at: '2026-10-27T10:00:00Z',
    updated_at: '2026-10-28T14:00:00Z'
  },
  {
    id: 'rep-wat-05',
    tracking_token: 'CLK-WAT-5505',
    title: 'Public Borewell Handpump Mechanical Failure',
    description: 'Community handpump handle detached from piston rod. Crucial drinking source for 60 local families unusable.',
    category: 'Water Supply',
    latitude: 12.9625,
    longitude: 77.6110,
    address: 'Near Slum Board Quarters, Neelasandra',
    status: 'Submitted',
    priority_band: 'Medium',
    created_at: '2026-10-29T10:30:00Z',
    updated_at: '2026-10-29T10:30:00Z'
  },
  {
    id: 'rep-wat-06',
    tracking_token: 'CLK-WAT-5506',
    title: 'Defective Distribution Valve Leaking Constant Stream',
    description: 'Underground control valve chamber constantly overflowing into adjacent road stormwater drain.',
    category: 'Water Supply',
    latitude: 12.9692,
    longitude: 77.6145,
    address: 'Opposite Government Maternity Hospital',
    status: 'Resolved',
    priority_band: 'Low',
    created_at: '2026-10-20T08:00:00Z',
    updated_at: '2026-10-26T15:00:00Z'
  },

  // --- 3 ELECTRICAL HAZARDS ---
  {
    id: 'rep-elec-01',
    tracking_token: 'CLK-ELC-3301',
    title: 'Sparking Transformer with Dripping Insulating Oil',
    description: 'Pole-mounted distribution transformer making loud buzzing sounds with visible electrical sparks. Hot oil dripping near fruit vendor cart.',
    category: 'Electrical Hazards',
    latitude: 12.9732,
    longitude: 77.6052,
    address: 'Commercial Street corner by fruit market',
    status: 'Verified',
    priority_band: 'Critical',
    created_at: '2026-10-29T08:15:00Z',
    updated_at: '2026-10-29T08:45:00Z'
  },
  {
    id: 'rep-elec-02',
    tracking_token: 'CLK-ELC-3302',
    title: 'Snapping Overhead Cable Dangling at Head Height',
    description: 'Live 440V overhead distribution wire snapped during wind and hanging 5 feet above the pedestrian walkway.',
    category: 'Electrical Hazards',
    latitude: 12.9678,
    longitude: 77.6088,
    address: 'Residency Road near petrol bunk',
    status: 'In Progress',
    priority_band: 'Critical',
    created_at: '2026-10-29T07:00:00Z',
    updated_at: '2026-10-29T07:20:00Z'
  },
  {
    id: 'rep-elec-03',
    tracking_token: 'CLK-ELC-3303',
    title: 'Exposed Electrical Feeder Pillar Box Left Unlocked',
    description: 'Sheet metal distribution feeder pillar has doors torn open with live copper busbars fully accessible to curious children.',
    category: 'Electrical Hazards',
    latitude: 12.9642,
    longitude: 77.6035,
    address: 'Apartment playground perimeter, Victoria Road',
    status: 'Assigned',
    priority_band: 'Critical',
    created_at: '2026-10-28T16:30:00Z',
    updated_at: '2026-10-29T09:10:00Z'
  },

  // --- 3 OTHER CIVIC ISSUES ---
  {
    id: 'rep-oth-01',
    tracking_token: 'CLK-OTH-1101',
    title: 'Large Dead Banyan Tree Branch Threatening Rooftops',
    description: 'Giant dried tree branch hanging over high-voltage power line and two residential tiled roofs.',
    category: 'Other Civic Issues',
    latitude: 12.9718,
    longitude: 77.6008,
    address: 'Kasturba Road behind Museum',
    status: 'Verified',
    priority_band: 'High',
    created_at: '2026-10-28T11:15:00Z',
    updated_at: '2026-10-28T14:00:00Z'
  },
  {
    id: 'rep-oth-02',
    tracking_token: 'CLK-OTH-1102',
    title: 'Unauthorized Encroachment on Pedestrian Footpath',
    description: 'Commercial shop erected illegal corrugated tin extension entirely blocking wheelchair and pedestrian access.',
    category: 'Other Civic Issues',
    latitude: 12.9742,
    longitude: 77.6125,
    address: 'Old Madras Road shop #104',
    status: 'Submitted',
    priority_band: 'Medium',
    created_at: '2026-10-29T14:00:00Z',
    updated_at: '2026-10-29T14:00:00Z'
  },
  {
    id: 'rep-oth-03',
    tracking_token: 'CLK-OTH-1103',
    title: 'Damaged Safety Railing on Lake Jogging Track',
    description: '30 feet of protective perimeter railing collapsed into lake bed, posing drowning risk for children.',
    category: 'Other Civic Issues',
    latitude: 12.9595,
    longitude: 77.6170,
    address: 'Ulsoor Lake south promenade',
    status: 'Assigned',
    priority_band: 'High',
    created_at: '2026-10-27T08:00:00Z',
    updated_at: '2026-10-27T16:30:00Z'
  }
];

export const SYNTHETIC_ANALYSES: Record<string, AIAnalysis> = {
  'rep-drain-01': {
    id: 'ana-drain-01',
    report_id: 'rep-drain-01',
    category: 'Drainage & Waterlogging',
    summary: 'Severely silted stormwater drain causing commercial area waterlogging',
    severity: 'critical',
    urgency_score: 92,
    impact_score: 88,
    duration_score: 85,
    recurrence_score: 90,
    priority_score: 89,
    reasoning: [
      'Heavy pedestrian and merchant footfall directly affected',
      'High risk of flash flooding during forecasted afternoon rains',
      'Structural silt build-up requires mechanical jetting',
      'Potential sanitation hazard from trapped organic matter'
    ],
    recommended_action: 'Dispatch mechanical super-sucker drain jetting team within 2 hours to clear obstruction.',
    created_at: '2026-10-28T09:16:00Z'
  },
  'rep-road-01': {
    id: 'ana-road-01',
    report_id: 'rep-road-01',
    category: 'Roads & Potholes',
    summary: 'High-speed flyover descent crater creating severe two-wheeler fatal hazard',
    severity: 'critical',
    urgency_score: 95,
    impact_score: 90,
    duration_score: 40,
    recurrence_score: 75,
    priority_score: 82,
    reasoning: [
      'Vehicles descending at 50-60 km/h cannot brake in time',
      'Immediate danger of two-wheeler thrown rider accidents',
      'Sharp edges capable of bursting automobile tires and bending rims'
    ],
    recommended_action: 'Place emergency retroreflective warning cones immediately. Deploy cold-mix asphalt patch unit.',
    created_at: '2026-10-29T06:02:00Z'
  },
  'rep-elec-01': {
    id: 'ana-elec-01',
    report_id: 'rep-elec-01',
    category: 'Electrical Hazards',
    summary: 'Active sparking pole transformer with burning dielectric oil hazard',
    severity: 'critical',
    urgency_score: 98,
    impact_score: 95,
    duration_score: 20,
    recurrence_score: 10,
    priority_score: 86,
    reasoning: [
      'Live electrical arcing in dense pedestrian market',
      'Flammable mineral oil dripping onto street vendor structures',
      'Risk of explosive transformer failure and localized blackout'
    ],
    recommended_action: 'Isolate 11kV feeder section immediately. Dispatch emergency electrical utility squad.',
    created_at: '2026-10-29T08:16:00Z'
  }
};

export const SYNTHETIC_HOTSPOTS: Hotspot[] = [
  {
    id: 'hotspot-gandhi-bazaar',
    name: 'Gandhi Bazaar — Market Drainage & Road Cluster',
    latitude: 12.9746,
    longitude: 77.6083,
    radius_meters: 350,
    report_count: 8,
    dominant_category: 'Drainage & Waterlogging',
    severity: 'critical',
    ai_brief_summary: '8 complaints indicate recurring drainage overflow and associated road subgrade collapse around Market Circle. High probability of shared storm line choke.',
    recommended_intervention: 'Inspect primary arterial trunk drain downstream of Gandhi Bazaar and execute joint desilting before road patching.',
    created_at: '2026-10-29T10:00:00Z'
  },
  {
    id: 'hotspot-indiranagar-flyover',
    name: '100ft Road Flyover Pothole Cluster',
    latitude: 12.9791,
    longitude: 77.6111,
    radius_meters: 200,
    report_count: 5,
    dominant_category: 'Roads & Potholes',
    severity: 'high',
    ai_brief_summary: 'Multiple complaints reporting severe asphalt surface peeling on the descent ramp following recent overnight downpours.',
    recommended_intervention: 'Complete mill-and-fill resurfacing on the bridge expansion joint segment rather than temporary pothole filling.',
    created_at: '2026-10-29T09:30:00Z'
  },
  {
    id: 'hotspot-brigade-sanitation',
    name: 'Brigade Road Promenade Sanitation Cluster',
    latitude: 12.9751,
    longitude: 77.6061,
    radius_meters: 250,
    report_count: 6,
    dominant_category: 'Garbage & Sanitation',
    severity: 'high',
    ai_brief_summary: 'Repeated accumulation of solid waste and commercial packaging overflowing municipal bins on pedestrian footpaths.',
    recommended_intervention: 'Increase daily clearance frequency from once to three times daily and enforce commercial waste segregation.',
    created_at: '2026-10-29T08:45:00Z'
  }
];

export const SYNTHETIC_DUPLICATES: DuplicateCandidate[] = [
  {
    id: 'dup-01',
    report_id: 'rep-drain-02',
    matched_report_id: 'rep-drain-01',
    semantic_score: 91,
    geographic_score: 94,
    category_score: 100,
    combined_score: 93.1, // 0.60*91 + 0.25*94 + 0.15*100 = 54.6 + 23.5 + 15 = 93.1
    review_status: 'pending',
    notes: 'Same Gandhi Bazaar drainage channel blockage reported by two different citizens 2 hours apart.',
    created_at: '2026-10-28T11:42:00Z'
  },
  {
    id: 'dup-02',
    report_id: 'rep-road-02',
    matched_report_id: 'rep-road-01',
    semantic_score: 94,
    geographic_score: 96,
    category_score: 100,
    combined_score: 95.4,
    review_status: 'pending',
    notes: 'Identical flyover descent pothole reported within 1 hour 45 minutes.',
    created_at: '2026-10-29T07:46:00Z'
  },
  {
    id: 'dup-03',
    report_id: 'rep-wat-02',
    matched_report_id: 'rep-wat-01',
    semantic_score: 89,
    geographic_score: 92,
    category_score: 100,
    combined_score: 91.4,
    review_status: 'pending',
    notes: 'Same drinking water pipe burst on 8th Main road junction.',
    created_at: '2026-10-29T08:05:00Z'
  },
  {
    id: 'dup-04',
    report_id: 'rep-garb-02',
    matched_report_id: 'rep-garb-01',
    semantic_score: 86,
    geographic_score: 95,
    category_score: 100,
    combined_score: 90.35,
    review_status: 'pending',
    notes: 'Brigade Road sidewalk garbage pile reported by nearby shopkeeper and a pedestrian.',
    created_at: '2026-10-28T14:32:00Z'
  }
];
