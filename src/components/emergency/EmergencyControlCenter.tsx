import React, { useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  Flame,
  Hospital,
  ShieldAlert,
  Navigation,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { EmergencyCase } from '../../types';
import { saveEmergencyCase, addNotification } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';

interface EmergencyControlCenterProps {
  emergencyCases: EmergencyCase[];
  onRefresh: () => void;
}

export const EmergencyControlCenter: React.FC<EmergencyControlCenterProps> = ({
  emergencyCases,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(
    emergencyCases[0] || null
  );

  // Human Dispatch Authorization Modal
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authNote, setAuthNote] = useState<string>('Dispatched closest ALS Ambulance and Fire Rescue boat.');

  const handleApproveDispatch = async () => {
    if (!selectedCase) return;

    const updated: EmergencyCase = {
      ...selectedCase,
      status: 'DISPATCHED',
      humanApproved: true,
      approvedBy: `${currentUser?.name || 'Emergency Controller'} (${currentUser?.role || 'EMERGENCY_OPERATOR'})`,
      updatedAt: new Date().toISOString()
    };

    await saveEmergencyCase(updated);
    addNotification('EMERGENCY UNITS DISPATCHED', `Units deployed for ${updated.title}`, 'CRITICAL');
    setSelectedCase(updated);
    setShowAuthModal(false);
    onRefresh();
  };

  const handleResolveEmergency = async () => {
    if (!selectedCase) return;

    const updated: EmergencyCase = {
      ...selectedCase,
      status: 'RESOLVED',
      updatedAt: new Date().toISOString()
    };

    await saveEmergencyCase(updated);
    setSelectedCase(updated);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* High-Contrast Emergency Header (Clarity first) */}
      <div className="p-5 rounded-2xl bg-[#211E1B] text-white border border-[#3D3732] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#B83A32] flex items-center justify-center text-white shadow-md">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#B83A32] text-white font-mono text-[10px] font-bold">
                112 EMERGENCY COMMAND
              </span>
              <span className="text-xs text-[#D8C7AA]">Bhubaneswar Multi-Agency Coordination</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Emergency Response & Trauma Desk
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[#81786D]">HOTLINES</span>
            <p className="text-[#5C765A] font-bold">112 / 101 / 108 ACTIVE</p>
          </div>
          <div className="text-right">
            <span className="text-[#81786D]">TRAUMA BEDS</span>
            <p className="text-[#C58B3A] font-bold">38 ICU AVAILABLE</p>
          </div>
        </div>
      </div>

      {/* Main Split: Cases Feed vs Dispatch Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Cases */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono font-bold text-[#81786D] uppercase tracking-wider">
            Active Emergency Cases ({emergencyCases.length})
          </h2>

          <div className="space-y-2.5">
            {emergencyCases.map((ec) => (
              <div
                key={ec.id}
                onClick={() => setSelectedCase(ec)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                  selectedCase?.id === ec.id
                    ? 'bg-[#211E1B] text-white border-[#B83A32] shadow-md'
                    : 'bg-[#FFFFFF] border-[#E2D7C3] hover:border-[#81786D] text-[#81786D]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#B83A32] font-bold">{ec.caseNo}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ec.status === 'REPORTED'
                        ? 'bg-[#B83A32] text-white'
                        : ec.status === 'DISPATCHED'
                        ? 'bg-[#C58B3A] text-white'
                        : 'bg-[#5C765A] text-white'
                    }`}
                  >
                    {ec.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm leading-snug">{ec.title}</h3>
                <p className="text-[11px] truncate">{ec.location}</p>

                <div className="pt-2 border-t border-[#3D3732]/30 flex items-center justify-between text-[10px] font-mono">
                  <span>ETA: {ec.etaMinutes} mins</span>
                  <span>{ec.nearestHospital.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dispatch Action Terminal */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2D7C3]">
                <div>
                  <span className="text-xs font-mono text-[#B83A32] font-bold">{selectedCase.caseNo}</span>
                  <h2 className="text-lg font-bold text-[#211E1B]">{selectedCase.title}</h2>
                  <p className="text-xs text-[#81786D]">{selectedCase.location} · {selectedCase.ward}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FDF2F1] border border-[#B83A32]/30 text-[#B83A32] text-xs font-mono font-bold">
                    {selectedCase.emergencyType}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F7F1E5] text-[#211E1B] text-xs font-mono font-semibold">
                    {selectedCase.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#211E1B] leading-relaxed bg-[#F7F1E5] p-3.5 rounded-xl border border-[#E2D7C3]">
                {selectedCase.description}
              </p>

              {/* Resource Allocation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#5C765A] text-xs font-bold">
                    <Hospital className="w-4 h-4" />
                    <span>Hospital Trauma Link</span>
                  </div>
                  <p className="text-xs font-bold text-[#211E1B] truncate">{selectedCase.nearestHospital}</p>
                  <p className="text-[11px] text-[#5C765A] font-mono font-bold">
                    ICU Available: {selectedCase.hospitalBedAvailability?.icuAvailable || 8} Beds
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#B83A32] text-xs font-bold">
                    <Flame className="w-4 h-4" />
                    <span>Fire & Rescue Squad</span>
                  </div>
                  <p className="text-xs font-bold text-[#211E1B] truncate">{selectedCase.nearestFireStation}</p>
                  <p className="text-[11px] text-[#81786D]">Tenders: 4 Ready</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#6D3028] text-xs font-bold">
                    <Navigation className="w-4 h-4" />
                    <span>ETA & Suggested Route</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-[#211E1B]">{selectedCase.etaMinutes} Mins ETA</p>
                  <p className="text-[11px] text-[#6D3028] truncate">{selectedCase.suggestedRoute}</p>
                </div>
              </div>

              {/* Responders */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold font-mono text-[#81786D] uppercase">
                  Assigned Emergency Units
                </h3>
                <div className="space-y-2">
                  {selectedCase.assignedResponders.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#211E1B]">{resp.unitId}</p>
                        <p className="text-[11px] text-[#81786D]">{resp.agency}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] text-[10px] font-mono font-semibold">
                          {resp.status}
                        </span>
                        <p className="text-[10px] text-[#81786D] font-mono mt-0.5">Hotline: {resp.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Human Authorization Footer */}
              <div className="pt-4 border-t border-[#E2D7C3] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  {selectedCase.humanApproved ? (
                    <span className="text-[#5C765A] flex items-center gap-1.5 font-bold">
                      <UserCheck className="w-4 h-4" />
                      Authorized by {selectedCase.approvedBy}
                    </span>
                  ) : (
                    <span className="text-[#C58B3A] flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      Requires Human Operator Authorization
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!selectedCase.humanApproved ? (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#B83A32] hover:bg-[#A32D26] text-white font-bold text-xs flex items-center gap-2 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Dispatch Units</span>
                    </button>
                  ) : selectedCase.status !== 'RESOLVED' ? (
                    <button
                      onClick={handleResolveEmergency}
                      className="px-5 py-2.5 rounded-xl bg-[#5C765A] hover:bg-[#4E644C] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Incident Resolved</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-[#5C765A] font-bold">
                      INCIDENT CLOSED
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#81786D] rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3]">
              Select an emergency case to review dispatch controls.
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Human Authorization Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2D7C3] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
              <div className="flex items-center gap-2 text-[#B83A32] font-bold">
                <ShieldAlert className="w-5 h-5" />
                <span>Emergency Dispatch Confirmation</span>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-[#81786D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#3D3732]">
              You are about to authorize simultaneous emergency response for{' '}
              <strong className="text-[#211E1B]">{selectedCase?.title}</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#211E1B]">Operator Directives</label>
              <input
                type="text"
                value={authNote}
                onChange={(e) => setAuthNote(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B83A32]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#81786D]"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveDispatch}
                className="px-5 py-2.5 rounded-xl bg-[#B83A32] hover:bg-[#A32D26] text-white font-bold text-xs shadow-md"
              >
                Confirm Dispatch Authorization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
