const TONES = {
  blue: { bg: 'bg-brand-50', text: 'text-brand-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
};

/** Admin style: eyebrow label + icon box on top row, big number below, caption underneath. */
export function StatCardVertical({ label, value, caption, icon: Icon, tone = 'blue' }) {
  const t = TONES[tone] || TONES.blue;
  return (
    <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.bg} ${t.text}`}>
          {Icon && <Icon size={16} strokeWidth={2.25} />}
        </span>
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {caption && <div className="text-xs text-slate-400 mt-1">{caption}</div>}
    </div>
  );
}

/** Officer style: icon square on the left, label above number on the right. */
export function StatCardHorizontal({ label, value, icon: Icon, tone = 'blue' }) {
  const t = TONES[tone] || TONES.blue;
  return (
    <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm p-5 flex items-center gap-4">
      <span className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${t.bg} ${t.text}`}>
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </span>
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-900 leading-tight">{value}</div>
      </div>
    </div>
  );
}
