import React, { useState } from 'react';
import {
  Users,
  HardHat,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Filter,
  UserCheck,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Complaint, FieldTask } from '../../types';
import { saveFieldTask, saveComplaint, addNotification } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';
import { PattachitraDivider } from '../common/PattachitraDivider';

interface SupervisorPanelProps {
  complaints: Complaint[];
  fieldTasks: FieldTask[];
  onRefresh: () => void;
}

const FIELD_TEAM_MEMBERS = [
  { id: 'sqd_01', name: 'Ranjan Barik', phone: '+91-9437110022', activeTasks: 3, completedToday: 5, zone: 'Central Zone', status: 'ON_DUTY' },
  { id: 'sqd_02', name: 'Manas Mohanty', phone: '+91-9437110033', activeTasks: 2, completedToday: 4, zone: 'Central Zone', status: 'ON_DUTY' },
  { id: 'sqd_03', name: 'Prakash Jena', phone: '+91-9437110044', activeTasks: 1, completedToday: 6, zone: 'Central Zone', status: 'ON_DUTY' },
  { id: 'sqd_04', name: 'Balaram Sahoo', phone: '+91-9437110055', activeTasks: 4, completedToday: 3, zone: 'Central Zone', status: 'BUSY' },
  { id: 'sqd_05', name: 'Santosh Nayak', phone: '+91-9437110066', activeTasks: 0, completedToday: 7, zone: 'Central Zone', status: 'STANDBY' }
];

export const SupervisorPanel: React.FC<SupervisorPanelProps> = ({
  complaints,
  fieldTasks,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(FIELD_TEAM_MEMBERS[0].id);
  const [assignSuccess, setAssignSuccess] = useState<boolean>(false);

  const pendingTasks = fieldTasks.filter(t => t.status !== 'RESOLVED');

  const handleAssignTask = async (task: FieldTask) => {
    const worker = FIELD_TEAM_MEMBERS.find(w => w.id === selectedWorkerId);
    if (!worker) return;

    const updatedTask: FieldTask = {
      ...task,
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      status: 'ACCEPTED',
      updatedAt: new Date().toISOString()
    };

    await saveFieldTask(updatedTask);
    addNotification('TASK REASSIGNED', `Task ${task.title} assigned to ${worker.name}`, 'INFO');
    setAssignSuccess(true);
    setTimeout(() => setAssignSuccess(false), 2000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#211E1B] text-[#F7F1E5] border border-[#3D3732] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#3D3732] border border-[#C58B3A]/60 flex items-center justify-center text-[#C58B3A] shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#3D3732] text-[#C58B3A] border border-[#5A524A] font-mono text-[10px] font-bold">
                BMC SUPERVISORY OPERATIONS
              </span>
              <span className="text-xs text-[#D8C7AA]">Squad Coordination & Field Workload</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F1E5] tracking-tight mt-0.5">
              Field Operations Supervisor Panel
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-[#3D3732] border border-[#5A524A] text-[#5C765A] font-bold">
            5 SQUADS ACTIVE
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#3D3732] border border-[#5A524A] text-[#C58B3A] font-bold">
            {pendingTasks.length} OPEN TASKS
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">ACTIVE FIELD WORKERS</span>
          <p className="text-2xl font-bold font-mono text-[#211E1B]">5 On-Duty</p>
          <p className="text-[11px] text-[#5C765A]">100% attendance verified</p>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">PENDING SQUAD TASKS</span>
          <p className="text-2xl font-bold font-mono text-[#B8543A]">{pendingTasks.length}</p>
          <p className="text-[11px] text-[#81786D]">Across Ward 14 & Central Zone</p>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">RESOLVED TODAY</span>
          <p className="text-2xl font-bold font-mono text-[#5C765A]">25 Tasks</p>
          <p className="text-[11px] text-[#5C765A]">With geo-tagged photo proof</p>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">SLA COMPLIANCE</span>
          <p className="text-2xl font-bold font-mono text-[#C58B3A]">96.8%</p>
          <p className="text-[11px] text-[#5C765A]">Average turnaround: 3.2h</p>
        </div>
      </div>

      <PattachitraDivider theme="ochre" />

      {/* Main Grid: Field Team Roster & Unassigned Task Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Squad Team Roster (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
            <h3 className="font-serif font-bold text-sm text-[#211E1B]">Ground Squad Roster</h3>
            <span className="text-[10px] font-mono text-[#81786D]">Central Zone</span>
          </div>

          <div className="space-y-3">
            {FIELD_TEAM_MEMBERS.map(worker => (
              <div
                key={worker.id}
                className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#B8543A]/30 flex items-center justify-center text-[#B8543A] font-bold">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#211E1B]">{worker.name}</h4>
                    <p className="text-[11px] text-[#81786D] font-mono">{worker.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    worker.status === 'ON_DUTY'
                      ? 'bg-[#5C765A]/10 text-[#5C765A]'
                      : worker.status === 'STANDBY'
                      ? 'bg-[#C58B3A]/10 text-[#C58B3A]'
                      : 'bg-[#B8543A]/10 text-[#B8543A]'
                  }`}>
                    {worker.status}
                  </span>
                  <p className="text-[11px] text-[#81786D] mt-1">{worker.activeTasks} active · {worker.completedToday} done</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Task Assignment Queue (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
            <h3 className="font-serif font-bold text-sm text-[#211E1B]">Squad Dispatch & Reallocation</h3>
            <span className="text-[10px] font-mono text-[#B8543A] font-bold">{pendingTasks.length} Pending</span>
          </div>

          <div className="space-y-3">
            {pendingTasks.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B8543A] text-white font-bold">
                      {task.priority}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#211E1B] mt-1">{task.title}</h4>
                    <p className="text-xs text-[#81786D] flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B8543A]" />
                      <span>{task.ward} · {task.location}</span>
                    </p>
                  </div>

                  <span className="text-xs font-mono text-[#5C765A] font-semibold">
                    {task.workerName || 'Unassigned'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E2D7C3]/60">
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] text-xs font-medium text-[#211E1B] focus:outline-hidden"
                  >
                    {FIELD_TEAM_MEMBERS.map(w => (
                      <option key={w.id} value={w.id}>
                        Assign: {w.name} ({w.activeTasks} active)
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleAssignTask(task)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#B8543A] hover:bg-[#A14731] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Squad</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
