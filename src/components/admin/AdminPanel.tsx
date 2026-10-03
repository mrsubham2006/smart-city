import React, { useState } from 'react';
import {
  Lock,
  Users,
  Shield,
  Key,
  Server,
  Cpu,
  ScrollText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  UserCheck,
  Building2,
  XCircle,
  Clock,
  UserPlus
} from 'lucide-react';
import { DEMO_USERS, BHUBANESWAR_DEPARTMENTS, BHUBANESWAR_WARDS } from '../../services/bhubaneswarData';
import { logAuditEvent, addNotification } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { PattachitraDivider } from '../common/PattachitraDivider';

interface AdminPanelProps {
  onOpenQaModal: () => void;
  onNavigate: (path: string) => void;
}

interface PendingStaffRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  requestedRole: UserRole;
  requestedDepartment: string;
  employeeGovId: string;
  zone: string;
  ward: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_PENDING_REQUESTS: PendingStaffRequest[] = [
  {
    id: 'req_01',
    name: 'Er. Alok Das',
    email: 'alok.das@bhubaneswar.gov.in',
    phone: '+91 94371 88990',
    requestedRole: 'DEPARTMENT_HEAD',
    requestedDepartment: 'Engineering & Roads',
    employeeGovId: 'BMC-ENG-2026-88',
    zone: 'Central Zone',
    ward: 'Ward 14 (Jayadev Vihar)',
    submittedAt: '2026-10-02T18:45:00Z',
    status: 'PENDING'
  },
  {
    id: 'req_02',
    name: 'Sushant Jena',
    email: 'sushant.squad@bmc.gov.in',
    phone: '+91 94372 11223',
    requestedRole: 'FIELD_WORKER',
    requestedDepartment: 'Disaster Management & Drainage',
    employeeGovId: 'SQUAD-FLW-902',
    zone: 'North Zone',
    ward: 'Ward 2 (Patia)',
    submittedAt: '2026-10-02T19:10:00Z',
    status: 'PENDING'
  },
  {
    id: 'req_03',
    name: 'Dr. Pritam Pattnaik',
    email: 'p.pattnaik@health.odisha.gov.in',
    phone: '+91 94370 55667',
    requestedRole: 'HOSPITAL_OPERATOR',
    requestedDepartment: 'Capital Hospital Trauma Desk',
    employeeGovId: 'MED-CAP-404',
    zone: 'Central Zone',
    ward: 'Ward 36 (Unit-6)',
    submittedAt: '2026-10-02T19:50:00Z',
    status: 'PENDING'
  }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onOpenQaModal,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'users' | 'approvals' | 'security' | 'ai'>('users');
  const [pendingRequests, setPendingRequests] = useState<PendingStaffRequest[]>(INITIAL_PENDING_REQUESTS);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredUsers = DEMO_USERS.filter(
    u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveStaff = async (req: PendingStaffRequest) => {
    setPendingRequests(prev =>
      prev.map(item => (item.id === req.id ? { ...item, status: 'APPROVED' } : item))
    );

    await logAuditEvent(
      'APPROVE_STAFF_ACCOUNT',
      'USER_ROLE',
      req.id,
      `Administrator ${currentUser?.name || 'System Admin'} approved ${req.name} as ${req.requestedRole} in ${req.requestedDepartment}`
    );

    addNotification(
      'STAFF ONBOARDING APPROVED',
      `Account for ${req.name} (${req.requestedRole}) has been authorized.`,
      'SUCCESS'
    );

    setSuccessToast(`Account approved for ${req.name} (${req.requestedRole})`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleRejectStaff = async (req: PendingStaffRequest) => {
    setPendingRequests(prev =>
      prev.map(item => (item.id === req.id ? { ...item, status: 'REJECTED' } : item))
    );

    await logAuditEvent(
      'REJECT_STAFF_ACCOUNT',
      'USER_ROLE',
      req.id,
      `Administrator ${currentUser?.name || 'System Admin'} rejected onboarding request for ${req.name}`
    );

    setSuccessToast(`Onboarding request rejected for ${req.name}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const pendingCount = pendingRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#211E1B] text-[#F7F1E5] border border-[#3D3732] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#3D3732] border border-[#B8543A]/60 flex items-center justify-center text-[#B8543A] shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#3D3732] text-[#C58B3A] border border-[#5A524A] font-mono text-[10px] font-bold">
                ROOT SYSTEM ADMINISTRATION
              </span>
              <span className="text-xs text-[#D8C7AA]">Security Directorate & User RBAC Governance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F1E5] tracking-tight mt-0.5">
              Civic Nexus System Administration
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#3D3732] border border-[#5A524A] text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-[#B8543A] text-white shadow-xs' : 'text-[#D8C7AA] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === 'approvals' ? 'bg-[#B8543A] text-white shadow-xs' : 'text-[#D8C7AA] hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Staff Approvals</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#B83A32] text-white text-[9px] font-mono font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security' ? 'bg-[#B8543A] text-white shadow-xs' : 'text-[#D8C7AA] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security & RBAC</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai' ? 'bg-[#B8543A] text-white shadow-xs' : 'text-[#D8C7AA] hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Config</span>
          </button>
          <button
            onClick={onOpenQaModal}
            className="px-3.5 py-1.5 rounded-lg text-[#C58B3A] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>QA Health</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-[#5C765A]/15 border border-[#5C765A]/40 text-xs text-[#5C765A] font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tab 1: User Directory */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2D7C3]">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#211E1B]">Authorized Staff & Citizen Directory</h3>
              <p className="text-xs text-[#81786D]">Provisioned administrative, operational and citizen user records</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#81786D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff, role, email..."
                className="pl-9 pr-4 py-1.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs text-[#211E1B] focus:border-[#B8543A] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F1E5] border-b border-[#E2D7C3] text-[#81786D] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Official Name</th>
                  <th className="p-3">Role Code</th>
                  <th className="p-3">Assigned Department</th>
                  <th className="p-3">Jurisdiction / Ward</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8D9]">
                {filteredUsers.map((u, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F1E5]/50 transition-colors">
                    <td className="p-3 font-semibold text-[#211E1B]">
                      <div>{u.name}</div>
                      <div className="text-[11px] font-mono text-[#81786D] font-normal">{u.email}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#F7F1E5] border border-[#E2D7C3] text-[#B8543A] font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-[#211E1B]">{u.department}</td>
                    <td className="p-3 text-[#81786D]">{u.ward} ({u.zone})</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[#5C765A] font-mono text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        PROVISIONED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Staff Onboarding & Account Approvals */}
      {activeTab === 'approvals' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-5 shadow-sm">
          <div>
            <h3 className="font-serif font-bold text-base text-[#211E1B]">
              Staff Account Onboarding & Verification Queue
            </h3>
            <p className="text-xs text-[#81786D]">
              Review government identity credentials, assign official roles, departments, and wards before activating municipal access.
            </p>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  req.status === 'APPROVED'
                    ? 'bg-[#5C765A]/5 border-[#5C765A]/40'
                    : req.status === 'REJECTED'
                    ? 'bg-[#B83A32]/5 border-[#B83A32]/30 opacity-60'
                    : 'bg-[#F7F1E5] border-[#E2D7C3]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#211E1B]">{req.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2D7C3] font-mono text-[10px] text-[#B8543A] font-bold">
                        {req.employeeGovId}
                      </span>
                    </div>
                    <p className="text-xs text-[#81786D]">
                      {req.email} · {req.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold ${
                        req.status === 'APPROVED'
                          ? 'bg-[#5C765A] text-white'
                          : req.status === 'REJECTED'
                          ? 'bg-[#B83A32] text-white'
                          : 'bg-[#C58B3A] text-white'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[#FFFFFF] p-3 rounded-lg border border-[#E2D7C3]">
                  <div>
                    <span className="text-[10px] font-mono text-[#81786D] block">REQUESTED ROLE</span>
                    <strong className="text-[#211E1B]">{req.requestedRole}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#81786D] block">DEPARTMENT</span>
                    <strong className="text-[#211E1B]">{req.requestedDepartment}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#81786D] block">ASSIGNED JURISDICTION</span>
                    <strong className="text-[#211E1B]">{req.ward} ({req.zone})</strong>
                  </div>
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleRejectStaff(req)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#FDF2F1] text-[#B83A32] border border-[#B83A32]/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Request</span>
                    </button>
                    <button
                      onClick={() => handleApproveStaff(req)}
                      className="px-4 py-1.5 rounded-lg bg-[#5C765A] hover:bg-[#4E644C] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve & Provision Credentials</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & RBAC Policies */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-sm text-[#211E1B]">Firestore Security Rules Summary</h3>
            <p className="text-xs text-[#81786D]">Hardened RBAC rules deployed to Firestore backend</p>
            <div className="space-y-2 text-xs font-mono bg-[#211E1B] text-[#F7F1E5] p-4 rounded-xl">
              <p className="text-[#5C765A]">// Rules Version 2 Hardened Security</p>
              <p>Default Deny: match /&#123;document=**&#125; &#123; allow read, write: if false; &#125;</p>
              <p>Complaints: read if isSignedIn(), write if citizen or staff</p>
              <p>Incidents: read all, write only BMC_ADMIN, COMMISSIONER, EMERGENCY_OPERATOR</p>
              <p>FieldTasks: write restricted to SUPERVISOR, FIELD_WORKER</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-sm text-[#211E1B]">Audit Trail & Access Governance</h3>
            <p className="text-xs text-[#81786D]">Immutable logs recorded for all administrative dispatch actions</p>
            <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#81786D]">Audit Stream:</span>
                <span className="font-mono text-[#5C765A] font-bold">ACTIVE (0 Latency)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#81786D]">Session Lifetime:</span>
                <span className="font-mono text-[#211E1B]">8 Hours Token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#81786D]">Multi-Factor Auth:</span>
                <span className="font-mono text-[#211E1B]">Firebase Auth Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Configuration */}
      {activeTab === 'ai' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-sm text-[#211E1B]">Gemini AI Engine Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
              <span className="text-[10px] font-mono text-[#81786D]">TRIAGE MODEL</span>
              <p className="font-bold text-[#B8543A]">gemini-2.5-flash</p>
              <p className="text-[11px] text-[#81786D]">Multimodal photo, voice, category extraction</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
              <span className="text-[10px] font-mono text-[#81786D]">CASCADE INTELLIGENCE</span>
              <p className="font-bold text-[#C58B3A]">gemini-2.5-flash</p>
              <p className="text-[11px] text-[#81786D]">Multi-agency dependency propagation</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
              <span className="text-[10px] font-mono text-[#81786D]">DIGITAL TWIN SIMULATOR</span>
              <p className="font-bold text-[#5C765A]">Rule-Engine + AI</p>
              <p className="text-[11px] text-[#81786D]">Bhubaneswar GIS ward waterlogging matrix</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
