import React, { useState } from 'react';
import { Sparkles, Play, Plus, Volume2, Mic, MicOff, BookOpen, Music, Heart, Share2, Compass } from 'lucide-react';
import { MemoryStory, LanguageCode } from '../types';
import { soundService } from '../services/soundService';
import { generateReminiscenceStory } from '../services/aiService';

interface MemoriesScreenProps {
  stories: MemoryStory[];
  onReliveMemory: (story: MemoryStory) => void;
  onAddStory: (story: Partial<MemoryStory>) => void;
  language: LanguageCode;
  patientName: string;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({
  stories,
  onReliveMemory,
  onAddStory,
  language,
  patientName,
}) => {
  const [selectedStory, setSelectedStory] = useState<MemoryStory | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiCustomStory, setAiCustomStory] = useState<{
    title: string;
    story: string;
    sensoryCues: string[];
    conversationPrompt: string;
  } | null>(null);

  // New Memory Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('1990');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Tezpur, Assam');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=380&fit=crop');

  const handleGenerateAiStory = async (theme: string) => {
    setIsAiGenerating(true);
    soundService.playClick();
    const res = await generateReminiscenceStory({
      theme,
      era: '1980s-1990s',
      language,
      patientName,
    });
    setAiCustomStory(res);
    setIsAiGenerating(false);
    soundService.playSuccess();
    soundService.speak(res.story, language);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddStory({
      title: newTitle.trim(),
      year: newYear,
      description: newDescription.trim() || 'A cherished family memory.',
      location: newLocation,
      imageUrl: newImage,
      culturalTheme: 'Family & Heritage',
      audioDuration: '1:30 min',
      recordedBy: 'Family Member',
      hasVoiceNote: true,
      tag: 'Family Memory',
    });

    soundService.playSuccess();
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div id="memories-screen" className="space-y-6 pb-24">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Memories & Heritage
        </h2>
        <p className="text-sm text-purple-200/80 leading-relaxed">
          Relive comforting life moments, regional traditions, and voices of loved ones.
        </p>
      </div>

      {/* AI Memory Prompt Generator Bar */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">AI Reminiscence Storyteller</h3>
          </div>
          <span className="text-xs text-purple-300 font-semibold px-2 py-0.5 rounded-full bg-purple-900/50">
            Powered by Sathi AI
          </span>
        </div>

        <p className="text-xs text-purple-200/80">
          Select a familiar North Eastern topic to listen to a comforting sensory memory:
        </p>

        <div className="flex items-center gap-2 flex-wrap pt-1">
          {[
            'Assam Tea Harvest',
            'Majuli Island Flute',
            'Bihu Pitha Festivity',
            'Brahmaputra Sunset Walk',
            'Mizoram Hills Garden',
          ].map((theme) => (
            <button
              key={theme}
              onClick={() => handleGenerateAiStory(theme)}
              disabled={isAiGenerating}
              className="px-3 py-1.5 rounded-xl bg-[#282142] hover:bg-purple-800/40 border border-purple-700/40 text-purple-200 text-xs font-semibold active:scale-95 transition-all"
            >
              ✨ {theme}
            </button>
          ))}
        </div>

        {/* Display generated AI story */}
        {aiCustomStory && (
          <div className="p-4 rounded-2xl bg-[#141022] border border-purple-700/50 mt-3 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">{aiCustomStory.title}</h4>
              <button
                onClick={() => soundService.speak(aiCustomStory.story, language)}
                className="p-1.5 rounded-lg bg-purple-900/60 text-purple-200 text-xs flex items-center gap-1 hover:bg-purple-800"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            </div>

            <p className="text-xs text-purple-200/90 leading-relaxed italic">
              "{aiCustomStory.story}"
            </p>

            {aiCustomStory.sensoryCues && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {aiCustomStory.sensoryCues.map((cue, cIdx) => (
                  <span
                    key={cIdx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/30"
                  >
                    🌿 {cue}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Header for Photo Album */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Photo & Audio Albums
        </h3>
        <button
          id="add-new-memory-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Memories Grid */}
      <div className="space-y-5">
        {stories.map((story) => (
          <div
            key={story.id}
            id={`memory-card-${story.id}`}
            className="bg-[#1C172E] border border-purple-900/40 rounded-3xl overflow-hidden shadow-xl shadow-purple-950/20 hover:border-purple-600/50 transition-all"
          >
            <div className="relative h-48 w-full">
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C172E] via-transparent to-black/30" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-md text-purple-200 text-xs font-bold border border-purple-700/60 shadow-md">
                  {story.year}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-800/60">
                  {story.location}
                </span>
              </div>
            </div>

            <div className="p-5 -mt-2 space-y-3">
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">{story.title}</h4>
                <p className="text-xs sm:text-sm text-purple-200/80 mt-1 leading-relaxed">
                  {story.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-950/60">
                <span className="text-xs text-purple-300/70 font-medium">
                  Voice note by: <strong>{story.recordedBy}</strong>
                </span>

                <button
                  id={`play-story-${story.id}`}
                  onClick={() => {
                    soundService.playClick();
                    onReliveMemory(story);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Relive</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MEMORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181427] border border-purple-800/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Family Memory</h3>

            <form onSubmit={handleSaveMemory} className="space-y-3">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Grandchildren Picnic in Tezpur"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-purple-300 font-semibold block mb-1">Year / Era</label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-300 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Heartfelt Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell a brief story about what happened on that beautiful day..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#282142] text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg"
                >
                  Save to Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
