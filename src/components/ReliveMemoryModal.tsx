import React, { useState } from 'react';
import { X, Volume2, Sparkles, Mic, Play, Pause, Heart, MessageSquare } from 'lucide-react';
import { MemoryStory, LanguageCode } from '../types';
import { soundService } from '../services/soundService';

interface ReliveMemoryModalProps {
  story: MemoryStory;
  onClose: () => void;
  language: LanguageCode;
}

export const ReliveMemoryModal: React.FC<ReliveMemoryModalProps> = ({
  story,
  onClose,
  language,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingNote, setIsRecordingNote] = useState(false);
  const [patientNote, setPatientNote] = useState('');

  const handleToggleNarrate = () => {
    if (isPlayingAudio) {
      soundService.stopSpeech();
      setIsPlayingAudio(false);
    } else {
      soundService.speak(story.description, language);
      setIsPlayingAudio(true);
    }
  };

  const handleRecordNote = () => {
    soundService.playClick();
    setIsRecordingNote(!isRecordingNote);
    if (!isRecordingNote) {
      setTimeout(() => {
        setPatientNote('I remember sitting on the garden verandah with a warm cup of Assam tea...');
        setIsRecordingNote(false);
        soundService.playSuccess();
      }, 3000);
    }
  };

  return (
    <div
      id="relive-memory-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="relive-memory-modal-container"
        className="bg-[#181427] border border-purple-800/50 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-white my-auto max-h-[92vh] flex flex-col"
      >
        {/* Photo Header */}
        <div className="relative h-60 w-full overflow-hidden">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181427] via-black/20 to-black/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-900/90 text-purple-200 text-xs font-bold border border-purple-700/60">
              {story.year}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-950/90 text-amber-300 text-xs font-bold border border-amber-800/60">
              {story.location}
            </span>
          </div>
        </div>

        {/* Content & Narration */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {story.title}
            </h3>
            <p className="text-xs text-purple-300/80 mt-0.5 font-medium">
              Narrated with love by {story.recordedBy} · {story.culturalTheme}
            </p>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-[#201A38] border border-purple-800/40 text-sm text-purple-100 leading-relaxed space-y-2">
            <p>{story.description}</p>
          </div>

          {/* Audio narration button */}
          <button
            id="narrate-memory-btn"
            onClick={handleToggleNarrate}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Pause Narration' : 'Listen Voice Story in Regional Language'}</span>
          </button>

          {/* Recorded Note Section */}
          <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Add Your Personal Voice Thought:
              </span>
              <button
                onClick={handleRecordNote}
                className={`p-2 rounded-xl text-xs flex items-center gap-1 font-semibold ${
                  isRecordingNote
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecordingNote ? 'Recording...' : 'Record'}</span>
              </button>
            </div>

            {patientNote ? (
              <p className="text-xs text-emerald-300 italic bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/30">
                "{patientNote}"
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Tap record to speak a sweet memory or feeling about this photo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
