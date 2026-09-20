import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, MapPin, Sparkles, Navigation, AlertTriangle, ArrowUpDown, Filter } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import useComplaintFilters from '../../lib/useComplaintFilters';
import Card, { CardHeader } from '../../components/shared/Card';
import FilterBar from '../../components/shared/FilterBar';
import Table, { Td } from '../../components/shared/Table';
import StatusBadge from '../../components/shared/StatusBadge';
import PriorityBadge from '../../components/shared/PriorityBadge';
import { getAllComplaints } from '../../lib/api';
import { generateComplaintReceiptPDF } from '../../lib/pdfGenerator';
import { analyzeLocationProximity, sortComplaintsByProximity } from '../../services/geoProximityService';

export default function AdminComplaints() {
  usePageMeta('Complaints', 'All civic grievances across departments');
  const [complaintList, setComplaintList] = useState([]);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [proximityFilter, setProximityFilter] = useState('all'); // all, local, maharashtra, interstate, international

  useEffect(() => {
    getAllComplaints().then(({ data }) => {
      if (Array.isArray(data)) {
        setComplaintList(data);
      }
    });
  }, []);

  const { filters, onChange, onReset, filtered: baseFiltered } = useComplaintFilters(complaintList);

  // Apply Proximity Filter & Proximity Sorting
  const processedComplaints = useMemo(() => {
    let list = [...baseFiltered];

    // Filter by Proximity Zone / International Jurisdiction
    if (proximityFilter !== 'all') {
      list = list.filter((c) => {
        const geo = analyzeLocationProximity(c.location);
        if (proximityFilter === 'local') return geo.zone === 'local';
        if (proximityFilter === 'maharashtra') return geo.isMaharashtra;
        if (proximityFilter === 'interstate') return geo.zone === 'interstate';
        if (proximityFilter === 'international') return geo.isOutsideIndia;
        return true;
      });
    }

    // Sort by proximity to Maharashtra Admin HQ (nearest first)
    if (sortByProximity) {
      list = sortComplaintsByProximity(list, true);
    }

    return list;
  }, [baseFiltered, proximityFilter, sortByProximity]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader title="Find Complaints" subtitle="Search and filter all complaints across the platform." />
        <FilterBar filters={filters} onChange={onChange} onReset={onReset} />
      </Card>

      {/* Maharashtra Admin HQ Proximity Prioritization Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 shadow-md border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Navigation size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Admin Proximity Command (Maharashtra)
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                HQ: Mumbai / Pune
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Prioritize urgent local grievances & identify non-Indian submissions outside municipal jurisdiction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto justify-end">
          {/* Proximity Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <Filter size={13} className="text-cyan-400" />
            <select
              value={proximityFilter}
              onChange={(e) => setProximityFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Distances</option>
              <option value="local" className="bg-slate-900 text-white">Local Metro (&lt; 50 km)</option>
              <option value="maharashtra" className="bg-slate-900 text-white">Maharashtra State (&lt; 350 km)</option>
              <option value="interstate" className="bg-slate-900 text-white">Inter-State India</option>
              <option value="international" className="bg-slate-900 text-white">🚫 Non-India (Out of Jurisdiction)</option>
            </select>
          </div>

          {/* Proximity Sort Toggle Button */}
          <button
            type="button"
            onClick={() => setSortByProximity((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
              sortByProximity
                ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15'
            }`}
          >
            <ArrowUpDown size={13} />
            {sortByProximity ? 'Prioritized: Nearest First' : 'Prioritize Nearby (Maharashtra)'}
          </button>
        </div>
      </div>

      <Card padding="p-0 pt-6">
        <div className="px-6 flex items-center justify-between flex-wrap gap-2 mb-2">
          <CardHeader
            title="All Complaints"
            subtitle={`${processedComplaints.length} complaint(s) listed.`}
          />
          {sortByProximity && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200">
              📍 Sorted by proximity to Maharashtra HQ (Nearest first)
            </span>
          )}
        </div>

        <Table columns={['Complaint ID', 'Citizen', 'Category', 'Location & Proximity', 'Priority', 'Submitted', 'Status', 'Action']}>
          {processedComplaints.map((c) => {
            const id = c.id || c.complaintId;
            const geo = analyzeLocationProximity(c.location);

            return (
              <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                <Td className="font-semibold text-brand-700">{id}</Td>
                <Td>{c.userName || c.submittedBy || 'Citizen'}</Td>
                <Td>
                  <span className="font-medium text-slate-800">{c.category}</span>
                  <div className="text-[11px] text-slate-400 capitalize">{(c.department || 'General').toLowerCase()}</div>
                </Td>
                <Td>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs font-semibold text-slate-800 capitalize flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {c.location || 'Local'}
                    </span>
                    {geo.isOutsideIndia ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                        <AlertTriangle size={10} />
                        Non-India (Cannot Solve)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        geo.zone === 'local'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : geo.zone === 'maharashtra'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        📍 {geo.formattedDistance} ({geo.zone === 'local' ? 'Local' : geo.isMaharashtra ? 'MH State' : 'Inter-State'})
                      </span>
                    )}
                  </div>
                </Td>
                <Td>
                  <PriorityBadge priority={c.priority || c.urgency || 'MEDIUM'} />
                </Td>
                <Td className="text-slate-500 text-xs">
                  {new Date(c.submittedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/complaints/${id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                      title="Open AI Action Advisor & Details"
                    >
                      <Sparkles size={13} className="text-indigo-600" />
                      AI Action
                    </Link>
                    <button
                      onClick={() => generateComplaintReceiptPDF(c)}
                      className="text-slate-400 hover:text-brand-600 inline-flex cursor-pointer p-1"
                      title="Download Receipt PDF"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </Td>
              </tr>
            );
          })}
          {processedComplaints.length === 0 && (
            <tr>
              <Td className="text-center text-slate-400 py-10" colSpan={8}>
                No complaints match your filters.
              </Td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}


