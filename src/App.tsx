/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { RoleLoginPage } from './components/auth/RoleLoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UnauthorizedView } from './components/auth/UnauthorizedView';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { BmcCommandCenter } from './components/admin/BmcCommandCenter';
import { AdminPanel } from './components/admin/AdminPanel';
import { SupervisorPanel } from './components/supervisor/SupervisorPanel';
import { PartnerPanel } from './components/partner/PartnerPanel';
import { BhubaneswarLiveMap } from './components/map/BhubaneswarLiveMap';
import { EmergencyControlCenter } from './components/emergency/EmergencyControlCenter';
import { DepartmentDashboard } from './components/department/DepartmentDashboard';
import { FieldWorkerPanel } from './components/field/FieldWorkerPanel';
import { CascadeIntelligenceView } from './components/cascade/CascadeIntelligenceView';
import { DigitalTwinView } from './components/digitaltwin/DigitalTwinView';
import { SmartCameraCenter } from './components/cctv/SmartCameraCenter';
import { SmartTourismView } from './components/tourism/SmartTourismView';
import { CityAnalyticsView } from './components/analytics/CityAnalyticsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { SystemHealthModal } from './components/qa/SystemHealthModal';
import { CivicAiAssistant } from './components/ai/CivicAiAssistant';

import {
  subscribeComplaints,
  subscribeIncidents,
  subscribeEmergencyCases,
  subscribeFieldTasks,
  subscribeCameraEvents
} from './firebase/service';
import { testFirestoreConnection } from './firebase/config';
import { Complaint, Incident, EmergencyCase, FieldTask, CameraEvent } from './types';
import { Menu, Sparkles } from 'lucide-react';

function getPathFromLocation(): string {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    return hash.startsWith('/') ? hash : `/${hash}`;
  }
  const pathname = window.location.pathname;
  return pathname && pathname !== '' ? pathname : '/';
}

function AppContent() {
  const { currentUser, isRouteProtected } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => getPathFromLocation());
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isQaModalOpen, setIsQaModalOpen] = useState<boolean>(false);

  // Real-time collections state
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);
  const [fieldTasks, setFieldTasks] = useState<FieldTask[]>([]);
  const [cameraEvents, setCameraEvents] = useState<CameraEvent[]>([]);

  // Initial connection test
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to hash/URL changes
  useEffect(() => {
    const handleHashChange = () => {
      const newPath = getPathFromLocation();
      setCurrentPath((prev) => (prev === newPath ? prev : newPath));
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Subscribe to real-time collections
  useEffect(() => {
    const unsubComplaints = subscribeComplaints((list) => setComplaints([...list]));
    const unsubIncidents = subscribeIncidents((list) => setIncidents([...list]));
    const unsubEmergency = subscribeEmergencyCases((list) => setEmergencyCases([...list]));
    const unsubTasks = subscribeFieldTasks((list) => setFieldTasks([...list]));
    const unsubCameras = subscribeCameraEvents((list) => setCameraEvents([...list]));

    return () => {
      unsubComplaints();
      unsubIncidents();
      unsubEmergency();
      unsubTasks();
      unsubCameras();
    };
  }, []);

  const navigateTo = useCallback((path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    setCurrentPath(cleanPath);
    if (typeof window !== 'undefined') {
      window.location.hash = cleanPath;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSidebarOpen(false);
  }, []);

  const refreshAll = useCallback(() => {
    setComplaints((prev) => [...prev]);
  }, []);

  // Determine view routing & RBAC protection
  const isPublicView = currentPath === '/' || currentPath.startsWith('/login') || currentPath.startsWith('/#') || !isRouteProtected(currentPath);
  const isLoginView = currentPath.startsWith('/login');

  // Parse login role subpath, e.g. /login/citizen -> citizen
  let loginRoleId: string | undefined = undefined;
  if (isLoginView && currentPath.length > 6) {
    loginRoleId = currentPath.replace('/login/', '').replace('/login', '').split('/')[0];
  }

  // Render view dispatcher with strict 3-stage architecture
  const renderViewContent = () => {
    // STAGE 1: PUBLIC LANDING PAGE (Always default at /)
    if (currentPath === '/' || currentPath.startsWith('/#') || currentPath === '') {
      return (
        <LandingPage
          onNavigate={navigateTo}
          onOpenVoice={() => setIsAiAssistantOpen(true)}
        />
      );
    }

    // STAGE 2: ROLE-BASED LOGIN (At /login or /login/:roleId)
    if (isLoginView) {
      return (
        <RoleLoginPage
          initialRoleId={loginRoleId}
          onNavigate={navigateTo}
        />
      );
    }

    // STAGE 3: ROLE-SPECIFIC PANELS (Wrapped with ProtectedRoute)
    if (currentPath.startsWith('/citizen')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Citizen Services Portal"
        >
          <CitizenPortal complaints={complaints} onRefresh={refreshAll} />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/command-center') || currentPath === '/command') {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="BMC Executive Command Center"
        >
          <BmcCommandCenter
            complaints={complaints}
            incidents={incidents}
            emergencyCases={emergencyCases}
            fieldTasks={fieldTasks}
            cameraEvents={cameraEvents}
            onNavigate={navigateTo}
            onRefresh={refreshAll}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/department')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Municipal Department Operations"
        >
          <DepartmentDashboard
            complaints={complaints}
            fieldTasks={fieldTasks}
            onRefresh={refreshAll}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/supervisor')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Field Squad Supervision"
        >
          <SupervisorPanel
            complaints={complaints}
            fieldTasks={fieldTasks}
            onRefresh={refreshAll}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/field')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Ground Squad Operations"
        >
          <FieldWorkerPanel
            tasks={fieldTasks}
            onRefresh={refreshAll}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/emergency')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="112 Emergency Operations Desk"
        >
          <EmergencyControlCenter
            emergencyCases={emergencyCases}
            onRefresh={refreshAll}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/partner')) {
      const isTraffic = currentPath.includes('traffic');
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Partner Agency Operations"
        >
          <PartnerPanel
            emergencyCases={emergencyCases}
            partnerType={isTraffic ? 'traffic' : 'hospital'}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/admin')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Root System Administration"
        >
          <AdminPanel
            onOpenQaModal={() => setIsQaModalOpen(true)}
            onNavigate={navigateTo}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/map')) {
      return (
        <BhubaneswarLiveMap
          complaints={complaints}
          incidents={incidents}
          cameraEvents={cameraEvents}
          onSelectComplaint={() => navigateTo('/citizen')}
          onSelectIncident={() => navigateTo('/command-center')}
        />
      );
    }

    if (currentPath.startsWith('/cascade')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Cascade Intelligence Engine"
        >
          <CascadeIntelligenceView />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/digitaltwin')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Digital Twin Simulation Sandbox"
        >
          <DigitalTwinView />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/cctv')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Smart CCTV Camera Hub"
        >
          <SmartCameraCenter
            cameraEvents={cameraEvents}
            onRefresh={refreshAll}
          />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/tourism')) {
      return <SmartTourismView />;
    }

    if (currentPath.startsWith('/analytics')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="City SLA & Telemetry Analytics"
        >
          <CityAnalyticsView complaints={complaints} />
        </ProtectedRoute>
      );
    }

    if (currentPath.startsWith('/audit')) {
      return (
        <ProtectedRoute
          currentPath={currentPath}
          onNavigate={navigateTo}
          requiredRoleLabel="Immutable Audit Log Stream"
        >
          <AuditLogsView />
        </ProtectedRoute>
      );
    }

    // Default fallback
    return (
      <LandingPage
        onNavigate={navigateTo}
        onOpenVoice={() => setIsAiAssistantOpen(true)}
      />
    );
  };

  const showSidebar = currentUser && !isPublicView;

  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#211E1B] flex flex-col selection:bg-[#B8543A]/20 selection:text-[#6D3028]">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenVoice={() => setIsAiAssistantOpen(true)}
        onOpenQaModal={() => setIsQaModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Role-Specific Sidebar (Only for authenticated internal panels) */}
        {showSidebar && (
          <Sidebar
            currentPath={currentPath}
            onNavigate={navigateTo}
            isOpen={sidebarOpen}
            onCloseMobile={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 p-4 lg:p-6 overflow-x-hidden">
          {/* Mobile Toggle for authenticated panels */}
          {showSidebar && (
            <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#E2D7C3]">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E2D7C3] text-[#211E1B] cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-mono text-xs text-[#B8543A] font-bold uppercase">
                {currentPath.replace('/', '').replace('-', ' ') || 'WORKSPACE'}
              </span>
              <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="p-2 rounded-lg bg-[#F7F1E5] border border-[#B8543A]/40 text-[#B8543A] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Render Active View */}
          {renderViewContent()}
        </main>
      </div>

      {/* Floating AI Assistant */}
      <CivicAiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        complaints={complaints}
        incidents={incidents}
        onNavigate={navigateTo}
      />

      {/* QA System Health Modal */}
      <SystemHealthModal
        isOpen={isQaModalOpen}
        onClose={() => setIsQaModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
