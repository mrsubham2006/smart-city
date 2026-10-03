import React, { useState } from 'react';
import {
  Shield,
  Activity,
  ArrowRight,
  FileText,
  PhoneCall,
  Sparkles,
  Compass,
  Waves,
  Trash2,
  Construction,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Navigation,
  ExternalLink,
  LogIn,
  AlertOctagon,
  HeartPulse,
  Flame,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BHUBANESWAR_TOURISM } from '../../services/bhubaneswarData';
import { KonarkWheel } from '../common/KonarkWheel';
import { PattachitraDivider } from '../common/PattachitraDivider';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onOpenVoice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenVoice }) => {
  const { lang, t } = useLanguage();
  const { currentUser, getAuthorizedDashboardPath } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  const handleReportClick = () => {
    if (currentUser) {
      if (currentUser.role === 'CITIZEN') {
        onNavigate('/citizen');
      } else {
        onNavigate(getAuthorizedDashboardPath(currentUser.role));
      }
    } else {
      onNavigate('/login/citizen');
    }
  };

  const handleIntelligenceClick = () => {
    if (currentUser && (currentUser.role === 'BMC_ADMIN' || currentUser.role === 'COMMISSIONER')) {
      onNavigate('/command-center');
    } else {
      // Scroll to intelligence section
      const el = document.getElementById('intelligence');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      {/* Institutional Top Trust Bar */}
      <div className="bg-[#FFFFFF] border border-[#E2D7C3] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5 text-[#211E1B]">
          <div className="w-5 h-5 rounded-full bg-[#F7F1E5] flex items-center justify-center">
            <KonarkWheel size={14} color="#B8543A" />
          </div>
          <span className="font-serif font-bold text-[#6D3028]">
            BHUBANESWAR MUNICIPAL CORPORATION (BMC)
          </span>
          <span className="text-[#81786D] hidden sm:inline">· Proposed Smart City Operational Platform</span>
        </div>
        <div className="flex items-center gap-3 text-[#81786D] font-mono text-[11px]">
          <span>67 WARDS</span>
          <span>·</span>
          <span>NORTH · CENTRAL · SOUTH-WEST ZONES</span>
        </div>
      </div>

      {/* SECTION 1: EDITORIAL HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] p-8 lg:p-14 shadow-sm">
        {/* Subtle Ikat pattern overlay */}
        <div className="absolute inset-0 bg-ikat-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F1E5] border border-[#B8543A]/30 text-[#6D3028] text-xs font-semibold">
              <KonarkWheel size={14} color="#B8543A" />
              <span>AI-POWERED CITY INTELLIGENCE</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#211E1B] tracking-tight leading-[1.12]">
                CIVIC NEXUS <span className="text-[#B8543A]">AI</span>
              </h1>
              <p className="text-xl sm:text-2xl font-serif italic text-[#6D3028] leading-snug">
                "{lang === 'OD' ? t('platform_tagline') : 'One City. One Intelligence. One Connected Response.'}"
              </p>
              <p className="text-sm text-[#81786D] italic">
                "{lang === 'OD' ? t('platform_emotional') : "We're not just building a smarter city. We're building a city that cares."}"
              </p>
            </div>

            <p className="text-sm text-[#3D3732] leading-relaxed max-w-xl">
              Connecting citizens, civic services and response teams to help Bhubaneswar understand problems, coordinate action and build a safer, more responsive city.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleReportClick}
                className="px-6 py-3.5 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{lang === 'OD' ? 'ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ' : 'REPORT A CIVIC ISSUE'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleIntelligenceClick}
                className="px-6 py-3.5 rounded-xl bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#211E1B] font-bold text-xs border border-[#E2D7C3] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-[#B8543A]" />
                <span>{lang === 'OD' ? 'ନଗର ପରିଚାଳନା ଦେଖନ୍ତୁ' : 'EXPLORE CITY INTELLIGENCE'}</span>
              </button>

              <button
                onClick={() => setShowEmergencyModal(true)}
                className="px-5 py-3.5 rounded-xl bg-[#B83A32]/10 hover:bg-[#B83A32]/20 text-[#B83A32] border border-[#B83A32]/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>EMERGENCY HELP</span>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Elegant Bhubaneswar Civic Art & Konark Geometry */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-2xl bg-[#F7F1E5] border border-[#E2D7C3] shadow-inner space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
                <div className="flex items-center gap-2">
                  <KonarkWheel size={18} color="#B8543A" />
                  <span className="font-serif font-bold text-xs text-[#211E1B]">BHUBANESWAR TELEMETRY</span>
                </div>
                <span className="text-[10px] font-mono text-[#5C765A] font-bold">67 WARDS LIVE</span>
              </div>

              {/* Stylized Vector Map representation */}
              <div className="space-y-2.5 text-xs text-[#3D3732]">
                <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#211E1B]">Jayadev Vihar (Ward 14)</p>
                    <p className="text-[11px] text-[#81786D]">Stormwater dewatering pump active</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FDF6ED] text-[#C58B3A] font-bold">
                    P1 FLOOD
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#211E1B]">Patia Square (Ward 2)</p>
                    <p className="text-[11px] text-[#81786D]">Sanitation compactor en route</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F1E5] text-[#5C765A] font-bold">
                    ASSIGNED
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#211E1B]">Old Town Lingaraj (Ward 45)</p>
                    <p className="text-[11px] text-[#81786D]">Heritage zone crowd: Moderate</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F1E5] text-[#81786D]">
                    VISITOR GREEN
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-[#81786D] text-center">
                OFFICIAL CIVIC INTELLIGENCE PLATFORM · BMC BHUBANESWAR
              </div>
            </div>
          </div>
        </div>
      </div>

      <PattachitraDivider theme="terracotta" />

      {/* SECTION 2: "HOW A CITY RESPONDS" (Operational Lifecycle) */}
      <div id="platform" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#B8543A] uppercase tracking-wider">
            Operational Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#211E1B]">
            How Bhubaneswar Responds
          </h2>
          <p className="text-xs text-[#81786D]">
            From the moment a problem is detected to verified field resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <span className="text-xs font-serif font-bold text-[#B8543A]">01. CITIZEN</span>
            <h3 className="text-sm font-bold text-[#211E1B]">Report Logged</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Photo, voice, or text grievance submitted with auto-detected GPS coords.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <span className="text-xs font-serif font-bold text-[#C58B3A]">02. AI TRIAGE</span>
            <h3 className="text-sm font-bold text-[#211E1B]">Instant Analysis</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Severity classified (P1–P4), duplicates checked, routed to BMC dept.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <span className="text-xs font-serif font-bold text-[#6D3028]">03. DEPARTMENT</span>
            <h3 className="text-sm font-bold text-[#211E1B]">Work Order</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Department officer assigns work order to local ward supervisor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <span className="text-xs font-serif font-bold text-[#B8543A]">04. FIELD SQUAD</span>
            <h3 className="text-sm font-bold text-[#211E1B]">On-Site Action</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Responders arrive, execute work, and upload before/after photos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <span className="text-xs font-serif font-bold text-[#5C765A]">05. CITIZEN</span>
            <h3 className="text-sm font-bold text-[#211E1B]">Resolution Verified</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Citizen reviews photographic evidence and confirms resolution.
            </p>
          </div>
        </div>
      </div>

      <PattachitraDivider theme="ochre" />

      {/* SECTION 3: "ONE CITY. MANY SIGNALS." (City Intelligence Overview) */}
      <div id="intelligence" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#B8543A] uppercase tracking-wider">
            Integrated Data Streams
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#211E1B]">
            One City. Many Signals.
          </h2>
          <p className="text-xs text-[#81786D]">
            Civic Nexus AI connects fragmented municipal data streams into a single operating layer.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: 'Citizen Grievances', icon: FileText, desc: '67 Wards Intake' },
            { title: 'Smart CCTV Feeds', icon: Activity, desc: 'Visual Anomaly AI' },
            { title: 'Weather Radar', icon: Waves, desc: 'Rainfall Hydrology' },
            { title: 'Traffic Corridors', icon: Navigation, desc: 'NH-16 & Janpath' },
            { title: '112 Emergency', icon: PhoneCall, desc: 'Fire & Trauma Beds' },
            { title: 'Ward Infrastructure', icon: Construction, desc: 'Roads & Drainage' }
          ].map((sig, idx) => {
            const Icon = sig.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#F7F1E5] flex items-center justify-center mx-auto text-[#B8543A]">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-[#211E1B]">{sig.title}</h4>
                <p className="text-[10px] text-[#81786D]">{sig.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <PattachitraDivider theme="terracotta" />

      {/* SECTION 4: "BUILT FOR BHUBANESWAR" (Civic Responsibilities) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#B8543A] uppercase tracking-wider">
            BMC Responsibilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#211E1B]">
            Built for Bhubaneswar Municipal Realities
          </h2>
          <p className="text-xs text-[#81786D]">
            Mapped to official municipal departments and emergency partner agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#B8543A]">DRAINAGE & FLOOD</span>
              <Waves className="w-4 h-4 text-[#B8543A]" />
            </div>
            <h3 className="font-bold text-sm text-[#211E1B]">Disaster Management</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Monitoring 10 primary drainage basins, low-lying culverts at Jayadev Vihar and Sundarpada, and deploying mobile dewatering pump squads.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#5C765A]">HEALTH & HYGIENE</span>
              <Trash2 className="w-4 h-4 text-[#5C765A]" />
            </div>
            <h3 className="font-bold text-sm text-[#211E1B]">Sanitation & Waste</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Night-shift hydraulic compactor dispatch, commercial bin overflow clearing, and public disinfectant spraying.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#C58B3A]">CIVIL WORKS</span>
              <Construction className="w-4 h-4 text-[#C58B3A]" />
            </div>
            <h3 className="font-bold text-sm text-[#211E1B]">Engineering & Roads</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Post-monsoon pothole resurfacing, utility excavation safety barriers, and pedestrian footpath maintenance across all wards.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#C58B3A]">ENERGY & LIGHT</span>
              <Zap className="w-4 h-4 text-[#C58B3A]" />
            </div>
            <h3 className="font-bold text-sm text-[#211E1B]">Street Lighting</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Feeder pillar MCB replacement, dark corridor restoration, and energy-efficient LED maintenance.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#B83A32]">EMERGENCY PARTNER</span>
              <PhoneCall className="w-4 h-4 text-[#B83A32]" />
            </div>
            <h3 className="font-bold text-sm text-[#211E1B]">112 & Fire Services</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Integrated with Odisha Fire Services and 108 Emergency Medical with real-time Capital Hospital / AIIMS trauma bed readiness.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#6D3028]">HERITAGE CULTURE</span>
              <Compass className="w-4 h-4 text-[#6D3028]" />
            </div>
            <h3 className="font-bold text-sm text-[#211E1B]">Ekamra Smart Tourism</h3>
            <p className="text-xs text-[#81786D] leading-relaxed">
              Crowd-aware itineraries and multilingual audio guides for Lingaraj Temple, Mukteshvara, and Khandagiri Caves.
            </p>
          </div>
        </div>
      </div>

      <PattachitraDivider theme="ochre" />

      {/* SECTION 5: SMART TOURISM SPOTLIGHT */}
      <div id="tourism-guide" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-[#B8543A] uppercase">Ekamra Kshetra</span>
            <h2 className="text-2xl font-serif font-bold text-[#211E1B]">
              Smart Bhubaneswar Heritage
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/tourism')}
            className="text-xs text-[#B8543A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Heritage Sites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BHUBANESWAR_TOURISM.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onNavigate('/tourism')}
              className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] hover:border-[#B8543A] transition-all cursor-pointer space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#B8543A] font-bold">
                  {p.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F7F1E5] text-[#81786D]">
                  {p.crowdLevel}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#211E1B] truncate">{p.name}</h4>
              <p className="text-xs text-[#81786D] line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: INSTITUTIONAL ABOUT & GOVERNANCE */}
      <div id="about" className="p-8 lg:p-12 rounded-2xl bg-[#211E1B] text-[#F7F1E5] text-center space-y-6 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#3D3732] flex items-center justify-center mx-auto text-[#B8543A]">
          <KonarkWheel size={32} color="#C58B3A" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F1E5]">
            Unified Civic Operations for Bhubaneswar
          </h2>
          <p className="text-xs text-[#D8C7AA] leading-relaxed">
            Civic Nexus AI connects citizens, municipal field squads, emergency services, and BMC leadership into one trusted public service platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/login')}
            className="px-6 py-3 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>ENTER SECURE ROLE LOGIN</span>
          </button>
        </div>
      </div>

      {/* Traditional Footer */}
      <footer className="pt-8 border-t border-[#E2D7C3] text-center text-xs text-[#81786D] space-y-2">
        <div className="flex items-center justify-center gap-2 font-serif font-bold text-[#211E1B]">
          <KonarkWheel size={16} color="#B8543A" />
          <span>CIVIC NEXUS AI · BHUBANESWAR MUNICIPAL CORPORATION</span>
        </div>
        <p className="text-[11px]">
          Official Civic Intelligence & Response System · Bhubaneswar, Odisha
        </p>
      </footer>

      {/* Public Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border-2 border-[#B83A32]/40 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#B83A32] text-white flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#211E1B]">Emergency Helpline Directory</h3>
                  <p className="text-xs text-[#81786D]">Bhubaneswar Multi-Agency Emergency Response</p>
                </div>
              </div>

              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#F7F1E5] text-[#81786D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#B83A32]/10 border border-[#B83A32]/30 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#B83A32]">112 — National Unified Emergency</p>
                  <p className="text-xs text-[#81786D]">Police, Fire, and Ambulance Integration</p>
                </div>
                <a
                  href="tel:112"
                  className="px-3.5 py-1.5 rounded-lg bg-[#B83A32] text-white font-bold text-xs shadow-xs"
                >
                  Call 112
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#211E1B]">108 — Medical Emergency & Trauma</p>
                  <p className="text-xs text-[#81786D]">Capital Hospital / AIIMS Ambulance Fleet</p>
                </div>
                <a
                  href="tel:108"
                  className="px-3.5 py-1.5 rounded-lg bg-[#5C765A] text-white font-bold text-xs shadow-xs"
                >
                  Call 108
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#211E1B]">101 — Odisha Fire & Rescue Services</p>
                  <p className="text-xs text-[#81786D]">Kalpana Square / Chandrasekharpur Stations</p>
                </div>
                <a
                  href="tel:101"
                  className="px-3.5 py-1.5 rounded-lg bg-[#C58B3A] text-white font-bold text-xs shadow-xs"
                >
                  Call 101
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#211E1B]">1929 — BMC 24x7 Control Helpline</p>
                  <p className="text-xs text-[#81786D]">Municipal Flood & Disaster Dewatering</p>
                </div>
                <a
                  href="tel:1929"
                  className="px-3.5 py-1.5 rounded-lg bg-[#211E1B] text-[#F7F1E5] font-bold text-xs shadow-xs"
                >
                  Call 1929
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
