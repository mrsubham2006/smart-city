import React, { useState } from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  Flame,
  Waves,
  ShieldCheck,
  HardHat,
  ArrowUpRight,
  Activity,
  Building2,
  PhoneCall,
  CheckCircle2,
  Clock,
  Send,
  Filter
} from 'lucide-react';
import { Complaint, Incident, EmergencyCase, FieldTask, CameraEvent } from '../../types';
import { BHUBANESWAR_WARDS } from '../../services/bhubaneswarData';
import { addNotification } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';
import { KonarkWheel } from '../common/KonarkWheel';

interface BmcCommandCenterProps {
  complaints: Complaint[];
  incidents: Incident[];
  emergencyCases: EmergencyCase[];
  fieldTasks: FieldTask[];
  cameraEvents: CameraEvent[];
  onNavigate: (view: string) => void;
  onRefresh: () => void;
}

export const BmcCommandCenter: React.FC<BmcCommandCenterProps> = ({
  complaints,
  incidents,
  emergencyCases,
  fieldTasks,
  cameraEvents,
  onNavigate,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastText, setBroadcastText] = useState<string>('');
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  const criticalComplaints = complaints.filter(c => c.priority === 'P1_CRITICAL');
  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE' || i.status === 'RESOLVING');
  const activeEmergency = emergencyCases.filter(e => e.status !== 'RESOLVED' && e.status !== 'CLOSED');
  const activeTasks = fieldTasks.filter(t => t.status !== 'RESOLVED');

  const handleBroadcastAlert = async () => {
    if (!broadcastText.trim()) return;
    addNotification('CITYWIDE CIVIC ADVISORY', broadcastText, 'CRITICAL');
    setBroadcastSuccess(true);
    setBroadcastText('');
    setTimeout(() => {
      setBroadcastSuccess(false);
      setIsBroadcasting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Command Header (Deep Charcoal & Terracotta) */}
      <div className="p-5 rounded-2xl bg-[#211E1B] text-[#F7F1E5] border border-[#3D3732] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#3D3732] border border-[#5A524A] text-[#C58B3A] font-mono text-[10px] font-bold">
              BMC COMMAND OPERATIONS
            </span>
            <span className="text-xs text-[#D8C7AA]">Integrated Municipal Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F1E5] tracking-tight mt-1">
            Bhubaneswar Executive Command Center
          </h1>
          <p className="text-xs text-[#81786D]">
            Real-time municipal telemetry across 67 BMC wards · Executive Directorate
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBroadcasting(true)}
            className="px-4 py-2 rounded-xl bg-[#3D3732] hover:bg-[#4A433D] text-[#C58B3A] border border-[#5A524A] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Advisory</span>
          </button>
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Open GIS Map</span>
          </button>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcasting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2D7C3] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-serif font-bold text-[#211E1B] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#C58B3A]" />
              <span>Broadcast Municipal Advisory</span>
            </h3>
            <p className="text-xs text-[#81786D]">
              This message broadcasts instantly to citizens and response teams across Bhubaneswar.
            </p>
            <textarea
              rows={3}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="e.g. Heavy rainfall alert in Jayadev Vihar & Nayapalli. Please avoid NH-16 service road."
              className="w-full p-2.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B8543A]"
            />
            {broadcastSuccess && (
              <p className="text-xs text-[#5C765A] font-bold">Advisory broadcasted successfully!</p>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBroadcasting(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#81786D]"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcastAlert}
                disabled={!broadcastText.trim()}
                className="px-4 py-2 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs"
              >
                Broadcast Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: OPERATIONAL KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">P1 CRITICAL CASES</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#B83A32]">{criticalComplaints.length}</span>
            <span className="w-2 h-2 rounded-full bg-[#B83A32]"></span>
          </div>
          <p className="text-[10px] text-[#81786D]">High priority dispatch</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">ACTIVE INCIDENTS</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#C58B3A]">{activeIncidents.length}</span>
            <span className="text-[10px] text-[#81786D] font-mono">1 Flood / 1 Traffic</span>
          </div>
          <p className="text-[10px] text-[#81786D]">Multi-agency coordination</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">112 EMERGENCY</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#6D3028]">{activeEmergency.length}</span>
            <span className="text-[10px] text-[#5C765A] font-mono font-semibold">Trauma Ready</span>
          </div>
          <p className="text-[10px] text-[#81786D]">Fire & Hospital link</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">FIELD SQUADS ACTIVE</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#B8543A]">{activeTasks.length}</span>
            <span className="text-[10px] text-[#81786D] font-mono">GPS Tracked</span>
          </div>
          <p className="text-[10px] text-[#81786D]">Drainage & Sanitation</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">CCTV ANOMALIES</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#211E1B]">{cameraEvents.length}</span>
            <span className="text-[10px] text-[#5C765A] font-mono font-semibold">94% Confidence</span>
          </div>
          <p className="text-[10px] text-[#81786D]">AI vision stream</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase">SLA COMPLIANCE</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#5C765A]">94.2%</span>
            <span className="text-[10px] text-[#5C765A] font-mono font-semibold">Target &gt;90%</span>
          </div>
          <p className="text-[10px] text-[#81786D]">BMC benchmark</p>
        </div>
      </div>

      {/* Main Grid: Priority Incidents & Ward Vulnerability Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Correlated Incidents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2D7C3]">
            <div>
              <h2 className="text-base font-serif font-bold text-[#211E1B] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#B83A32]" />
                <span>Correlated City Incidents</span>
              </h2>
              <p className="text-xs text-[#81786D]">
                Multi-signal incidents requiring cross-departmental response
              </p>
            </div>
            <button
              onClick={() => onNavigate('cascade')}
              className="text-xs text-[#B8543A] font-bold hover:underline flex items-center gap-1"
            >
              <span>Cascade Threat Graph</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#B83A32] font-bold">{inc.code}</span>
                    <span className="px-2 py-0.5 rounded bg-[#FDF2F1] border border-[#B83A32]/30 text-[10px] font-mono text-[#B83A32] font-bold">
                      {inc.priority}
                    </span>
                    <span className="text-xs font-bold text-[#211E1B]">{inc.category}</span>
                  </div>
                  <span className="text-[10px] text-[#81786D] font-mono">{inc.ward}</span>
                </div>

                <h3 className="text-sm font-serif font-bold text-[#211E1B] leading-snug">{inc.title}</h3>
                <p className="text-xs text-[#3D3732] leading-relaxed">{inc.description}</p>

                <div className="p-3 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[11px] space-y-1">
                  <span className="text-[#81786D] font-bold">Inter-Agency Directives:</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {inc.affectedServices.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#81786D]">
                    Assigned: <strong className="text-[#B8543A]">{inc.assignedTeamName}</strong>
                  </span>
                  <button
                    onClick={() => onNavigate('map')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#211E1B] text-xs font-semibold border border-[#E2D7C3]"
                  >
                    Locate on GIS Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Bhubaneswar Ward Risk Index */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-[#E2D7C3]">
            <h2 className="text-base font-serif font-bold text-[#211E1B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B8543A]" />
              <span>Ward Vulnerability Index</span>
            </h2>
            <p className="text-xs text-[#81786D]">
              Stormwater topography & grievance density
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-xs">
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {BHUBANESWAR_WARDS.slice(0, 8).map((w) => (
                <div
                  key={w.wardNo}
                  className="p-2.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-[#211E1B]">Ward {w.wardNo}: {w.name.split('&')[0]}</p>
                    <p className="text-[11px] text-[#81786D]">{w.zone} · {w.corporatorName}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        w.vulnerabilityIndex === 'HIGH'
                          ? 'bg-[#FDF2F1] text-[#B83A32] border border-[#B83A32]/30'
                          : 'bg-[#F7F1E5] text-[#5C765A] border border-[#5C765A]/30'
                      }`}
                    >
                      {w.vulnerabilityIndex} RISK
                    </span>
                    <p className="text-[10px] text-[#81786D] font-mono mt-0.5">
                      {w.activeComplaintsCount} active tickets
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E2D7C3]">
              <button
                onClick={() => onNavigate('digitaltwin')}
                className="w-full py-2.5 rounded-lg bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#6D3028] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#E2D7C3]"
              >
                <span>Run Flood Simulation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
