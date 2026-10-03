import React, { useState, useEffect } from 'react';
import {
  Bell,
  User,
  LogOut,
  AlertTriangle,
  ChevronDown,
  X,
  CheckCircle,
  Clock,
  PhoneCall,
  Shield,
  LayoutDashboard,
  LogIn,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationItem } from '../../types';
import { subscribeNotifications } from '../../firebase/service';
import { KonarkWheel } from '../common/KonarkWheel';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenVoice: () => void;
  onOpenQaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenVoice,
  onOpenQaModal
}) => {
  const { currentUser, logout, getAuthorizedDashboardPath } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const isPublicPage = currentPath === '/' || currentPath.startsWith('/login') || currentPath === '/about' || currentPath === '/platform';
  const authorizedDashboardPath = getAuthorizedDashboardPath ? getAuthorizedDashboardPath(currentUser?.role) : '/citizen';

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit'
        }) + ' IST'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unsub = subscribeNotifications((list) => setNotifications(list));
      return () => unsub();
    }
  }, [currentUser]);

  const handleLogoutClick = async () => {
    await logout();
    setShowUserMenu(false);
    onNavigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E2D7C3] shadow-[0_1px_3px_rgba(33,30,27,0.05)] px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone (Traditional Institutional Header) */}
        <div
          className="flex items-center gap-3.5 shrink-0 cursor-pointer group"
          onClick={() => onNavigate('/')}
        >
          <div className="w-10 h-10 rounded-lg bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center p-1 group-hover:border-[#B8543A] transition-colors">
            <KonarkWheel size={28} color="#B8543A" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base lg:text-lg tracking-tight text-[#211E1B]">
                CIVIC NEXUS <span className="text-[#B8543A] font-sans text-xs px-1.5 py-0.5 rounded bg-[#F7F1E5] border border-[#B8543A]/30 font-semibold">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-[#81786D] font-medium tracking-wide">
              {lang === 'OD' ? 'ଭୁବନେଶ୍ୱର ମହାନଗର ନିଗମ (BMC)' : 'Bhubaneswar Municipal Corporation'}
            </p>
          </div>
        </div>

        {/* Navigation Mode A: PUBLIC LANDING NAVIGATION (When on public pages) */}
        {isPublicPage && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#81786D]">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-[#B8543A] transition-colors cursor-pointer ${currentPath === '/' ? 'text-[#B8543A]' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('/#platform')}
              className="hover:text-[#B8543A] transition-colors cursor-pointer"
            >
              Platform
            </button>
            <button
              onClick={() => {
                if (currentUser && currentUser.role === 'CITIZEN') {
                  onNavigate('/citizen');
                } else {
                  onNavigate('/login/citizen');
                }
              }}
              className="hover:text-[#B8543A] transition-colors cursor-pointer"
            >
              Citizen Services
            </button>
            <button
              onClick={() => onNavigate('/#intelligence')}
              className="hover:text-[#B8543A] transition-colors cursor-pointer"
            >
              City Intelligence
            </button>
            <button
              onClick={() => onNavigate('/#emergency-guide')}
              className="hover:text-[#B83A32] text-[#B83A32] font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency</span>
            </button>
            <button
              onClick={() => onNavigate('/#tourism-guide')}
              className="hover:text-[#B8543A] transition-colors cursor-pointer"
            >
              Tourism
            </button>
            <button
              onClick={() => onNavigate('/#about')}
              className="hover:text-[#B8543A] transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>
        )}

        {/* Navigation Mode B: AUTHENTICATED PANEL HEADER TELEMETRY (When logged into a panel) */}
        {!isPublicPage && currentUser && (
          <div className="hidden md:flex items-center gap-3 text-xs text-[#81786D]">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3]">
              <span className="w-2 h-2 rounded-full bg-[#5C765A]"></span>
              <span className="font-bold text-[#211E1B]">{currentUser.department || 'BMC Operations'}</span>
              <span className="text-[#81786D]">·</span>
              <span className="font-mono text-[#B8543A] font-semibold">{currentUser.ward || '67 Wards'}</span>
            </div>

            <div className="flex items-center gap-1 text-[#81786D] px-2 py-1 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#B8543A]" />
              <span>{currentTime}</span>
            </div>
          </div>
        )}

        {/* Right Action Zone */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang('EN')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                lang === 'EN' ? 'bg-[#FFFFFF] text-[#211E1B] font-bold shadow-xs' : 'text-[#81786D] hover:text-[#211E1B]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('OD')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                lang === 'OD' ? 'bg-[#FFFFFF] text-[#211E1B] font-bold shadow-xs font-odia' : 'text-[#81786D] hover:text-[#211E1B]'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>

          {/* IF NOT AUTHENTICATED: Show [ ROLE-BASED LOGIN ] */}
          {!currentUser && (
            <button
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>ROLE-BASED LOGIN</span>
            </button>
          )}

          {/* IF AUTHENTICATED on public landing page: Show [ OPEN MY DASHBOARD ] */}
          {currentUser && isPublicPage && (
            <button
              onClick={() => onNavigate(authorizedDashboardPath)}
              className="px-4 py-2 rounded-xl bg-[#211E1B] hover:bg-[#3D3732] text-[#F7F1E5] text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#C58B3A]" />
              <span>OPEN MY DASHBOARD</span>
            </button>
          )}

          {/* IF AUTHENTICATED: User Profile Menu & Logout */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F1E5] hover:bg-[#EFE8DA] border border-[#E2D7C3] transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#B8543A] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#211E1B] leading-tight truncate max-w-[120px]">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] font-mono text-[#B8543A] leading-none font-semibold">
                    {currentUser.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#81786D]" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-xl p-3 z-50 space-y-3">
                  <div className="p-3 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3]">
                    <p className="text-xs font-bold text-[#211E1B]">{currentUser.name}</p>
                    <p className="text-[11px] font-mono text-[#81786D] truncate">{currentUser.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B8543A] text-white font-bold">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-medium text-[#211E1B]">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate(authorizedDashboardPath);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F7F1E5] flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#B8543A]" />
                      <span>My Authorized Workspace</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('/');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F7F1E5] flex items-center gap-2 cursor-pointer"
                    >
                      <KonarkWheel size={16} color="#81786D" />
                      <span>Public Landing Page</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#F0E8D9]">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#B83A32]/10 hover:bg-[#B83A32]/20 text-[#B83A32] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
