import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Globe,
  MapPin,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  PhoneCall,
  Flame,
  Waves
} from 'lucide-react';
import {
  queryCivicAiAssistant,
  searchBhubaneswarLiveIntelligence,
  searchBhubaneswarGisPlaces
} from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Complaint, Incident } from '../../types';
import { KonarkWheel } from '../common/KonarkWheel';

interface CivicAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Complaint[];
  incidents: Incident[];
  onNavigate: (view: string) => void;
}

type TabMode = 'CHAT' | 'SEARCH_GROUNDING' | 'MAPS_GROUNDING';

export const CivicAiAssistant: React.FC<CivicAiAssistantProps> = ({
  isOpen,
  onClose,
  complaints,
  incidents,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabMode>('CHAT');

  // Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'USER' | 'AI'; text: string; timestamp: string; sources?: any[] }>>([
    {
      sender: 'AI',
      text: `Namaskar ${currentUser?.name || 'Citizen'}! I am CIVIC NEXUS AI, your dedicated Bhubaneswar Smart City Operations Assistant. Ask me anything about real-time flood telemetry, grievance tracking, 112 emergency trauma beds, or ward status.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState<string>('Bhubaneswar rainfall weather advisory');
  const [searchResult, setSearchResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Maps Grounding State
  const [mapQuery, setMapQuery] = useState<string>('AIIMS & Capital Hospital Trauma Center');
  const [mapResult, setMapResult] = useState<{ text: string } | null>(null);
  const [isMapping, setIsMapping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (queryOverride?: string) => {
    const q = queryOverride || inputText;
    if (!q.trim() || isLoading) return;

    const userMsg = {
      sender: 'USER' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        sender: m.sender === 'USER' ? ('user' as const) : ('assistant' as const),
        text: m.text
      }));

      const response = await queryCivicAiAssistant(
        q,
        currentUser?.role || 'CITIZEN',
        historyForApi,
        {
          activeComplaints: complaints.length,
          criticalIncidents: incidents.filter((i) => i.priority === 'P1_CRITICAL').length,
          activeFloods: 1,
          activeFieldWorkers: 4
        },
        lang
      );

      const aiMsg = {
        sender: 'AI' as const,
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Voice read-out if enabled
      if ('speechSynthesis' in window && isSpeaking) {
        const cleanText = response.replace(/[•*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang === 'OD' ? 'hi-IN' : 'en-IN';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('AI Assistant error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported by your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = lang === 'OD' ? 'or-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      console.warn('Speech Recognition failed:', e);
      setIsListening(false);
    }
  };

  const handleRunSearchGrounding = async (q: string) => {
    setIsSearching(true);
    try {
      const res = await searchBhubaneswarLiveIntelligence(q);
      setSearchResult(res);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRunMapsGrounding = async (q: string) => {
    setIsMapping(true);
    try {
      const res = await searchBhubaneswarGisPlaces(q);
      setMapResult(res);
    } finally {
      setIsMapping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-[#FFFFFF] border border-[#E2D7C3] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
      {/* Institutional Header */}
      <div className="p-3.5 bg-[#F7F1E5] border-b border-[#E2D7C3] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
            <KonarkWheel size={18} color="#B8543A" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-bold text-[#211E1B] flex items-center gap-1.5">
              <span>CIVIC NEXUS AI</span>
              <span className="text-[9px] font-mono px-1 rounded bg-[#FFFFFF] text-[#B8543A] border border-[#E2D7C3]">
                BMC
              </span>
            </h3>
            <p className="text-[10px] text-[#81786D]">Gemini Grounded City Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            title={isSpeaking ? 'Voice Readout On' : 'Voice Readout Off'}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
              isSpeaking
                ? 'bg-[#B8543A] text-white border-[#B8543A]'
                : 'bg-[#FFFFFF] text-[#81786D] border-[#E2D7C3] hover:text-[#211E1B]'
            }`}
          >
            {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] text-[#81786D] hover:text-[#211E1B] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grounding Tool Modes */}
      <div className="grid grid-cols-3 bg-[#F0E8D9] border-b border-[#E2D7C3] text-[11px] font-bold">
        <button
          onClick={() => setActiveTab('CHAT')}
          className={`py-2 px-1 text-center cursor-pointer flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'CHAT' ? 'bg-[#FFFFFF] text-[#B8543A] border-b-2 border-[#B8543A]' : 'text-[#81786D] hover:text-[#211E1B]'
          }`}
        >
          <MessageSquare className="w-3 h-3" />
          <span>Multi-Turn Chat</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('SEARCH_GROUNDING');
            if (!searchResult) handleRunSearchGrounding(searchQuery);
          }}
          className={`py-2 px-1 text-center cursor-pointer flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'SEARCH_GROUNDING' ? 'bg-[#FFFFFF] text-[#B8543A] border-b-2 border-[#B8543A]' : 'text-[#81786D] hover:text-[#211E1B]'
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>Google Search</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('MAPS_GROUNDING');
            if (!mapResult) handleRunMapsGrounding(mapQuery);
          }}
          className={`py-2 px-1 text-center cursor-pointer flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'MAPS_GROUNDING' ? 'bg-[#FFFFFF] text-[#B8543A] border-b-2 border-[#B8543A]' : 'text-[#81786D] hover:text-[#211E1B]'
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>Google Maps</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'CHAT' && (
        <>
          {/* Scrollable Message Thread */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FAF6EE] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'USER'
                      ? 'bg-[#B8543A] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[9px] text-[#81786D] font-mono mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-xs text-[#81786D] w-fit">
                <Sparkles className="w-4 h-4 text-[#B8543A] animate-spin" />
                <span>Civic Nexus AI is reasoning across Bhubaneswar telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-[#F7F1E5] border-t border-[#E2D7C3] flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('What is the waterlogging status in Jayadev Vihar?')}
              className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] hover:border-[#B8543A] whitespace-nowrap cursor-pointer"
            >
              🌊 Jayadev Vihar Flooding
            </button>
            <button
              onClick={() => handleSend('Check ICU and emergency bed readiness at Capital Hospital')}
              className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] hover:border-[#B8543A] whitespace-nowrap cursor-pointer"
            >
              🏥 112 ICU Readiness
            </button>
            <button
              onClick={() => handleSend('How can I submit a street light grievance?')}
              className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] hover:border-[#B8543A] whitespace-nowrap cursor-pointer"
            >
              💡 Report Streetlight
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#FFFFFF] border-t border-[#E2D7C3] flex items-center gap-2">
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                isListening
                  ? 'bg-[#B83A32] text-white border-[#B83A32] animate-pulse'
                  : 'bg-[#F7F1E5] text-[#B8543A] border-[#E2D7C3] hover:bg-[#EFE8DA]'
              }`}
              title="Voice Speech Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening to voice...' : 'Ask about Bhubaneswar civic operations...'}
              className="flex-1 px-3 py-2 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs text-[#211E1B] focus:border-[#B8543A] focus:outline-hidden"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-xl bg-[#B8543A] hover:bg-[#A14731] disabled:opacity-40 text-white cursor-pointer transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* Search Grounding View */}
      {activeTab === 'SEARCH_GROUNDING' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF6EE] text-xs">
          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2 shadow-xs">
            <span className="text-[10px] font-mono text-[#B8543A] font-bold block">
              GOOGLE SEARCH GROUNDING
            </span>
            <p className="text-[#81786D]">
              Fetches verified live web telemetry regarding IMD weather warnings, Odisha Disaster Authority alerts, and municipal updates.
            </p>

            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search live query in Bhubaneswar..."
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-xs"
              />
              <button
                onClick={() => handleRunSearchGrounding(searchQuery)}
                disabled={isSearching}
                className="px-3 py-1.5 rounded-lg bg-[#B8543A] text-white font-bold text-xs"
              >
                {isSearching ? 'Grounding...' : 'Search'}
              </button>
            </div>
          </div>

          {searchResult && (
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-xs">
              <h4 className="font-serif font-bold text-[#211E1B] text-sm">Verified Search Telemetry</h4>
              <p className="text-[#3D3732] leading-relaxed whitespace-pre-line">{searchResult.text}</p>
              {searchResult.sources && searchResult.sources.length > 0 && (
                <div className="pt-2 border-t border-[#E2D7C3]">
                  <span className="text-[10px] font-mono text-[#81786D] font-bold block mb-1">
                    GROUNDED SOURCES:
                  </span>
                  <div className="space-y-1">
                    {searchResult.sources.slice(0, 3).map((s: any, idx: number) => (
                      <div key={idx} className="text-[10px] text-[#B8543A] truncate flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        <span>{s.web?.title || s.web?.uri || 'Grounded Web Chunk'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Maps Grounding View */}
      {activeTab === 'MAPS_GROUNDING' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF6EE] text-xs">
          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-2 shadow-xs">
            <span className="text-[10px] font-mono text-[#5C765A] font-bold block">
              GOOGLE MAPS & GIS GROUNDING
            </span>
            <p className="text-[#81786D]">
              Locates verified landmarks, trauma hospitals, fire stations, and ward connectivity across all 67 Bhubaneswar wards.
            </p>

            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={mapQuery}
                onChange={(e) => setMapQuery(e.target.value)}
                placeholder="Search hospital or landmark in Bhubaneswar..."
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-xs"
              />
              <button
                onClick={() => handleRunMapsGrounding(mapQuery)}
                disabled={isMapping}
                className="px-3 py-1.5 rounded-lg bg-[#5C765A] text-white font-bold text-xs"
              >
                {isMapping ? 'Mapping...' : 'Find GIS'}
              </button>
            </div>
          </div>

          {mapResult && (
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-xs">
              <h4 className="font-serif font-bold text-[#211E1B] text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B8543A]" />
                <span>Grounded GIS Place Data</span>
              </h4>
              <p className="text-[#3D3732] leading-relaxed whitespace-pre-line">{mapResult.text}</p>
              <button
                onClick={() => {
                  onNavigate('/map');
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#B8543A] font-bold text-xs border border-[#E2D7C3] flex items-center justify-center gap-1"
              >
                <span>View on Bhubaneswar Live GIS Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
