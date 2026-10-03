import React, { useState } from 'react';
import {
  FileText,
  Camera,
  Mic,
  MicOff,
  MapPin,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  RotateCcw,
  ThumbsUp,
  Image as ImageIcon,
  Check,
  Search,
  Waves,
  Trash2,
  Construction,
  Zap,
  PhoneCall,
  Shield,
  Trees,
  Droplets
} from 'lucide-react';
import { Complaint } from '../../types';
import { BHUBANESWAR_WARDS } from '../../services/bhubaneswarData';
import { analyzeComplaintWithAi } from '../../services/geminiService';
import { saveComplaint } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { KonarkWheel } from '../common/KonarkWheel';
import { PattachitraDivider } from '../common/PattachitraDivider';

interface CitizenPortalProps {
  complaints: Complaint[];
  onRefresh: () => void;
}

const CATEGORY_CARDS = [
  { id: 'Flood / Waterlogging', label: 'Flood & Waterlogging', icon: Waves, desc: 'Stormwater choke, waterlogged roads' },
  { id: 'Drainage & Stormwater', label: 'Drainage Culverts', icon: Droplets, desc: 'Sluice gates, silted box drains' },
  { id: 'Roads & Footpaths', label: 'Roads & Potholes', icon: Construction, desc: 'Bitumen subsidence, open trenches' },
  { id: 'Garbage / Solid Waste', label: 'Waste & Sanitation', icon: Trash2, desc: 'Commercial bins, illegal dumping' },
  { id: 'Electrical & Street Lighting', label: 'Street Lighting', icon: Zap, desc: 'Dark corridors, blown LED drivers' },
  { id: 'Drinking Water Supply', label: 'Drinking Water', icon: Droplets, desc: 'Pipeline leakage, low pressure' },
  { id: 'Traffic & Congestion', label: 'Traffic & Obstruction', icon: Shield, desc: 'Signals down, abandoned vehicles' },
  { id: 'Environment & Tree Fall', label: 'Environment & Trees', icon: Trees, desc: 'Fallen branches, park maintenance' },
  { id: 'Public Safety & Nuisance', label: 'Public Safety', icon: AlertTriangle, desc: 'Stray animals, hazard barriers' }
];

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ complaints, onRefresh }) => {
  const { currentUser } = useAuth();
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'REPORT' | 'TRACK' | 'MY_REPORTS'>('REPORT');

  // Report Form States
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<string>('Flood / Waterlogging');
  const [description, setDescription] = useState<string>('');
  const [ward, setWard] = useState<string>('Ward 14 (Jayadev Vihar)');
  const [address, setAddress] = useState<string>('Near Pal Heights, Jayadev Vihar Overbridge');
  const [lat, setLat] = useState<number>(20.2984);
  const [lng, setLng] = useState<number>(85.8192);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // AI Triage preview state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiPreview, setAiPreview] = useState<any>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Track state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints[0] || null
  );
  const [searchTicket, setSearchTicket] = useState<string>('');
  const [reopenReason, setReopenReason] = useState<string>('');
  const [showReopenDialog, setShowReopenDialog] = useState<boolean>(false);

  // Submission success
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Speech Recognition
  const handleVoiceRecord = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported by your browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      setIsRecording(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeComplaintWithAi(description, category, address, complaints);
      setAiPreview(result);
      if (result.duplicateCandidateId) {
        setDuplicateWarning(
          `A similar grievance (${result.duplicateCandidateId}) was recently registered in this ward.`
        );
      } else {
        setDuplicateWarning(null);
      }
      setStep(4);
    } catch (err) {
      console.error('AI Triage error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitComplaint = async () => {
    const ticketNo = `BMC-CNX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: Complaint = {
      id: `cmp_${Date.now()}`,
      ticketNo,
      citizenId: currentUser?.id || 'cit_guest',
      citizenName: currentUser?.name || 'Citizen Subham',
      citizenPhone: currentUser?.phone || '+91-9876543210',
      category: aiPreview?.category || category,
      subcategory: aiPreview?.subcategory || 'General Civic Issue',
      description,
      photoUrl: photoPreview || '',
      address,
      ward,
      zone: aiPreview?.zoneEstimated || 'Central Zone',
      lat,
      lng,
      status: 'SUBMITTED',
      priority: aiPreview?.priority || 'P2_HIGH',
      severity: aiPreview?.severity || 'HIGH',
      department: aiPreview?.department || 'Engineering & Roads',
      aiAnalysis: aiPreview,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          updatedBy: `${currentUser?.name || 'Citizen'} (BMC Portal)`,
          userRole: 'CITIZEN',
          note: 'Grievance submitted with location coordinates.'
        },
        {
          id: `tl_ai_${Date.now()}`,
          status: 'AI_ANALYSIS',
          timestamp: new Date().toISOString(),
          updatedBy: 'Civic Nexus AI Triage',
          userRole: 'SYSTEM_AI',
          note: `Auto-triaged as ${aiPreview?.priority || 'P2_HIGH'}. Assigned to ${aiPreview?.department || 'Engineering'}.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveComplaint(newComplaint);
    setSubmittedTicket(ticketNo);
    setSelectedComplaint(newComplaint);
    onRefresh();
  };

  const handleCitizenConfirm = async (confirmed: boolean) => {
    if (!selectedComplaint) return;

    if (confirmed) {
      const updated: Complaint = {
        ...selectedComplaint,
        status: 'CITIZEN_CONFIRMED',
        citizenFeedback: {
          confirmed: true,
          rating: 5,
          comment: 'Issue resolved satisfactorily by BMC team.',
          confirmedAt: new Date().toISOString()
        },
        timeline: [
          ...selectedComplaint.timeline,
          {
            id: `tl_${Date.now()}`,
            status: 'CITIZEN_CONFIRMED',
            timestamp: new Date().toISOString(),
            updatedBy: `${currentUser?.name || 'Citizen'}`,
            userRole: 'CITIZEN',
            note: 'Citizen confirmed successful resolution of the grievance.'
          }
        ],
        updatedAt: new Date().toISOString()
      };
      await saveComplaint(updated);
      setSelectedComplaint(updated);
      onRefresh();
    } else {
      setShowReopenDialog(true);
    }
  };

  const handleReopenComplaint = async () => {
    if (!selectedComplaint) return;
    const updated: Complaint = {
      ...selectedComplaint,
      status: 'ESCALATED',
      reopenReason,
      priority: 'P1_CRITICAL',
      timeline: [
        ...selectedComplaint.timeline,
        {
          id: `tl_${Date.now()}`,
          status: 'ESCALATED',
          timestamp: new Date().toISOString(),
          updatedBy: `${currentUser?.name || 'Citizen'}`,
          userRole: 'CITIZEN',
          note: `Citizen reopened grievance: "${reopenReason}". Escalated automatically to Zone Officer.`
        }
      ],
      updatedAt: new Date().toISOString()
    };
    await saveComplaint(updated);
    setSelectedComplaint(updated);
    setShowReopenDialog(false);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Warm Namaskar Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-serif font-bold text-[#B8543A] uppercase tracking-wider">
            {lang === 'OD' ? 'ନାଗରିକ ସେବା କେନ୍ଦ୍ର' : 'Bhubaneswar Citizen Portal'}
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#211E1B] mt-0.5">
            {lang === 'OD' ? 'ନମସ୍କାର' : 'Namaskar'}, {currentUser?.name || 'Subham'}
          </h1>
          <p className="text-xs text-[#81786D] mt-1">
            {lang === 'OD' ? t('citizen_help_prompt') : 'What can we help you resolve in Bhubaneswar today?'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F1E5] rounded-xl border border-[#E2D7C3] text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('REPORT');
              setSubmittedTicket(null);
            }}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'REPORT'
                ? 'bg-[#B8543A] text-white shadow-xs font-bold'
                : 'text-[#81786D] hover:text-[#211E1B]'
            }`}
          >
            {lang === 'OD' ? 'ଅଭିଯୋଗ ଦାଖଲ' : 'Report an Issue'}
          </button>
          <button
            onClick={() => setActiveTab('TRACK')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'TRACK'
                ? 'bg-[#B8543A] text-white shadow-xs font-bold'
                : 'text-[#81786D] hover:text-[#211E1B]'
            }`}
          >
            {lang === 'OD' ? 'ସ୍ଥିତି ଯାଞ୍ଚ' : 'Track Grievance'}
          </button>
          <button
            onClick={() => setActiveTab('MY_REPORTS')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'MY_REPORTS'
                ? 'bg-[#B8543A] text-white shadow-xs font-bold'
                : 'text-[#81786D] hover:text-[#211E1B]'
            }`}
          >
            {lang === 'OD' ? 'ମୋର ଅଭିଯୋଗ' : `My Reports (${complaints.length})`}
          </button>
        </div>
      </div>

      {/* TAB 1: REPORT AN ISSUE (Human 4-step Flow) */}
      {activeTab === 'REPORT' && (
        <div className="space-y-6">
          {submittedTicket ? (
            <div className="p-8 lg:p-12 rounded-2xl bg-[#FFFFFF] border border-[#5C765A]/40 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#F7F1E5] border border-[#5C765A] flex items-center justify-center mx-auto text-[#5C765A]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-[#5C765A] uppercase tracking-wider font-bold">
                  Grievance Registered Successfully
                </span>
                <h2 className="text-3xl font-mono font-bold text-[#211E1B]">{submittedTicket}</h2>
                <p className="text-xs text-[#81786D] max-w-md mx-auto">
                  Your grievance has been classified and routed to the responsible BMC ward squad. You can track progress and review before/after photographic proof here.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#81786D]">Category:</span>
                  <span className="text-[#211E1B] font-bold">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#81786D]">Ward:</span>
                  <span className="text-[#211E1B] font-bold">{ward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#81786D]">Estimated Resolution:</span>
                  <span className="text-[#B8543A] font-bold">Within 4-8 Hours</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('TRACK')}
                  className="px-5 py-2.5 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Track Grievance Timeline
                </button>
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setStep(1);
                    setDescription('');
                    setPhotoPreview(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#211E1B] font-bold text-xs border border-[#E2D7C3] transition-colors"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 lg:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-6 shadow-sm">
              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2D7C3]">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#F7F1E5] border border-[#B8543A] flex items-center justify-center text-xs font-bold text-[#B8543A]">
                    {step}
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#211E1B]">
                    {step === 1 && 'Step 1: What is happening?'}
                    {step === 2 && 'Step 2: Tell us more (Text or Voice)'}
                    {step === 3 && 'Step 3: Where is it happening?'}
                    {step === 4 && 'Step 4: Review and Submit'}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#81786D]">Step {step} of 4</span>
              </div>

              {/* STEP 1: CATEGORY SELECTION */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-[#81786D]">
                    Choose the category that best describes the municipal problem:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CATEGORY_CARDS.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                            isSelected
                              ? 'bg-[#F7F1E5] border-[#B8543A] shadow-xs'
                              : 'bg-[#FFFFFF] border-[#E2D7C3] hover:border-[#81786D]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-[#B8543A]' : 'text-[#81786D]'}`} />
                            {isSelected && <Check className="w-4 h-4 text-[#B8543A]" />}
                          </div>
                          <h4 className="font-bold text-[#211E1B]">{cat.label}</h4>
                          <p className="text-[11px] text-[#81786D] leading-snug">{cat.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DESCRIPTION, PHOTO & VOICE */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#211E1B] flex items-center justify-between">
                      <span>Describe what you observed *</span>
                      <span className="text-[11px] text-[#81786D] font-normal">Mention key street landmarks</span>
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Heavy waterlogging reaching knee height near Jayadev Vihar Overbridge service lane. Vehicles are getting stalled."
                      className="w-full p-3 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B8543A] placeholder:text-[#81786D]"
                    />
                  </div>

                  {/* Voice Dictation */}
                  <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#211E1B] flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-[#B8543A]" />
                        <span>Speak Your Grievance (Voice Dictation)</span>
                      </p>
                      <p className="text-[11px] text-[#81786D]">
                        Speak in English or Odia. It will transcribe directly into the description.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleVoiceRecord}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                        isRecording
                          ? 'bg-[#B83A32] text-white border-[#B83A32] animate-pulse'
                          : 'bg-[#FFFFFF] text-[#6D3028] border-[#E2D7C3] hover:border-[#B8543A]'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isRecording ? 'Listening...' : 'Record'}</span>
                    </button>
                  </div>

                  {/* Photo Evidence */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#211E1B]">
                      Upload Photo / Evidence (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] hover:border-[#B8543A] text-[#211E1B] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                        <Camera className="w-4 h-4 text-[#B8543A]" />
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {photoPreview && (
                        <div className="flex items-center gap-2">
                          <img
                            src={photoPreview}
                            alt="Uploaded evidence preview"
                            className="w-10 h-10 rounded-lg object-cover border border-[#E2D7C3]"
                          />
                          <span className="text-[11px] text-[#5C765A] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Photo Attached
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E2D7C3]">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-xs text-[#81786D] hover:text-[#211E1B]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!description.trim()}
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-[#B8543A] disabled:opacity-40 hover:bg-[#A14731] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Next: Location</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: LOCATION & WARD */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#211E1B]">
                      Select BMC Municipal Ward *
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B8543A] font-medium"
                    >
                      {BHUBANESWAR_WARDS.map((w) => (
                        <option key={w.wardNo} value={`Ward ${w.wardNo} (${w.name})`}>
                          Ward {w.wardNo}: {w.name} ({w.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#211E1B]">
                      Street Landmark Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g., Near Pal Heights Hotel, NH-16 Service Road, Jayadev Vihar"
                      className="w-full p-2.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B8543A]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#3D3732]">
                      <MapPin className="w-4 h-4 text-[#B8543A]" />
                      <span>GPS Coordinates:</span>
                      <span className="font-mono text-[#6D3028] font-bold">{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              setLat(pos.coords.latitude);
                              setLng(pos.coords.longitude);
                            },
                            () => {}
                          );
                        }
                      }}
                      className="text-[11px] text-[#B8543A] hover:underline font-bold"
                    >
                      Refresh GPS
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E2D7C3]">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 text-xs text-[#81786D] hover:text-[#211E1B]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isAnalyzing}
                      onClick={handleTriggerAiAnalysis}
                      className="px-6 py-2.5 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                    >
                      <KonarkWheel size={14} color="#FFFFFF" />
                      <span>{isAnalyzing ? 'Analyzing with Civic AI...' : 'Review & Submit'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & FINAL SUBMIT */}
              {step === 4 && aiPreview && (
                <div className="space-y-4">
                  {duplicateWarning && (
                    <div className="p-3.5 rounded-xl bg-[#FDF6ED] border border-[#C58B3A]/60 text-[#6D3028] text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-[#C58B3A] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Duplicate Incident Notice</p>
                        <p className="text-[11px] mt-0.5">{duplicateWarning}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2D7C3]">
                      <span className="text-xs font-serif font-bold text-[#6D3028] flex items-center gap-1.5">
                        <KonarkWheel size={14} color="#B8543A" />
                        AI CIVIC TRIAGE SUMMARY
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2D7C3] text-[#5C765A] font-bold">
                        Confidence: {(aiPreview.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3]">
                        <span className="text-[10px] text-[#81786D]">CATEGORY</span>
                        <p className="font-bold text-[#211E1B] truncate">{aiPreview.category}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3]">
                        <span className="text-[10px] text-[#81786D]">PRIORITY</span>
                        <p className="font-mono font-bold text-[#B83A32]">{aiPreview.priority}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3]">
                        <span className="text-[10px] text-[#81786D]">RESPONSIBLE DEPT</span>
                        <p className="font-bold text-[#6D3028] truncate">{aiPreview.department}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3]">
                        <span className="text-[10px] text-[#81786D]">EST. RESOLUTION</span>
                        <p className="font-mono font-bold text-[#5C765A]">{aiPreview.estimatedResolutionHours} Hours</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#3D3732] pt-1">
                      <strong>Recommended Action:</strong> {aiPreview.recommendedAction}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E2D7C3]">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2 text-xs text-[#81786D] hover:text-[#211E1B]"
                    >
                      Back to Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitComplaint}
                      className="px-6 py-2.5 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirm & Register Grievance</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRACK GRIEVANCE TIMELINE */}
      {activeTab === 'TRACK' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#81786D]" />
              <input
                type="text"
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                placeholder="Search ticket (BMC-CNX)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-xs text-[#211E1B] placeholder:text-[#81786D] focus:outline-none focus:border-[#B8543A]"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {complaints
                .filter(c => !searchTicket || c.ticketNo.toLowerCase().includes(searchTicket.toLowerCase()) || c.category.toLowerCase().includes(searchTicket.toLowerCase()))
                .map((cmp) => (
                  <div
                    key={cmp.id}
                    onClick={() => setSelectedComplaint(cmp)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1 ${
                      selectedComplaint?.id === cmp.id
                        ? 'bg-[#F7F1E5] border-[#B8543A] shadow-xs'
                        : 'bg-[#FFFFFF] border-[#E2D7C3] hover:border-[#81786D] text-[#81786D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#B8543A] font-bold">{cmp.ticketNo}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#F7F1E5] text-[#211E1B]">
                        {cmp.status}
                      </span>
                    </div>
                    <p className="font-bold text-[#211E1B] truncate">{cmp.category}</p>
                    <p className="text-[11px] text-[#81786D] truncate">{cmp.ward}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Timeline & Evidence Detail */}
          <div className="lg:col-span-2">
            {selectedComplaint ? (
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2D7C3]">
                  <div>
                    <span className="text-xs font-mono text-[#B8543A] font-bold">{selectedComplaint.ticketNo}</span>
                    <h2 className="text-lg font-serif font-bold text-[#211E1B]">{selectedComplaint.category}</h2>
                    <p className="text-xs text-[#81786D]">{selectedComplaint.address} · {selectedComplaint.ward}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#F7F1E5] border border-[#B8543A]/30 text-[#6D3028] text-xs font-mono font-bold">
                    {selectedComplaint.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs space-y-2">
                  <p className="text-[#3D3732] leading-relaxed">{selectedComplaint.description}</p>
                  <div className="pt-2 border-t border-[#E2D7C3] flex flex-wrap gap-4 text-[#81786D] text-[11px]">
                    <span>Dept: <strong className="text-[#211E1B]">{selectedComplaint.department}</strong></span>
                    {selectedComplaint.assignedWorkerName && (
                      <span>Field Worker: <strong className="text-[#B8543A]">{selectedComplaint.assignedWorkerName}</strong></span>
                    )}
                  </div>
                </div>

                {/* Evidence Proof & Confirmation */}
                {(selectedComplaint.status === 'RESOLVED' || selectedComplaint.status === 'CITIZEN_CONFIRMED') && (
                  <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-3">
                    <h3 className="text-xs font-serif font-bold text-[#6D3028] uppercase">
                      Field Resolution Proof
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] space-y-1">
                        <span className="text-[10px] font-mono text-[#81786D]">BEFORE WORK</span>
                        <div className="h-24 rounded bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-center text-xs text-[#81786D]">
                          Initial Obstruction Photo
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#5C765A]/40 space-y-1">
                        <span className="text-[10px] font-mono text-[#5C765A] font-bold">AFTER RESOLUTION</span>
                        <div className="h-24 rounded bg-[#F7F1E5] border border-[#5C765A]/30 flex items-center justify-center text-xs text-[#5C765A] font-bold">
                          ✓ Site Cleared by BMC Team
                        </div>
                      </div>
                    </div>

                    {selectedComplaint.status === 'RESOLVED' && (
                      <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs font-bold text-[#211E1B]">Please verify the work proof and confirm resolution.</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCitizenConfirm(true)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#5C765A] hover:bg-[#4E644C] text-white font-bold text-xs flex items-center gap-1"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Confirm Resolved</span>
                          </button>
                          <button
                            onClick={() => handleCitizenConfirm(false)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#FDF2F1] text-[#B83A32] border border-[#B83A32]/40 font-bold text-xs flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reopen</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-serif font-bold text-[#211E1B] uppercase">
                    Audit Timeline
                  </h3>
                  <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2D7C3]">
                    {selectedComplaint.timeline.map((evt, idx) => (
                      <div key={evt.id || idx} className="relative text-xs space-y-0.5">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#B8543A] ring-4 ring-[#FFFFFF]" />
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#211E1B]">{evt.status}</span>
                          <span className="text-[10px] text-[#81786D] font-mono">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[#81786D] text-[11px]">{evt.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-[#81786D] rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3]">
                Select a grievance on the left to track timeline.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MY REPORTS LIST */}
      {activeTab === 'MY_REPORTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedComplaint(c);
                setActiveTab('TRACK');
              }}
              className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] hover:border-[#B8543A] cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#B8543A] text-xs font-bold">{c.ticketNo}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F1E5] text-[#211E1B]">
                  {c.status}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#211E1B] truncate">{c.category}</h4>
              <p className="text-xs text-[#81786D] line-clamp-2">{c.description}</p>
              <div className="pt-2 border-t border-[#E2D7C3] flex items-center justify-between text-[11px] text-[#81786D]">
                <span>{c.ward}</span>
                <span className="text-[#B8543A] font-bold">Track →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reopen Modal */}
      {showReopenDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2D7C3] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-serif font-bold text-[#211E1B] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#B83A32]" />
              <span>Reopen Grievance & Escalate</span>
            </h3>
            <p className="text-xs text-[#81786D]">
              Please state why the resolution was incomplete. It will be escalated to the BMC Zone Officer immediately.
            </p>
            <textarea
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. Water is still accumulating near the culvert..."
              className="w-full p-2.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B83A32]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReopenDialog(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#81786D]"
              >
                Cancel
              </button>
              <button
                disabled={!reopenReason.trim()}
                onClick={handleReopenComplaint}
                className="px-4 py-2 rounded-xl bg-[#B83A32] hover:bg-[#A32D26] text-white font-bold text-xs"
              >
                Escalate Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
