import React, { useState } from 'react';
import { Sparkles, Brain, Award, Play, CheckCircle2, Lock } from 'lucide-react';
import { CognitiveGame, LanguageCode } from '../types';
import { soundService } from '../services/soundService';

interface GamesHubProps {
  games: CognitiveGame[];
  onSelectGame: (game: CognitiveGame) => void;
  language: LanguageCode;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  games,
  onSelectGame,
  language,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'memory' | 'logic' | 'focus' | 'cultural'>('all');

  const filterChips = [
    { id: 'all' as const, label: 'All' },
    { id: 'memory' as const, label: 'Memory' },
    { id: 'logic' as const, label: 'Logic' },
    { id: 'focus' as const, label: 'Focus' },
    { id: 'cultural' as const, label: 'Cultural / NER' },
  ];

  const filteredGames = games.filter((g) => {
    if (activeFilter === 'all') return true;
    return g.category === activeFilter;
  });

  return (
    <div id="games-hub-screen" className="space-y-6 pb-24">
      {/* Title & Introduction */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cognitive Games Hub
        </h2>
        <p className="text-sm text-purple-200/80 leading-relaxed max-w-xl">
          Maintain and enhance your cognitive functions with our curated selection of premium exercises. Designed for comfort, cultural familiarity, and clarity.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              id={`filter-chip-${chip.id}`}
              onClick={() => {
                soundService.playClick();
                setActiveFilter(chip.id);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-900/40'
                  : 'bg-[#221B38] text-slate-300 hover:bg-[#2A2346] border border-purple-900/40'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Games List */}
      <div className="space-y-5">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            id={`game-card-${game.id}`}
            className="bg-[#1C172E] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl shadow-purple-950/20 hover:border-purple-600/50 transition-all flex flex-col"
          >
            {/* Banner Image */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden">
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C172E] via-transparent to-black/30" />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {game.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-md text-purple-200 text-xs font-bold border border-purple-700/60 shadow-md">
                    Featured
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-amber-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-800/60 capitalize">
                  {game.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 -mt-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {game.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/80 mt-1.5 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5">
                <button
                  id={`start-game-${game.id}-btn`}
                  onClick={() => {
                    soundService.playClick();
                    onSelectGame(game);
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] ${
                    game.isFeatured
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-purple-900/40'
                      : 'bg-[#282142] hover:bg-[#322A53] text-white border border-purple-800/50'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{game.isFeatured ? 'Start Challenge' : 'Play Now'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
