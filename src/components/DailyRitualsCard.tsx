import React from 'react';
import { CheckCircle2, Circle, Droplets, Pill, Gamepad2, Footprints, Plus } from 'lucide-react';
import { DailyRitual } from '../types';
import { soundService } from '../services/soundService';

interface DailyRitualsCardProps {
  rituals: DailyRitual[];
  onToggleRitual: (id: string) => void;
  onLogWater: () => void;
  onPlayGame: () => void;
}

export const DailyRitualsCard: React.FC<DailyRitualsCardProps> = ({
  rituals,
  onToggleRitual,
  onLogWater,
  onPlayGame,
}) => {
  return (
    <div id="daily-rituals-section" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Daily Rituals
        </h3>
        <span className="text-xs text-purple-300 font-medium">
          {rituals.filter((r) => r.completed).length}/{rituals.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {rituals.map((ritual) => {
          const isHydration = ritual.type === 'hydration';
          const isGame = ritual.type === 'game';

          return (
            <div
              key={ritual.id}
              id={`ritual-item-${ritual.id}`}
              className={`bg-[#1E1931] border rounded-2xl p-4 transition-all duration-200 flex flex-col gap-3 ${
                ritual.completed
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-purple-900/30 hover:border-purple-600/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Icon */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      ritual.iconType === 'meds'
                        ? 'bg-amber-500/20 text-amber-300'
                        : ritual.iconType === 'water'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : ritual.iconType === 'brain'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {ritual.iconType === 'meds' && <Pill className="w-5 h-5" />}
                    {ritual.iconType === 'water' && <Droplets className="w-5 h-5" />}
                    {ritual.iconType === 'brain' && <Gamepad2 className="w-5 h-5" />}
                    {ritual.iconType === 'walk' && <Footprints className="w-5 h-5" />}
                    {ritual.iconType === 'sun' && <Footprints className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {ritual.title}
                    </h4>
                    <p
                      className={`text-xs ${
                        ritual.completed ? 'text-emerald-300 font-semibold' : 'text-purple-300/80'
                      }`}
                    >
                      {ritual.timeStr}
                    </p>
                  </div>
                </div>

                {/* Right Action / Check button */}
                <div>
                  {isHydration ? (
                    <button
                      id="log-water-glass-btn"
                      onClick={() => {
                        soundService.playWaterDrop();
                        onLogWater();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold active:scale-95 transition-all"
                      title="Log 1 glass of water"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Glass</span>
                    </button>
                  ) : isGame ? (
                    <button
                      id="play-ritual-game-btn"
                      onClick={() => {
                        soundService.playClick();
                        onPlayGame();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
                    >
                      Play
                    </button>
                  ) : (
                    <button
                      id={`toggle-ritual-${ritual.id}`}
                      onClick={() => {
                        if (!ritual.completed) soundService.playMedicationBell();
                        else soundService.playClick();
                        onToggleRitual(ritual.id);
                      }}
                      className="p-1 rounded-full text-purple-300 hover:text-purple-100 transition-all focus:outline-none"
                    >
                      {ritual.completed ? (
                        <CheckCircle2 className="w-7 h-7 text-amber-400 fill-amber-400/20" />
                      ) : (
                        <Circle className="w-7 h-7 text-purple-400/50 hover:text-purple-300" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar for hydration */}
              {isHydration && ritual.requiredCount && (
                <div className="mt-1">
                  <div className="w-full bg-purple-950/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-indigo-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((ritual.currentCount || 0) / ritual.requiredCount) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-purple-300/70 mt-1 font-medium">
                    <span>{ritual.currentCount || 0} of {ritual.requiredCount} glasses</span>
                    <span>{Math.round(((ritual.currentCount || 0) / ritual.requiredCount) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
