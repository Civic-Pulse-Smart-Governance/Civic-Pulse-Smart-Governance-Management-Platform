import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Edit3,
  Bot,
  MapPin,
  Globe,
  Ban,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { analyzeComplaintWithAI, AVAILABLE_MODELS, isPuterAvailable } from '../../services/puterService';
import { analyzeLocationProximity } from '../../services/geoProximityService';

export default function AiActionAdvisor({
  complaint,
  onApplySolution,
  isApplying = false,
  className = ''
}) {
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.5-flash');
  const [analysis, setAnalysis] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(1); // 1-4 for AI options, 'custom' for custom
  const [customText, setCustomText] = useState('');
  const [customStatus, setCustomStatus] = useState('In Progress');
  const [showCustomBox, setShowCustomBox] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  // Proximity & Jurisdiction Check
  const geoInfo = analyzeLocationProximity(complaint?.location || '');

  const runAnalysis = async () => {
    if (!complaint) return;
    setLoading(true);
    try {
      const res = await analyzeComplaintWithAI(complaint, { model: selectedModel });
      setAnalysis(res);
      // Auto-select first option
      if (res.options && res.options.length > 0) {
        setSelectedOptionId(res.options[0].id);
      }
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaint?.id, selectedModel]);

  // Determine active plan to apply
  const getActivePlan = () => {
    if (selectedOptionId === 'custom') {
      return {
        title: 'Custom Admin Solution',
        note: customText.trim() || 'Custom administrative resolution applied.',
        status: customStatus,
        isCustom: true
      };
    }
    const opt = analysis?.options?.find((o) => o.id === selectedOptionId);
    if (opt) {
      return {
        title: opt.title,
        note: opt.actionText,
        status: opt.status || 'In Progress',
        isCustom: false
      };
    }
    return null;
  };

  const handleApply = async () => {
    const plan = getActivePlan();
    if (!plan || !onApplySolution) return;
    
    await onApplySolution(plan);
    setApplySuccess(`Successfully applied: "${plan.title}"`);
    setTimeout(() => setApplySuccess(''), 4000);
  };

  if (!complaint) return null;

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-indigo-500/20 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                AI Grievance Action Advisor
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Puter.js Free AI
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Automated 4-option municipal operational plan & distance prioritization
            </p>
          </div>
        </div>

        {/* Controls: Model Switcher & Re-analyze */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={loading}
              className="appearance-none bg-slate-800/90 border border-indigo-400/30 rounded-lg text-xs text-slate-200 pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <button
            type="button"
            onClick={runAnalysis}
            disabled={loading}
            className="inline-flex items-center gap-1 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-slate-200"
            title="Re-analyze with AI"
          >
            <RefreshCw className={loading ? 'animate-spin text-cyan-400' : ''} size={14} />
            <span className="hidden sm:inline">{loading ? 'Analyzing...' : 'Re-Run'}</span>
          </button>
        </div>
      </div>

      {/* Proximity / Location Jurisdictional Status Banner */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {geoInfo.isOutsideIndia ? (
          <div className="w-full flex items-start gap-2.5 bg-red-950/80 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl shadow-inner">
            <Ban className="text-red-400 shrink-0 mt-0.5" size={18} />
            <div>
              <div className="font-bold text-sm text-red-300 flex items-center gap-2">
                <span>🚫 Outside Indian Jurisdiction — Cannot Be Solved by Admin</span>
                <span className="text-[10px] bg-red-500/30 text-red-100 px-2 py-0.5 rounded border border-red-500/40">
                  International Location
                </span>
              </div>
              <p className="mt-1 text-xs text-red-200/90 leading-relaxed">
                The reported location <span className="font-semibold text-white">"{complaint.location}"</span> is outside India. Indian municipal and Maharashtra state authorities hold no operational or statutory jurisdiction abroad. Local officers cannot resolve this complaint. Please issue an Out-of-Jurisdiction advisory notice or reject the submission.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between flex-wrap gap-2 bg-slate-800/70 border border-white/10 px-3.5 py-2.5 rounded-xl">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="text-cyan-400" size={15} />
              <span>Location: <strong className="text-white capitalize">{complaint.location || 'Local Area'}</strong></span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300 font-medium">
                Admin HQ Baseline: <strong>Maharashtra (Mumbai/Pune)</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                geoInfo.zone === 'local'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : geoInfo.zone === 'maharashtra'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                📍 {geoInfo.formattedDistance} ({geoInfo.zoneLabel})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* AI Summary Diagnosis */}
      {analysis && (
        <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-2 font-semibold text-indigo-300 mb-1">
            <Bot size={16} />
            <span>AI Problem Assessment</span>
            {analysis.urgencyAssessment && (
              <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Priority: {analysis.urgencyAssessment}
              </span>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            {analysis.summary}
          </p>
        </div>
      )}

      {/* 4 Action Options */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>Recommended Solutions (Select 1 of 4)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any option to preview and execute
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="animate-spin text-cyan-400" size={24} />
            <span className="text-xs font-medium">Generating intelligent municipal options via Puter.js...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis?.options?.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedOptionId(opt.id);
                    setShowCustomBox(false);
                  }}
                  className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-900/90 to-blue-950/90 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                      : 'bg-slate-800/60 hover:bg-slate-800/90 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/10">
                        {opt.tag || `Option ${opt.id}`}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Clock size={12} className="text-slate-400" />
                        <span>{opt.estimatedTime || 'Standard'}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5">
                      {opt.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      "{opt.actionText}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Target Status: <strong className={opt.status === 'Resolved' ? 'text-emerald-400' : opt.status === 'Rejected' ? 'text-red-400' : 'text-cyan-300'}>{opt.status}</strong>
                    </span>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                        : 'border-white/30 text-transparent'
                    }`}>
                      <CheckCircle2 size={13} className={isSelected ? 'block text-slate-900' : 'hidden'} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Option 5: Type Custom Solution */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div
          onClick={() => {
            setSelectedOptionId('custom');
            setShowCustomBox(true);
          }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedOptionId === 'custom'
              ? 'bg-gradient-to-br from-indigo-900/90 to-blue-950/90 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
              : 'bg-slate-800/40 hover:bg-slate-800/70 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 size={16} className="text-cyan-400" />
              <span className="text-xs font-bold text-white">
                Option 5: Type Custom Solution
              </span>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded">
                If the 4 AI options were not perfect
              </span>
            </div>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
              selectedOptionId === 'custom'
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                : 'border-white/30 text-transparent'
            }`}>
              <CheckCircle2 size={13} className={selectedOptionId === 'custom' ? 'block text-slate-900' : 'hidden'} />
            </div>
          </div>

          {(selectedOptionId === 'custom' || showCustomBox) && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5" onClick={(e) => e.stopPropagation()}>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your tailored solution, official instructions, or dispatch notes here..."
                className="w-full rounded-lg bg-slate-950/80 border border-indigo-400/40 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

              <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Mark Status As:</span>
                  <select
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    className="bg-slate-900 border border-white/20 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Action Execution Bar */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-300 min-w-0">
          <span className="text-slate-400">Active Choice: </span>
          <strong className="text-cyan-300 truncate inline-block max-w-xs align-bottom">
            {selectedOptionId === 'custom'
              ? 'Custom Solution'
              : analysis?.options?.find((o) => o.id === selectedOptionId)?.title || 'Option 1'}
          </strong>
        </div>

        {applySuccess && (
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 size={14} />
            {applySuccess}
          </div>
        )}

        <button
          type="button"
          onClick={handleApply}
          disabled={isApplying || loading}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
            geoInfo.isOutsideIndia && selectedOptionId === 1
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold shadow-cyan-500/20'
          }`}
        >
          {isApplying ? (
            <>
              <RefreshCw className="animate-spin" size={15} />
              Applying Solution...
            </>
          ) : (
            <>
              <Send size={15} />
              Apply & Execute This Solution
            </>
          )}
        </button>
      </div>
    </div>
  );
}
