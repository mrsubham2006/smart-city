import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  Download,
  Check,
  TrendingUp,
  Building2,
  Clock,
  ShieldCheck,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { Complaint } from '../../types';
import { PattachitraDivider } from '../common/PattachitraDivider';

interface CityAnalyticsViewProps {
  complaints: Complaint[];
}

const DEPT_DATA = [
  { name: 'Disaster / Flood', count: 42, color: '#B8543A' },
  { name: 'Sanitation / Waste', count: 28, color: '#5C765A' },
  { name: 'Roads & Engineering', count: 18, color: '#C58B3A' },
  { name: 'Street Lighting', count: 12, color: '#81786D' },
  { name: 'Encroachment & Safety', count: 8, color: '#6D3028' }
];

const RESOLUTION_TIME_DATA = [
  { category: 'P1 Waterlogging', hours: 2.1, target: 4.0 },
  { category: 'P2 Solid Waste', hours: 4.5, target: 8.0 },
  { category: 'P2 Potholes', hours: 7.2, target: 12.0 },
  { category: 'P3 Street Lighting', hours: 5.8, target: 24.0 },
  { category: 'Water Pipe Burst', hours: 3.4, target: 6.0 }
];

const HOURLY_FLOW_DATA = [
  { hour: '06:00', reports: 4, resolved: 2 },
  { hour: '09:00', reports: 14, resolved: 8 },
  { hour: '12:00', reports: 22, resolved: 18 },
  { hour: '15:00', reports: 31, resolved: 26 },
  { hour: '18:00', reports: 28, resolved: 24 },
  { hour: '21:00', reports: 12, resolved: 16 }
];

export const CityAnalyticsView: React.FC<CityAnalyticsViewProps> = ({ complaints }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleExportCSV = () => {
    // Generate CSV content
    const escapeCsv = (str: string | number | undefined) => {
      if (str === undefined || str === null) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows: string[] = [];

    // Header metadata
    rows.push('BHUBANESWAR MUNICIPAL CORPORATION (BMC) - CIVIC NEXUS AI');
    rows.push('City Analytics & Municipal Performance Telemetry Export');
    rows.push(`Generated On: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    rows.push('');

    // Section 1: Executive KPI Metrics
    rows.push('--- SECTION 1: EXECUTIVE KPI SUMMARY ---');
    rows.push(['Metric Name', 'Value', 'Benchmark Target', 'Status'].map(escapeCsv).join(','));
    rows.push(['Overall SLA Compliance', '94.2%', '90.0%', 'TARGET EXCEEDED'].map(escapeCsv).join(','));
    rows.push(['Average Resolution Time', '3.8 Hours', '6.0 Hours', 'OPTIMAL'].map(escapeCsv).join(','));
    rows.push(['AI Triage Accuracy', '96.4%', '92.0%', 'OPTIMAL'].map(escapeCsv).join(','));
    rows.push(['Citizen Satisfaction Rating', '4.8 / 5.0', '4.0 / 5.0', 'EXCELLENT'].map(escapeCsv).join(','));
    rows.push(['Escalation / Reopen Rate', '2.1%', '< 5.0%', 'CONTROLLED'].map(escapeCsv).join(','));
    rows.push('');

    // Section 2: Department Workload Distribution
    rows.push('--- SECTION 2: DEPARTMENT WORKLOAD DISTRIBUTION ---');
    rows.push(['Department Name', 'Active Grievance Volume', 'Percentage Share'].map(escapeCsv).join(','));
    const totalDeptCount = DEPT_DATA.reduce((acc, d) => acc + d.count, 0);
    DEPT_DATA.forEach(d => {
      const pct = ((d.count / totalDeptCount) * 100).toFixed(1) + '%';
      rows.push([d.name, d.count, pct].map(escapeCsv).join(','));
    });
    rows.push('');

    // Section 3: SLA Performance & Resolution Times
    rows.push('--- SECTION 3: CATEGORY-WISE RESOLUTION TIMES (HOURS) ---');
    rows.push(['Grievance Category', 'Actual Avg Hours', 'Government SLA Target (Hours)', 'SLA Variance'].map(escapeCsv).join(','));
    RESOLUTION_TIME_DATA.forEach(r => {
      const variance = (r.target - r.hours).toFixed(1) + 'h ahead';
      rows.push([r.category, r.hours, r.target, variance].map(escapeCsv).join(','));
    });
    rows.push('');

    // Section 4: Diurnal Flow Telemetry
    rows.push('--- SECTION 4: 24-HOUR INTAKE VS RESOLUTION VELOCITY ---');
    rows.push(['Time Window (IST)', 'New Grievances Registered', 'Squad Field Closures'].map(escapeCsv).join(','));
    HOURLY_FLOW_DATA.forEach(h => {
      rows.push([h.hour, h.reports, h.resolved].map(escapeCsv).join(','));
    });
    rows.push('');

    // Section 5: Detailed Active Grievance Register
    rows.push('--- SECTION 5: LIVE MUNICIPAL GRIEVANCE REGISTER ---');
    rows.push([
      'Ticket Number',
      'Citizen Name',
      'Category',
      'Ward',
      'Zone',
      'Priority',
      'Severity',
      'Department',
      'Status',
      'Assigned Field Worker',
      'Registered At',
      'Location Address'
    ].map(escapeCsv).join(','));

    complaints.forEach(c => {
      rows.push([
        c.ticketNo,
        c.citizenName,
        c.category,
        c.ward,
        c.zone,
        c.priority,
        c.severity,
        c.department,
        c.status,
        c.assignedWorkerName || 'Unassigned',
        c.createdAt,
        c.address
      ].map(escapeCsv).join(','));
    });

    const csvString = rows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BMC_City_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header (Odisha Heritage + Municipal Tech) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#211E1B] text-[#F7F1E5] border border-[#3D3732] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#3D3732] border border-[#B8543A]/60 flex items-center justify-center text-[#C58B3A] shadow-md">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#3D3732] text-[#C58B3A] border border-[#5A524A] font-mono text-[10px] font-bold">
                BMC DATA INTELLIGENCE
              </span>
              <span className="text-xs text-[#D8C7AA]">Municipal SLA & Ward Telemetry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F1E5] tracking-tight mt-0.5">
              City Performance & SLA Analytics
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Data Button */}
          <button
            onClick={handleExportCSV}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              downloadSuccess
                ? 'bg-[#5C765A] text-white shadow-[#5C765A]/30'
                : 'bg-[#B8543A] hover:bg-[#A14731] text-white shadow-[#B8543A]/20'
            }`}
            title="Download full analytics report and grievance register as CSV"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Report Downloaded (CSV)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <FileSpreadsheet className="w-3.5 h-3.5 opacity-80" />
                <span>Export Data (CSV)</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3D3732] border border-[#5A524A] text-xs font-mono text-[#D8C7AA]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5C765A]" />
            <span>94.2% SLA COMPLIANCE</span>
          </div>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-[0_1px_3px_rgba(33,30,27,0.05)] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase tracking-wider">AVG RESOLUTION TIME</span>
          <p className="text-2xl font-bold font-mono text-[#B8543A]">3.8 Hours</p>
          <p className="text-[11px] text-[#5C765A] font-medium">-22% faster than 2025 SLA</p>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-[0_1px_3px_rgba(33,30,27,0.05)] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase tracking-wider">AI TRIAGE ACCURACY</span>
          <p className="text-2xl font-bold font-mono text-[#C58B3A]">96.4%</p>
          <p className="text-[11px] text-[#81786D]">Auto-routed to 1 of 5 departments</p>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-[0_1px_3px_rgba(33,30,27,0.05)] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase tracking-wider">CITIZEN RATING</span>
          <p className="text-2xl font-bold font-mono text-[#5C765A]">4.8 / 5.0</p>
          <p className="text-[11px] text-[#81786D]">Verified photo proof feedback</p>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-[0_1px_3px_rgba(33,30,27,0.05)] space-y-1">
          <span className="text-[10px] font-mono text-[#81786D] uppercase tracking-wider">REOPEN RATE</span>
          <p className="text-2xl font-bold font-mono text-[#211E1B]">2.1%</p>
          <p className="text-[11px] text-[#5C765A] font-medium">Within target thresholds (&lt; 5%)</p>
        </div>
      </div>

      <PattachitraDivider theme="terracotta" />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Workload Distribution */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-[0_2px_6px_rgba(33,30,27,0.04)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#211E1B]">Grievance Volume by Municipal Department</h3>
              <p className="text-xs text-[#81786D]">Active cases across BMC administrative wings</p>
            </div>
            <span className="text-[11px] font-mono text-[#B8543A] font-semibold">Live Intake</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D9" />
                <XAxis dataKey="name" stroke="#81786D" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#81786D" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#211E1B',
                    borderColor: '#3D3732',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F7F1E5'
                  }}
                  itemStyle={{ color: '#C58B3A' }}
                />
                <Bar dataKey="count" fill="#B8543A" radius={[4, 4, 0, 0]}>
                  {DEPT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Resolution Times vs Target SLA */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-[0_2px_6px_rgba(33,30,27,0.04)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#211E1B]">Avg Resolution Hours vs Government SLA Target</h3>
              <p className="text-xs text-[#81786D]">Actual squad turnaround compared to statutory limits</p>
            </div>
            <span className="text-[11px] font-mono text-[#5C765A] font-semibold">Targets Exceeded</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOLUTION_TIME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D9" />
                <XAxis dataKey="category" stroke="#81786D" fontSize={10} />
                <YAxis stroke="#81786D" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#211E1B',
                    borderColor: '#3D3732',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F7F1E5'
                  }}
                />
                <Bar dataKey="hours" name="Actual Hours" fill="#5C765A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="SLA Benchmark" fill="#D8C7AA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Hourly Intake vs Resolution Velocity */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-4 shadow-[0_2px_6px_rgba(33,30,27,0.04)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C3]">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#211E1B]">Diurnal Telemetry: Incident Influx vs Squad Closures</h3>
              <p className="text-xs text-[#81786D]">24-hour progression of incoming citizen reports vs completed field work</p>
            </div>
            <span className="text-[11px] font-mono text-[#B8543A] font-semibold">24h Velocity</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_FLOW_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D9" />
                <XAxis dataKey="hour" stroke="#81786D" fontSize={11} />
                <YAxis stroke="#81786D" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#211E1B',
                    borderColor: '#3D3732',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F7F1E5'
                  }}
                />
                <Line type="monotone" dataKey="reports" name="New Grievances" stroke="#B8543A" strokeWidth={2.5} dot={{ r: 4, fill: '#B8543A' }} />
                <Line type="monotone" dataKey="resolved" name="Squad Resolutions" stroke="#5C765A" strokeWidth={2.5} dot={{ r: 4, fill: '#5C765A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
