import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  Trash2,
  Globe,
  CheckCircle2,
  Clock,
  Puzzle,
  TrendingUp,
  AlertTriangle,
  Radio,
  Asterisk,
  ShieldCheck,
} from 'lucide-react';
import {
  LanguageCode,
  PatientProfile,
  DailyRitual,
  MedicationItem,
  CognitiveGame,
  AIChatMessage,
} from '../types';
import { soundService } from '../services/soundService';
import { askCogniCareAssistant } from '../services/aiService';
import {
  get_my_profile,
  get_today_reminders,
  get_game_history,
  get_progress_summary,
  fetchChatMessagesFromSupabase,
  saveChatMessageToSupabase,
  clearChatMessagesInSupabase,
} from '../services/aiToolService';

interface VoiceAssistantModalProps {
  onClose: () => void;
  patient?: PatientProfile;
  patientName?: string;
  language: LanguageCode;
  onChangeLanguage?: (lang: LanguageCode) => void;
  pendingMedications?: string[];
  pendingMeds?: string[];
  location?: string;
  rituals?: DailyRitual[];
  medications?: MedicationItem[];
  games?: CognitiveGame[];
  userId?: string;
  onOpenSOS?: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  onClose,
  patient,
  patientName: propPatientName,
  language: initialLanguage,
  onChangeLanguage,
  pendingMedications,
  pendingMeds,
  location: propLocation,
  rituals = [],
  medications = [],
  games = [],
  userId,
  onOpenSOS,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(initialLanguage || 'en');
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeakingActive, setIsSpeakingActive] = useState(false);
  const [autoVoiceResponse, setAutoVoiceResponse] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const displayName = patient?.name || propPatientName || 'Friend';
  const effectiveUserId = userId || patient?.id || 'usr_local';

  // Language display options
  const languageOptions: Array<{ code: LanguageCode; label: string; native: string; speechLocale: string }> = [
    { code: 'en', label: 'English', native: 'English', speechLocale: 'en-IN' },
    { code: 'as', label: 'Assamese', native: 'অসমীয়া', speechLocale: 'as-IN' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা', speechLocale: 'bn-IN' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', speechLocale: 'hi-IN' },
  ];

  // Translations for Assistant UI Elements
  const uiTexts: Record<
    LanguageCode,
    {
      title: string;
      subtitle: string;
      greeting: string;
      inputPlaceholder: string;
      listeningBadge: string;
      stopListening: string;
      listenButton: string;
      stopSpeech: string;
      clearChat: string;
      clearConfirmTitle: string;
      clearConfirmDesc: string;
      confirmBtn: string;
      cancelBtn: string;
      sendBtn: string;
      voiceToggle: string;
      speechUnsupported: string;
      safetyNotice: string;
      quickPrompts: string[];
    }
  > = {
    en: {
      title: 'RemI Voice Assistant',
      subtitle: 'AI Cognitive Companion & Memory Care Assistant',
      greeting: `Hello ${displayName}! I am your RemI Voice Assistant. How can I help you today? You can ask me about your reminders, memory games, or simply talk with me.`,
      inputPlaceholder: 'Type a message or press the microphone to speak...',
      listeningBadge: 'Listening to your voice... Speak now',
      stopListening: 'Stop Listening',
      listenButton: 'Listen',
      stopSpeech: 'Stop Speaking',
      clearChat: 'Clear Chat',
      clearConfirmTitle: 'Clear conversation history?',
      clearConfirmDesc: 'This will reset our current conversation history.',
      confirmBtn: 'Yes, Clear',
      cancelBtn: 'Cancel',
      sendBtn: 'Send',
      voiceToggle: 'Voice Output',
      speechUnsupported: 'Speech recognition is not supported in this browser. You can type your message below.',
      safetyNotice: 'Non-diagnostic assistant. For medical emergencies, use SOS.',
      quickPrompts: [
        'What reminders do I have today?',
        'How is my activity progress today?',
        'Explain the cognitive games',
        'Give me some gentle encouragement',
      ],
    },
    as: {
      title: 'RemI ভইচ সহায়ক',
      subtitle: 'বহুভাষিক ভইচ আৰু স্মৃতি সংগী (RemI AI)',
      greeting: `নমস্কাৰ ${displayName} ডাঙৰীয়া! মই আপোনাৰ RemI ভইচ সহায়ক। আজি মই আপোনাক কেনেদৰে সহায় কৰিব পাৰোঁ? আপুনি ঔষধৰ সময়, মগজুৰ খেল বা যিকোনো কথা সুধিব পাৰে।`,
      inputPlaceholder: 'বাৰ্তা লিখক বা কথা কʼবলৈ মাইক্ৰ’ফোন টিপক...',
      listeningBadge: 'আপোনাৰ কথা শুনা হৈছে... কওক',
      stopListening: 'শুনা বন্ধ কৰক',
      listenButton: 'শুনক',
      stopSpeech: 'কʼব নালাগে',
      clearChat: 'কথা মচি পেলাওক',
      clearConfirmTitle: 'কথোপকথন মচি পেলাব বিচাৰে নেকি?',
      clearConfirmDesc: 'ইয়াৰ ফলত বৰ্তমানৰ বাৰ্তাবোৰ মচি যাব।',
      confirmBtn: 'হয়, মচক',
      cancelBtn: 'বাতিল কৰক',
      sendBtn: 'প্ৰেৰণ',
      voiceToggle: 'কণ্ঠস্বৰ',
      speechUnsupported: 'ব্ৰাউজাৰত ভইচ ইনপুট উপলব্ধ নহʼলে তলত টাইপ কৰক।',
      safetyNotice: 'অ-চিকিৎসাজনিত সহায়ক। জৰুৰী কালত SOS টিপক।',
      quickPrompts: [
        'আজি মোৰ কি কি ঔষধ আৰু ৰুটিন বাকী আছে?',
        'আজি মোৰ স্মৃতি আৰু যত্নৰ অগ্ৰগতি কেনেকুৱা?',
        'মেমৰি খেলৰ বিষয়ে বুজাই দিয়া',
        'মনত শান্তি পাবলৈ কিবা কোৱা',
      ],
    },
    bn: {
      title: 'RemI ভয়েস সহকারী',
      subtitle: 'বহুভাষিক ভয়েস ও স্মৃতি বন্ধু (RemI AI)',
      greeting: `নমস্কার ${displayName} মশাই! আমি আপনার RemI ভয়েস সহকারী। আজ আপনাকে কীভাবে সাহায্য করতে পারি? ওষুধ, মস্তিষ্কের ব্যায়াম বা যে কোনো প্রশ্ন আমাকে করতে পারেন।`,
      inputPlaceholder: 'বার্তা টাইপ করুন বা কথা বলতে মাইক টিপুন...',
      listeningBadge: 'আপনার কথা শোনা হচ্ছে... বলুন',
      stopListening: 'শোনা বন্ধ করুন',
      listenButton: 'শুনুন',
      stopSpeech: 'বন্ধ করুন',
      clearChat: 'বার্তা মুছুন',
      clearConfirmTitle: 'কথোপকথন মুছে ফেলবেন?',
      clearConfirmDesc: 'এর ফলে আগের সমস্ত বার্তা মুছে যাবে।',
      confirmBtn: 'হ্যাঁ, মুছুন',
      cancelBtn: 'বাতিল',
      sendBtn: 'পাঠান',
      voiceToggle: 'ভয়েস আউটপুট',
      speechUnsupported: 'আপনার ব্রাউজারে ভয়েস সাপোর্ট না থাকলে নিচে টাইপ করুন।',
      safetyNotice: 'অ-চিকিৎসা সহকারী। জরুরি অবস্থায় SOS ব্যবহার করুন।',
      quickPrompts: [
        'আজ আমার কি কি ওষুধ নেওয়ার কথা?',
        'আজকের কাজের অগ্রগতি কেমন?',
        'মেমরি ম্যাচ গেম কীভাবে খেলব?',
        'কিছু সুন্দর উৎসাহের কথা বলো',
      ],
    },
    hi: {
      title: 'RemI वॉइस सहायक',
      subtitle: 'बहुभाषी वॉइस एवं स्मृति साथी (RemI AI)',
      greeting: `नमस्ते ${displayName} जी! मैं आपकी RemI वॉइस सहायक हूँ। आज मैं आपकी क्या मदद कर सकती हूँ? आप मुझसे आज की दवाइयों, दिमागी खेलों या दिनचर्या के बारे में पूछ सकते हैं।`,
      inputPlaceholder: 'संदेश लिखें या बोलने के लिए माइक दबाएं...',
      listeningBadge: 'आपकी आवाज़ सुनी जा रही है... बोलिए',
      stopListening: 'रोकें',
      listenButton: 'सुनें',
      stopSpeech: 'आवाज़ रोकें',
      clearChat: 'बातचीत हटाएं',
      clearConfirmTitle: 'बातचीत का इतिहास हटाएं?',
      clearConfirmDesc: 'इससे मौजूदा बातचीत मिट जाएगी।',
      confirmBtn: 'हाँ, हटाएं',
      cancelBtn: 'रद्द करें',
      sendBtn: 'भेजें',
      voiceToggle: 'वॉइस आउटपुट',
      speechUnsupported: 'ब्राउज़र में वॉइस इनपुट उपलब्ध न होने पर नीचे लिखें।',
      safetyNotice: 'गैर-चिकित्सीय सहायक। आपातकाल के लिए SOS दबाएं।',
      quickPrompts: [
        'आज मेरी कौन सी दवाइयां बाकी हैं?',
        'आज मेरी प्रगति कैसी रही?',
        'मेमोरी गेम्स के बारे में बताएं',
        'कुछ सकारात्मक विचार सुनाएं',
      ],
    },
    mni: {
      title: 'RemI Voice Assistant',
      subtitle: 'Multilingual Voice Companion',
      greeting: `Hello ${displayName}! I am your RemI Voice Assistant. How can I help you today?`,
      inputPlaceholder: 'Type a message or press the microphone...',
      listeningBadge: 'Listening to your voice...',
      stopListening: 'Stop Listening',
      listenButton: 'Listen',
      stopSpeech: 'Stop Speaking',
      clearChat: 'Clear Chat',
      clearConfirmTitle: 'Clear conversation?',
      clearConfirmDesc: 'This will reset our conversation.',
      confirmBtn: 'Yes, Clear',
      cancelBtn: 'Cancel',
      sendBtn: 'Send',
      voiceToggle: 'Voice Output',
      speechUnsupported: 'Speech recognition is not supported in this browser.',
      safetyNotice: 'Non-diagnostic companion.',
      quickPrompts: ['What reminders do I have today?', 'How is my activity progress today?'],
    },
  };

  const currentTexts = uiTexts[selectedLanguage] || uiTexts.en;

  // 1. Load Conversation History on Mount or Language Change
  useEffect(() => {
    let isSubscribed = true;
    const loadHistory = async () => {
      const stored = await fetchChatMessagesFromSupabase(effectiveUserId);
      if (!isSubscribed) return;

      if (stored && stored.length > 0) {
        setMessages(stored);
      } else {
        // Initial greeting
        const initialGreetingMsg: AIChatMessage = {
          id: `greet_${Date.now()}`,
          user_id: effectiveUserId,
          sender: 'assistant',
          text: currentTexts.greeting,
          language: selectedLanguage,
          timestamp: new Date().toISOString(),
        };
        setMessages([initialGreetingMsg]);
      }
    };

    loadHistory();

    return () => {
      isSubscribed = false;
      soundService.stopSpeaking();
    };
  }, [effectiveUserId]);

  // 2. Initialize Web Speech API SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const activeOpt = languageOptions.find((l) => l.code === selectedLanguage);
      recognition.lang = activeOpt?.speechLocale || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSpeechText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in browser.');
        } else if (event.error === 'no-speech') {
          // Silent timeout
        } else {
          setSpeechError(`Speech input note: ${event.error}. You can type anytime!`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      recognitionRef.current = null;
    }
  }, [selectedLanguage]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle Speech Recognition Toggle
  const handleToggleListening = () => {
    soundService.playClick();
    if (!recognitionRef.current) {
      setSpeechError(currentTexts.speechUnsupported);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      setSpeechError(null);
      soundService.stopSpeaking();
      setIsSpeakingActive(false);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Start speech error:', e);
        setIsListening(false);
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
  };

  // Text-To-Speech Play / Stop
  const handleSpeakText = (text: string, msgId?: string) => {
    if (isSpeakingActive && activeSpeakingMsgId === msgId) {
      soundService.stopSpeaking();
      setIsSpeakingActive(false);
      setActiveSpeakingMsgId(null);
      return;
    }

    soundService.playClick();
    soundService.speak(text, selectedLanguage);
    setIsSpeakingActive(true);
    if (msgId) setActiveSpeakingMsgId(msgId);

    // Estimate speaking duration to reset active state
    const wordCount = text.split(/\s+/).length;
    const estimatedMs = Math.max(3000, wordCount * 380);
    setTimeout(() => {
      setIsSpeakingActive(false);
      setActiveSpeakingMsgId(null);
    }, estimatedMs);
  };

  const handleStopAllSpeech = () => {
    soundService.stopSpeaking();
    setIsSpeakingActive(false);
    setActiveSpeakingMsgId(null);
  };

  // Send Message Logic
  const handleSendMessage = async (customText?: string) => {
    const rawText = customText || speechText;
    if (!rawText.trim() || isThinking) return;

    soundService.playClick();
    const query = rawText.trim();
    setSpeechText('');
    setSpeechError(null);
    handleStopListening();

    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      user_id: effectiveUserId,
      sender: 'user',
      text: query,
      language: selectedLanguage,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsThinking(true);
    await saveChatMessageToSupabase(userMsg);

    try {
      // 1. Gather real user context data tools
      const profileData = await get_my_profile(effectiveUserId, patient);
      const remindersData = get_today_reminders(rituals, medications);
      const gameHistoryData = get_game_history(games);
      const progressData = get_progress_summary(rituals, medications, games);

      // 2. Call secure AI backend
      const response = await askCogniCareAssistant({
        message: query,
        patientName: displayName,
        language: selectedLanguage,
        userId: effectiveUserId,
        conversationHistory: newMessages.slice(-6).map((m) => ({
          role: m.sender,
          content: m.text,
        })),
        userContext: {
          profile: profileData,
          reminders: remindersData,
          gameHistory: gameHistoryData,
          progressSummary: progressData,
        },
      });

      const assistantMsg: AIChatMessage = {
        id: `asst_${Date.now()}`,
        user_id: effectiveUserId,
        sender: 'assistant',
        text: response.reply,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        toolData: response.toolType
          ? {
              type: response.toolType,
              data: response.toolData,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      await saveChatMessageToSupabase(assistantMsg);

      // 3. Auto-play voice if enabled
      if (autoVoiceResponse) {
        handleSpeakText(response.reply, assistantMsg.id);
      }
    } catch (err) {
      console.error('Assistant error:', err);
      const errorMsg: AIChatMessage = {
        id: `err_${Date.now()}`,
        user_id: effectiveUserId,
        sender: 'assistant',
        text:
          selectedLanguage === 'as'
            ? 'মই আপোনাৰ কথা বুজিবলৈ চেষ্টা কৰি আছোঁ। আপুনি সম্পূৰ্ণ সুৰক্ষিত আৰু আমি আপোনাৰ কাষত আছোঁ।'
            : selectedLanguage === 'bn'
            ? 'আমি আপনার সাথে আছি। শান্ত থাকুন, আপনি একদম সুরক্ষিত।'
            : selectedLanguage === 'hi'
            ? 'मैं आपके साथ हूँ। आप बिल्कुल सुरक्षित हैं और बहुत अच्छा कर रहे हैं।'
            : 'I am right here with you. Take a calm breath, everything is safe.',
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // Clear Chat History
  const handleClearChat = async () => {
    soundService.playClick();
    await clearChatMessagesInSupabase(effectiveUserId);
    const resetGreeting: AIChatMessage = {
      id: `greet_${Date.now()}`,
      user_id: effectiveUserId,
      sender: 'assistant',
      text: currentTexts.greeting,
      language: selectedLanguage,
      timestamp: new Date().toISOString(),
    };
    setMessages([resetGreeting]);
    setShowClearConfirm(false);
  };

  // Change Language Switcher
  const handleLanguageChange = (lang: LanguageCode) => {
    soundService.playClick();
    setSelectedLanguage(lang);
    if (onChangeLanguage) {
      onChangeLanguage(lang);
    }
  };

  return (
    <div
      id="voice-assistant-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
    >
      <div
        id="voice-assistant-modal-container"
        className="bg-[#161224] border border-purple-800/60 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[820px] text-white"
      >
        {/* TOP BAR: Brand & Language Selector & Close */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 border-b border-purple-950/80 bg-[#120E1E] gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-900/50">
                <Sparkles className="w-6 h-6 text-purple-100 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#120E1E]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg tracking-tight">
                  {currentTexts.title}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/70 text-purple-200 border border-purple-700/50 font-medium">
                  RemI Voice
                </span>
              </div>
              <p className="text-xs text-purple-300/80 font-medium">
                {currentTexts.subtitle}
              </p>
            </div>
          </div>

          {/* Language Selector Chips & Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#1E1833] p-1 rounded-xl border border-purple-800/40">
              <Globe className="w-3.5 h-3.5 text-purple-300 ml-1.5 hidden xs:inline" />
              {languageOptions.map((opt) => (
                <button
                  key={opt.code}
                  id={`ai-lang-select-${opt.code}-btn`}
                  onClick={() => handleLanguageChange(opt.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedLanguage === opt.code
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                  }`}
                  title={`Switch to ${opt.label}`}
                >
                  {opt.native}
                </button>
              ))}
            </div>

            {/* Voice Toggle */}
            <button
              id="ai-assistant-voice-toggle-btn"
              onClick={() => {
                soundService.playClick();
                setAutoVoiceResponse(!autoVoiceResponse);
                if (isSpeakingActive) handleStopAllSpeech();
              }}
              className={`p-2 rounded-xl border transition-all ${
                autoVoiceResponse
                  ? 'bg-purple-950/60 text-purple-200 border-purple-700/60'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800'
              }`}
              title={`${currentTexts.voiceToggle}: ${autoVoiceResponse ? 'ON' : 'OFF'}`}
            >
              {autoVoiceResponse ? (
                <Volume2 className="w-4 h-4 text-purple-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Clear History Button */}
            <button
              id="ai-assistant-clear-chat-btn"
              onClick={() => setShowClearConfirm(true)}
              className="p-2 rounded-xl text-purple-300/80 hover:text-rose-300 hover:bg-rose-950/40 border border-purple-900/40 transition-all"
              title={currentTexts.clearChat}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              id="ai-assistant-close-modal-btn"
              onClick={() => {
                soundService.stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-purple-900/40 transition-all"
              title="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clear Confirmation Prompt Modal Overlay */}
        {showClearConfirm && (
          <div className="bg-purple-950/90 border-b border-purple-800 px-4 py-3 flex items-center justify-between gap-3 text-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">{currentTexts.clearConfirmTitle}</span>
                <span className="text-purple-200 ml-1.5 hidden sm:inline">{currentTexts.clearConfirmDesc}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 rounded-lg bg-[#201A38] text-purple-200 hover:bg-purple-900/40 font-medium"
              >
                {currentTexts.cancelBtn}
              </button>
              <button
                onClick={handleClearChat}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow"
              >
                {currentTexts.confirmBtn}
              </button>
            </div>
          </div>
        )}

        {/* Global Stop Speaking Banner (When audio is actively playing) */}
        {isSpeakingActive && (
          <div className="bg-indigo-950/90 border-b border-indigo-700/60 px-4 py-2 flex items-center justify-between text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-300 animate-pulse" />
              <span>Speaking response aloud...</span>
            </div>
            <button
              onClick={handleStopAllSpeech}
              className="px-2.5 py-1 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{currentTexts.stopSpeech}</span>
            </button>
          </div>
        )}

        {/* Active Speech Recognition Banner */}
        {isListening && (
          <div className="bg-red-950/90 border-b border-red-700 px-4 py-2.5 flex items-center justify-between text-xs text-red-200 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="font-semibold text-white">{currentTexts.listeningBadge}</span>
              {speechText && <span className="italic text-red-200 truncate max-w-xs">"{speechText}"</span>}
            </div>
            <button
              onClick={handleStopListening}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 shadow"
            >
              <MicOff className="w-3.5 h-3.5" />
              <span>{currentTexts.stopListening}</span>
            </button>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechError && (
          <div className="bg-amber-950/90 border-b border-amber-800 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{speechError}</span>
            </div>
            <button onClick={() => setSpeechError(null)} className="text-amber-300 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CHAT MESSAGE FEED */}
        <div
          id="ai-assistant-messages-feed"
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#140F22] to-[#171227]"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isPlayingThis = isSpeakingActive && activeSpeakingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed tracking-normal shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-[#201938] border border-purple-800/50 text-purple-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-normal">{msg.text}</p>

                  {/* Tool Data Rich Presentation (If reminders or games returned) */}
                  {msg.toolData && msg.toolData.type === 'reminders' && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-950/60 border border-purple-800/40 text-xs text-purple-200 space-y-2">
                      <div className="font-semibold flex items-center gap-1.5 text-purple-300">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>Today's Reminders Overview</span>
                      </div>
                      {msg.toolData.data?.pendingMedications?.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-purple-100">
                          {msg.toolData.data.pendingMedications.map((m: any, mIdx: number) => (
                            <li key={mIdx}>
                              <span className="font-medium text-amber-300">{m.name}</span> ({m.scheduledTime})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>All scheduled medications completed!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.toolData && (msg.toolData.type === 'games' || msg.toolData.type === 'progress') && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-950/60 border border-purple-800/40 text-xs text-purple-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Daily Activity Vitality</span>
                      </div>
                      <span className="font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-700/50">
                        {msg.toolData.data?.completionPercentage ?? 80}%
                      </span>
                    </div>
                  )}

                  {/* Message Bottom Action Bar */}
                  <div className="mt-2.5 pt-2 border-t border-purple-900/30 flex items-center justify-between text-[11px] text-purple-300/80">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => handleSpeakText(msg.text, msg.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                          isPlayingThis
                            ? 'bg-indigo-600 text-white font-bold animate-pulse'
                            : 'hover:bg-purple-900/40 text-purple-300 hover:text-white'
                        }`}
                        title="Listen to this message"
                      >
                        {isPlayingThis ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>{currentTexts.stopSpeech}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{currentTexts.listenButton}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking animation */}
          {isThinking && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-300 bg-[#201938] border border-purple-800/50 p-4 rounded-2xl w-fit animate-pulse shadow-lg">
              <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
              <span>RemI Assistant is responding warmly in {languageOptions.find((l) => l.code === selectedLanguage)?.native}...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* QUICK PROMPT SUGGESTION CHIPS */}
        <div className="px-4 py-2.5 bg-[#120E1E] border-t border-purple-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {currentTexts.quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              id={`ai-quick-prompt-${pIdx}-btn`}
              onClick={() => handleSendMessage(prompt)}
              className="px-3.5 py-1.5 rounded-full bg-[#201A38] hover:bg-purple-900/60 border border-purple-800/50 text-purple-200 text-xs font-medium whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>💬</span>
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* INPUT & VOICE CONTROLS (Elderly-Friendly High Contrast Layout) */}
        <div className="p-4 sm:p-5 bg-[#120E1E] border-t border-purple-950/80">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Big Dedicated Microphone Button */}
            <button
              id="ai-assistant-mic-toggle-btn"
              onClick={handleToggleListening}
              className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 min-w-[52px] min-h-[52px] ${
                isListening
                  ? 'bg-red-600 text-white shadow-xl shadow-red-600/50 animate-bounce'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95 active:scale-95 shadow-md shadow-purple-950/60 ring-2 ring-purple-500/30'
              }`}
              title={isListening ? currentTexts.stopListening : 'Tap to speak'}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 animate-pulse" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {/* Input Box */}
            <div className="flex-1 relative">
              <input
                id="ai-assistant-text-input"
                type="text"
                placeholder={isListening ? currentTexts.listeningBadge : currentTexts.inputPlaceholder}
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isThinking}
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-[#201938] border border-purple-800/60 text-white text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 pr-12 transition-all"
              />

              {/* In-field Send Button */}
              <button
                id="ai-assistant-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!speechText.trim() || isThinking}
                className="absolute right-2 sm:right-2.5 top-2 sm:top-2.5 p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 transition-all"
                title={currentTexts.sendBtn}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Emergency SOS Shortcut */}
            {onOpenSOS && (
              <button
                id="ai-assistant-sos-btn"
                onClick={() => {
                  soundService.playSOSBeep();
                  onOpenSOS();
                }}
                className="p-3.5 sm:p-4 rounded-2xl bg-rose-900/60 hover:bg-rose-800 border border-rose-700/60 text-rose-200 flex-shrink-0 transition-all"
                title="Emergency SOS"
              >
                <Asterisk className="w-5 h-5 stroke-[2.8]" />
              </button>
            )}
          </div>

          {/* Medical Safety Disclaimer */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-purple-300/60">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>{currentTexts.safetyNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
