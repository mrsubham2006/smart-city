import React, { useState, useEffect } from 'react';
import {
  Shield,
  User,
  Building2,
  HardHat,
  AlertOctagon,
  Network,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Briefcase,
  Users,
  Compass,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { DEMO_USERS, BHUBANESWAR_WARDS } from '../../services/bhubaneswarData';
import { KonarkWheel } from '../common/KonarkWheel';
import { PattachitraDivider } from '../common/PattachitraDivider';

export type RoleCategory =
  | 'citizen'
  | 'bmc'
  | 'department'
  | 'field'
  | 'emergency'
  | 'partner'
  | 'admin';

interface RoleLoginPageProps {
  initialRoleId?: string;
  onNavigate: (path: string) => void;
}

interface RoleCardInfo {
  id: RoleCategory;
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  demoAccount: {
    email: string;
    role: UserRole;
    name: string;
    department: string;
  };
  loginTitle: string;
  inputPlaceholder: string;
  inputLabel: string;
  isPublicRegistrationAllowed: boolean;
}

const ROLE_DEFINITIONS: RoleCardInfo[] = [
  {
    id: 'citizen',
    title: 'CITIZEN',
    badge: 'Public Access',
    description: 'Report and track civic issues, receive city alerts and access citizen services.',
    icon: User,
    demoAccount: {
      email: 'citizen@demo.local',
      role: 'CITIZEN',
      name: 'Subham Pradhan',
      department: 'Citizen Services'
    },
    loginTitle: 'CITIZEN ACCESS',
    inputPlaceholder: 'name@example.com or +91 98765 43210',
    inputLabel: 'Email / Phone',
    isPublicRegistrationAllowed: true
  },
  {
    id: 'bmc',
    title: 'BMC OFFICIAL',
    badge: 'Executive Directorate',
    description: 'Monitor city operations, incidents and department performance.',
    icon: Building2,
    demoAccount: {
      email: 'admin@demo.local',
      role: 'BMC_ADMIN',
      name: 'Dr. Rajesh Verma, IAS',
      department: 'BMC Administration'
    },
    loginTitle: 'BMC OFFICIAL ACCESS',
    inputPlaceholder: 'emp.id@bhubaneswar.gov.in or BMC-DIR-2026',
    inputLabel: 'Official Email / Employee ID',
    isPublicRegistrationAllowed: false
  },
  {
    id: 'department',
    title: 'DEPARTMENT OFFICER',
    badge: 'Wing Operations',
    description: 'Manage department incidents, assignments and operational tasks.',
    icon: Briefcase,
    demoAccount: {
      email: 'disaster@demo.local',
      role: 'DEPARTMENT_HEAD',
      name: 'Er. Debabrata Jena',
      department: 'Disaster Management & Drainage'
    },
    loginTitle: 'DEPARTMENT OFFICER ACCESS',
    inputPlaceholder: 'dept.head@bhubaneswar.gov.in',
    inputLabel: 'Official Department Email',
    isPublicRegistrationAllowed: false
  },
  {
    id: 'field',
    title: 'FIELD WORKER',
    badge: 'Ground Squads',
    description: 'View and complete assigned field tasks.',
    icon: HardHat,
    demoAccount: {
      email: 'fieldworker@demo.local',
      role: 'FIELD_WORKER',
      name: 'Ranjan Barik',
      department: 'Disaster Management & Drainage'
    },
    loginTitle: 'FIELD OPERATIONS ACCESS',
    inputPlaceholder: 'field.sqd.14@bmc.gov.in or SQUAD-991',
    inputLabel: 'Official ID / Email',
    isPublicRegistrationAllowed: false
  },
  {
    id: 'emergency',
    title: 'EMERGENCY OPERATOR',
    badge: '112 Multi-Agency',
    description: 'Coordinate emergency incidents and response resources.',
    icon: AlertOctagon,
    demoAccount: {
      email: 'emergency@demo.local',
      role: 'EMERGENCY_OPERATOR',
      name: 'Commander R. K. Nayak',
      department: 'Emergency Control Room 112'
    },
    loginTitle: 'EMERGENCY OPERATIONS ACCESS',
    inputPlaceholder: '112-OP-302@emergency.odisha.gov.in',
    inputLabel: 'Operator ID / Secure Access Email',
    isPublicRegistrationAllowed: false
  },
  {
    id: 'partner',
    title: 'PARTNER / SERVICE OPERATOR',
    badge: 'Hospital / Traffic',
    description: 'Access authorized partner operations.',
    icon: Network,
    demoAccount: {
      email: 'hospital@demo.local',
      role: 'HOSPITAL_OPERATOR',
      name: 'Dr. Sujata Ray (Capital Hosp)',
      department: 'Capital Hospital Trauma Desk'
    },
    loginTitle: 'PARTNER SERVICE ACCESS',
    inputPlaceholder: 'partner.id@health.odisha.gov.in',
    inputLabel: 'Partner Agency ID / Email',
    isPublicRegistrationAllowed: false
  },
  {
    id: 'admin',
    title: 'ADMINISTRATOR',
    badge: 'Security & Systems',
    description: 'System administration and security.',
    icon: Lock,
    demoAccount: {
      email: 'sysadmin@demo.local',
      role: 'SYSTEM_ADMIN',
      name: 'System Security Lead',
      department: 'IT & Special Projects'
    },
    loginTitle: 'SYSTEM SECURITY ACCESS',
    inputPlaceholder: 'sysadmin@bhubaneswar.gov.in',
    inputLabel: 'Administrator Email / Token',
    isPublicRegistrationAllowed: false
  }
];

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({
  initialRoleId,
  onNavigate
}) => {
  const { loginWithCredentials, registerCitizen, loginWithGoogle } = useAuth();

  // Selected role tab/view
  const [selectedRole, setSelectedRole] = useState<RoleCategory | null>(() => {
    if (initialRoleId && ROLE_DEFINITIONS.some(r => r.id === initialRoleId)) {
      return initialRoleId as RoleCategory;
    }
    return null;
  });

  // Citizen registration tab toggle
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // Form states
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('Bhubaneswar@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Citizen registration specific fields
  const [regName, setRegName] = useState<string>('');
  const [regMobile, setRegMobile] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regWard, setRegWard] = useState<string>('Ward 14 (Jayadev Vihar)');

  useEffect(() => {
    if (initialRoleId && ROLE_DEFINITIONS.some(r => r.id === initialRoleId)) {
      setSelectedRole(initialRoleId as RoleCategory);
    }
  }, [initialRoleId]);

  const activeRoleDef = ROLE_DEFINITIONS.find(r => r.id === selectedRole);

  const handleSelectRole = (roleId: RoleCategory) => {
    setSelectedRole(roleId);
    setErrorMsg('');
    setIsRegistering(false);
    onNavigate(`/login/${roleId}`);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setErrorMsg('');
    setIsRegistering(false);
    onNavigate('/login');
  };

  const handleFillDemo = (email: string) => {
    setIdentifier(email);
    setPassword('Bhubaneswar@2026');
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const emailToUse = identifier.trim() || activeRoleDef?.demoAccount.email || 'citizen@demo.local';
      const result = await loginWithCredentials(emailToUse, password);

      if (result.success && result.authorizedPath) {
        onNavigate(result.authorizedPath);
      } else {
        setErrorMsg(result.error || 'Invalid credentials. Please verify your official credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Please provide full name, email, and a secure password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const result = await registerCitizen({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regMobile.trim() || '+91 9437000000',
        password: regPassword,
        ward: regWard
      });

      if (result.success && result.authorizedPath) {
        onNavigate(result.authorizedPath);
      } else {
        setErrorMsg(result.error || 'Failed to complete registration.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Citizen registration error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Institutional Top Trust Header */}
      <div className="text-center mb-8 space-y-3">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#81786D] hover:text-[#B8543A] transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#B8543A]/40 flex items-center justify-center p-1.5 shadow-sm">
            <KonarkWheel size={26} color="#B8543A" />
          </div>
          <div className="text-left">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#211E1B] tracking-tight">
              CIVIC NEXUS <span className="text-[#B8543A]">AI</span>
            </h1>
            <p className="text-xs text-[#81786D] font-medium">
              Bhubaneswar Municipal Corporation · Unified Authentication Gateway
            </p>
          </div>
        </div>

        <div className="pt-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#211E1B]">
            {selectedRole ? activeRoleDef?.loginTitle : 'Secure Access'}
          </h2>
          <p className="text-sm text-[#81786D] max-w-md mx-auto mt-1">
            {selectedRole
              ? activeRoleDef?.description
              : 'Select how you access the Bhubaneswar civic intelligence platform.'}
          </p>
        </div>
      </div>

      {/* STAGE 2.A: ROLE SELECTION CARDS (When no role selected or at /login) */}
      {!selectedRole && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {ROLE_DEFINITIONS.map((role) => {
              const IconComp = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className="group relative p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] hover:border-[#B8543A] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] group-hover:border-[#B8543A]/40 flex items-center justify-center text-[#B8543A] transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F1E5] text-[#81786D] border border-[#E2D7C3] font-semibold">
                        {role.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-[#211E1B] group-hover:text-[#B8543A] transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs text-[#81786D] mt-1 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#B8543A] border-t border-[#F0E8D9]">
                    <span>Access Panel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          <PattachitraDivider theme="ochre" />

          {/* Institutional Security Notice */}
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-xs text-[#81786D] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#5C765A]" />
              <span>Official BMC Access: Role authorization is verified against municipal records upon authentication.</span>
            </div>
            <span className="font-mono text-[11px] text-[#211E1B]">ODISHA GOV TECH v2.6</span>
          </div>
        </div>
      )}

      {/* STAGE 2.B: ROLE-SPECIFIC LOGIN & REGISTRATION FORM */}
      {selectedRole && activeRoleDef && (
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-[0_2px_8px_rgba(33,30,27,0.06)] space-y-6">
            {/* Header of Form */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2D7C3]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
                  <activeRoleDef.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#211E1B]">{activeRoleDef.title}</h3>
                  <span className="text-[10px] font-mono text-[#81786D]">{activeRoleDef.badge}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBackToRoles}
                className="text-xs font-semibold text-[#81786D] hover:text-[#B8543A] transition-colors cursor-pointer"
              >
                Change Role
              </button>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#B83A32]/10 border border-[#B83A32]/30 text-xs text-[#B83A32] flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Citizen Toggle between Sign In & Create Account */}
            {activeRoleDef.isPublicRegistrationAllowed && (
              <div className="flex rounded-xl bg-[#F7F1E5] p-1 border border-[#E2D7C3] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    !isRegistering
                      ? 'bg-[#FFFFFF] text-[#211E1B] shadow-xs'
                      : 'text-[#81786D] hover:text-[#211E1B]'
                  }`}
                >
                  Citizen Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isRegistering
                      ? 'bg-[#FFFFFF] text-[#211E1B] shadow-xs'
                      : 'text-[#81786D] hover:text-[#211E1B]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Form Mode 1: SIGN IN */}
            {!isRegistering && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#211E1B]">
                    {activeRoleDef.inputLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={activeRoleDef.inputPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] focus:border-[#B8543A] focus:outline-hidden text-xs text-[#211E1B] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#211E1B]">Password</label>
                    <span className="text-[11px] text-[#81786D] cursor-pointer hover:underline">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] focus:border-[#B8543A] focus:outline-hidden text-xs text-[#211E1B] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81786D] hover:text-[#211E1B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#B8543A] hover:bg-[#A14731] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Staff Provisioning Notice if staff role */}
                {!activeRoleDef.isPublicRegistrationAllowed && (
                  <div className="p-3 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[11px] text-[#81786D]">
                    <span className="font-semibold text-[#6D3028]">Official Staff Protocol: </span>
                    Staff accounts are provisioned and audited by the BMC IT & Administrative Directorate.
                  </div>
                )}
              </form>
            )}

            {/* Form Mode 2: CITIZEN REGISTRATION */}
            {isRegistering && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#211E1B]">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Subham Pradhan"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] focus:border-[#B8543A] focus:outline-hidden text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#211E1B]">Mobile Number</label>
                  <input
                    type="tel"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="+91 94370 00000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] focus:border-[#B8543A] focus:outline-hidden text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#211E1B]">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="resident@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] focus:border-[#B8543A] focus:outline-hidden text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#211E1B]">Resident Ward</label>
                  <select
                    value={regWard}
                    onChange={(e) => setRegWard(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] focus:border-[#B8543A] focus:outline-hidden text-xs"
                  >
                    {BHUBANESWAR_WARDS.slice(0, 15).map(w => (
                      <option key={w.wardNo} value={`Ward ${w.wardNo} (${w.name.split(' ')[0]})`}>
                        Ward {w.wardNo} — {w.name} ({w.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#211E1B]">Create Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] focus:border-[#B8543A] focus:outline-hidden text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#5C765A] hover:bg-[#4E644C] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registering...' : 'Complete Citizen Registration'}</span>
                </button>
              </form>
            )}

            {/* Quick Demo Test Credential Assistant */}
            <div className="pt-2 border-t border-[#F0E8D9] space-y-2">
              <span className="text-[10px] font-mono text-[#81786D] uppercase font-semibold">
                Quick Test Authorized Credential
              </span>
              <button
                type="button"
                onClick={() => handleFillDemo(activeRoleDef.demoAccount.email)}
                className="w-full p-2.5 rounded-xl bg-[#F7F1E5] hover:bg-[#EFE8DA] border border-[#E2D7C3] text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-[#211E1B]">{activeRoleDef.demoAccount.name}</p>
                  <p className="text-[11px] font-mono text-[#B8543A]">{activeRoleDef.demoAccount.email}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2D7C3] text-[#81786D]">
                  Auto-Fill
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
