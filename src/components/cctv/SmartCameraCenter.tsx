import React, { useState } from 'react';
import {
  Video,
  AlertTriangle,
  Flame,
  Waves,
  Car,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { CameraEvent, Incident } from '../../types';
import { saveIncident } from '../../firebase/service';
import { KonarkWheel } from '../common/KonarkWheel';

interface SmartCameraCenterProps {
  cameraEvents: CameraEvent[];
  onRefresh: () => void;
}

const DEMO_CAMERAS = [
  { id: 'CAM_01', code: 'CAM-01-JVH', name: 'Jayadev Vihar Flyover North Underpass', ward: 'Ward 14 (Jayadev Vihar)', activeEvent: 'WATERLOGGING', confidence: 0.96 },
  { id: 'CAM_02', code: 'CAM-02-PAT', name: 'Patia Big Bazaar Commercial Square', ward: 'Ward 2 (Patia)', activeEvent: 'GARBAGE_DUMP', confidence: 0.89 },
  { id: 'CAM_03', code: 'CAM-03-MCN', name: 'Master Canteen Railway Approach', ward: 'Ward 30 (Kharavela Nagar)', activeEvent: 'CROWD_SURGE', confidence: 0.88 },
  { id: 'CAM_05', code: 'CAM-05-RSG', name: 'Rasulgarh Overbridge Highway Corridor', ward: 'Ward 8 (Mancheswar)', activeEvent: 'ROAD_ACCIDENT', confidence: 0.94 }
];

export const SmartCameraCenter: React.FC<SmartCameraCenterProps> = ({ cameraEvents, onRefresh }) => {
  const [selectedCam, setSelectedCam] = useState(DEMO_CAMERAS[0]);

  const handleEscalateIncident = async (cam: typeof DEMO_CAMERAS[0]) => {
    const newIncident: Incident = {
      id: `inc_cctv_${Date.now()}`,
      code: `INC-CCTV-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `AI Vision Incident: ${cam.activeEvent} at ${cam.name}`,
      description: `Computer vision camera feed (${cam.code}) detected anomalous ${cam.activeEvent.toLowerCase()} condition with ${(cam.confidence * 100).toFixed(0)}% confidence.`,
      category: cam.activeEvent === 'WATERLOGGING' ? 'Disaster Management & Drainage' : 'Enforcement & Public Safety',
      severity: cam.activeEvent === 'WATERLOGGING' || cam.activeEvent === 'ROAD_ACCIDENT' ? 'CRITICAL' : 'HIGH',
      priority: 'P1_CRITICAL',
      status: 'ACTIVE',
      department: cam.activeEvent === 'WATERLOGGING' ? 'Disaster Management & Drainage' : 'Enforcement & Public Safety',
      ward: cam.ward,
      zone: 'Central Zone',
      lat: 20.2984,
      lng: 85.8192,
      source: 'CCTV_AI',
      affectedServices: ['Traffic Police', 'BMC Field Squads'],
      assignedTeamName: 'Auto-Dispatched CCTV Triage Squad',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveIncident(newIncident);
    alert(`Incident ${newIncident.code} created and routed to Command Center!`);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#6D3028] border border-[#B8543A]/30 font-mono text-[10px] font-bold">
                AI COMPUTER VISION
              </span>
              <span className="text-xs text-[#81786D]">Camera Event Stream</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#211E1B] tracking-tight mt-0.5">
              Bhubaneswar Integrated Camera Intelligence
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs font-mono text-[#5C765A] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#5C765A]"></span>
          <span>4 FEED NODES ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Feed Canvas vs Event Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Monitor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-80 sm:h-96 rounded-2xl bg-[#211E1B] border border-[#3D3732] overflow-hidden shadow-inner flex flex-col justify-between p-4 text-[#F7F1E5]">
            <div className="flex items-center justify-between z-10 text-xs font-mono">
              <div className="flex items-center gap-2 bg-[#26221F]/90 px-2.5 py-1 rounded border border-[#3D3732]">
                <span className="w-2 h-2 rounded-full bg-[#B83A32] animate-ping"></span>
                <span>LIVE FEED · {selectedCam.code}</span>
              </div>
              <div className="bg-[#26221F]/90 px-2.5 py-1 rounded border border-[#3D3732] text-[#C58B3A]">
                {selectedCam.ward}
              </div>
            </div>

            {/* Bounding Box Vector Representation */}
            <div className="relative flex-1 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-36 border-2 border-dashed border-[#C58B3A] bg-[#C58B3A]/10 rounded-lg flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] font-mono text-[#C58B3A] font-bold">
                  <span>AI DETECTED</span>
                  <span>{(selectedCam.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="text-center font-mono font-bold text-xs text-white bg-[#211E1B]/90 px-2 py-1 rounded">
                  {selectedCam.activeEvent}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between z-10 text-xs font-mono text-[#81786D] bg-[#26221F]/90 px-3 py-1.5 rounded-lg border border-[#3D3732]">
              <span>{selectedCam.name}</span>
              <span>25 FPS · 1080P</span>
            </div>
          </div>

          {/* Camera Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DEMO_CAMERAS.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCam(cam)}
                className={`p-3 rounded-xl border text-xs text-left transition-all ${
                  selectedCam.id === cam.id
                    ? 'bg-[#F7F1E5] border-[#B8543A] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#E2D7C3] hover:border-[#81786D] text-[#81786D]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[#B8543A] text-[10px] font-bold">{cam.code}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5C765A]"></span>
                </div>
                <p className="font-bold text-[#211E1B] truncate">{cam.activeEvent}</p>
                <p className="text-[10px] text-[#81786D] truncate">{cam.ward.split(' ')[0]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#E2D7C3]">
              <span className="text-[10px] font-mono text-[#B8543A] font-bold uppercase">
                Active Anomaly Stream
              </span>
              <h3 className="text-base font-serif font-bold text-[#211E1B] mt-1">{selectedCam.name}</h3>
              <p className="text-xs text-[#81786D]">{selectedCam.ward}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#81786D]">Anomaly Type:</span>
                <span className="text-[#B83A32] font-mono font-bold">{selectedCam.activeEvent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#81786D]">Confidence:</span>
                <span className="text-[#5C765A] font-mono font-bold">
                  {(selectedCam.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-[#81786D] leading-relaxed">
              If confirmed by the operator, escalate to create an official P1 Incident in the command center and mobilize inter-agency field units.
            </p>
          </div>

          <button
            onClick={() => handleEscalateIncident(selectedCam)}
            className="w-full py-3 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Escalate to BMC City Incident</span>
          </button>
        </div>
      </div>
    </div>
  );
};
