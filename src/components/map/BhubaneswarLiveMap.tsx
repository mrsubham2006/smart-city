import React, { useState } from 'react';
import {
  MapPin,
  Flame,
  Hospital,
  HardHat,
  Video,
  Compass,
  Navigation,
  ZoomIn,
  ZoomOut,
  Info,
  X,
  Waves
} from 'lucide-react';
import {
  BHUBANESWAR_WARDS,
  BHUBANESWAR_HOSPITALS,
  BHUBANESWAR_FIRE_STATIONS,
  BHUBANESWAR_TOURISM
} from '../../services/bhubaneswarData';
import { Complaint, Incident, CameraEvent } from '../../types';
import { KonarkWheel } from '../common/KonarkWheel';

interface BhubaneswarLiveMapProps {
  complaints: Complaint[];
  incidents: Incident[];
  cameraEvents: CameraEvent[];
  onSelectComplaint?: (c: Complaint) => void;
  onSelectIncident?: (i: Incident) => void;
}

export const BhubaneswarLiveMap: React.FC<BhubaneswarLiveMapProps> = ({
  complaints,
  incidents,
  cameraEvents,
  onSelectComplaint,
  onSelectIncident
}) => {
  const [showComplaints, setShowComplaints] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showFireStations, setShowFireStations] = useState<boolean>(true);
  const [showCameras, setShowCameras] = useState<boolean>(true);
  const [showTourism, setShowTourism] = useState<boolean>(true);
  const [showFloodZones, setShowFloodZones] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<{
    type: 'COMPLAINT' | 'INCIDENT' | 'HOSPITAL' | 'FIRE_STATION' | 'CAMERA' | 'TOURISM' | 'WARD';
    data: any;
  } | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const minLat = 20.18;
  const maxLat = 20.41;
  const minLng = 85.73;
  const maxLng = 85.89;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 700;
    return { x, y };
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F7F1E5] flex items-center justify-center">
            <KonarkWheel size={20} color="#B8543A" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#211E1B]">
              Bhubaneswar Municipal GIS Map
            </h2>
            <p className="text-xs text-[#81786D]">
              Geospatial monitoring across 67 wards, NH-16 arterial corridor & Kuakhai/Daya river basin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.min(2.5, zoom + 0.25))}
            className="p-2 rounded-lg bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#211E1B] border border-[#E2D7C3] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(Math.max(0.75, zoom - 0.25))}
            className="p-2 rounded-lg bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#211E1B] border border-[#E2D7C3] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#211E1B] border border-[#E2D7C3] font-mono font-bold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Layer Filters Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setShowComplaints(!showComplaints)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
            showComplaints
              ? 'bg-[#F7F1E5] text-[#B8543A] border-[#B8543A] font-bold'
              : 'bg-[#FFFFFF] text-[#81786D] border-[#E2D7C3]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#B8543A]"></span>
          <span>Complaints ({complaints.length})</span>
        </button>

        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
            showIncidents
              ? 'bg-[#FDF2F1] text-[#B83A32] border-[#B83A32] font-bold'
              : 'bg-[#FFFFFF] text-[#81786D] border-[#E2D7C3]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#B83A32]"></span>
          <span>P1 Incidents ({incidents.length})</span>
        </button>

        <button
          onClick={() => setShowFloodZones(!showFloodZones)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
            showFloodZones
              ? 'bg-[#F7F1E5] text-[#6D3028] border-[#6D3028] font-bold'
              : 'bg-[#FFFFFF] text-[#81786D] border-[#E2D7C3]'
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-[#6D3028]" />
          <span>Waterlogging Hotspots</span>
        </button>

        <button
          onClick={() => setShowHospitals(!showHospitals)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
            showHospitals
              ? 'bg-[#F7F1E5] text-[#5C765A] border-[#5C765A] font-bold'
              : 'bg-[#FFFFFF] text-[#81786D] border-[#E2D7C3]'
          }`}
        >
          <Hospital className="w-3.5 h-3.5 text-[#5C765A]" />
          <span>Hospitals ({BHUBANESWAR_HOSPITALS.length})</span>
        </button>

        <button
          onClick={() => setShowFireStations(!showFireStations)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
            showFireStations
              ? 'bg-[#FDF2F1] text-[#B83A32] border-[#B83A32] font-bold'
              : 'bg-[#FFFFFF] text-[#81786D] border-[#E2D7C3]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#B83A32]" />
          <span>Fire Stations ({BHUBANESWAR_FIRE_STATIONS.length})</span>
        </button>

        <button
          onClick={() => setShowTourism(!showTourism)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
            showTourism
              ? 'bg-[#F7F1E5] text-[#C58B3A] border-[#C58B3A] font-bold'
              : 'bg-[#FFFFFF] text-[#81786D] border-[#E2D7C3]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#C58B3A]" />
          <span>Heritage Tourism ({BHUBANESWAR_TOURISM.length})</span>
        </button>
      </div>

      {/* Main Map Canvas and Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative h-[520px] lg:h-[620px] bg-[#F7F1E5] rounded-2xl border border-[#E2D7C3] overflow-hidden shadow-inner">
          {/* Subtle Konark compass rose */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] text-[11px] font-serif font-bold text-[#211E1B] flex items-center gap-2 shadow-xs">
            <KonarkWheel size={16} color="#B8543A" />
            <span>BHUBANESWAR GIS · NORTH ↑</span>
          </div>

          <svg
            viewBox="0 0 800 700"
            className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
            }}
          >
            {/* Waterways: Daya & Kuakhai Rivers */}
            <path
              d="M 600,680 Q 550,550 520,450 T 480,280 Q 450,150 490,40"
              fill="none"
              stroke="#D8C7AA"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Arterials: NH-16 Highway & Janpath */}
            <path
              d="M 120,650 L 260,520 L 380,380 L 460,260 L 590,140 L 720,40"
              fill="none"
              stroke="#81786D"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 120,650 L 260,520 L 380,380 L 460,260 L 590,140 L 720,40"
              fill="none"
              stroke="#B8543A"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />

            {/* Nandankanan Road */}
            <path
              d="M 460,260 L 440,160 L 450,80 L 480,20"
              fill="none"
              stroke="#C58B3A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            <text x="640" y="100" fill="#81786D" fontSize="10" fontFamily="Noto Serif" transform="rotate(-38, 640, 100)">
              NH-16 (Bhubaneswar-Cuttack)
            </text>

            {/* 67 Ward Nodes with Terracotta Boundaries */}
            {BHUBANESWAR_WARDS.map((w) => {
              const { x, y } = projectCoords(w.lat, w.lng);
              const isSelected = selectedItem?.data?.wardNo === w.wardNo;

              return (
                <g key={w.wardNo} className="cursor-pointer group" onClick={() => setSelectedItem({ type: 'WARD', data: w })}>
                  <circle
                    cx={x}
                    cy={y}
                    r={w.vulnerabilityIndex === 'HIGH' ? 22 : 16}
                    fill={w.vulnerabilityIndex === 'HIGH' ? 'rgba(184, 84, 58, 0.12)' : 'rgba(197, 139, 58, 0.08)'}
                    stroke={w.vulnerabilityIndex === 'HIGH' ? '#B8543A' : '#E2D7C3'}
                    strokeWidth="1"
                    strokeDasharray={w.vulnerabilityIndex === 'HIGH' ? '3 2' : 'none'}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 5 : 3}
                    fill={isSelected ? '#B8543A' : '#81786D'}
                  />
                  <text
                    x={x + 6}
                    y={y + 3}
                    fill="#3D3732"
                    fontSize="8.5"
                    fontFamily="Plus Jakarta Sans"
                    className="select-none font-bold"
                  >
                    W{w.wardNo} · {w.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Flood Inundation Circles */}
            {showFloodZones && (
              <g id="flood_zones">
                {(() => {
                  const { x, y } = projectCoords(20.2984, 85.8192);
                  return (
                    <g
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedItem({
                          type: 'INCIDENT',
                          data: incidents[0] || { title: 'Jayadev Vihar Flood Hazard' }
                        })
                      }
                    >
                      <circle cx={x} cy={y} r="28" fill="rgba(184, 58, 50, 0.18)" stroke="#B83A32" strokeWidth="1.5" />
                      <text x={x - 18} y={y - 20} fill="#B83A32" fontSize="9" fontWeight="bold">
                        ⚠️ FLOOD P1
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Hospitals */}
            {showHospitals &&
              BHUBANESWAR_HOSPITALS.map((hosp) => {
                const { x, y } = projectCoords(hosp.lat, hosp.lng);
                return (
                  <g
                    key={hosp.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedItem({ type: 'HOSPITAL', data: hosp })}
                  >
                    <circle cx={x} cy={y} r="8" fill="#5C765A" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x={x - 3} y={y + 3} fill="#ffffff" fontSize="8" fontWeight="bold">
                      +
                    </text>
                  </g>
                );
              })}

            {/* Fire Stations */}
            {showFireStations &&
              BHUBANESWAR_FIRE_STATIONS.map((fire) => {
                const { x, y } = projectCoords(fire.lat, fire.lng);
                return (
                  <g
                    key={fire.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedItem({ type: 'FIRE_STATION', data: fire })}
                  >
                    <circle cx={x} cy={y} r="7.5" fill="#B83A32" stroke="#FFFFFF" strokeWidth="1.2" />
                    <text x={x - 2.5} y={y + 2.5} fill="#ffffff" fontSize="7" fontWeight="bold">
                      F
                    </text>
                  </g>
                );
              })}

            {/* Heritage Tourism */}
            {showTourism &&
              BHUBANESWAR_TOURISM.map((tour) => {
                const { x, y } = projectCoords(tour.lat, tour.lng);
                return (
                  <g
                    key={tour.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedItem({ type: 'TOURISM', data: tour })}
                  >
                    <polygon
                      points={`${x},${y - 8} ${x + 7},${y + 5} ${x - 7},${y + 5}`}
                      fill="#C58B3A"
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                    />
                  </g>
                );
              })}

            {/* Complaints */}
            {showComplaints &&
              complaints.map((c) => {
                const { x, y } = projectCoords(c.lat, c.lng);
                const isCritical = c.priority === 'P1_CRITICAL';
                return (
                  <g
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedItem({ type: 'COMPLAINT', data: c });
                      if (onSelectComplaint) onSelectComplaint(c);
                    }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isCritical ? 6.5 : 5}
                      fill={isCritical ? '#B83A32' : c.status === 'RESOLVED' ? '#5C765A' : '#B8543A'}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Selected Landmark Drawer */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
              <span className="text-xs font-mono font-bold text-[#B8543A] uppercase">
                {selectedItem ? selectedItem.type : 'MAP INTELLIGENCE'}
              </span>
              {selectedItem && (
                <button onClick={() => setSelectedItem(null)} className="text-[#81786D] hover:text-[#211E1B]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedItem ? (
              <div className="mt-3 space-y-3 text-xs">
                {selectedItem.type === 'COMPLAINT' && (
                  <div className="space-y-2">
                    <span className="font-mono text-[#B8543A] font-bold">{selectedItem.data.ticketNo}</span>
                    <h4 className="font-serif font-bold text-sm text-[#211E1B]">{selectedItem.data.category}</h4>
                    <p className="text-[#81786D]">{selectedItem.data.description}</p>
                    <div className="pt-2 border-t border-[#E2D7C3] space-y-1 text-[#3D3732]">
                      <p><strong>Ward:</strong> {selectedItem.data.ward}</p>
                      <p><strong>Status:</strong> <span className="text-[#B8543A] font-bold">{selectedItem.data.status}</span></p>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'HOSPITAL' && (
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#5C765A]">{selectedItem.data.name}</h4>
                    <p className="text-[#81786D]">{selectedItem.data.ward}</p>
                    <div className="p-3 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                      <p className="text-[#211E1B]">ICU Available: <strong className="text-[#5C765A]">{selectedItem.data.icuAvailable} / {selectedItem.data.icuTotal} Beds</strong></p>
                      <p className="text-[#211E1B]">Trauma Desk: <strong className="text-[#211E1B]">24/7 Active</strong></p>
                      <p className="text-[#81786D] mt-1">Phone: {selectedItem.data.phone}</p>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'WARD' && (
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#211E1B]">Ward {selectedItem.data.wardNo}: {selectedItem.data.name}</h4>
                    <p className="text-[#81786D]">Zone: <strong>{selectedItem.data.zone}</strong></p>
                    <p className="text-[#81786D]">Corporator: <strong>{selectedItem.data.corporatorName}</strong></p>
                    <div className="p-2.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3]">
                      <span className="text-[10px] text-[#81786D]">VULNERABILITY INDEX</span>
                      <p className={`font-mono font-bold ${
                        selectedItem.data.vulnerabilityIndex === 'HIGH' ? 'text-[#B83A32]' : 'text-[#5C765A]'
                      }`}>
                        {selectedItem.data.vulnerabilityIndex} PRIORITY
                      </p>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'TOURISM' && (
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#6D3028]">{selectedItem.data.name}</h4>
                    <p className="text-[#81786D]">{selectedItem.data.description}</p>
                    <div className="p-2.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                      <p><strong>Crowd:</strong> <span className="text-[#C58B3A] font-bold">{selectedItem.data.crowdLevel}</span></p>
                      <p><strong>Timings:</strong> {selectedItem.data.timings}</p>
                      <p><strong>Entry:</strong> {selectedItem.data.entryFee}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-[#81786D] space-y-2">
                <Info className="w-8 h-8 mx-auto text-[#81786D]" />
                <p>Click any map pin or ward node to view municipal telemetry.</p>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[11px] text-[#81786D] font-mono">
            COORDS: 20.2961° N, 85.8245° E
          </div>
        </div>
      </div>
    </div>
  );
};
