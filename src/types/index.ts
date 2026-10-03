export type UserRole =
  | 'CITIZEN'
  | 'BMC_ADMIN'
  | 'COMMISSIONER'
  | 'ZONE_OFFICER'
  | 'DEPARTMENT_HEAD'
  | 'SUPERVISOR'
  | 'FIELD_WORKER'
  | 'EMERGENCY_OPERATOR'
  | 'HOSPITAL_OPERATOR'
  | 'TRAFFIC_OPERATOR'
  | 'FIRE_OPERATOR'
  | 'TOURISM_OPERATOR'
  | 'ANALYST'
  | 'SYSTEM_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  ward?: string;
  zone?: 'North Zone' | 'Central Zone' | 'South-West Zone' | 'All Zones';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLogin: string;
}

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'AI_ANALYSIS'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'FIELD_VERIFICATION'
  | 'RESOLVED'
  | 'CITIZEN_CONFIRMED'
  | 'CLOSED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'ESCALATED';

export type PriorityLevel = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  userRole: string;
  note: string;
  evidenceUrl?: string;
}

export interface AIAnalysisResult {
  category: string;
  subcategory: string;
  severity: SeverityLevel;
  priority: PriorityLevel;
  confidence: number;
  department: string;
  locationIdentified: string;
  wardEstimated: string;
  zoneEstimated: string;
  summary: string;
  recommendedAction: string;
  estimatedResolutionHours: number;
  duplicateCandidateId?: string;
  duplicateSimilarityScore?: number;
  cascadeRisks?: string[];
}

export interface Complaint {
  id: string;
  ticketNo: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  category: string;
  subcategory: string;
  description: string;
  photoUrl?: string;
  voiceUrl?: string;
  address: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
  status: ComplaintStatus;
  priority: PriorityLevel;
  severity: SeverityLevel;
  department: string;
  aiAnalysis?: AIAnalysisResult;
  timeline: TimelineEvent[];
  assignedTeamId?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  fieldNotes?: string;
  citizenFeedback?: {
    confirmed: boolean;
    rating?: number;
    comment?: string;
    confirmedAt?: string;
  };
  reopenReason?: string;
  duplicateOfId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  severity: SeverityLevel;
  priority: PriorityLevel;
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVING' | 'RESOLVED' | 'CLOSED';
  department: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
  source: 'CITIZEN_REPORT' | 'CCTV_AI' | 'IOT_SENSOR' | 'FIELD_PATROL' | 'TRAFFIC_FEED';
  affectedServices: string[];
  cascadeImpact?: {
    primaryEvent: string;
    downstreamThreats: string[];
    affectedRoads: string[];
    mitigationDirectives: string[];
  };
  assignedTeamId?: string;
  assignedTeamName?: string;
  complaintIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyCase {
  id: string;
  caseNo: string;
  emergencyType: 'FIRE' | 'ROAD_ACCIDENT' | 'MEDICAL_EMERGENCY' | 'FLOOD' | 'BUILDING_INCIDENT' | 'PUBLIC_SAFETY';
  title: string;
  description: string;
  location: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
  severity: SeverityLevel;
  status: 'REPORTED' | 'DISPATCHED' | 'ON_SCENE' | 'RESOLVED' | 'CLOSED';
  nearestHospital: string;
  nearestFireStation: string;
  nearestAmbulance: string;
  suggestedRoute: string;
  etaMinutes: number;
  hospitalBedAvailability: {
    hospitalName: string;
    icuAvailable: number;
    emergencyBeds: number;
    traumaCenterReady: boolean;
  };
  humanApproved: boolean;
  approvedBy?: string;
  assignedResponders: {
    agency: string;
    unitId: string;
    status: string;
    contact: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FieldTask {
  id: string;
  complaintId?: string;
  incidentId?: string;
  ticketNo: string;
  workerId: string;
  workerName: string;
  workerPhone?: string;
  department: string;
  title: string;
  description: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'ON_SITE' | 'RESOLVED' | 'REJECTED';
  priority: PriorityLevel;
  ward: string;
  zone: string;
  location: string;
  lat: number;
  lng: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  workerNotes?: string;
  startedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CameraEvent {
  id: string;
  cameraCode: string;
  locationName: string;
  ward: string;
  lat: number;
  lng: number;
  eventType: 'WATERLOGGING' | 'ROAD_ACCIDENT' | 'TRAFFIC_STALL' | 'GARBAGE_DUMP' | 'FIRE_HAZARD' | 'STRAY_CATTLE' | 'CROWD_SURGE';
  confidence: number;
  severity: SeverityLevel;
  snapshotUrl?: string;
  videoPreviewUrl?: string;
  status: 'DETECTED' | 'VERIFIED' | 'ACTIONED' | 'DISMISSED';
  incidentId?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget?: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'COMPLAINT' | 'INCIDENT' | 'EMERGENCY' | 'FIELD_TASK' | 'USER_ROLE' | 'SYSTEM_SETTING';
  entityId: string;
  details: string;
  previousState?: string;
  newState?: string;
  timestamp: string;
}

export interface TourismPlace {
  id: string;
  name: string;
  category: 'HERITAGE_TEMPLE' | 'MUSEUM' | 'CAVES' | 'PARK_ZOO' | 'CULTURE_CRAFTS' | 'FOOD_MARKET';
  ward: string;
  address: string;
  lat: number;
  lng: number;
  timings: string;
  entryFee: string;
  crowdLevel: 'LOW' | 'MODERATE' | 'BUSY' | 'VERY_BUSY';
  weatherSuitability: string;
  description: string;
  highlights: string[];
  audioGuideSummary: string;
  imageUrl?: string;
}

export interface WardInfo {
  wardNo: number;
  name: string;
  zone: 'North Zone' | 'Central Zone' | 'South-West Zone';
  corporatorName: string;
  keyLandmarks: string[];
  vulnerabilityIndex: 'HIGH' | 'MEDIUM' | 'LOW';
  activeComplaintsCount: number;
  lat: number;
  lng: number;
}
