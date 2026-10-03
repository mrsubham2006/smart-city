import React, { useState } from 'react';
import {
  Cpu,
  Waves,
  Sliders,
  RotateCcw,
  AlertTriangle,
  Car
} from 'lucide-react';
import { runDigitalTwinSimulation } from '../../services/geminiService';
import { KonarkWheel } from '../common/KonarkWheel';

export const DigitalTwinView: React.FC = () => {
  const [rainfallMm, setRainfallMm] = useState<number>(65);
  const [durationHours, setDurationHours] = useState<number>(3);
  const [blockedDrainagePercent, setBlockedDrainagePercent] = useState<number>(25);

  const simulation = runDigitalTwinSimulation(rainfallMm, durationHours, blockedDrainagePercent);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#6D3028] border border-[#B8543A]/30 font-mono text-[10px] font-bold">
                BHUBANESWAR DIGITAL TWIN
              </span>
              <span className="text-xs text-[#81786D]">Urban Hydrology Planning Simulator</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#211E1B] tracking-tight mt-0.5">
              What-If Urban Flood Resilience Simulator
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FDF6ED] border border-[#C58B3A]/40 text-xs font-mono text-[#6D3028] font-bold">
          <AlertTriangle className="w-3.5 h-3.5 text-[#C58B3A]" />
          <span>SIMULATION MODEL · URBAN PLANNING</span>
        </div>
      </div>

      {/* Main Grid: Stress Controls vs Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
            <h2 className="text-sm font-serif font-bold text-[#211E1B] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#B8543A]" />
              <span>Simulation Stress Sliders</span>
            </h2>
            <button
              onClick={() => {
                setRainfallMm(65);
                setDurationHours(3);
                setBlockedDrainagePercent(25);
              }}
              className="text-[11px] text-[#81786D] hover:text-[#211E1B] flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Rainfall Intensity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#3D3732] font-bold">Rainfall Intensity</span>
              <span className="font-mono text-[#B8543A] font-bold">{rainfallMm} mm / hr</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={rainfallMm}
              onChange={(e) => setRainfallMm(Number(e.target.value))}
              className="w-full accent-[#B8543A]"
            />
            <div className="flex justify-between text-[10px] text-[#81786D] font-mono">
              <span>10mm</span>
              <span>65mm (Cloudburst)</span>
              <span>150mm (Extreme)</span>
            </div>
          </div>

          {/* Precipitation Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#3D3732] font-bold">Precipitation Duration</span>
              <span className="font-mono text-[#6D3028] font-bold">{durationHours} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full accent-[#6D3028]"
            />
            <div className="flex justify-between text-[10px] text-[#81786D] font-mono">
              <span>1 hr</span>
              <span>6 hrs</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Blocked Drainage % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#3D3732] font-bold">Drainage Obstruction / Silt</span>
              <span className="font-mono text-[#B83A32] font-bold">{blockedDrainagePercent}% Choke</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={blockedDrainagePercent}
              onChange={(e) => setBlockedDrainagePercent(Number(e.target.value))}
              className="w-full accent-[#B83A32]"
            />
            <div className="flex justify-between text-[10px] text-[#81786D] font-mono">
              <span>0% (Clean)</span>
              <span>40% (Choked)</span>
              <span>80% (Sluice Failure)</span>
            </div>
          </div>
        </div>

        {/* Forecast Output Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-[#81786D] uppercase">AFFECTED ROADS</span>
              <p className="text-xl font-mono font-bold text-[#211E1B]">{simulation.affectedRoadsCount} Corridors</p>
              <p className="text-[10px] text-[#81786D]">NH-16 & Arterials</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-[#81786D] uppercase">TRAFFIC DELAY</span>
              <p className="text-xl font-mono font-bold text-[#C58B3A]">{simulation.trafficCongestionMultiplier}x Delay</p>
              <p className="text-[10px] text-[#81786D]">Commute slowdown</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-[#81786D] uppercase">PUMPS REQUIRED</span>
              <p className="text-xl font-mono font-bold text-[#B8543A]">{simulation.pumpsRequired} Units</p>
              <p className="text-[10px] text-[#81786D]">500 GPM Mobile Fleet</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-[#81786D] uppercase">CREW DEPLOYMENT</span>
              <p className="text-xl font-mono font-bold text-[#5C765A]">{simulation.fieldRespondersRequired} Crew</p>
              <p className="text-[10px] text-[#81786D]">Drainage & Traffic</p>
            </div>
          </div>

          {/* Submerged Wards Breakdown */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
              <h3 className="text-sm font-serif font-bold text-[#211E1B] flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#B8543A]" />
                <span>Simulated Ward Inundation Projections</span>
              </h3>
              <span className="text-[11px] font-mono text-[#81786D]">Topographic Model</span>
            </div>

            <div className="space-y-2.5">
              {simulation.submergedWards.map((sw) => (
                <div
                  key={sw.wardNo}
                  className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#211E1B]">Ward {sw.wardNo}: {sw.name}</p>
                    <p className="text-[11px] text-[#81786D]">
                      Water Depth: <strong className="text-[#B8543A] font-mono">{sw.waterDepthCm} cm</strong>
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      sw.riskLevel === 'CRITICAL'
                        ? 'bg-[#FDF2F1] text-[#B83A32] border border-[#B83A32]/30'
                        : sw.riskLevel === 'HIGH'
                        ? 'bg-[#FDF6ED] text-[#C58B3A] border border-[#C58B3A]/40'
                        : 'bg-[#FFFFFF] text-[#5C765A] border border-[#5C765A]/30'
                    }`}
                  >
                    {sw.riskLevel}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs text-[#3D3732] space-y-1">
              <div className="flex items-center gap-1.5 text-[#B83A32] font-bold">
                <Car className="w-3.5 h-3.5" />
                <span>Emergency Ambulance Corridor Risk:</span>
              </div>
              <p className="text-[11px] text-[#81786D]">{simulation.emergencyRouteImpact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
