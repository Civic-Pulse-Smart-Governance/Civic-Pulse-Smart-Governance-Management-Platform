const STYLES = {
  Pending: 'bg-status-pending-bg text-status-pending-text',
  'In Progress': 'bg-status-progress-bg text-status-progress-text',
  Resolved: 'bg-status-resolved-bg text-status-resolved-text',
  Rejected: 'bg-status-rejected-bg text-status-rejected-text',
  Active: 'bg-status-resolved-bg text-status-resolved-text',
  Inactive: 'bg-slate-200 text-slate-600',
  Suspended: 'bg-status-rejected-bg text-status-rejected-text',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-slate-200 text-slate-700';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${style}`}>
      {status}
    </span>
  );
}
