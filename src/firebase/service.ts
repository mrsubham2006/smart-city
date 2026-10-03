import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from './config';
import {
  Complaint,
  Incident,
  EmergencyCase,
  FieldTask,
  CameraEvent,
  NotificationItem,
  AuditLog,
  UserProfile
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_INCIDENTS,
  INITIAL_EMERGENCY_CASES,
  INITIAL_FIELD_TASKS,
  INITIAL_CAMERA_EVENTS
} from '../services/bhubaneswarData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[Civic Nexus AI] Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// In-Memory state sync fallback when offline or pre-auth to guarantee 100% demo resilience
let localComplaints: Complaint[] = [...INITIAL_COMPLAINTS];
let localIncidents: Incident[] = [...INITIAL_INCIDENTS];
let localEmergency: EmergencyCase[] = [...INITIAL_EMERGENCY_CASES];
let localFieldTasks: FieldTask[] = [...INITIAL_FIELD_TASKS];
let localCameraEvents: CameraEvent[] = [...INITIAL_CAMERA_EVENTS];
let localNotifications: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Flash Waterlogging Alert: Jayadev Vihar',
    message: 'High precipitation detected at Ward 14. Dewatering pumps active. Traffic diversion initiated.',
    type: 'CRITICAL',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif_02',
    title: 'Work Order Assigned: BMC-CNX-2026-0891',
    message: 'Rapid drainage squad deployed to Mayfair Service Road.',
    type: 'INFO',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
];
let localAuditLogs: AuditLog[] = [
  {
    id: 'aud_01',
    userId: 'admin@demo.local',
    userName: 'Dr. Rajesh Verma, IAS',
    userRole: 'BMC_ADMIN',
    action: 'DISPATCH_APPROVED',
    entityType: 'EMERGENCY',
    entityId: 'emg_01',
    details: 'Approved multi-agency flood rescue team at Jayadev Vihar',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: 'aud_02',
    userId: 'system_ai',
    userName: 'Civic Nexus AI',
    userRole: 'SYSTEM_AI',
    action: 'AUTO_TRIAGE_COMPLAINT',
    entityType: 'COMPLAINT',
    entityId: 'cmp_001',
    details: 'Classified flood report as P1_CRITICAL (94% confidence)',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

// --- AUDIT LOGS ---
export async function logAuditEvent(action: string, entityType: AuditLog['entityType'], entityId: string, details: string, user?: { id: string; name: string; role: string }) {
  const newLog: AuditLog = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId: user?.id || auth.currentUser?.uid || 'guest_user',
    userName: user?.name || auth.currentUser?.displayName || 'Citizen Reporter',
    userRole: user?.role || 'CITIZEN',
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString()
  };

  localAuditLogs = [newLog, ...localAuditLogs];

  if (auth.currentUser) {
    const path = 'audit_logs';
    try {
      await setDoc(doc(db, path, newLog.id), newLog);
    } catch (e) {
      console.warn('Audit log write to firestore caught fallback:', e);
    }
  }
}

// --- COMPLAINTS SERVICE ---
export function subscribeComplaints(callback: (complaints: Complaint[]) => void): Unsubscribe {
  const path = 'complaints';
  try {
    const q = query(collection(db, path), orderBy('updatedAt', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Complaint);
          localComplaints = list;
          callback(list);
        } else {
          callback(localComplaints);
        }
      },
      (error) => {
        console.warn('Firestore complaints live-listener fallback to local sync:', error.message);
        callback(localComplaints);
      }
    );
  } catch (error) {
    console.warn('subscribeComplaints fallback:', error);
    callback(localComplaints);
    return () => {};
  }
}

export async function saveComplaint(complaint: Complaint): Promise<Complaint> {
  const existingIdx = localComplaints.findIndex(c => c.id === complaint.id);
  if (existingIdx >= 0) {
    localComplaints[existingIdx] = complaint;
  } else {
    localComplaints = [complaint, ...localComplaints];
  }

  // Also auto-create field task if assigned to a worker
  if (complaint.assignedWorkerName && (complaint.status === 'ASSIGNED' || complaint.status === 'IN_PROGRESS')) {
    const existingTask = localFieldTasks.find(t => t.complaintId === complaint.id);
    if (!existingTask) {
      const newTask: FieldTask = {
        id: `tsk_${Date.now()}`,
        complaintId: complaint.id,
        ticketNo: complaint.ticketNo,
        workerId: complaint.assignedWorkerId || 'field_01',
        workerName: complaint.assignedWorkerName,
        department: complaint.department,
        title: `Grievance Resolution: ${complaint.category} at ${complaint.ward}`,
        description: complaint.description,
        status: 'ASSIGNED',
        priority: complaint.priority,
        ward: complaint.ward,
        zone: complaint.zone,
        location: complaint.address,
        lat: complaint.lat,
        lng: complaint.lng,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localFieldTasks = [newTask, ...localFieldTasks];
    }
  }

  if (auth.currentUser) {
    const path = 'complaints';
    try {
      await setDoc(doc(db, path, complaint.id), complaint);
    } catch (e) {
      console.warn('Firestore complaint save fallback to memory:', e);
    }
  }

  await logAuditEvent(
    existingIdx >= 0 ? `UPDATE_COMPLAINT_${complaint.status}` : 'SUBMIT_COMPLAINT',
    'COMPLAINT',
    complaint.id,
    `Complaint ${complaint.ticketNo} (${complaint.category}) set to ${complaint.status}`
  );

  return complaint;
}

// --- INCIDENTS SERVICE ---
export function subscribeIncidents(callback: (incidents: Incident[]) => void): Unsubscribe {
  const path = 'incidents';
  try {
    const q = query(collection(db, path), orderBy('updatedAt', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Incident);
          localIncidents = list;
          callback(list);
        } else {
          callback(localIncidents);
        }
      },
      () => {
        callback(localIncidents);
      }
    );
  } catch {
    callback(localIncidents);
    return () => {};
  }
}

export async function saveIncident(incident: Incident): Promise<Incident> {
  const existingIdx = localIncidents.findIndex(i => i.id === incident.id);
  if (existingIdx >= 0) {
    localIncidents[existingIdx] = incident;
  } else {
    localIncidents = [incident, ...localIncidents];
  }

  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'incidents', incident.id), incident);
    } catch (e) {
      console.warn('Incident write fallback to local state:', e);
    }
  }

  await logAuditEvent('SAVE_INCIDENT', 'INCIDENT', incident.id, `Incident ${incident.code} updated (${incident.status})`);
  return incident;
}

// --- EMERGENCY CASES SERVICE ---
export function subscribeEmergencyCases(callback: (cases: EmergencyCase[]) => void): Unsubscribe {
  const path = 'emergency_cases';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as EmergencyCase);
          localEmergency = list;
          callback(list);
        } else {
          callback(localEmergency);
        }
      },
      () => {
        callback(localEmergency);
      }
    );
  } catch {
    callback(localEmergency);
    return () => {};
  }
}

export async function saveEmergencyCase(emergency: EmergencyCase): Promise<EmergencyCase> {
  const existingIdx = localEmergency.findIndex(e => e.id === emergency.id);
  if (existingIdx >= 0) {
    localEmergency[existingIdx] = emergency;
  } else {
    localEmergency = [emergency, ...localEmergency];
  }

  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'emergency_cases', emergency.id), emergency);
    } catch (e) {
      console.warn('Emergency case write fallback:', e);
    }
  }

  await logAuditEvent('EMERGENCY_ACTION', 'EMERGENCY', emergency.id, `Emergency Case ${emergency.caseNo} status changed to ${emergency.status}`);
  return emergency;
}

// --- FIELD TASKS SERVICE ---
export function subscribeFieldTasks(callback: (tasks: FieldTask[]) => void): Unsubscribe {
  const path = 'field_tasks';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as FieldTask);
          localFieldTasks = list;
          callback(list);
        } else {
          callback(localFieldTasks);
        }
      },
      () => {
        callback(localFieldTasks);
      }
    );
  } catch {
    callback(localFieldTasks);
    return () => {};
  }
}

export async function saveFieldTask(task: FieldTask): Promise<FieldTask> {
  const existingIdx = localFieldTasks.findIndex(t => t.id === task.id);
  if (existingIdx >= 0) {
    localFieldTasks[existingIdx] = task;
  } else {
    localFieldTasks = [task, ...localFieldTasks];
  }

  // If resolved, sync back to related complaint
  if (task.complaintId && task.status === 'RESOLVED') {
    const cmp = localComplaints.find(c => c.id === task.complaintId);
    if (cmp) {
      cmp.status = 'RESOLVED';
      cmp.updatedAt = new Date().toISOString();
      cmp.beforePhotoUrl = task.beforePhotoUrl || cmp.beforePhotoUrl;
      cmp.afterPhotoUrl = task.afterPhotoUrl || cmp.afterPhotoUrl;
      cmp.fieldNotes = task.workerNotes;
      cmp.timeline.push({
        id: `tl_${Date.now()}`,
        status: 'RESOLVED',
        timestamp: new Date().toISOString(),
        updatedBy: `${task.workerName} (Field Worker)`,
        userRole: 'FIELD_WORKER',
        note: `Work completed on site. Proof of resolution uploaded. ${task.workerNotes || ''}`
      });
      await saveComplaint(cmp);
    }
  }

  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'field_tasks', task.id), task);
    } catch (e) {
      console.warn('Field task write fallback:', e);
    }
  }

  await logAuditEvent('FIELD_TASK_UPDATE', 'FIELD_TASK', task.id, `Task ${task.title} updated by ${task.workerName} to ${task.status}`);
  return task;
}

export const updateFieldTask = saveFieldTask;

// --- CAMERA EVENTS SERVICE ---
export function subscribeCameraEvents(callback: (events: CameraEvent[]) => void): Unsubscribe {
  const path = 'camera_events';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as CameraEvent);
          localCameraEvents = list;
          callback(list);
        } else {
          callback(localCameraEvents);
        }
      },
      () => {
        callback(localCameraEvents);
      }
    );
  } catch {
    callback(localCameraEvents);
    return () => {};
  }
}

export async function addCameraEvent(event: CameraEvent): Promise<CameraEvent> {
  localCameraEvents = [event, ...localCameraEvents];
  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'camera_events', event.id), event);
    } catch (e) {
      console.warn('Camera event write fallback:', e);
    }
  }
  return event;
}

// --- NOTIFICATIONS & AUDIT LOGS ---
export function subscribeNotifications(callback: (notifications: NotificationItem[]) => void): Unsubscribe {
  callback(localNotifications);
  return () => {};
}

export function subscribeAuditLogs(callback: (logs: AuditLog[]) => void): Unsubscribe {
  callback(localAuditLogs);
  return () => {};
}

export function addNotification(title: string, message: string, type: NotificationItem['type'] = 'INFO') {
  const newNotif: NotificationItem = {
    id: `notif_${Date.now()}`,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  localNotifications = [newNotif, ...localNotifications];
}
