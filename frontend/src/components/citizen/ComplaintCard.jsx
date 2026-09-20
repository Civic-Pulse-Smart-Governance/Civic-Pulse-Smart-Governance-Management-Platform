import { Link } from 'react-router-dom';
import { Hash, CalendarDays, Download } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import { generateComplaintReceiptPDF } from '../../lib/pdfGenerator';

export default function ComplaintCard({ complaint }) {
  const c = complaint;
  return (
    <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm p-6">
      <div className="flex items-start justify-between mb-1">
        <Link
          to={`/citizen/complaints/${c.id}`}
          className="flex items-center gap-1.5 text-brand-700 font-bold text-sm hover:underline"
        >
          <Hash size={14} />
          {c.id}
        </Link>
        <StatusBadge status={c.status} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-4">{c.title}</h3>
      <div className="h-px bg-slate-100 mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-4">
        <div>
          <span className="font-semibold text-slate-700">Category: </span>
          <span className="text-slate-600">{c.category}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Priority: </span>
          <span className="text-slate-600">{c.priority}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Department: </span>
          <span className="text-slate-600">{c.department}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Location: </span>
          <span className="text-slate-600 capitalize">{c.location}</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="font-semibold text-slate-700 text-sm">Description:</span>
        <p className="text-sm text-slate-600 mt-1">{c.description}</p>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={13} />
          Submitted:{' '}
          {new Date(c.submittedAt).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
        <button
          onClick={() => generateComplaintReceiptPDF(c)}
          className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >
          <Download size={13} />
          Receipt PDF
        </button>
      </div>
    </div>
  );
}
