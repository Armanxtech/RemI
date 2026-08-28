import React from 'react';
import { Sparkles, Play, Volume2 } from 'lucide-react';
import { MemoryStory } from '../types';
import { soundService } from '../services/soundService';

interface MemoryOfTheDayCardProps {
  memory: MemoryStory;
  onReliveMemory: (memory: MemoryStory) => void;
  language: string;
}

export const MemoryOfTheDayCard: React.FC<MemoryOfTheDayCardProps> = ({
  memory,
  onReliveMemory,
  language,
}) => {
  return (
    <div
      id="memory-of-the-day-card"
      className="bg-[#1C172E] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl shadow-purple-950/30 transition-all hover:border-purple-600/40"
    >
      {/* Featured Photo */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={memory.imageUrl}
          alt={memory.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C172E] via-transparent to-black/20" />
      </div>

      <div className="p-5 -mt-3 relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>{memory.tag}</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-white mt-3 tracking-tight">
          {memory.title}
        </h3>

        <p className="text-sm text-purple-200/80 mt-2 leading-relaxed">
          {memory.description}
        </p>

        {/* Relive Memory CTA Button */}
        <div className="mt-5">
          <button
            id="relive-memory-btn"
            onClick={() => {
              soundService.playClick();
              onReliveMemory(memory);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Relive Memory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
