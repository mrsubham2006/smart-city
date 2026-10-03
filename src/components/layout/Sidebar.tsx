import React from 'react';
import {
  Home,
  MessageSquarePlus,
  LayoutDashboard,
  MapPin,
  AlertOctagon,
  Building2,
  HardHat,
  Network,
  Cpu,
  Video,
  Compass,
  BarChart3,
  ScrollText,
  Lock,
  ChevronRight,
  LogOut,
  Users,
  Activity,
  FileCheck,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KonarkWheel } from '../common/KonarkWheel';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpen,
  onCloseMobile
}) => {
  const { currentUser, logout } = useAuth();

  // If no user is authenticated or we are on public pages, do not show sidebar
  if (!currentUser) {
    return null;
  }

  const role = currentUser.role;

  // Build role-specific navigation list
  let navItems: NavItem[] = [];

  if (role === 'CITIZEN') {
    navItems = [
      { id: '/citizen', label: 'Citizen Dashboard', icon: Home },
      { id: '/citizen#report', label: 'Report Grievance', icon: MessageSquarePlus },
      { id: '/citizen#my-reports', label: 'My Submissions', icon: FileCheck },
      { id: '/tourism', label: 'Ekamra Kshetra Guide', icon: Compass }
    ];
  } else if (role === 'FIELD_WORKER') {
    navItems = [
      { id: '/field', label: 'My Field Tasks', icon: HardHat, badge: 'Active' },
      { id: '/map', label: 'Jurisdiction Map', icon: MapPin }
    ];
  } else if (role === 'SUPERVISOR') {
    navItems = [
      { id: '/supervisor', label: 'Squad Coordination', icon: Users },
      { id: '/field', label: 'Task Register', icon: HardHat },
      { id: '/map', label: 'Field Map', icon: MapPin }
    ];
  } else if (role === 'EMERGENCY_OPERATOR') {
    navItems = [
      { id: '/emergency', label: '112 Emergency Desk', icon: AlertOctagon, badge: 'Live' },
      { id: '/partner', label: 'Hospital & Traffic Hub', icon: Network },
      { id: '/map', label: 'Emergency GIS Map', icon: MapPin }
    ];
  } else if (role === 'HOSPITAL_OPERATOR' || role === 'TRAFFIC_OPERATOR') {
    navItems = [
      { id: '/partner', label: 'Partner Operations', icon: Network },
      { id: '/emergency', label: '112 Emergency Stream', icon: AlertOctagon }
    ];
  } else if (role === 'DEPARTMENT_HEAD' || role === 'ZONE_OFFICER') {
    navItems = [
      { id: '/department', label: 'Department Workload', icon: Building2 },
      { id: '/supervisor', label: 'Field Squads', icon: Users },
      { id: '/analytics', label: 'SLA Analytics', icon: BarChart3 },
      { id: '/map', label: 'Ward GIS Map', icon: MapPin }
    ];
  } else {
    // BMC_ADMIN, COMMISSIONER, SYSTEM_ADMIN, ANALYST
    navItems = [
      { id: '/command-center', label: 'Command Center', icon: LayoutDashboard },
      { id: '/map', label: 'Live City GIS', icon: MapPin },
      { id: '/emergency', label: '112 Emergency Desk', icon: AlertOctagon, badge: 'SOS' },
      { id: '/department', label: 'Departments', icon: Building2 },
      { id: '/supervisor', label: 'Supervisor Desk', icon: Users },
      { id: '/cascade', label: 'Cascade AI Engine', icon: Network },
      { id: '/digitaltwin', label: 'Digital Twin Sandbox', icon: Cpu },
      { id: '/cctv', label: 'CCTV Vision Hub', icon: Video },
      { id: '/analytics', label: 'SLA & City Analytics', icon: BarChart3 },
      { id: '/admin', label: 'System Admin & RBAC', icon: Lock },
      { id: '/audit', label: 'Immutable Audit Log', icon: ScrollText }
    ];
  }

  const handleNavClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  const handleLogout = async () => {
    await logout();
    onCloseMobile();
    onNavigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#E2D7C3] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* User Role Banner */}
          <div className="p-3.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] space-y-2">
            <div className="flex items-center gap-2">
              <KonarkWheel size={16} color="#B8543A" />
              <span className="font-serif font-bold text-xs text-[#211E1B]">WORKSPACE PANEL</span>
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold text-[#B8543A] uppercase tracking-wider">
                {currentUser.role.replace('_', ' ')}
              </p>
              <p className="text-xs font-semibold text-[#211E1B] truncate">{currentUser.name}</p>
              <p className="text-[11px] text-[#81786D] truncate">{currentUser.department}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-mono text-[#81786D] uppercase tracking-wider font-semibold">
              Authorized Views
            </span>

            <nav className="space-y-1 pt-1.5">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = currentPath === item.id || (item.id !== '/' && currentPath.startsWith(item.id));
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#B8543A] text-white shadow-xs'
                        : 'text-[#3D3732] hover:bg-[#F7F1E5] hover:text-[#211E1B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#81786D]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#B8543A]/10 text-[#B8543A]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#F0E8D9] space-y-2">
          <button
            onClick={() => {
              onNavigate('/');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#81786D] hover:text-[#211E1B] hover:bg-[#F7F1E5] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#B83A32] hover:bg-[#B83A32]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
