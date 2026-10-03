import React, { useState } from 'react';
import {
  Network,
  Hospital,
  Car,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Activity,
  MapPin,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { EmergencyCase } from '../../types';
import { PattachitraDivider } from '../common/PattachitraDivider';

interface PartnerPanelProps {
  emergencyCases: EmergencyCase[];
  partnerType?: 'hospital' | 'traffic' | 'all';
}

const HOSPITAL_DATA = [
  { name: 'AIIMS Bhubaneswar', icuBedsAvailable: 14, otActive: 4, ambulanceStatus: '3 Standby', contact: '0674-2476789' },
  { name: 'Capital Hospital Unit-6', icuBedsAvailable: 8, otActive: 3, ambulanceStatus: '2 En Route', contact: '0674-2391983' },
  { name: 'SUM Ultimate Medicare', icuBedsAvailable: 12, otActive: 2, ambulanceStatus: '4 Standby', contact: '0674-3500500' },
  { name: 'Apollo Hospitals Sainik School', icuBedsAvailable: 6, otActive: 2, ambulanceStatus: '1 Dispatched', contact: '0674-6661016' }
];

const TRAFFIC_CORRIDORS = [
  { corridor: 'Jayadev Vihar - Capital Hospital Green Corridor', status: 'SYNCHRONIZED', priority: 'ACTIVE_AMBULANCE', signalOverride: 'GREEN_WAVE' },
  { corridor: 'Rasulgarh Overpass to AIIMS Sijua', status: 'MONITORED', priority: 'NORMAL', signalOverride: 'AUTO_ADAPTIVE' },
  { corridor: 'VSS Nagar Canal Approach to Apollo', status: 'MONITORED', priority: 'NORMAL', signalOverride: 'AUTO_ADAPTIVE' },
  { corridor: 'Master Canteen - Rajmahal Flyover Desk', status: 'CONGESTED', priority: 'DIVERSION_POSTED', signalOverride: 'TRAFFIC_CONTROL' }
];

export const PartnerPanel: React.FC<PartnerPanelProps> = ({
  emergencyCases,
  partnerType = 'all'
}) => {
  const [activeTab, setActiveTab] = useState<'hospital' | 'traffic'>(
    partnerType === 'traffic' ? 'traffic' : 'hospital'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#211E1B] text-[#F7F1E5] border border-[#3D3732] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#3D3732] border border-[#B8543A]/60 flex items-center justify-center text-[#B8543A] shadow-md">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#3D3732] text-[#C58B3A] border border-[#5A524A] font-mono text-[10px] font-bold">
                MULTI-AGENCY INTEGRATION
              </span>
              <span className="text-xs text-[#D8C7AA]">Hospital Trauma Network & Traffic Signal Control</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F1E5] tracking-tight mt-0.5">
              Partner Agency Operational Desk
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#3D3732] border border-[#5A524A] text-xs font-bold">
          <button
            onClick={() => setActiveTab('hospital')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hospital'
                ? 'bg-[#B8543A] text-white shadow-xs'
                : 'text-[#D8C7AA] hover:text-white'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>Hospital Trauma</span>
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'traffic'
                ? 'bg-[#B8543A] text-white shadow-xs'
                : 'text-[#D8C7AA] hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Traffic Signals</span>
          </button>
        </div>
      </div>

      {/* Hospital View */}
      {activeTab === 'hospital' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOSPITAL_DATA.map((hosp, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F1E5] border border-[#B8543A]/30 flex items-center justify-center text-[#B8543A]">
                    <Hospital className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5C765A]/10 text-[#5C765A] font-bold">
                    ONLINE
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-sm text-[#211E1B]">{hosp.name}</h3>
                  <p className="text-[11px] text-[#81786D] font-mono">{hosp.contact}</p>
                </div>

                <div className="pt-2 border-t border-[#F0E8D9] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#81786D]">ICU Beds Available:</span>
                    <span className="font-mono font-bold text-[#5C765A]">{hosp.icuBedsAvailable} Beds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#81786D]">Ambulance Units:</span>
                    <span className="font-mono text-[#211E1B]">{hosp.ambulanceStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <PattachitraDivider theme="terracotta" />

          {/* Active 112 Trauma Queue */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-sm text-[#211E1B]">Live 112 Incoming Trauma Dispatches</h3>
            <div className="space-y-3">
              {emergencyCases.slice(0, 3).map(ec => (
                <div key={ec.id} className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B83A32] text-white font-bold">
                      {ec.severity}
                    </span>
                    <h4 className="font-bold text-[#211E1B] text-sm mt-1">{ec.title}</h4>
                    <p className="text-xs text-[#81786D]">{ec.ward} · {ec.location}</p>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#E2D7C3] text-[#5C765A] font-bold">
                    {ec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Traffic View */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRAFFIC_CORRIDORS.map((corridor, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F1E5] border border-[#C58B3A]/40 flex items-center justify-center text-[#C58B3A]">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    corridor.status === 'SYNCHRONIZED'
                      ? 'bg-[#5C765A]/10 text-[#5C765A]'
                      : corridor.status === 'MONITORED'
                      ? 'bg-[#C58B3A]/10 text-[#C58B3A]'
                      : 'bg-[#B83A32]/10 text-[#B83A32]'
                  }`}>
                    {corridor.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-sm text-[#211E1B]">{corridor.corridor}</h3>
                  <p className="text-[11px] text-[#81786D] font-mono mt-0.5">Mode: {corridor.signalOverride}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
