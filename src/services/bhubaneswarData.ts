import { WardInfo, TourismPlace, Complaint, Incident, EmergencyCase, FieldTask, CameraEvent } from '../types';

export const BHUBANESWAR_ZONES = [
  'North Zone',
  'Central Zone',
  'South-West Zone'
] as const;

export const BHUBANESWAR_DEPARTMENTS = [
  { id: 'ENGINEERING', name: 'Engineering & Roads', icon: 'Construction', color: 'cyan' },
  { id: 'DRAINAGE', name: 'Disaster Management & Drainage', icon: 'Waves', color: 'blue' },
  { id: 'SANITATION', name: 'Health & Sanitation', icon: 'Trash2', color: 'emerald' },
  { id: 'ELECTRICAL', name: 'Electrical & Street Lighting', icon: 'Zap', color: 'amber' },
  { id: 'ENVIRONMENT', name: 'Environment & Parks', icon: 'Trees', color: 'green' },
  { id: 'ENFORCEMENT', name: 'Enforcement & Public Safety', icon: 'ShieldCheck', color: 'rose' },
  { id: 'IT_PROJECTS', name: 'IT & Special Projects', icon: 'Cpu', color: 'indigo' },
  { id: 'SOCIAL_WELFARE', name: 'Social Welfare & Community', icon: 'HeartHandshake', color: 'pink' },
  { id: 'PR_COMMUNICATION', name: 'PR & Public Communication', icon: 'Megaphone', color: 'purple' }
] as const;

export const PARTNER_AGENCIES = [
  { id: 'TRAFFIC_POLICE', name: 'Bhubaneswar-Cuttack Police Commissionerate (Traffic)', badge: 'Integrated Partner' },
  { id: 'ODISHA_FIRE', name: 'Odisha Fire & Emergency Services', badge: 'Integrated Partner' },
  { id: 'HEALTH_SERVICES', name: 'Odisha State Health & Capital Hospital Network', badge: 'Integrated Partner' },
  { id: 'ODISHA_TOURISM', name: 'Odisha Tourism Development Corporation (OTDC)', badge: 'Integrated Partner' },
  { id: 'SRC_ODISHA', name: 'Special Relief Commissioner (Disaster Warning)', badge: 'Integrated Partner' }
] as const;

export const BHUBANESWAR_WARDS: WardInfo[] = [
  // North Zone
  { wardNo: 1, name: 'Raghunathpur & Nandankanan', zone: 'North Zone', corporatorName: 'Smt. Minati Pradhan', keyLandmarks: ['Nandankanan Zoo', 'Kalyan Mandap'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 3, lat: 20.3956, lng: 85.8286 },
  { wardNo: 2, name: 'Patia Village & Infocity Rd', zone: 'North Zone', corporatorName: 'Sri Bikash Mohanty', keyLandmarks: ['Infocity Gate 1', 'Silicon Tech Hub'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 7, lat: 20.3588, lng: 85.8197 },
  { wardNo: 3, name: 'Kalarahanga & KIIT Campus', zone: 'North Zone', corporatorName: 'Sri Ranjan Nayak', keyLandmarks: ['KIIT Square', 'KIMS Hospital'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 4, lat: 20.3541, lng: 85.8152 },
  { wardNo: 4, name: 'Sailashree Vihar North', zone: 'North Zone', corporatorName: 'Smt. Rashmita Dash', keyLandmarks: ['Sailashree Vihar Market', 'DAV School'], vulnerabilityIndex: 'LOW', activeComplaintsCount: 2, lat: 20.3391, lng: 85.8114 },
  { wardNo: 5, name: 'Niladri Vihar & Buddha Park', zone: 'North Zone', corporatorName: 'Sri Debasis Jena', keyLandmarks: ['Buddha Jayanti Park', 'Niladri Vihar PHC'], vulnerabilityIndex: 'LOW', activeComplaintsCount: 2, lat: 20.3312, lng: 85.8168 },
  { wardNo: 6, name: 'Chandrasekharpur Housing Board', zone: 'North Zone', corporatorName: 'Sri Subrat Samal', keyLandmarks: ['Care Hospitals Chhak', 'HP Petrol Pump'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 5, lat: 20.3235, lng: 85.8189 },
  { wardNo: 7, name: 'Damana & BDA Colony', zone: 'North Zone', corporatorName: 'Smt. Anita Behera', keyLandmarks: ['Damana Square', 'Utkal Kanika Galleria'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 6, lat: 20.3204, lng: 85.8142 },
  { wardNo: 8, name: 'Mancheswar Industrial Estate', zone: 'North Zone', corporatorName: 'Sri Manoj Kumar Panda', keyLandmarks: ['Railway Carriage Workshop', 'IDCO Towers II'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 8, lat: 20.3168, lng: 85.8456 },
  { wardNo: 9, name: 'Gadasahi & VSS Nagar West', zone: 'North Zone', corporatorName: 'Smt. Mamata Sahoo', keyLandmarks: ['VSS Nagar Market', 'Chakeisiani Canal'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 9, lat: 20.3114, lng: 85.8512 },
  { wardNo: 10, name: 'VSS Nagar Central', zone: 'North Zone', corporatorName: 'Sri Santosh Rout', keyLandmarks: ['VSS Nagar High School', 'Post Office'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 4, lat: 20.3075, lng: 85.8488 },
  { wardNo: 11, name: 'Gadakana & Railway Colony', zone: 'North Zone', corporatorName: 'Sri Prasant Barik', keyLandmarks: ['Gadakana Overbridge', 'Sainik School Backgate'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 3, lat: 20.3211, lng: 85.8345 },
  { wardNo: 12, name: 'Sainik School & Apollo Hospital', zone: 'North Zone', corporatorName: 'Smt. Sunita Das', keyLandmarks: ['Apollo Hospital', 'Sainik School Campus'], vulnerabilityIndex: 'LOW', activeComplaintsCount: 2, lat: 20.3134, lng: 85.8312 },

  // Central Zone
  { wardNo: 14, name: 'Jayadev Vihar & Mayfair Chhak', zone: 'Central Zone', corporatorName: 'Sri Mihir Mohapatra', keyLandmarks: ['Jayadev Vihar Flyover', 'Pal Heights', 'NH-16 Junction'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 11, lat: 20.2984, lng: 85.8192 },
  { wardNo: 15, name: 'Nayapalli IRC Village & Behera Sahi', zone: 'Central Zone', corporatorName: 'Smt. Pravasini Ray', keyLandmarks: ['IRC Village Park', 'IDBI Bank Square'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 9, lat: 20.3015, lng: 85.8089 },
  { wardNo: 16, name: 'Nayapalli Nuasahi & Ekamra Kanan', zone: 'Central Zone', corporatorName: 'Sri Ashish Patnaik', keyLandmarks: ['Ekamra Kanan Lake', 'RPRC Botanical Garden'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 4, lat: 20.3082, lng: 85.7995 },
  { wardNo: 20, name: 'Acharya Vihar & Utkal University', zone: 'Central Zone', corporatorName: 'Smt. Jayanti Swain', keyLandmarks: ['Utkal University Main Gate', 'Acharya Vihar Square', 'RRL Campus'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 10, lat: 20.3012, lng: 85.8336 },
  { wardNo: 25, name: 'Saheed Nagar Market & Maharshi College', zone: 'Central Zone', corporatorName: 'Sri Jyoti Prakash', keyLandmarks: ['Saheed Nagar Puja Mandap', 'Sparsh Hospital', 'Bhawani Mall'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 8, lat: 20.2889, lng: 85.8451 },
  { wardNo: 27, name: 'Satya Nagar & Big Bazaar Chhak', zone: 'Central Zone', corporatorName: 'Smt. Sabita Sethi', keyLandmarks: ['Satya Nagar Kali Temple', 'St. Joseph High School'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 5, lat: 20.2825, lng: 85.8412 },
  { wardNo: 30, name: 'Kharavela Nagar & Master Canteen', zone: 'Central Zone', corporatorName: 'Sri Alok Tripathy', keyLandmarks: ['Bhubaneswar Railway Station', 'Master Canteen Square', 'Lalchand Market'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 12, lat: 20.2685, lng: 85.8398 },
  { wardNo: 34, name: 'Unit-1 Daily Market & Rajmahal', zone: 'Central Zone', corporatorName: 'Sri Jagannath Padhi', keyLandmarks: ['Unit-1 Haat', 'Rajmahal Flyover', 'AG Square'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 14, lat: 20.2642, lng: 85.8305 },
  { wardNo: 36, name: 'Unit-6 Capital Hospital & Ganga Nagar', zone: 'Central Zone', corporatorName: 'Smt. Gita Mishra', keyLandmarks: ['Capital Hospital Main Gate', 'Ganga Nagar Square', 'OUAT Gate'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 6, lat: 20.2618, lng: 85.8175 },
  { wardNo: 40, name: 'Bapuji Nagar & Forest Park', zone: 'Central Zone', corporatorName: 'Sri Tanmay Kar', keyLandmarks: ['Forest Park Jogging Track', 'Sishu Bhawan Square'], vulnerabilityIndex: 'LOW', activeComplaintsCount: 3, lat: 20.2575, lng: 85.8291 },

  // South-West Zone
  { wardNo: 45, name: 'Old Town Lingaraj Temple Precinct', zone: 'South-West Zone', corporatorName: 'Sri Manoranjan Srichandan', keyLandmarks: ['Lingaraj Temple', 'Bindusagar Lake', 'Mukteshvara Temple'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 9, lat: 20.2384, lng: 85.8341 },
  { wardNo: 48, name: 'Kapilaprasad & Sundarpada North', zone: 'South-West Zone', corporatorName: 'Smt. Lopamudra Rout', keyLandmarks: ['Sundarpada Canal Road', 'Hi-Tech Plaza'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 11, lat: 20.2285, lng: 85.8188 },
  { wardNo: 51, name: 'Pokhariput & DAV School Chhak', zone: 'South-West Zone', corporatorName: 'Sri Soumya Ranjan Dash', keyLandmarks: ['Pokhariput Overbridge', 'Aerodrome Gate', 'DAV Pokhariput'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 5, lat: 20.2458, lng: 85.8012 },
  { wardNo: 53, name: 'Jagamara & ITER College Road', zone: 'South-West Zone', corporatorName: 'Sri Bijoy Nayak', keyLandmarks: ['ITER University', 'Jagamara Square', 'Gopabandhu Health Clinic'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 7, lat: 20.2523, lng: 85.7892 },
  { wardNo: 58, name: 'Khandagiri & Udayagiri Heritage Zone', zone: 'South-West Zone', corporatorName: 'Smt. Swarnalata Biswal', keyLandmarks: ['Khandagiri Caves', 'NH-16 Khandagiri Chhak', 'AMRI Hospital'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 8, lat: 20.2589, lng: 85.7785 },
  { wardNo: 62, name: 'Dumduma Housing Board Phase 1-3', zone: 'South-West Zone', corporatorName: 'Sri Deepak Mohanty', keyLandmarks: ['Dumduma Sub-Post Office', 'Subhadra Kalyan Mandap'], vulnerabilityIndex: 'MEDIUM', activeComplaintsCount: 4, lat: 20.2372, lng: 85.7725 },
  { wardNo: 64, name: 'Patrapada & AIIMS Bhubaneswar Area', zone: 'South-West Zone', corporatorName: 'Sri Sudhanshu Sekhar Behera', keyLandmarks: ['AIIMS Bhubaneswar Campus', 'DN Regalia Mall', 'NH-16 Overbridge'], vulnerabilityIndex: 'HIGH', activeComplaintsCount: 6, lat: 20.2312, lng: 85.7594 },
  { wardNo: 67, name: 'Ghatikia & Kalinga Nagar Phase II', zone: 'South-West Zone', corporatorName: 'Smt. Kalyani Mohapatra', keyLandmarks: ['SUM Ultimate Medicare', 'CET College Campus', 'Kalinga Studio'], vulnerabilityIndex: 'LOW', activeComplaintsCount: 3, lat: 20.2715, lng: 85.7645 }
];

export const BHUBANESWAR_HOSPITALS = [
  { id: 'HOSP_01', name: 'AIIMS Bhubaneswar', zone: 'South-West Zone', ward: 'Ward 64 (Patrapada)', lat: 20.2312, lng: 85.7594, icuTotal: 48, icuAvailable: 11, emergencyBeds: 60, oxygenSupply: '100% (Cryogenic)', traumaCenter: true, phone: '+91-674-2476789' },
  { id: 'HOSP_02', name: 'Capital Hospital (Government)', zone: 'Central Zone', ward: 'Ward 36 (Unit-6)', lat: 20.2618, lng: 85.8175, icuTotal: 36, icuAvailable: 6, emergencyBeds: 85, oxygenSupply: '98%', traumaCenter: true, phone: '+91-674-2391983' },
  { id: 'HOSP_03', name: 'SUM Ultimate Medicare', zone: 'South-West Zone', ward: 'Ward 67 (Kalinga Nagar)', lat: 20.2715, lng: 85.7645, icuTotal: 55, icuAvailable: 19, emergencyBeds: 45, oxygenSupply: '100%', traumaCenter: true, phone: '+91-674-2386262' },
  { id: 'HOSP_04', name: 'KIMS Hospital', zone: 'North Zone', ward: 'Ward 3 (Kalarahanga)', lat: 20.3541, lng: 85.8152, icuTotal: 42, icuAvailable: 14, emergencyBeds: 50, oxygenSupply: '100%', traumaCenter: true, phone: '+91-674-7111000' },
  { id: 'HOSP_05', name: 'Apollo Hospitals Bhubaneswar', zone: 'North Zone', ward: 'Ward 12 (Sainik School)', lat: 20.3134, lng: 85.8312, icuTotal: 30, icuAvailable: 8, emergencyBeds: 30, oxygenSupply: '100%', traumaCenter: true, phone: '+91-674-6661066' },
  { id: 'HOSP_06', name: 'AMRI Hospital Khandagiri', zone: 'South-West Zone', ward: 'Ward 58 (Khandagiri)', lat: 20.2589, lng: 85.7785, icuTotal: 25, icuAvailable: 5, emergencyBeds: 28, oxygenSupply: '99%', traumaCenter: true, phone: '+91-674-6666600' }
];

export const BHUBANESWAR_FIRE_STATIONS = [
  { id: 'FIRE_01', name: 'Kalpana Fire Station', location: 'Kalpana Square, Central Zone', lat: 20.2534, lng: 85.8432, tendersReady: 4, foamTenders: 2, responseTeam: 'Alpha Team (12 crew)', phone: '101 / +91-674-2430101' },
  { id: 'FIRE_02', name: 'Chandrasekharpur Fire Station', location: 'CS Pur Damana Road, North Zone', lat: 20.3245, lng: 85.8201, tendersReady: 3, foamTenders: 1, responseTeam: 'Bravo Team (9 crew)', phone: '101 / +91-674-2740101' },
  { id: 'FIRE_03', name: 'Secretariat Fire Station', location: 'Lok Seva Bhavan Enclave', lat: 20.2741, lng: 85.8275, tendersReady: 3, foamTenders: 1, responseTeam: 'Hazmat Delta Team', phone: '101 / +91-674-2322101' },
  { id: 'FIRE_04', name: 'Tamando Fire Station', location: 'NH-16 South Gateway', lat: 20.2185, lng: 85.7482, tendersReady: 2, foamTenders: 1, responseTeam: 'Echo Rescue Team', phone: '101 / +91-674-2460101' }
];

export const BHUBANESWAR_TOURISM: TourismPlace[] = [
  {
    id: 'TOUR_01',
    name: 'Lingaraj Temple (11th Century CE)',
    category: 'HERITAGE_TEMPLE',
    ward: 'Ward 45 (Old Town)',
    address: 'Old Town, Bhubaneswar, Odisha 751002',
    lat: 20.2384,
    lng: 85.8341,
    timings: '06:00 AM – 09:00 PM (Daily)',
    entryFee: 'Free (Non-Hindus can view from curio platform)',
    crowdLevel: 'VERY_BUSY',
    weatherSuitability: 'Best during early morning / post 4 PM',
    description: 'The crowning jewel of Kalinga temple architecture, dedicated to Lord Harihara. Features a 180-foot deula spire towering over ancient red sandstone courtyards.',
    highlights: ['55-meter Kalinga Spire', 'Bindusagar Holy Tank', 'Surrounding 108 subsidiary shrines', 'Mahashivratri festival epicenter'],
    audioGuideSummary: 'Welcome to Lingaraj Temple, built by the Somavamsi dynasty kings in the 11th century. Notice the rhythmic horizontal tiers of the Jagamohana prayer hall and exquisite dancing celestial figures carved into sacred sandstone.'
  },
  {
    id: 'TOUR_02',
    name: 'Mukteshvara Temple & Torana',
    category: 'HERITAGE_TEMPLE',
    ward: 'Ward 45 (Old Town)',
    address: 'Kedar Gouri Temple Road, Old Town',
    lat: 20.2432,
    lng: 85.8385,
    timings: '06:30 AM – 07:00 PM',
    entryFee: 'Free',
    crowdLevel: 'MODERATE',
    weatherSuitability: 'Excellent all day',
    description: 'Known as the "Gem of Odisha Architecture", famous for its standalone ornate arched Torana gateway influenced by Buddhist and Jain motifs.',
    highlights: ['Iconic Arched Torana', 'Marichi Kund Tank', 'Erotic and mythological miniature carvings', 'Yearly Mukteswar Dance Festival site'],
    audioGuideSummary: 'Mukteshvara marks the transitional zenith of Kalinga temple engineering. Observe the iconic monolithic arched gateway with finely sculpted smiling maiden figures.'
  },
  {
    id: 'TOUR_03',
    name: 'Udayagiri & Khandagiri Rock-Cut Caves',
    category: 'CAVES',
    ward: 'Ward 58 (Khandagiri)',
    address: 'Khandagiri Chhak, Bhubaneswar 751030',
    lat: 20.2589,
    lng: 85.7785,
    timings: '09:00 AM – 06:00 PM',
    entryFee: '₹25 (Indians), ₹300 (Foreigners)',
    crowdLevel: 'BUSY',
    weatherSuitability: 'Avoid peak afternoon heat (climb involved)',
    description: 'Partly natural and partly artificial caves of archaeological significance dating back to Emperor Kharavela (2nd century BCE) of Kalinga.',
    highlights: ['Hathigumpha Inscription in Brahmi script', 'Rani Gumpha double-storey monastery', 'Panoramic viewpoint overlooking Bhubaneswar skyline', 'Monkeys and heritage trail'],
    audioGuideSummary: 'You are standing before the rock shelters of ancient Jain ascetics. The Hathigumpha cave contains the famous 17-line biographical inscription of Emperor Kharavela.'
  },
  {
    id: 'TOUR_04',
    name: 'Nandankanan Zoological Park & Botanical Garden',
    category: 'PARK_ZOO',
    ward: 'Ward 1 (Nandankanan)',
    address: 'Nandankanan Rd, near Raghunathpur',
    lat: 20.3956,
    lng: 85.8286,
    timings: '08:00 AM – 05:00 PM (Closed Mondays)',
    entryFee: '₹50 (Adults), ₹10 (Children)',
    crowdLevel: 'BUSY',
    weatherSuitability: 'Ideal in morning hours',
    description: 'Premier 437-hectare zoo and botanical park on the banks of Kanjia Lake. Renowned worldwide for breeding white tigers and endangered pangolins.',
    highlights: ['White Tiger Safari', 'Lion Safari', 'Kanjia Lake Boating & Ropeway', 'Botanical Orchid House'],
    audioGuideSummary: 'Nandankanan means "Garden of the Gods". It is the only zoo in India with an open-moated wildlife enclosure and the world-famous white tiger conservation facility.'
  },
  {
    id: 'TOUR_05',
    name: 'Odisha Crafts Museum (Kala Bhoomi)',
    category: 'CULTURE_CRAFTS',
    ward: 'Ward 51 (Pokhariput)',
    address: 'Pokhariput, Bhubaneswar 751030',
    lat: 20.2458,
    lng: 85.8012,
    timings: '10:00 AM – 05:30 PM (Closed Mondays)',
    entryFee: '₹50',
    crowdLevel: 'LOW',
    weatherSuitability: 'Indoor air-conditioned galleries',
    description: 'World-class museum celebrating indigenous handicrafts and handlooms of Odisha, set across 12.68 acres of traditional courtyard courtyards.',
    highlights: ['Pattachitra Paintings', 'Silver Filigree (Tarakasi)', 'Terracotta courtyards', 'Handloom Live Demonstration workshop'],
    audioGuideSummary: 'Kala Bhoomi showcases eight centuries of living Odishan craftsmanship. From the intricate silver filigree of Cuttack to the sacred Pattachitra scrolls of Raghurajpur.'
  },
  {
    id: 'TOUR_06',
    name: 'Dhauli Shanti Stupa (Peace Pagoda)',
    category: 'HERITAGE_TEMPLE',
    ward: 'South Gateway (Dhauli Hills)',
    address: 'Dhauli Hills, Daya River bank',
    lat: 20.1925,
    lng: 85.8392,
    timings: '06:00 AM – 07:00 PM (Light & Sound: 07:00 PM)',
    entryFee: 'Free (Parking ₹20)',
    crowdLevel: 'MODERATE',
    weatherSuitability: 'Sunset and evening light show',
    description: 'Built on the hillock where Emperor Ashoka renounced war after the bloody Kalinga War in 261 BCE and embraced Buddhism.',
    highlights: ['Dhauli Ashokan Rock Edict with sculpted elephant', 'White Japanese Peace Pagoda', 'Daya River panoramic vista', 'Night projection mapping show'],
    audioGuideSummary: 'Here on the banks of River Daya in 261 BCE, human history changed as Emperor Ashoka transformed from Chandashoka the conqueror into Dharmashoka the patron of peace.'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_001',
    ticketNo: 'BMC-CNX-2026-0891',
    citizenId: 'cit_user_01',
    citizenName: 'Subham Pradhan',
    citizenPhone: '+91-9876543210',
    category: 'Flood / Waterlogging',
    subcategory: 'Severe Stormwater Drain Clog',
    description: 'Heavy waterlogging reaching knee height near Jayadev Vihar Overbridge service lane. Vehicles and two-wheelers are getting stalled, causing traffic jam towards Nayapalli.',
    address: 'Service Road, Near Pal Heights, Jayadev Vihar',
    ward: 'Ward 14 (Jayadev Vihar)',
    zone: 'Central Zone',
    lat: 20.2984,
    lng: 85.8192,
    status: 'IN_PROGRESS',
    priority: 'P1_CRITICAL',
    severity: 'CRITICAL',
    department: 'Disaster Management & Drainage',
    aiAnalysis: {
      category: 'Flood / Waterlogging',
      subcategory: 'Stormwater Grid Choke',
      severity: 'CRITICAL',
      priority: 'P1_CRITICAL',
      confidence: 0.94,
      department: 'Disaster Management & Drainage',
      locationIdentified: 'Jayadev Vihar Flyover NH-16 Service Road',
      wardEstimated: 'Ward 14 (Jayadev Vihar)',
      zoneEstimated: 'Central Zone',
      summary: 'Severe water accumulation causing NH-16 service road gridlock and pedestrian blockage.',
      recommendedAction: 'Deploy high-capacity mobile dewatering pump (500 GPM) and clear gully pit grates immediately.',
      estimatedResolutionHours: 2,
      duplicateCandidateId: undefined,
      cascadeRisks: [
        'Overspill into Nayapalli Behera Sahi low-lying residential clusters',
        'Traffic congestion spilling over to Acharya Vihar junction (NH-16)',
        'Delay to Capital Hospital bound emergency ambulances from Chandrasekharpur'
      ]
    },
    timeline: [
      {
        id: 'tl_01',
        status: 'SUBMITTED',
        timestamp: '2026-10-02T21:15:00Z',
        updatedBy: 'Subham Pradhan (Citizen)',
        userRole: 'CITIZEN',
        note: 'Complaint submitted with high-resolution photo evidence.'
      },
      {
        id: 'tl_02',
        status: 'AI_ANALYSIS',
        timestamp: '2026-10-02T21:15:08Z',
        updatedBy: 'Civic Nexus AI Engine',
        userRole: 'SYSTEM_AI',
        note: 'AI classified as P1 Critical Flood hazard with 94% confidence. Auto-routed to Disaster Management.'
      },
      {
        id: 'tl_03',
        status: 'ASSIGNED',
        timestamp: '2026-10-02T21:20:00Z',
        updatedBy: 'Dr. S. Mohapatra (Disaster Head)',
        userRole: 'DEPARTMENT_HEAD',
        note: 'Assigned to Rapid Drainage Response Unit #4 (Supervisor: B. Rout).'
      },
      {
        id: 'tl_04',
        status: 'IN_PROGRESS',
        timestamp: '2026-10-02T21:35:00Z',
        updatedBy: 'Ranjan Barik (Field Worker)',
        userRole: 'FIELD_WORKER',
        note: 'On site with 500 GPM dewatering suction unit. De-silting main storm drain conduit.'
      }
    ],
    assignedTeamId: 'TEAM_DRAINAGE_04',
    assignedWorkerId: 'field_01',
    assignedWorkerName: 'Ranjan Barik',
    beforePhotoUrl: '',
    createdAt: '2026-10-02T21:15:00Z',
    updatedAt: '2026-10-02T21:35:00Z'
  },
  {
    id: 'cmp_002',
    ticketNo: 'BMC-CNX-2026-0892',
    citizenId: 'cit_user_02',
    citizenName: 'Priyanka Das',
    citizenPhone: '+91-9437012345',
    category: 'Garbage / Solid Waste',
    subcategory: 'Commercial Bin Overflow & Plastic Waste',
    description: 'Huge garbage pile-up near Patia Big Bazaar square attracting stray animals and blocking the pedestrian walkway. Foul smell spreading across residential lane.',
    address: 'Near Big Bazaar Square, Patia Main Road',
    ward: 'Ward 2 (Patia)',
    zone: 'North Zone',
    lat: 20.3588,
    lng: 85.8197,
    status: 'ASSIGNED',
    priority: 'P2_HIGH',
    severity: 'HIGH',
    department: 'Health & Sanitation',
    aiAnalysis: {
      category: 'Garbage / Solid Waste',
      subcategory: 'Commercial Secondary Bin Overflow',
      severity: 'HIGH',
      priority: 'P2_HIGH',
      confidence: 0.91,
      department: 'Health & Sanitation',
      locationIdentified: 'Patia Big Bazaar Square Commercial Area',
      wardEstimated: 'Ward 2 (Patia)',
      zoneEstimated: 'North Zone',
      summary: 'Solid waste heap overflowing secondary dump point, causing health and pedestrian obstruction.',
      recommendedAction: 'Dispatch hydraulic compactor vehicle and 4 sanitation staff for immediate clearing and bleaching powder spray.',
      estimatedResolutionHours: 4
    },
    timeline: [
      {
        id: 'tl_11',
        status: 'SUBMITTED',
        timestamp: '2026-10-02T20:30:00Z',
        updatedBy: 'Priyanka Das (Citizen)',
        userRole: 'CITIZEN',
        note: 'Citizen filed grievance regarding uncollected waste.'
      },
      {
        id: 'tl_12',
        status: 'AI_ANALYSIS',
        timestamp: '2026-10-02T20:30:04Z',
        updatedBy: 'Civic Nexus AI Engine',
        userRole: 'SYSTEM_AI',
        note: 'Classified P2 High priority. Scheduled sanitation route optimization.'
      },
      {
        id: 'tl_13',
        status: 'ASSIGNED',
        timestamp: '2026-10-02T21:00:00Z',
        updatedBy: 'Sanitation Officer North Zone',
        userRole: 'SUPERVISOR',
        note: 'Allocated to Night Shift Compactor Vehicle OD-02-AX-8910.'
      }
    ],
    assignedWorkerId: 'field_02',
    assignedWorkerName: 'Tapan Sethi',
    createdAt: '2026-10-02T20:30:00Z',
    updatedAt: '2026-10-02T21:00:00Z'
  },
  {
    id: 'cmp_003',
    ticketNo: 'BMC-CNX-2026-0885',
    citizenId: 'cit_user_03',
    citizenName: 'Debasis Jena',
    citizenPhone: '+91-9937812934',
    category: 'Electrical & Street Lighting',
    subcategory: 'Dark Corridor / Streetlight Array Outage',
    description: 'All 6 LED streetlights on Saheed Nagar Maharshi College road have been dark for 2 nights, raising safety concerns for students and commuters.',
    address: 'Maharshi College Road, Saheed Nagar',
    ward: 'Ward 25 (Saheed Nagar)',
    zone: 'Central Zone',
    lat: 20.2889,
    lng: 85.8451,
    status: 'RESOLVED',
    priority: 'P3_MEDIUM',
    severity: 'MEDIUM',
    department: 'Electrical & Street Lighting',
    aiAnalysis: {
      category: 'Electrical & Street Lighting',
      subcategory: 'Feeder Pillar MCB Tripped',
      severity: 'MEDIUM',
      priority: 'P3_MEDIUM',
      confidence: 0.96,
      department: 'Electrical & Street Lighting',
      locationIdentified: 'Maharshi College Rd, Saheed Nagar',
      wardEstimated: 'Ward 25 (Saheed Nagar)',
      zoneEstimated: 'Central Zone',
      summary: 'Feeder pillar group failure causing 60m dark corridor.',
      recommendedAction: 'Inspect central feeder breaker switch and replace burnt phase fuse.',
      estimatedResolutionHours: 6
    },
    timeline: [
      {
        id: 'tl_21',
        status: 'SUBMITTED',
        timestamp: '2026-10-02T16:00:00Z',
        updatedBy: 'Debasis Jena (Citizen)',
        userRole: 'CITIZEN',
        note: 'Reported dark corridor.'
      },
      {
        id: 'tl_22',
        status: 'RESOLVED',
        timestamp: '2026-10-02T19:40:00Z',
        updatedBy: 'Prakash Sahoo (Electrical Lineman)',
        userRole: 'FIELD_WORKER',
        note: 'Replaced tripped 63A MCB and replaced 2 blown 90W LED driver modules. Luminance restored.'
      }
    ],
    assignedWorkerName: 'Prakash Sahoo',
    createdAt: '2026-10-02T16:00:00Z',
    updatedAt: '2026-10-02T19:40:00Z'
  },
  {
    id: 'cmp_004',
    ticketNo: 'BMC-CNX-2026-0894',
    citizenId: 'cit_user_04',
    citizenName: 'Manas Ranjan Mishra',
    citizenPhone: '+91-9437199882',
    category: 'Roads & Footpaths',
    subcategory: 'Deep Bitumen Pothole & Cave-in',
    description: 'Deep trench cave-in after pipeline work on Nayapalli Behera Sahi main road. Two bikes skidded today.',
    address: 'Near Behera Sahi Market, Nayapalli',
    ward: 'Ward 15 (Nayapalli)',
    zone: 'Central Zone',
    lat: 20.3015,
    lng: 85.8089,
    status: 'VERIFIED',
    priority: 'P2_HIGH',
    severity: 'HIGH',
    department: 'Engineering & Roads',
    aiAnalysis: {
      category: 'Roads & Footpaths',
      subcategory: 'Post-Excavation Road Trench',
      severity: 'HIGH',
      priority: 'P2_HIGH',
      confidence: 0.92,
      department: 'Engineering & Roads',
      locationIdentified: 'Nayapalli Behera Sahi Road',
      wardEstimated: 'Ward 15 (Nayapalli)',
      zoneEstimated: 'Central Zone',
      summary: 'Post utility trench subsidence presenting acute road accident hazard.',
      recommendedAction: 'Apply barricade warning tape and deploy cold-mix asphalt patch team.',
      estimatedResolutionHours: 8
    },
    timeline: [
      {
        id: 'tl_31',
        status: 'SUBMITTED',
        timestamp: '2026-10-02T21:40:00Z',
        updatedBy: 'Manas Ranjan Mishra',
        userRole: 'CITIZEN',
        note: 'Reported trench hazard.'
      },
      {
        id: 'tl_32',
        status: 'VERIFIED',
        timestamp: '2026-10-02T21:42:00Z',
        updatedBy: 'Assistant Executive Engineer (Roads)',
        userRole: 'DEPARTMENT_HEAD',
        note: 'Verified with engineering unit. Barricades dispatched.'
      }
    ],
    createdAt: '2026-10-02T21:40:00Z',
    updatedAt: '2026-10-02T21:42:00Z'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc_01',
    code: 'INC-BMC-2026-0042',
    title: 'Severe Flash Waterlogging & Traffic Stall at Jayadev Vihar Junction',
    description: 'Intense 65mm/hr cloudburst resulted in stormwater overflow on NH-16 service road and flyover underpass, disrupting north-bound commuter traffic.',
    category: 'Disaster Management & Drainage',
    severity: 'CRITICAL',
    priority: 'P1_CRITICAL',
    status: 'ACTIVE',
    department: 'Disaster Management & Drainage',
    ward: 'Ward 14 (Jayadev Vihar)',
    zone: 'Central Zone',
    lat: 20.2984,
    lng: 85.8192,
    source: 'CCTV_AI',
    affectedServices: ['Traffic Police Division', 'Emergency Ambulance Corridor', 'Engineering Heavy Pumps'],
    cascadeImpact: {
      primaryEvent: 'Cloudburst Stormwater Inundation (65mm/hr) at Jayadev Vihar Underpass',
      downstreamThreats: [
        'Drainage backflow into low-lying Nayapalli Nuasahi housing cluster (400 households)',
        'Vehicular gridlock propagating 2.4 km backwards to Acharya Vihar flyover',
        'Estimated +14 min transit delay for ambulances heading to Capital Hospital / Apollo Hospital'
      ],
      affectedRoads: ['NH-16 Service Road', 'Mayfair Chhak Arterial', 'IRC Village Link Road'],
      mitigationDirectives: [
        'Trigger automated sluice gates on Drainage Channel No. 4',
        'Mobilize 3x diesel high-volume mobile dewatering pumps (BMC Fleet)',
        'Issue digital VMS signage alert on NH-16 diverting traffic via Ekamra Kanan Road'
      ]
    },
    assignedTeamName: 'BMC Rapid Flood Mitigation Squad #1',
    createdAt: '2026-10-02T21:10:00Z',
    updatedAt: '2026-10-02T21:30:00Z'
  },
  {
    id: 'inc_02',
    code: 'INC-BMC-2026-0043',
    title: 'Multi-Vehicle Collision on Rasulgarh Overbridge (NH-16)',
    description: 'Heavy truck brake failure caused 3-vehicle pileup blocking two lanes towards Cuttack.',
    category: 'Enforcement & Public Safety',
    severity: 'HIGH',
    priority: 'P1_CRITICAL',
    status: 'RESOLVING',
    department: 'Enforcement & Public Safety',
    ward: 'Ward 8 (Mancheswar)',
    zone: 'North Zone',
    lat: 20.3014,
    lng: 85.8645,
    source: 'CCTV_AI',
    affectedServices: ['Traffic Police Commissionerate', 'Odisha Fire Services (Hydraulic Cutter)', '108 Ambulance Service'],
    assignedTeamName: 'Traffic Rescue Unit 7 & Kalpana Fire Tender',
    createdAt: '2026-10-02T21:05:00Z',
    updatedAt: '2026-10-02T21:25:00Z'
  }
];

export const INITIAL_EMERGENCY_CASES: EmergencyCase[] = [
  {
    id: 'emg_01',
    caseNo: '112-BMC-EMG-7701',
    emergencyType: 'FLOOD',
    title: 'Waterlogging Inundation with Trapped City Bus at Jayadev Vihar',
    description: 'Mo Bus #22 engine flooded with 35 passengers on board near Mayfair junction.',
    location: 'Near Mayfair Lagoon Chhak, Jayadev Vihar',
    ward: 'Ward 14 (Jayadev Vihar)',
    zone: 'Central Zone',
    lat: 20.2984,
    lng: 85.8192,
    severity: 'CRITICAL',
    status: 'DISPATCHED',
    nearestHospital: 'Apollo Hospitals Bhubaneswar (2.1 km)',
    nearestFireStation: 'Secretariat Fire Station (3.2 km)',
    nearestAmbulance: 'Ambulance Unit OD-02-AM-1081 (0.8 km away)',
    suggestedRoute: 'Via Sainik School - Acharya Vihar bypass (clear of waterlogging)',
    etaMinutes: 6,
    hospitalBedAvailability: {
      hospitalName: 'Apollo Hospitals Bhubaneswar',
      icuAvailable: 8,
      emergencyBeds: 14,
      traumaCenterReady: true
    },
    humanApproved: true,
    approvedBy: 'Dr. A. K. Patnaik (Chief Emergency Dispatcher, 112 Command)',
    assignedResponders: [
      { agency: 'Odisha Fire Services', unitId: 'Fire Rescue Inflatable Boat Unit 2', status: 'En Route', contact: '101' },
      { agency: '108 Emergency Medical', unitId: 'Advanced Life Support Ambulance #14', status: 'On Scene', contact: '108' },
      { agency: 'Traffic Police', unitId: 'Jayadev Vihar Outpost Patrol #3', status: 'Securing Perimeter', contact: '+91-674-2390112' }
    ],
    createdAt: '2026-10-02T21:20:00Z',
    updatedAt: '2026-10-02T21:32:00Z'
  },
  {
    id: 'emg_02',
    caseNo: '112-BMC-EMG-7702',
    emergencyType: 'ROAD_ACCIDENT',
    title: 'Motorcycle & Delivery Van Collision at Khandagiri Square',
    description: 'Two injured riders requiring trauma assistance. Traffic halted on South-West artery.',
    location: 'Khandagiri Chhak, Near AMRI Hospital',
    ward: 'Ward 58 (Khandagiri)',
    zone: 'South-West Zone',
    lat: 20.2589,
    lng: 85.7785,
    severity: 'HIGH',
    status: 'ON_SCENE',
    nearestHospital: 'AMRI Hospital Khandagiri (0.4 km)',
    nearestFireStation: 'Tamando Fire Station (4.1 km)',
    nearestAmbulance: 'AMRI Emergency ALS Unit #2',
    suggestedRoute: 'Direct link via Khandagiri Main Road (Green Corridor active)',
    etaMinutes: 2,
    hospitalBedAvailability: {
      hospitalName: 'AMRI Hospital Khandagiri',
      icuAvailable: 5,
      emergencyBeds: 9,
      traumaCenterReady: true
    },
    humanApproved: true,
    approvedBy: 'S. N. Mohanty (Emergency Controller)',
    assignedResponders: [
      { agency: '108 Ambulance', unitId: 'ALS-Khandagiri-02', status: 'Treating on Scene', contact: '108' },
      { agency: 'Traffic Police', unitId: 'Khandagiri Traffic PCR', status: 'Managing Flow', contact: '112' }
    ],
    createdAt: '2026-10-02T21:40:00Z',
    updatedAt: '2026-10-02T21:48:00Z'
  }
];

export const INITIAL_FIELD_TASKS: FieldTask[] = [
  {
    id: 'tsk_01',
    complaintId: 'cmp_001',
    ticketNo: 'BMC-CNX-2026-0891',
    workerId: 'field_01',
    workerName: 'Ranjan Barik',
    workerPhone: '+91-9861001122',
    department: 'Disaster Management & Drainage',
    title: 'Deploy High-Volume Mobile Pump at Jayadev Vihar Underpass',
    description: 'Clear stormwater accumulation and de-silt inlet box culvert near Pal Heights service lane.',
    status: 'ON_SITE',
    priority: 'P1_CRITICAL',
    ward: 'Ward 14 (Jayadev Vihar)',
    zone: 'Central Zone',
    location: 'Service Road, Near Pal Heights, Jayadev Vihar',
    lat: 20.2984,
    lng: 85.8192,
    beforePhotoUrl: '',
    workerNotes: 'Suction line connected to Drain No. 4. Discharge rate 480 gallons/min. Water level receding by 4 inches every 15 mins.',
    startedAt: '2026-10-02T21:35:00Z',
    createdAt: '2026-10-02T21:20:00Z',
    updatedAt: '2026-10-02T21:35:00Z'
  },
  {
    id: 'tsk_02',
    complaintId: 'cmp_002',
    ticketNo: 'BMC-CNX-2026-0892',
    workerId: 'field_02',
    workerName: 'Tapan Sethi',
    workerPhone: '+91-9778003344',
    department: 'Health & Sanitation',
    title: 'Commercial Waste Clearance & Bin Sanitization at Patia Square',
    description: 'Clear overflowing secondary bin, spray sodium hypochlorite and disinfect surrounding perimeter.',
    status: 'ASSIGNED',
    priority: 'P2_HIGH',
    ward: 'Ward 2 (Patia)',
    zone: 'North Zone',
    location: 'Near Big Bazaar Square, Patia Main Road',
    lat: 20.3588,
    lng: 85.8197,
    createdAt: '2026-10-02T21:00:00Z',
    updatedAt: '2026-10-02T21:00:00Z'
  }
];

export const INITIAL_CAMERA_EVENTS: CameraEvent[] = [
  {
    id: 'cam_evt_01',
    cameraCode: 'CAM-01-JVH',
    locationName: 'Jayadev Vihar Flyover North Underpass',
    ward: 'Ward 14 (Jayadev Vihar)',
    lat: 20.2984,
    lng: 85.8192,
    eventType: 'WATERLOGGING',
    confidence: 0.96,
    severity: 'CRITICAL',
    status: 'ACTIONED',
    incidentId: 'inc_01',
    timestamp: '2026-10-02T21:08:00Z'
  },
  {
    id: 'cam_evt_02',
    cameraCode: 'CAM-05-RSG',
    locationName: 'Rasulgarh Overbridge Junction (Cuttack Flank)',
    ward: 'Ward 8 (Mancheswar)',
    lat: 20.3014,
    lng: 85.8645,
    eventType: 'ROAD_ACCIDENT',
    confidence: 0.94,
    severity: 'HIGH',
    status: 'ACTIONED',
    incidentId: 'inc_02',
    timestamp: '2026-10-02T21:04:00Z'
  },
  {
    id: 'cam_evt_03',
    cameraCode: 'CAM-08-PAT',
    locationName: 'KIIT Square & Patia Commercial Hub',
    ward: 'Ward 2 (Patia)',
    lat: 20.3588,
    lng: 85.8197,
    eventType: 'GARBAGE_DUMP',
    confidence: 0.89,
    severity: 'MEDIUM',
    status: 'VERIFIED',
    timestamp: '2026-10-02T20:28:00Z'
  },
  {
    id: 'cam_evt_04',
    cameraCode: 'CAM-03-MCN',
    locationName: 'Master Canteen Bus Stand & Railway Approach',
    ward: 'Ward 30 (Kharavela Nagar)',
    lat: 20.2685,
    lng: 85.8398,
    eventType: 'CROWD_SURGE',
    confidence: 0.88,
    severity: 'MEDIUM',
    status: 'DETECTED',
    timestamp: '2026-10-02T21:42:00Z'
  }
];

export const DEMO_USERS = [
  { email: 'citizen@demo.local', name: 'Subham Pradhan', role: 'CITIZEN', department: 'Citizen Services', ward: 'Ward 14 (Jayadev Vihar)', zone: 'Central Zone' },
  { email: 'admin@demo.local', name: 'Dr. Rajesh Verma, IAS', role: 'BMC_ADMIN', department: 'BMC Administration', ward: 'All Wards', zone: 'All Zones' },
  { email: 'commissioner@demo.local', name: 'Commissioner BMC', role: 'COMMISSIONER', department: 'Executive Directorate', ward: 'All Wards', zone: 'All Zones' },
  { email: 'engineering@demo.local', name: 'Er. Asit Tripathy', role: 'DEPARTMENT_HEAD', department: 'Engineering & Roads', ward: 'Central Zone', zone: 'Central Zone' },
  { email: 'sanitation@demo.local', name: 'Dr. Sneha Mohanty', role: 'DEPARTMENT_HEAD', department: 'Health & Sanitation', ward: 'North Zone', zone: 'North Zone' },
  { email: 'disaster@demo.local', name: 'Er. Debabrata Jena', role: 'DEPARTMENT_HEAD', department: 'Disaster Management & Drainage', ward: 'All Wards', zone: 'All Zones' },
  { email: 'supervisor@demo.local', name: 'Balaram Rout', role: 'SUPERVISOR', department: 'Disaster Management & Drainage', ward: 'Ward 14 (Jayadev Vihar)', zone: 'Central Zone' },
  { email: 'fieldworker@demo.local', name: 'Ranjan Barik', role: 'FIELD_WORKER', department: 'Disaster Management & Drainage', ward: 'Ward 14 (Jayadev Vihar)', zone: 'Central Zone' },
  { email: 'emergency@demo.local', name: 'Commander R. K. Nayak', role: 'EMERGENCY_OPERATOR', department: 'Emergency Control Room 112', ward: 'Citywide', zone: 'All Zones' },
  { email: 'hospital@demo.local', name: 'Dr. Sujata Ray (Capital Hosp)', role: 'HOSPITAL_OPERATOR', department: 'Capital Hospital Trauma Desk', ward: 'Ward 36 (Unit-6)', zone: 'Central Zone' },
  { email: 'traffic@demo.local', name: 'ACP Traffic Bhubaneswar', role: 'TRAFFIC_OPERATOR', department: 'Traffic Control Command', ward: 'Citywide', zone: 'All Zones' },
  { email: 'tourism@demo.local', name: 'Pooja Samantaray', role: 'TOURISM_OPERATOR', department: 'Odisha Tourism / BMC Smart Tourism', ward: 'Ward 45 (Old Town)', zone: 'South-West Zone' },
  { email: 'analyst@demo.local', name: 'Kunal Senapati', role: 'ANALYST', department: 'Data Intelligence Unit', ward: 'Citywide', zone: 'All Zones' },
  { email: 'sysadmin@demo.local', name: 'System Security Lead', role: 'SYSTEM_ADMIN', department: 'IT & Special Projects', ward: 'Citywide', zone: 'All Zones' }
];
