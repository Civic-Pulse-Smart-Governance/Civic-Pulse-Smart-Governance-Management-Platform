const STYLES = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-status-pending-bg text-status-pending-text',
  HIGH: 'bg-status-rejected-bg text-status-rejected-text',
};

export default function PriorityBadge({ priority }) {
  const style = STYLES[priority] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${style}`}>
      {priority}
    </span>
  );
}
