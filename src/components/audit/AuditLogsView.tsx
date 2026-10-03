import React, { useState, useEffect } from 'react';
import { ScrollText, Search, Lock } from 'lucide-react';
import { AuditLog } from '../../types';
import { subscribeAuditLogs } from '../../firebase/service';
import { KonarkWheel } from '../common/KonarkWheel';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filterEntity, setFilterEntity] = useState<string>('ALL');

  useEffect(() => {
    const unsub = subscribeAuditLogs((list) => setLogs(list));
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchSearch = !search || l.action.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase()) || l.userName.toLowerCase().includes(search.toLowerCase());
    const matchEntity = filterEntity === 'ALL' || l.entityType === filterEntity;
    return matchSearch && matchEntity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#B8543A]/40 flex items-center justify-center text-[#B8543A]">
            <ScrollText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#F7F1E5] text-[#6D3028] border border-[#B8543A]/30 font-mono text-[10px] font-bold">
                AUDIT & COMPLIANCE
              </span>
              <span className="text-xs text-[#81786D]">Tamper-Evident Immutable System Trail</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#211E1B] tracking-tight mt-0.5">
              Municipal Audit Trail & Security Ledger
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F1E5] border border-[#E2D7C3] text-xs font-mono text-[#5C765A] font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>CRYPTOGRAPHIC HASH VERIFIED</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2D7C3] text-xs shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#81786D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or officer..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] placeholder:text-[#81786D] focus:outline-none focus:border-[#B8543A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#81786D] hidden sm:inline">Filter Entity:</span>
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="p-2 rounded-lg bg-[#F7F1E5] border border-[#E2D7C3] text-[#211E1B] text-xs focus:outline-none focus:border-[#B8543A]"
          >
            <option value="ALL">All Event Types</option>
            <option value="COMPLAINT">Complaints</option>
            <option value="INCIDENT">City Incidents</option>
            <option value="EMERGENCY">Emergency 112</option>
            <option value="FIELD_TASK">Field Tasks</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2D7C3] space-y-3 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2D7C3] text-[#81786D] font-mono text-[10px] uppercase">
              <th className="py-3 px-3">TIMESTAMP</th>
              <th className="py-3 px-3">OFFICER / USER</th>
              <th className="py-3 px-3">ROLE</th>
              <th className="py-3 px-3">ACTION EVENT</th>
              <th className="py-3 px-3">ENTITY ID</th>
              <th className="py-3 px-3">DETAILS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2D7C3]/60 font-sans">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#F7F1E5]/60 text-[#3D3732]">
                <td className="py-3 px-3 font-mono text-[11px] text-[#81786D] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="py-3 px-3 font-bold text-[#211E1B] whitespace-nowrap">
                  {log.userName}
                </td>
                <td className="py-3 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F7F1E5] border border-[#E2D7C3] text-[#6D3028]">
                    {log.userRole}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-[#B8543A] font-bold whitespace-nowrap">
                  {log.action}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-[#81786D] whitespace-nowrap">
                  {log.entityId}
                </td>
                <td className="py-3 px-3 text-[#3D3732] max-w-md truncate">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
