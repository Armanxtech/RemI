import React from 'react';
import { CheckCircle2, Gamepad2, Sparkles } from 'lucide-react';

interface ActivityGoalCardProps {
  percentage: number;
  completedRituals: number;
  totalRituals: number;
  completedGames: number;
  totalGames: number;
}

export const ActivityGoalCard: React.FC<ActivityGoalCardProps> = ({
  percentage,
  completedRituals,
  totalRituals,
  completedGames,
  totalGames,
}) => {
  // Stroke calculation for circular SVG gauge
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      id="activity-goal-card"
      className="bg-[#1C172E] border border-purple-900/30 rounded-3xl p-6 shadow-xl shadow-purple-950/20 text-center relative overflow-hidden"
    >
      {/* Subtle background ambient purple glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Circular Radial Metric */}
      <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="text-purple-950/60"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="text-purple-400 transition-all duration-1000 ease-out"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="url(#purpleGradient)"
            fill="transparent"
          />
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Text inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
            Goal Met
          </span>
        </div>
      </div>

      {/* Main Title & Positive Affirmation */}
      <h3 className="text-xl font-bold text-white mt-4 tracking-tight">
        Daily Activity Goal
      </h3>
      <p className="text-sm text-purple-200/80 mt-1 max-w-sm mx-auto leading-relaxed">
        {percentage >= 100
          ? '🌟 Remarkable job! You have achieved all your daily goals.'
          : 'You are almost there! Just a few more activities to complete your daily routine.'}
      </p>

      {/* Sub-Pills */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{completedRituals}/{totalRituals} Rituals</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{completedGames} Game{completedGames === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
};
