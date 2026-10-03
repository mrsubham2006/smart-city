import React, { useState } from 'react';
import {
  Network,
  ArrowDown,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { generateCascadePrediction } from '../../services/geminiService';
import { KonarkWheel } from '../common/KonarkWheel';
import { PattachitraDivider } from '../common/PattachitraDivider';

const SCENARIOS = [
  {
    id: 'rain_cloudburst',
    title: 'Monsoon Cloudburst (65mm/hr) at Jayadev Vihar',
    intensity: 65,
    location: 'Central Zone (Wards 14, 15, 20)',
    primaryHazard: 'Stormwater Grid Surcharge'
  },
  {
    id: 'drainage_culvert',
    title: 'Major Sluice Gate Choke on Drain No. 4 (Gangua Basin)',
    intensity: 45,
    location: 'Old Town & Sundarpada (Wards 45, 48)',
    primaryHazard: 'Lowland Hydrology Backflow'
  },
  {
    id: 'highway_pileup',
    title: 'Highway Obstruction on NH-16 Rasulgarh Overbridge',
    intensity: 30,
    location: 'North Gateway (Ward 8)',
    primaryHazard: 'Critical Artery Gridlock'
  }
];

export const CascadeIntelligenceView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [rainfallMm, setRainfallMm] = useState<number>(65);

  const cascadeData = generateCascadePrediction(selectedScenario.title, rainfallMm);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#6D3028] border border-[#B8543A]/30 font-mono text-[10px] font-bold">
                CASCADE DOMINO AI
              </span>
              <span className="text-xs text-[#81786D]">Downstream Threat Synthesizer</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#211E1B] tracking-tight mt-0.5">
              Multi-Agency Cascade Dependency Graph
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs font-mono text-[#6D3028] font-bold">
          <KonarkWheel size={14} color="#B8543A" />
          <span>AI PREDICTIVE GRAPH</span>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-[#81786D] uppercase tracking-wider">
          Select Incident Scenario
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                setRainfallMm(sc.intensity);
              }}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                selectedScenario.id === sc.id
                  ? 'bg-[#F7F1E5] border-[#B8543A] shadow-xs ring-1 ring-[#B8543A]'
                  : 'bg-[#FFFFFF] border-[#E2D7C3] hover:border-[#81786D] text-[#81786D]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#B8543A] text-[10px] uppercase font-bold">
                  {sc.primaryHazard}
                </span>
                <span className="text-[10px] text-[#81786D] font-mono font-semibold">{sc.intensity} mm/hr</span>
              </div>
              <h3 className="font-serif font-bold text-[#211E1B] leading-snug">{sc.title}</h3>
              <p className="text-[11px] text-[#81786D]">{sc.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Cascade Flow Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domino Stages */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
            <h2 className="text-sm font-serif font-bold text-[#211E1B] flex items-center gap-2">
              <Network className="w-4 h-4 text-[#B8543A]" />
              <span>Domino Threat Propagation Stages</span>
            </h2>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold ${
              cascadeData.riskLevel === 'CRITICAL' ? 'bg-[#FDF2F1] text-[#B83A32] border border-[#B83A32]/30' : 'bg-[#FDF6ED] text-[#C58B3A] border border-[#C58B3A]/40'
            }`}>
              {cascadeData.riskLevel} ESCALATION
            </span>
          </div>

          <div className="space-y-3 relative">
            {cascadeData.propagationStages.map((st, idx) => (
              <div key={st.stage} className="relative">
                <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] text-[#B8543A] flex items-center justify-center font-mono text-xs font-bold">
                        0{st.stage}
                      </span>
                      <span className="font-bold text-[#211E1B] text-xs">{st.system}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2D7C3] text-[#6D3028] font-bold">
                      {st.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#3D3732] pl-8 leading-relaxed">{st.effect}</p>
                </div>

                {idx < cascadeData.propagationStages.length - 1 && (
                  <div className="flex justify-center my-1 text-[#81786D]">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#81786D] italic pt-2">
            * Cascade predictions are computed continuously by correlating historical rainfall hydrology, sensors, and road topology.
          </p>
        </div>

        {/* Preventive Directives */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#E2D7C3]">
              <span className="text-[10px] font-mono text-[#B8543A] font-bold uppercase">PREVENTIVE ACTION</span>
              <h3 className="text-sm font-serif font-bold text-[#211E1B] mt-0.5">Recommended Directives</h3>
            </div>

            <div className="space-y-2.5">
              {cascadeData.recommendedMitigations.map((mit, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#6D3028] font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B8543A]" />
                    <span>DIRECTIVE #{idx + 1}</span>
                  </div>
                  <p className="text-[#3D3732] leading-relaxed">{mit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[11px] text-[#81786D] font-mono">
            AFFECTED WARDS: W14, W15, W20, W36
          </div>
        </div>
      </div>
    </div>
  );
};
