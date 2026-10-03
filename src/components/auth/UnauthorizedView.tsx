import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KonarkWheel } from '../common/KonarkWheel';
import { PattachitraDivider } from '../common/PattachitraDivider';

interface UnauthorizedViewProps {
  attemptedPath: string;
  requiredRoleLabel: string;
  onNavigate: (path: string) => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  attemptedPath,
  requiredRoleLabel,
  onNavigate
}) => {
  const { currentUser, getAuthorizedDashboardPath } = useAuth();

  const authorizedHome = getAuthorizedDashboardPath ? getAuthorizedDashboardPath() : '/';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 max-w-xl mx-auto">
      <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border-2 border-[#B83A32]/40 shadow-xl text-center space-y-6">
        {/* Security Badge */}
        <div className="inline-flex p-3 rounded-2xl bg-[#B83A32]/10 border border-[#B83A32]/30 text-[#B83A32]">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B83A32]/10 text-[#B83A32] font-mono text-[11px] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>403 — RESTRICTED ACCESS AREA</span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-[#211E1B]">
            Access Denied
          </h1>

          <p className="text-xs text-[#81786D] max-w-md mx-auto">
            You do not possess the required municipal authorization clearance to view{' '}
            <span className="font-mono text-[#211E1B] font-semibold">{attemptedPath}</span>.
          </p>
        </div>

        <PattachitraDivider theme="terracotta" />

        {/* Current Authenticated Identity Profile */}
        <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-left space-y-2">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2D7C3]">
            <span className="text-[#81786D]">Current Authenticated User:</span>
            <span className="font-bold text-[#211E1B]">{currentUser?.name || 'Authorized User'}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2D7C3]">
            <span className="text-[#81786D]">Assigned Role:</span>
            <span className="font-mono px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2D7C3] text-[#B8543A] font-bold text-[11px]">
              {currentUser?.role || 'CITIZEN'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#81786D]">Required Clearance:</span>
            <span className="font-semibold text-[#6D3028]">{requiredRoleLabel}</span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate(authorizedHome)}
            className="w-full sm:flex-1 py-3 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Return to My Authorized Workspace</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#F7F1E5] hover:bg-[#EFE8DA] text-[#211E1B] text-xs font-bold border border-[#E2D7C3] transition-all cursor-pointer"
          >
            Public Home
          </button>
        </div>
      </div>
    </div>
  );
};
