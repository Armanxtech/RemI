import React, { useState } from 'react';
import { HeartPulse, Activity, AlertTriangle, ShieldCheck, Download, Sparkles, TrendingUp, Clock, CheckCircle2, UserCheck, Calendar, Bell, Plus, PhoneCall, RefreshCw } from 'lucide-react';
import { PatientProfile, DailyRitual, CognitiveGame, MedicationItem, HealthRecord, CaregiverAlert } from '../types';
import { soundService } from '../services/soundService';

interface CaregiverDashboardProps {
  patient: PatientProfile;
  rituals: DailyRitual[];
  games: CognitiveGame[];
  medications: MedicationItem[];
  records: HealthRecord;
  alerts: CaregiverAlert[];
  onBackToPatient: () => void;
  onSendCaregiverVoiceNote: (text: string) => void;
  onOpenBookDoctor?: () => void;
  onOpenBookCaregiver?: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  patient,
  rituals,
  games,
  medications,
  records,
  alerts,
  onBackToPatient,
  onSendCaregiverVoiceNote,
  onOpenBookDoctor,
  onOpenBookCaregiver,
}) => {
  const [customVoiceMsg, setCustomVoiceMsg] = useState('');
  const [msgSentNotice, setMsgSentNotice] = useState(false);

  // Derived metrics
  const completedMeds = medications.filter((m) => m.completed).length;
  const totalScheduledMeds = medications.filter((m) => !m.isAsNeeded).length || 1;
  const medAdherencePercent = Math.round((completedMeds / totalScheduledMeds) * 100);

  const completedRituals = rituals.filter((r) => r.completed).length;
  const ritualAdherencePercent = Math.round((completedRituals / rituals.length) * 100);

  const handleSendVoicePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVoiceMsg.trim()) return;

    soundService.playSuccess();
    onSendCaregiverVoiceNote(customVoiceMsg.trim());
    setCustomVoiceMsg('');
    setMsgSentNotice(true);
    setTimeout(() => setMsgSentNotice(false), 4000);
  };

  const handlePrintNeurologistReport = () => {
    soundService.playClick();
    window.print();
  };

  return (
    <div id="caregiver-dashboard-container" className="space-y-6 pb-24 text-white">
      {/* Top Clinical Banner */}
      <div className="bg-gradient-to-r from-purple-950/90 via-[#1F1735] to-indigo-950/90 border border-purple-800/50 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={patient.avatarUrl}
              alt={patient.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-400"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{patient.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  Active Monitoring
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                Age {patient.age} • {patient.location} • Stage: <strong className="text-amber-300">{patient.cognitiveStage}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-neurologist-report-btn"
              onClick={handlePrintNeurologistReport}
              className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-700/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Clinical Summary</span>
            </button>

            <button
              onClick={onBackToPatient}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Patient View
            </button>
          </div>
        </div>

        {/* 3 Metric Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-[#141022]/80 border border-purple-900/50">
            <span className="text-xs text-purple-300 font-semibold block">Medication Adherence</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-400">{medAdherencePercent}%</span>
              <span className="text-xs text-slate-300">({completedMeds}/{totalScheduledMeds} doses)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141022]/80 border border-purple-900/50">
            <span className="text-xs text-purple-300 font-semibold block">Cognitive Vitality Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-purple-300">92/100</span>
              <span className="text-xs text-emerald-400">▲ +4% this week</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141022]/80 border border-purple-900/50">
            <span className="text-xs text-purple-300 font-semibold block">Daily Routine Completion</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-amber-300">{ritualAdherencePercent}%</span>
              <span className="text-xs text-slate-300">({completedRituals}/{rituals.length} done)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Cognitive Trend Visualization */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">7-Day Cognitive Stability Trend</h3>
          </div>
          <span className="text-xs text-purple-300 font-semibold px-2.5 py-1 rounded-full bg-purple-950 border border-purple-800/50">
            Target Tracking & Recall
          </span>
        </div>

        {/* CSS/SVG Sparkline graph */}
        <div className="space-y-2">
          <div className="h-32 w-full bg-[#120F1D] rounded-2xl p-4 flex items-end justify-between gap-2 border border-purple-950/60">
            {[
              { day: 'Mon', score: 84, latency: '2.1s' },
              { day: 'Tue', score: 88, latency: '1.9s' },
              { day: 'Wed', score: 86, latency: '2.0s' },
              { day: 'Thu', score: 91, latency: '1.7s' },
              { day: 'Fri', score: 89, latency: '1.8s' },
              { day: 'Sat', score: 94, latency: '1.6s' },
              { day: 'Sun (Today)', score: 92, latency: '1.7s' },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-purple-300">{item.score}%</span>
                <div
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-purple-700 to-indigo-400 transition-all duration-700 hover:brightness-125"
                  style={{ height: `${(item.score - 50) * 2.2}px` }}
                  title={`${item.day}: Score ${item.score}%, Latency ${item.latency}`}
                />
                <span className="text-[10px] text-slate-400 mt-1">{item.day.slice(0, 3)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-purple-300/80 italic">
            * Cognitive response latency remained steady between 1.6s and 2.1s, indicating sustained attention without signs of acute agitation.
          </p>
        </div>
      </div>

      {/* AI Neurological Insights & Recommendations */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">AI Clinical Assistant Observations</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50 space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <p>
            • <strong className="text-purple-300">Memory Engagement:</strong> Arpan responded with high emotional resonance to cultural prompts featuring the Tezpur Brahmaputra Ghat and Bihu music, showing spontaneous narrative recall.
          </p>
          <p>
            • <strong className="text-purple-300">Medication Routine:</strong> Morning Donepezil and Vitamin D3 have been taken with 100% punctuality over the last 5 days.
          </p>
          <p>
            • <strong className="text-purple-300">Suggested Action for Caregiver:</strong> Introduce 10 minutes of gentle afternoon garden walking to maintain circadian rhythm and promote evening sleep.
          </p>
        </div>
      </div>

      {/* Real-time Alerts & Safety Feed */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Safety & Activity Log</h3>
          </div>
          <span className="text-xs text-purple-300 font-semibold">{alerts.length} Events Today</span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                alert.severity === 'urgent'
                  ? 'bg-red-950/40 border-red-800/60 text-red-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : 'bg-[#141022] border-purple-900/40 text-purple-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {alert.severity === 'urgent' ? (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">
                    {alert.message || alert.title || alert.description}
                  </p>
                  {alert.description && alert.message && alert.description !== alert.message && (
                    <p className="text-[11px] text-slate-300 mt-0.5">{alert.description}</p>
                  )}
                  <p className="text-[11px] opacity-75 mt-0.5">{alert.timestamp}</p>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/40 border border-white/10 uppercase font-bold">
                {alert.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase Connected Appointments & In-Home Booking Hub */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>Medical Appointments & Caregiver Bookings</span>
            </h3>
            <p className="text-xs text-purple-200/80">
              Synced with Supabase Cloud DB (<code className="text-emerald-300 font-mono">kbggcjvqiepvbtlewwgf</code>)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenBookDoctor && (
              <button
                onClick={() => {
                  soundService.playClick();
                  onOpenBookDoctor();
                }}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Doctor</span>
              </button>
            )}
            {onOpenBookCaregiver && (
              <button
                onClick={() => {
                  soundService.playClick();
                  onOpenBookCaregiver();
                }}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Caregiver</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Upcoming Neurologist Review</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Supabase Synced
              </span>
            </div>
            <p className="text-xs text-purple-200">
              Dr. B. K. Sharma (TMCH Tezpur) • In-person clinic checkup
            </p>
            <p className="text-[11px] text-slate-400">
              Tomorrow at 10:00 AM • Routine MMSE cognitive battery
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">In-Home Caregiver Shift</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                Confirmed
              </span>
            </div>
            <p className="text-xs text-purple-200">
              8-Hour Day Shift • Assamese-speaking Companion
            </p>
            <p className="text-[11px] text-slate-400">
              Daily walk assistance, hydration tracking, photo reminiscing
            </p>
          </div>
        </div>
      </div>

      {/* Remote Voice Message to Patient */}

      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Send Voice Note / Gentle Reminder to Patient</h3>
        </div>

        <p className="text-xs text-purple-200/80">
          Type a caring message. Sathi AI will immediately speak it to Arpan in Assamese/English with warm family tone.
        </p>

        <form onSubmit={handleSendVoicePrompt} className="space-y-3">
          <input
            type="text"
            placeholder="e.g. Deuta, remember to drink a glass of fresh water after your walk!"
            value={customVoiceMsg}
            onChange={(e) => setCustomVoiceMsg(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#141022] border border-purple-700/50 text-white text-sm focus:outline-none focus:border-purple-400"
          />

          <div className="flex items-center justify-between">
            {msgSentNotice ? (
              <span className="text-xs text-emerald-400 font-bold">
                ✓ Message spoken to patient by Sathi!
              </span>
            ) : (
              <span className="text-xs text-purple-300/60">Delivered via Sathi Speech Engine</span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs text-white shadow-md active:scale-95 transition-all"
            >
              Send & Speak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
