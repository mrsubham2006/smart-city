import React, { useState } from 'react';
import {
  HardHat,
  CheckCircle2,
  Navigation,
  Camera,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  Check,
  RotateCcw
} from 'lucide-react';
import { FieldTask } from '../../types';
import { saveFieldTask } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';
import { KonarkWheel } from '../common/KonarkWheel';

interface FieldWorkerPanelProps {
  tasks: FieldTask[];
  onRefresh: () => void;
}

export const FieldWorkerPanel: React.FC<FieldWorkerPanelProps> = ({ tasks, onRefresh }) => {
  const { currentUser } = useAuth();
  const [selectedTask, setSelectedTask] = useState<FieldTask | null>(tasks[0] || null);

  const [workerNotes, setWorkerNotes] = useState<string>('');
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleUpdateStatus = async (newStatus: FieldTask['status']) => {
    if (!selectedTask) return;
    setIsUpdating(true);

    const updated: FieldTask = {
      ...selectedTask,
      status: newStatus,
      workerNotes: workerNotes || selectedTask.workerNotes,
      beforePhotoUrl: beforePhoto || selectedTask.beforePhotoUrl,
      afterPhotoUrl: afterPhoto || selectedTask.afterPhotoUrl,
      startedAt: newStatus === 'ON_SITE' ? new Date().toISOString() : selectedTask.startedAt,
      resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : selectedTask.resolvedAt,
      updatedAt: new Date().toISOString()
    };

    await saveFieldTask(updated);
    setSelectedTask(updated);
    setIsUpdating(false);
    onRefresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* High-Contrast Outdoor Field Banner */}
      <div className="p-5 rounded-2xl bg-[#211E1B] text-[#F7F1E5] border border-[#3D3732] shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#B8543A] flex items-center justify-center text-white">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#C58B3A] font-bold uppercase">
              BMC FIELD WORKER APP
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white">
              {currentUser?.name || 'Ranjan Barik'} · Squad #4
            </h1>
            <p className="text-xs text-[#D8C7AA]">{currentUser?.department || 'Disaster Management & Drainage'}</p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-[#81786D] text-[10px]">TASKS ASSIGNED</span>
          <p className="text-[#C58B3A] font-bold text-base">{tasks.length} Active</p>
        </div>
      </div>

      {/* Task Queue Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tasks.map((tsk) => (
          <div
            key={tsk.id}
            onClick={() => setSelectedTask(tsk)}
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
              selectedTask?.id === tsk.id
                ? 'bg-[#FFFFFF] border-[#B8543A] shadow-md ring-1 ring-[#B8543A]'
                : 'bg-[#FFFFFF] border-[#E2D7C3] hover:border-[#81786D] text-[#81786D]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[#B8543A] font-bold">{tsk.ticketNo}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  tsk.status === 'RESOLVED'
                    ? 'bg-[#5C765A] text-white'
                    : tsk.status === 'ON_SITE'
                    ? 'bg-[#C58B3A] text-white'
                    : 'bg-[#F7F1E5] text-[#211E1B]'
                }`}
              >
                {tsk.status}
              </span>
            </div>
            <h3 className="font-bold text-[#211E1B] text-sm">{tsk.title}</h3>
            <p className="text-[#81786D] line-clamp-1">{tsk.location}</p>
          </div>
        ))}
      </div>

      {/* Active Work Order Terminal */}
      {selectedTask && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E2D7C3]">
            <div>
              <span className="text-xs font-mono text-[#B8543A] font-bold">{selectedTask.ticketNo}</span>
              <h2 className="text-lg font-bold text-[#211E1B]">{selectedTask.title}</h2>
              <p className="text-xs text-[#81786D] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#B8543A]" />
                <span>{selectedTask.location} · {selectedTask.ward}</span>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#FDF2F1] border border-[#B83A32]/30 text-[#B83A32] text-xs font-mono font-bold">
              {selectedTask.priority}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs space-y-2">
            <p className="text-[#3D3732] leading-relaxed">{selectedTask.description}</p>
          </div>

          {/* Action Step 1: On-Site Check-in */}
          <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-3">
            <h3 className="text-xs font-bold font-mono text-[#6D3028] uppercase">
              Step 1: Check-in & Arrive On Site
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-[#81786D]">
                <span>GPS Location: </span>
                <strong className="text-[#211E1B] font-mono">{selectedTask.lat}° N, {selectedTask.lng}° E</strong>
              </div>
              <div className="flex items-center gap-2">
                {selectedTask.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleUpdateStatus('ACCEPTED')}
                    className="px-4 py-2 rounded-xl bg-[#211E1B] hover:bg-[#3D3732] text-white font-bold text-xs"
                  >
                    Accept Work Order
                  </button>
                )}
                {(selectedTask.status === 'ASSIGNED' || selectedTask.status === 'ACCEPTED') && (
                  <button
                    onClick={() => handleUpdateStatus('ON_SITE')}
                    className="px-4 py-2 rounded-xl bg-[#C58B3A] hover:bg-[#B37A2C] text-white font-bold text-xs"
                  >
                    Mark "Arrived on Site"
                  </button>
                )}
                {selectedTask.status === 'ON_SITE' && (
                  <span className="text-xs font-mono text-[#5C765A] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active on Site
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Step 2: Before & After Photos */}
          <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-3">
            <h3 className="text-xs font-bold font-mono text-[#6D3028] uppercase">
              Step 2: Upload Resolution Photographic Proof
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-center space-y-2">
                <span className="text-[10px] font-mono text-[#81786D]">BEFORE WORK EVIDENCE</span>
                <label className="block p-3 border border-dashed border-[#E2D7C3] rounded-lg text-[#81786D] text-xs cursor-pointer hover:border-[#B8543A]">
                  <Camera className="w-5 h-5 mx-auto text-[#B8543A] mb-1" />
                  <span>Capture Before Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => setBeforePhoto('mock_before_uploaded')}
                    className="hidden"
                  />
                </label>
                {beforePhoto && <span className="text-[10px] text-[#5C765A] font-bold">✓ Before Photo Saved</span>}
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-center space-y-2">
                <span className="text-[10px] font-mono text-[#5C765A] font-bold">AFTER RESOLUTION EVIDENCE</span>
                <label className="block p-3 border border-dashed border-[#5C765A]/50 rounded-lg text-[#5C765A] text-xs cursor-pointer hover:border-[#5C765A]">
                  <Camera className="w-5 h-5 mx-auto text-[#5C765A] mb-1" />
                  <span>Capture After Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => setAfterPhoto('mock_after_uploaded')}
                    className="hidden"
                  />
                </label>
                {afterPhoto && <span className="text-[10px] text-[#5C765A] font-bold">✓ Resolution Photo Saved</span>}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-[#211E1B]">Completion Field Notes</label>
              <textarea
                rows={3}
                value={workerNotes}
                onChange={(e) => setWorkerNotes(e.target.value)}
                placeholder="e.g. Cleared 50m of choked drain. High-capacity dewatering pump operated for 45 mins. Silt removed."
                className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B8543A]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#81786D] font-mono">
              Worker ID: {currentUser?.id || 'field_01'}
            </span>
            <button
              disabled={selectedTask.status === 'RESOLVED' || isUpdating}
              onClick={() => handleUpdateStatus('RESOLVED')}
              className="px-6 py-2.5 rounded-xl bg-[#5C765A] hover:bg-[#4E644C] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {selectedTask.status === 'RESOLVED' ? 'Work Completed' : 'Submit Proof & Mark Resolved'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
