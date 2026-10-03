import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Ticket,
  Users,
  Sun,
  Volume2,
  VolumeX,
  ExternalLink
} from 'lucide-react';
import { BHUBANESWAR_TOURISM } from '../../services/bhubaneswarData';
import { TourismPlace } from '../../types';
import { KonarkWheel } from '../common/KonarkWheel';
import { PattachitraDivider } from '../common/PattachitraDivider';

export const SmartTourismView: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<TourismPlace>(BHUBANESWAR_TOURISM[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleAudioGuide = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#6D3028] border border-[#B8543A]/30 font-mono text-[10px] font-bold">
                EKAMRA KSHETRA HERITAGE
              </span>
              <span className="text-xs text-[#81786D]">Odisha Tourism & BMC Smart Guide</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#211E1B] tracking-tight mt-0.5">
              Bhubaneswar Smart Heritage & Tourism Intelligence
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs font-mono text-[#6D3028] font-bold">
          <Users className="w-3.5 h-3.5 text-[#C58B3A]" />
          <span>CROWD TELEMETRY ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Monuments List vs Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Monuments List */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-[#81786D] uppercase tracking-wider">
            Historic Landmarks ({BHUBANESWAR_TOURISM.length})
          </span>

          <div className="space-y-2.5">
            {BHUBANESWAR_TOURISM.map((place) => (
              <div
                key={place.id}
                onClick={() => {
                  if (isPlayingAudio) window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                  setSelectedPlace(place);
                }}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                  selectedPlace.id === place.id
                    ? 'bg-[#F7F1E5] border-[#B8543A] shadow-xs ring-1 ring-[#B8543A]'
                    : 'bg-[#FFFFFF] border-[#E2D7C3] hover:border-[#81786D] text-[#81786D]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#B8543A] text-[10px] uppercase font-bold">
                    {place.category.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      place.crowdLevel === 'VERY_BUSY'
                        ? 'bg-[#FDF2F1] text-[#B83A32]'
                        : place.crowdLevel === 'BUSY'
                        ? 'bg-[#FDF6ED] text-[#C58B3A]'
                        : 'bg-[#FFFFFF] text-[#5C765A]'
                    }`}
                  >
                    {place.crowdLevel}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-[#211E1B] text-sm leading-snug">{place.name}</h3>
                <p className="text-[11px] text-[#81786D] truncate">{place.ward}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Monument Guide */}
        <div className="lg:col-span-2 p-6 lg:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2D7C3]">
              <div>
                <span className="text-xs font-mono text-[#B8543A] font-bold uppercase">
                  {selectedPlace.category}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#211E1B] mt-0.5">{selectedPlace.name}</h2>
                <p className="text-xs text-[#81786D] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B8543A]" />
                  <span>{selectedPlace.address}</span>
                </p>
              </div>

              {/* Audio Guide Play Button */}
              <button
                onClick={() => handleAudioGuide(selectedPlace.audioGuideSummary)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                  isPlayingAudio
                    ? 'bg-[#B83A32] hover:bg-[#A32D26] text-white'
                    : 'bg-[#B8543A] hover:bg-[#A14731] text-white'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Play Odishan Audio Guide'}</span>
              </button>
            </div>

            <p className="text-xs text-[#3D3732] leading-relaxed bg-[#F7F1E5] p-4 rounded-xl border border-[#E2D7C3]">
              {selectedPlace.description}
            </p>

            {/* Practical Visitor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                <span className="text-[10px] font-mono text-[#81786D] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#B8543A]" />
                  TIMINGS
                </span>
                <p className="text-xs font-bold text-[#211E1B]">{selectedPlace.timings}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                <span className="text-[10px] font-mono text-[#81786D] flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-[#5C765A]" />
                  ENTRY TARIFF
                </span>
                <p className="text-xs font-bold text-[#211E1B]">{selectedPlace.entryFee}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-1">
                <span className="text-[10px] font-mono text-[#81786D] flex items-center gap-1">
                  <Sun className="w-3 h-3 text-[#C58B3A]" />
                  OPTIMAL WINDOW
                </span>
                <p className="text-xs font-bold text-[#211E1B] truncate">{selectedPlace.weatherSuitability}</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <h3 className="text-xs font-serif font-bold text-[#211E1B] uppercase">
                Architectural Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedPlace.highlights.map((hl, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[#3D3732] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8543A]"></span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] flex items-center justify-between text-xs text-[#81786D]">
            <span>Official Odisha Tourism Directory Integration</span>
            <span className="font-mono text-[11px] text-[#6D3028]">LAT: {selectedPlace.lat}° N, LNG: {selectedPlace.lng}° E</span>
          </div>
        </div>
      </div>
    </div>
  );
};
