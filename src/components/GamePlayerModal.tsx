import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Volume2, RotateCcw, Award, CheckCircle2, ArrowRight, Brain, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CognitiveGame, LanguageCode } from '../types';
import { soundService } from '../services/soundService';
import { analyzeCognition } from '../services/aiService';

interface GamePlayerModalProps {
  game: CognitiveGame;
  onClose: () => void;
  onCompleteSession: (gameId: string, score: number, latencyMs: number) => void;
  language: LanguageCode;
}

// Cultural cards for North East India
interface CardItem {
  id: string;
  name: string;
  nameAs: string;
  nameBn: string;
  nameHi: string;
  iconSymbol: string;
  category: string;
  color: string;
}

const CULTURAL_ITEMS: CardItem[] = [
  { id: 'jaapi', name: 'Jaapi (Assam Hat)', nameAs: 'জাপি', nameBn: 'জাপি', nameHi: 'जापी', iconSymbol: '👒', category: 'Handloom', color: 'from-amber-600 to-yellow-500' },
  { id: 'gamosa', name: 'Gamosa (Woven Scarf)', nameAs: 'গামোচা', nameBn: 'গামছা', nameHi: 'गमोसा', iconSymbol: '🧣', category: 'Textile', color: 'from-red-600 to-rose-500' },
  { id: 'dhol', name: 'Bihu Dhol (Drum)', nameAs: 'ঢোল', nameBn: 'ঢোল', nameHi: 'ढोल', iconSymbol: '🥁', category: 'Music', color: 'from-purple-600 to-indigo-500' },
  { id: 'pepa', name: 'Pepa Horn', nameAs: 'পেঁপা', nameBn: 'পেঁপা', nameHi: 'पेपा', iconSymbol: '🎺', category: 'Music', color: 'from-orange-600 to-amber-500' },
  { id: 'tea', name: 'Assam CTC Tea', nameAs: 'অসমৰ চাহ', nameBn: 'আসামের চা', nameHi: 'असम की चाय', iconSymbol: '☕', category: 'Harvest', color: 'from-emerald-600 to-teal-500' },
  { id: 'rhino', name: 'Kaziranga Rhino', nameAs: 'এশিঙীয়া গঁড়', nameBn: 'একশৃঙ্গ গণ্ডার', nameHi: 'एक सींग वाला गैंडा', iconSymbol: '🦏', category: 'Wildlife', color: 'from-cyan-600 to-blue-500' },
  { id: 'hornbill', name: 'Hornbill Bird', nameAs: 'ধনেশ পক্ষী', nameBn: 'ধনেশ পাখি', nameHi: 'हॉर्नबिल पक्षी', iconSymbol: '🦜', category: 'Nature', color: 'from-fuchsia-600 to-pink-500' },
  { id: 'loktak', name: 'Loktak Phumdi', nameAs: 'লোকটাক হ্ৰদ', nameBn: 'লোকটাক হ্রদ', nameHi: 'लोकटक झील', iconSymbol: '🏝️', category: 'Heritage', color: 'from-teal-600 to-emerald-500' },
];

export const GamePlayerModal: React.FC<GamePlayerModalProps> = ({
  game,
  onClose,
  onCompleteSession,
  language,
}) => {
  const [currentLevel, setCurrentLevel] = useState<'Gentle' | 'Normal' | 'Challenging'>(game.difficulty);
  const [gameFinished, setGameFinished] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<{
    recommendedDifficulty: string;
    cognitiveVitalityScore: number;
    clinicalSummary: string;
    encouragingPraise: string;
  } | null>(null);

  // --- GAME 1: RECALL MASTERY (Card Match) State ---
  const [cards, setCards] = useState<Array<CardItem & { instanceId: number; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);

  // --- GAME 2: SEQUENCE SOLVER State ---
  const [seqRound, setSeqRound] = useState(0);
  const [seqQuestions] = useState([
    {
      sequence: ['👒 Jaapi', '🥁 Dhol', '👒 Jaapi', '🥁 Dhol'],
      options: ['👒 Jaapi', '☕ Tea', '🧣 Gamosa', '🦏 Rhino'],
      answer: '👒 Jaapi',
      explanation: 'Repeating rhythm: Hat, Drum, Hat, Drum, next is Hat!',
    },
    {
      sequence: ['🧣 Gamosa', '🧣 Gamosa', '☕ Tea', '🧣 Gamosa', '🧣 Gamosa'],
      options: ['☕ Tea', '🥁 Dhol', '🏝️ Loktak', '🎺 Pepa'],
      answer: '☕ Tea',
      explanation: 'Pattern: Two Scarves, One Tea, Two Scarves, next is Tea!',
    },
    {
      sequence: ['🦏 Rhino', '🦜 Hornbill', '🦏 Rhino', '🦜 Hornbill'],
      options: ['🦏 Rhino', '👒 Jaapi', '🧣 Gamosa', '☕ Tea'],
      answer: '🦏 Rhino',
      explanation: 'Wildlife pattern alternates between Rhino and Hornbill.',
    },
  ]);

  // --- GAME 3: TARGET TRACKING State ---
  const [trackingHits, setTrackingHits] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [trackingTimer, setTrackingTimer] = useState(15);

  // --- GAME 4: OBJECT & WORD MATCH State ---
  const [objRound, setObjRound] = useState(0);
  const [objQuestions] = useState([
    {
      item: CULTURAL_ITEMS[0], // Jaapi
      question: 'Which cultural item is this conical bamboo hat from Assam?',
      options: ['Jaapi (জাপি)', 'Dhol (ঢোল)', 'Gamosa (গামোচা)', 'Pepa (পেঁপা)'],
      correctIndex: 0,
    },
    {
      item: CULTURAL_ITEMS[1], // Gamosa
      question: 'What is this revered red and white handwoven cloth of respect?',
      options: ['Mekhela', 'Gamosa (গামোচা)', 'Eri Silk', 'Bihu Jaapi'],
      correctIndex: 1,
    },
    {
      item: CULTURAL_ITEMS[4], // Tea
      question: 'What famous morning beverage is grown in the tea gardens of Assam?',
      options: ['Kahwa', 'Assam CTC Tea (চাহ)', 'Coconut Water', 'Ginger Soda'],
      correctIndex: 1,
    },
  ]);

  // --- GAME 5: DAILY ROUTINE SEQUENCER State ---
  const [routineItems, setRoutineItems] = useState([
    { id: '1', step: 'Take morning tea & medication', order: 2 },
    { id: '2', step: 'Wake up and drink warm water', order: 1 },
    { id: '3', step: 'Have healthy breakfast', order: 3 },
    { id: '4', step: 'Gentle walk in the Tezpur garden', order: 4 },
  ]);

  // Initialize Memory Card Grid
  useEffect(() => {
    if (game.id === 'game_recall_mastery') {
      const pairCount = currentLevel === 'Gentle' ? 3 : currentLevel === 'Normal' ? 4 : 6;
      const selectedItems = CULTURAL_ITEMS.slice(0, pairCount);
      const deck = [...selectedItems, ...selectedItems].map((item, idx) => ({
        ...item,
        instanceId: idx,
        isFlipped: false,
        isMatched: false,
      }));

      // Shuffle deck
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
  }, [game.id, currentLevel]);

  // Target Tracking timer
  useEffect(() => {
    if (game.id === 'game_target_tracking' && !gameFinished) {
      const interval = setInterval(() => {
        setTrackingTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishGame(trackingHits * 10, errors);
            return 0;
          }
          return prev - 1;
        });

        // Gently move target
        setTargetPos({
          x: Math.floor(15 + Math.random() * 70),
          y: Math.floor(20 + Math.random() * 60),
        });
      }, 1800);

      return () => clearInterval(interval);
    }
  }, [game.id, gameFinished, trackingHits, errors]);

  // Memory Card Click Handler
  const handleCardClick = (idx: number) => {
    if (isProcessingMatch || cards[idx].isFlipped || cards[idx].isMatched) return;

    soundService.playClick();
    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessingMatch(true);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.id === secondCard.id) {
        // Matched!
        setTimeout(() => {
          soundService.playSuccess();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessingMatch(false);
          setScore((prev) => prev + 25);

          // Check if all matched
          const allDone = newCards.every((c) => c.isMatched);
          if (allDone) {
            finishGame(100, errors);
          }
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessingMatch(false);
          setErrors((prev) => prev + 1);
        }, 1100);
      }
    }
  };

  // Finish Game & Run AI Analysis
  const finishGame = async (calculatedScore: number, finalErrors: number) => {
    setGameFinished(true);
    soundService.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    const totalTimeMs = Date.now() - startTime;
    const finalScoreValue = Math.max(70, Math.min(100, calculatedScore - finalErrors * 4));

    // Call AI analysis
    const analysis = await analyzeCognition({
      gameType: game.title,
      metrics: {
        score: finalScoreValue,
        totalTrials: 10,
        errors: finalErrors,
        avgResponseTimeMs: Math.round(totalTimeMs / 6),
        hesitationCount: hintsUsed,
        completedLevel: currentLevel === 'Gentle' ? 1 : currentLevel === 'Normal' ? 2 : 3,
      },
    });

    setAnalysisResult(analysis);
    onCompleteSession(game.id, finalScoreValue, totalTimeMs);

    // Speak praise in regional voice
    if (analysis?.encouragingPraise) {
      soundService.speak(analysis.encouragingPraise, language);
    }
  };

  return (
    <div
      id="game-player-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="game-player-modal-container"
        className="bg-[#181427] border border-purple-800/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-white my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-950/60 bg-[#141022]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg tracking-tight">
                {game.title}
              </h3>
              <p className="text-xs text-purple-300 font-medium">
                {game.subtitle} · Difficulty: <span className="text-amber-300">{currentLevel}</span>
              </p>
            </div>
          </div>

          <button
            id="close-game-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/60 transition-all"
            title="Close Game"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto">
          {!gameFinished ? (
            <div>
              {/* GAME 1: RECALL MASTERY */}
              {game.id === 'game_recall_mastery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-purple-200 bg-purple-950/30 p-2.5 rounded-xl border border-purple-900/30">
                    <span>Tap matching pairs of cultural symbols</span>
                    <span>Score: <strong className="text-amber-300">{score}</strong></span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 py-2">
                    {cards.map((card, idx) => (
                      <button
                        key={card.instanceId}
                        id={`card-flip-${idx}`}
                        onClick={() => handleCardClick(idx)}
                        disabled={card.isMatched || card.isFlipped}
                        className={`h-24 sm:h-28 rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 transform perspective-1000 ${
                          card.isMatched
                            ? 'bg-emerald-950/40 border-2 border-emerald-500/60 opacity-80 scale-95'
                            : card.isFlipped
                            ? `bg-gradient-to-br ${card.color} border-2 border-white/60 shadow-lg scale-105`
                            : 'bg-[#221B3A] border border-purple-800/40 hover:border-purple-500 hover:bg-[#2A2247] active:scale-95'
                        }`}
                      >
                        {card.isFlipped || card.isMatched ? (
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-2xl sm:text-3xl">{card.iconSymbol}</span>
                            <span className="text-[11px] font-bold text-white mt-1 leading-tight line-clamp-1">
                              {language === 'as' ? card.nameAs : language === 'bn' ? card.nameBn : card.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-purple-400">
                            <Sparkles className="w-6 h-6 animate-pulse opacity-60" />
                            <span className="text-[10px] uppercase font-bold tracking-wider mt-1 text-purple-300/60">
                              Tap
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 2: SEQUENCE SOLVER */}
              {game.id === 'game_sequence_solver' && (
                <div className="space-y-5">
                  <div className="bg-purple-950/40 border border-purple-900/40 p-4 rounded-2xl text-center">
                    <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold mb-2">
                      Round {seqRound + 1} of {seqQuestions.length}: What comes next?
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap py-2">
                      {seqQuestions[seqRound].sequence.map((item, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 rounded-xl bg-[#282142] border border-purple-700/50 text-white font-bold text-sm shadow-md"
                        >
                          {item}
                        </div>
                      ))}
                      <div className="px-3 py-2 rounded-xl border-2 border-dashed border-amber-400 text-amber-300 font-extrabold text-sm animate-pulse">
                        ?
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs text-slate-300 font-medium">Select the matching piece:</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {seqQuestions[seqRound].options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => {
                            if (opt === seqQuestions[seqRound].answer) {
                              soundService.playSuccess();
                              if (seqRound < seqQuestions.length - 1) {
                                setSeqRound((prev) => prev + 1);
                              } else {
                                finishGame(95, errors);
                              }
                            } else {
                              soundService.playClick();
                              setErrors((prev) => prev + 1);
                            }
                          }}
                          className="p-3.5 rounded-2xl bg-[#201A38] border border-purple-800/40 hover:border-purple-400 hover:bg-purple-900/30 text-white font-bold text-sm text-center transition-all active:scale-95"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 3: TARGET TRACKING */}
              {game.id === 'game_target_tracking' && (
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-between text-xs text-purple-200 bg-purple-950/40 p-2.5 rounded-xl">
                    <span>Gently tap the glowing focal orb</span>
                    <span>Time: <strong className="text-amber-300">{trackingTimer}s</strong> | Taps: <strong className="text-emerald-300">{trackingHits}</strong></span>
                  </div>

                  {/* Interactive tracking canvas */}
                  <div className="relative h-64 w-full bg-[#130E22] border border-purple-900/40 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Floating Orb */}
                    <button
                      id="tracking-orb-target"
                      onClick={() => {
                        soundService.playSuccess();
                        setTrackingHits((h) => h + 1);
                        setTargetPos({
                          x: Math.floor(15 + Math.random() * 70),
                          y: Math.floor(20 + Math.random() * 60),
                        });
                      }}
                      className="absolute p-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-2xl shadow-purple-500/80 animate-pulse transition-all duration-700 active:scale-90"
                      style={{
                        left: `${targetPos.x}%`,
                        top: `${targetPos.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
                    </button>
                  </div>
                </div>
              )}

              {/* GAME 4: OBJECT & WORD MATCH */}
              {game.id === 'game_object_naming' && (
                <div className="space-y-4">
                  <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-900/40 text-center">
                    <span className="text-5xl">{objQuestions[objRound].item.iconSymbol}</span>
                    <h4 className="text-base font-bold text-white mt-2">
                      {objQuestions[objRound].question}
                    </h4>
                    <button
                      onClick={() =>
                        soundService.speak(
                          objQuestions[objRound].item.nameAs || objQuestions[objRound].item.name,
                          language
                        )
                      }
                      className="mt-2 text-xs text-purple-300 inline-flex items-center gap-1 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Listen pronunciation
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {objQuestions[objRound].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (i === objQuestions[objRound].correctIndex) {
                            soundService.playSuccess();
                            if (objRound < objQuestions.length - 1) {
                              setObjRound((r) => r + 1);
                            } else {
                              finishGame(96, errors);
                            }
                          } else {
                            soundService.playClick();
                            setErrors((e) => e + 1);
                          }
                        }}
                        className="p-3.5 rounded-2xl bg-[#221B3A] border border-purple-800/40 hover:border-purple-400 text-white font-bold text-sm text-center transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 5: DAILY ROUTINE SEQUENCER */}
              {game.id === 'game_routine_order' && (
                <div className="space-y-4">
                  <p className="text-xs text-purple-300 font-medium">
                    Arrange your morning activities in natural daily sequence:
                  </p>

                  <div className="space-y-2">
                    {routineItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-[#201A38] border border-purple-800/40 flex items-center justify-between gap-3 text-sm font-semibold text-white"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-900/80 text-purple-300 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{item.step}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              onClick={() => {
                                const newItems = [...routineItems];
                                const temp = newItems[idx - 1];
                                newItems[idx - 1] = newItems[idx];
                                newItems[idx] = temp;
                                setRoutineItems(newItems);
                              }}
                              className="px-2 py-1 rounded bg-purple-900/60 text-xs text-purple-200"
                            >
                              ▲
                            </button>
                          )}
                          {idx < routineItems.length - 1 && (
                            <button
                              onClick={() => {
                                const newItems = [...routineItems];
                                const temp = newItems[idx + 1];
                                newItems[idx + 1] = newItems[idx];
                                newItems[idx] = temp;
                                setRoutineItems(newItems);
                              }}
                              className="px-2 py-1 rounded bg-purple-900/60 text-xs text-purple-200"
                            >
                              ▼
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => finishGame(92, 0)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white shadow-lg"
                  >
                    Confirm Sequence
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* GAME COMPLETION & AI EVALUATION SCREEN */
            <div className="text-center space-y-4 py-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-[#181427] rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-amber-400 animate-bounce" />
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-white tracking-tight">
                  Wonderful Effort!
                </h4>
                <p className="text-xs text-purple-300/90 mt-1 max-w-sm mx-auto">
                  {analysisResult?.encouragingPraise || 'You completed the cognitive exercise with calm and steady focus.'}
                </p>
              </div>

              {/* AI Vitality & Adaptive Metrics */}
              <div className="bg-[#1F1934] border border-purple-800/40 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-2">
                  <span className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Cognitive Vitality Score
                  </span>
                  <span className="text-lg font-bold text-amber-300">
                    {analysisResult?.cognitiveVitalityScore || 92}/100
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">AI Adaptive Difficulty for Next Time:</span>
                  <span className="font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/50">
                    {analysisResult?.recommendedDifficulty || currentLevel}
                  </span>
                </div>

                <div className="text-xs text-purple-200/80 bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/30 leading-relaxed">
                  <strong className="text-purple-300">Caregiver Note: </strong>
                  {analysisResult?.clinicalSummary || 'Patient showed strong visual engagement with prompt response latency.'}
                </div>
              </div>

              {/* Done / Close CTA */}
              <button
                id="done-game-session-btn"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all active:scale-[0.99]"
              >
                Return to Games Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
