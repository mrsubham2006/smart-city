import React, { useState } from 'react';
import {
  Building2,
  HardHat,
  Filter,
  UserCheck
} from 'lucide-react';
import { Complaint, FieldTask } from '../../types';
import { BHUBANESWAR_DEPARTMENTS, BHUBANESWAR_WARDS } from '../../services/bhubaneswarData';
import { saveComplaint } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';
import { KonarkWheel } from '../common/KonarkWheel';

interface DepartmentDashboardProps {
  complaints: Complaint[];
  fieldTasks: FieldTask[];
  onRefresh: () => void;
}

export const DepartmentDashboard: React.FC<DepartmentDashboardProps> = ({
  complaints,
  fieldTasks,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const [activeDept, setActiveDept] = useState<string>(
    currentUser?.department && currentUser.department !== 'BMC Administration'
      ? currentUser.department
      : 'Disaster Management & Drainage'
  );

  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [assigningComplaint, setAssigningComplaint] = useState<Complaint | null>(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState<string>('Ranjan Barik (Squad 4)');

  const deptComplaints = complaints.filter(c => {
    const matchDept = c.department.toLowerCase().includes(activeDept.toLowerCase()) || activeDept.toLowerCase().includes(c.department.toLowerCase());
    const matchWard = selectedWard === 'ALL' || c.ward.includes(selectedWard);
    const matchPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
    return matchDept && matchWard && matchPriority;
  });

  const handleAssignWorker = async () => {
    if (!assigningComplaint) return;

    const workerName = selectedWorkerName.split(' ')[0] + ' ' + selectedWorkerName.split(' ')[1];
    const updated: Complaint = {
      ...assigningComplaint,
      status: 'ASSIGNED',
      assignedWorkerName: workerName,
      assignedWorkerId: 'field_01',
      timeline: [
        ...assigningComplaint.timeline,
        {
          id: `tl_${Date.now()}`,
          status: 'ASSIGNED',
          timestamp: new Date().toISOString(),
          updatedBy: `${currentUser?.name || 'Department Head'} (${activeDept})`,
          userRole: 'DEPARTMENT_HEAD',
          note: `Assigned to field worker ${workerName} for on-site inspection and rectification.`
        }
      ],
      updatedAt: new Date().toISOString()
    };

    await saveComplaint(updated);
    setAssigningComplaint(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Department Banner */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#6D3028] border border-[#B8543A]/30 font-mono text-[10px] font-bold">
                BMC DEPARTMENTAL WORKSPACE
              </span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#211E1B] tracking-tight mt-0.5">
              {activeDept}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#81786D] hidden sm:inline">Switch Department:</span>
          <select
            value={activeDept}
            onChange={(e) => setActiveDept(e.target.value)}
            className="p-2 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs text-[#211E1B] focus:outline-none focus:border-[#B8543A] font-semibold"
          >
            {BHUBANESWAR_DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#B8543A]" />
          <span className="text-[#211E1B] font-bold">Filter Grievances:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="p-1.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs font-medium"
          >
            <option value="ALL">All BMC Wards (67)</option>
            {BHUBANESWAR_WARDS.map((w) => (
              <option key={w.wardNo} value={w.name.split(' ')[0]}>
                Ward {w.wardNo}: {w.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="p-1.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1_CRITICAL">P1 Critical</option>
            <option value="P2_HIGH">P2 High</option>
            <option value="P3_MEDIUM">P3 Medium</option>
          </select>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#81786D] uppercase tracking-wider">
          Assigned Work Queue ({deptComplaints.length} Tickets)
        </h2>

        {deptComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptComplaints.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#B8543A] text-xs font-bold">{c.ticketNo}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      c.priority === 'P1_CRITICAL'
                        ? 'bg-[#FDF2F1] text-[#B83A32] border border-[#B83A32]/30'
                        : 'bg-[#F7F1E5] text-[#211E1B]'
                    }`}
                  >
                    {c.priority}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-serif font-bold text-[#211E1B]">{c.category}</h3>
                  <p className="text-xs text-[#81786D] line-clamp-2 mt-1">{c.description}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[11px] text-[#81786D] space-y-1">
                  <p>Location: <strong className="text-[#211E1B]">{c.address}</strong> ({c.ward})</p>
                  <p>Assigned Worker: <strong className="text-[#B8543A]">{c.assignedWorkerName || 'Unassigned'}</strong></p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2D7C3] text-xs">
                  <span className="text-[11px] text-[#81786D] font-mono">Status: {c.status}</span>
                  {!c.assignedWorkerName ? (
                    <button
                      onClick={() => setAssigningComplaint(c)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign Field Squad</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-[#5C765A] font-bold">Squad Dispatched</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[#81786D] rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3]">
            No unresolved grievances in this department filter.
          </div>
        )}
      </div>

      {/* Assign Worker Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2D7C3] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-serif font-bold text-[#211E1B] flex items-center gap-2">
              <HardHat className="w-5 h-5 text-[#B8543A]" />
              <span>Assign Work Order to Field Worker</span>
            </h3>
            <p className="text-xs text-[#81786D]">
              Ticket: <strong className="text-[#211E1B]">{assigningComplaint.ticketNo}</strong> ({assigningComplaint.category})
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#211E1B]">Select Field Responder Squad</label>
              <select
                value={selectedWorkerName}
                onChange={(e) => setSelectedWorkerName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B8543A] font-medium"
              >
                <option value="Ranjan Barik (Squad 4)">Ranjan Barik (Rapid Drainage Squad #4)</option>
                <option value="Tapan Sethi (Sanitation Unit 2)">Tapan Sethi (Sanitation Night Unit #2)</option>
                <option value="Prakash Sahoo (Electrical Lineman)">Prakash Sahoo (Electrical Lineman #1)</option>
                <option value="Balaram Rout (Engineering Field Tech)">Balaram Rout (Roads Patch Unit #3)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAssigningComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#81786D]"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignWorker}
                className="px-5 py-2.5 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs shadow-sm"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
