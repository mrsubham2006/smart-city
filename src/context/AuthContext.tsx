import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { DEMO_USERS } from '../services/bhubaneswarData';

/**
 * protectedRoutes object mapping path prefixes to required user roles.
 */
export const protectedRoutes: Record<string, UserRole[]> = {
  '/admin': ['SYSTEM_ADMIN', 'BMC_ADMIN'],
  '/field': ['FIELD_WORKER', 'SUPERVISOR', 'BMC_ADMIN'],
  '/citizen': ['CITIZEN', 'BMC_ADMIN', 'COMMISSIONER'],
  '/command-center': ['BMC_ADMIN', 'COMMISSIONER', 'SYSTEM_ADMIN', 'ANALYST'],
  '/command': ['BMC_ADMIN', 'COMMISSIONER', 'SYSTEM_ADMIN', 'ANALYST'],
  '/department': ['DEPARTMENT_HEAD', 'ZONE_OFFICER', 'BMC_ADMIN', 'COMMISSIONER'],
  '/supervisor': ['SUPERVISOR', 'DEPARTMENT_HEAD', 'BMC_ADMIN', 'COMMISSIONER'],
  '/emergency': ['EMERGENCY_OPERATOR', 'BMC_ADMIN', 'COMMISSIONER'],
  '/partner': ['HOSPITAL_OPERATOR', 'TRAFFIC_OPERATOR', 'FIRE_OPERATOR', 'BMC_ADMIN', 'COMMISSIONER'],
  '/cascade': ['BMC_ADMIN', 'COMMISSIONER', 'SYSTEM_ADMIN', 'ANALYST', 'DEPARTMENT_HEAD'],
  '/digitaltwin': ['BMC_ADMIN', 'COMMISSIONER', 'SYSTEM_ADMIN', 'ANALYST', 'DEPARTMENT_HEAD'],
  '/cctv': ['BMC_ADMIN', 'COMMISSIONER', 'SYSTEM_ADMIN', 'ANALYST', 'EMERGENCY_OPERATOR', 'DEPARTMENT_HEAD'],
  '/analytics': ['BMC_ADMIN', 'COMMISSIONER', 'SYSTEM_ADMIN', 'ANALYST', 'DEPARTMENT_HEAD'],
  '/audit': ['BMC_ADMIN', 'SYSTEM_ADMIN'],
  '/map': [
    'CITIZEN',
    'BMC_ADMIN',
    'COMMISSIONER',
    'DEPARTMENT_HEAD',
    'ZONE_OFFICER',
    'SUPERVISOR',
    'FIELD_WORKER',
    'EMERGENCY_OPERATOR',
    'HOSPITAL_OPERATOR',
    'TRAFFIC_OPERATOR',
    'TOURISM_OPERATOR',
    'ANALYST',
    'SYSTEM_ADMIN'
  ]
};

export const routeRoleLabels: Record<string, string> = {
  '/admin': 'Root System Administration',
  '/field': 'Ground Squad Operations',
  '/citizen': 'Citizen Services Portal',
  '/command-center': 'BMC Executive Command Center',
  '/command': 'BMC Executive Command Center',
  '/department': 'Municipal Department Operations',
  '/supervisor': 'Field Squad Supervision',
  '/emergency': '112 Emergency Operations Desk',
  '/partner': 'Partner Agency Operations',
  '/cascade': 'Cascade Intelligence Engine',
  '/digitaltwin': 'Digital Twin Simulation Sandbox',
  '/cctv': 'Smart CCTV Camera Hub',
  '/analytics': 'City SLA & Telemetry Analytics',
  '/audit': 'Immutable Audit Log Stream',
  '/map': 'Live City GIS Telemetry'
};

export interface RouteAccessValidation {
  status: 'ALLOWED' | 'UNAUTHENTICATED' | 'FORBIDDEN';
  redirectTo?: string;
  requiredRoleLabel?: string;
  requiredRoles?: UserRole[];
}

export interface RequireAuthResult {
  isAuthorized: boolean;
  isLoading: boolean;
  currentUser: UserProfile | null;
  errorReason: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | null;
  requiredRoles: UserRole[];
  requiredRoleLabel: string;
}

interface AuthResult {
  success: boolean;
  user?: UserProfile;
  authorizedPath?: string;
  error?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  fbUser: User | null;
  loading: boolean;
  pendingRedirectPath: string | null;
  setPendingRedirectPath: (path: string | null) => void;
  loginWithCredentials: (identifier: string, password?: string) => Promise<AuthResult>;
  registerCitizen: (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    ward?: string;
  }) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  getAuthorizedDashboardPath: (role?: UserRole) => string;
  isAuthorized: (path: string, user: UserProfile | null) => boolean;
  hasPermissionForRoute: (route: string, user: UserProfile | null) => {
    allowed: boolean;
    requiredRoleLabel?: string;
    requiredRoles?: UserRole[];
  };
  isRouteProtected: (path: string) => boolean;
  validateRouteAccess: (path: string, user: UserProfile | null) => RouteAccessValidation;
  protectedRoutes: Record<string, UserRole[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getAuthorizedDashboardPath = (role?: UserRole): string => {
  if (!role) return '/';
  switch (role) {
    case 'CITIZEN':
      return '/citizen';
    case 'BMC_ADMIN':
    case 'COMMISSIONER':
      return '/command-center';
    case 'DEPARTMENT_HEAD':
    case 'ZONE_OFFICER':
      return '/department';
    case 'SUPERVISOR':
      return '/supervisor';
    case 'FIELD_WORKER':
      return '/field';
    case 'EMERGENCY_OPERATOR':
      return '/emergency';
    case 'HOSPITAL_OPERATOR':
      return '/partner';
    case 'TRAFFIC_OPERATOR':
      return '/partner';
    case 'TOURISM_OPERATOR':
      return '/tourism';
    case 'SYSTEM_ADMIN':
      return '/admin';
    default:
      return '/citizen';
  }
};

export const getMatchingPrefix = (path: string): string | undefined => {
  const normalized = path.toLowerCase().replace(/^#/, '') || '/';
  return Object.keys(protectedRoutes).find(
    (prefix) =>
      normalized === prefix ||
      normalized.startsWith(prefix + '/') ||
      normalized.startsWith(prefix + '#') ||
      normalized.startsWith(prefix + '?')
  );
};

export const isRouteProtected = (path: string): boolean => {
  const normalized = path.toLowerCase().replace(/^#/, '');
  if (
    !normalized ||
    normalized === '/' ||
    normalized.startsWith('/#') ||
    normalized.startsWith('/login') ||
    normalized === '/about' ||
    normalized === '/platform' ||
    normalized === '/tourism'
  ) {
    return false;
  }
  return getMatchingPrefix(normalized) !== undefined;
};

/**
 * isAuthorized
 * Validates if the user's role matches the required roles mapped to the path prefix in protectedRoutes.
 */
export const isAuthorized = (path: string, user: UserProfile | null): boolean => {
  if (!user) return false;
  const prefix = getMatchingPrefix(path);
  if (!prefix) {
    // Route is not in protectedRoutes -> public access allowed
    return true;
  }
  const allowedRoles = protectedRoutes[prefix];
  return allowedRoles.includes(user.role);
};

export const hasPermissionForRoute = (
  route: string,
  user: UserProfile | null
): { allowed: boolean; requiredRoleLabel?: string; requiredRoles?: UserRole[] } => {
  if (!user) {
    return { allowed: false, requiredRoleLabel: 'Authenticated User', requiredRoles: [] };
  }

  const prefix = getMatchingPrefix(route);
  if (!prefix) {
    return { allowed: true };
  }

  const allowedRoles = protectedRoutes[prefix];
  const allowed = allowedRoles.includes(user.role);
  const label = routeRoleLabels[prefix] || 'Authorized Municipal Clearance';

  return {
    allowed,
    requiredRoleLabel: label,
    requiredRoles: allowedRoles
  };
};

export const validateRouteAccess = (
  path: string,
  user: UserProfile | null
): RouteAccessValidation => {
  const normalized = path.toLowerCase().replace(/^#/, '');

  if (!isRouteProtected(normalized)) {
    return { status: 'ALLOWED' };
  }

  if (!user) {
    return {
      status: 'UNAUTHENTICATED',
      redirectTo: '/login'
    };
  }

  const check = hasPermissionForRoute(normalized, user);
  if (!check.allowed) {
    return {
      status: 'FORBIDDEN',
      redirectTo: '/login',
      requiredRoleLabel: check.requiredRoleLabel || 'Authorized Clearance',
      requiredRoles: check.requiredRoles
    };
  }

  return { status: 'ALLOWED' };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('civic_nexus_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed parsing cached session', e);
      }
    }
    return null;
  });

  const [fbUser, setFbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingRedirectPath, setPendingRedirectPathState] = useState<string | null>(null);

  const setPendingRedirectPath = useCallback((path: string | null) => {
    setPendingRedirectPathState((prev) => (prev === path ? prev : path));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      if (!user) {
        if (!localStorage.getItem('civic_nexus_current_user')) {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithCredentials = async (identifier: string, _password?: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const cleanIdent = identifier.trim().toLowerCase();

      let matched = DEMO_USERS.find(
        (u) =>
          u.email.toLowerCase() === cleanIdent ||
          u.role.toLowerCase() === cleanIdent ||
          u.email.toLowerCase().includes(cleanIdent)
      );

      if (!matched) {
        if (cleanIdent.includes('admin') || cleanIdent.includes('commissioner')) {
          matched = DEMO_USERS[1];
        } else if (cleanIdent.includes('dept') || cleanIdent.includes('drainage') || cleanIdent.includes('eng')) {
          matched = DEMO_USERS[5];
        } else if (cleanIdent.includes('field') || cleanIdent.includes('squad')) {
          matched = DEMO_USERS[7];
        } else if (cleanIdent.includes('112') || cleanIdent.includes('emerg')) {
          matched = DEMO_USERS[8];
        } else if (cleanIdent.includes('hospital') || cleanIdent.includes('partner')) {
          matched = DEMO_USERS[9];
        } else if (cleanIdent.includes('sys') || cleanIdent.includes('security')) {
          matched = DEMO_USERS[13];
        } else {
          matched = DEMO_USERS[0];
        }
      }

      const profile: UserProfile = {
        id: `usr_${matched.role.toLowerCase()}_${Date.now().toString(36)}`,
        name: matched.name,
        email: matched.email,
        phone: '+91 9437000000',
        role: matched.role as UserRole,
        department: matched.department,
        ward: matched.ward,
        zone: matched.zone as any,
        status: 'ACTIVE',
        createdAt: '2026-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      };

      setCurrentUser(profile);
      localStorage.setItem('civic_nexus_current_user', JSON.stringify(profile));

      let targetPath = getAuthorizedDashboardPath(profile.role);
      if (pendingRedirectPath && isRouteProtected(pendingRedirectPath)) {
        if (isAuthorized(pendingRedirectPath, profile)) {
          targetPath = pendingRedirectPath;
        }
        setPendingRedirectPathState(null);
      }

      return { success: true, user: profile, authorizedPath: targetPath };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const registerCitizen = async (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    ward?: string;
  }): Promise<AuthResult> => {
    setLoading(true);
    try {
      const profile: UserProfile = {
        id: `cit_${Date.now().toString(36)}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 9437000000',
        role: 'CITIZEN',
        department: 'Citizen Services',
        ward: data.ward || 'Ward 14 (Jayadev Vihar)',
        zone: 'Central Zone',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setCurrentUser(profile);
      localStorage.setItem('civic_nexus_current_user', JSON.stringify(profile));

      return { success: true, user: profile, authorizedPath: '/citizen' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const isOfficialEmail = result.user.email?.includes('pradhan') || result.user.email?.includes('bmc');
        const role: UserRole = isOfficialEmail ? 'BMC_ADMIN' : 'CITIZEN';

        const profile: UserProfile = {
          id: result.user.uid,
          name: result.user.displayName || 'Authorized User',
          email: result.user.email || '',
          role: role,
          department: role === 'BMC_ADMIN' ? 'BMC Administration' : 'Citizen Services',
          ward: 'Ward 14 (Jayadev Vihar)',
          zone: 'Central Zone',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        setCurrentUser(profile);
        localStorage.setItem('civic_nexus_current_user', JSON.stringify(profile));
        const targetPath = getAuthorizedDashboardPath(profile.role);
        return { success: true, user: profile, authorizedPath: targetPath };
      }
      return { success: false, error: 'No user returned from Google' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Google sign-in cancelled' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout note:', e);
    }
    setCurrentUser(null);
    setPendingRedirectPathState(null);
    localStorage.removeItem('civic_nexus_current_user');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem('civic_nexus_current_user', JSON.stringify(updated));
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      currentUser,
      fbUser,
      loading,
      pendingRedirectPath,
      setPendingRedirectPath,
      loginWithCredentials,
      registerCitizen,
      loginWithGoogle,
      logout,
      updateUserProfile,
      getAuthorizedDashboardPath,
      isAuthorized,
      hasPermissionForRoute,
      isRouteProtected,
      validateRouteAccess,
      protectedRoutes
    }),
    [currentUser, fbUser, loading, pendingRedirectPath, setPendingRedirectPath]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * useRequireAuth hook
 * Performs an immediate check and hard redirect to /login for any route not explicitly permitted
 * for the current authenticated user's role based on protectedRoutes.
 */
export const useRequireAuth = (
  targetPath?: string,
  onRedirect?: (path: string) => void
): RequireAuthResult => {
  const { currentUser, loading, setPendingRedirectPath } = useAuth();

  const pathToCheck =
    targetPath ||
    (typeof window !== 'undefined'
      ? window.location.hash.replace(/^#/, '') || window.location.pathname
      : '/');

  const normalized = pathToCheck.toLowerCase().replace(/^#/, '') || '/';
  const prefix = getMatchingPrefix(normalized);

  const authStatus: RequireAuthResult = useMemo(() => {
    if (loading) {
      return {
        isAuthorized: false,
        isLoading: true,
        currentUser,
        errorReason: null,
        requiredRoles: [],
        requiredRoleLabel: ''
      };
    }

    if (!prefix) {
      return {
        isAuthorized: true,
        isLoading: false,
        currentUser,
        errorReason: null,
        requiredRoles: [],
        requiredRoleLabel: ''
      };
    }

    const allowedRoles = protectedRoutes[prefix];
    const label = routeRoleLabels[prefix] || 'Authorized Clearance';

    if (!currentUser) {
      return {
        isAuthorized: false,
        isLoading: false,
        currentUser: null,
        errorReason: 'UNAUTHENTICATED',
        requiredRoles: allowedRoles,
        requiredRoleLabel: label
      };
    }

    // Role-based isAuthorized check
    const permitted = isAuthorized(normalized, currentUser);
    if (!permitted) {
      return {
        isAuthorized: false,
        isLoading: false,
        currentUser,
        errorReason: 'UNAUTHORIZED',
        requiredRoles: allowedRoles,
        requiredRoleLabel: label
      };
    }

    return {
      isAuthorized: true,
      isLoading: false,
      currentUser,
      errorReason: null,
      requiredRoles: allowedRoles,
      requiredRoleLabel: label
    };
  }, [currentUser, loading, prefix, normalized]);

  const onRedirectRef = useRef(onRedirect);
  onRedirectRef.current = onRedirect;

  const redirectedRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!authStatus.isAuthorized && authStatus.errorReason) {
      const redirectKey = `${pathToCheck}-${authStatus.errorReason}`;
      if (redirectedRef.current === redirectKey) {
        return;
      }
      redirectedRef.current = redirectKey;

      if (authStatus.errorReason === 'UNAUTHENTICATED' && setPendingRedirectPath) {
        setPendingRedirectPath(pathToCheck);
      }

      if (onRedirectRef.current) {
        onRedirectRef.current('/login');
      } else if (typeof window !== 'undefined' && window.location.hash !== '#/login' && window.location.hash !== '/login') {
        window.location.hash = '/login';
      }
    } else {
      redirectedRef.current = null;
    }
  }, [authStatus.isAuthorized, authStatus.errorReason, loading, pathToCheck, setPendingRedirectPath]);

  return authStatus;
};
