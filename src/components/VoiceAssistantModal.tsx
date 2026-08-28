import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, Send, Heart, RefreshCw } from 'lucide-react';
import { LanguageCode, PatientProfile } from '../types';
import { soundService } from '../services/soundService';
import { askSathiCompanion } from '../services/aiService';

interface VoiceAssistantModalProps {
  onClose: () => void;
  patient: PatientProfile;
  language: LanguageCode;
  pendingMeds: string[];
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  onClose,
  patient,
  language,
  pendingMeds,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'sathi'; text: string; audioSpoken?: boolean }>>([
    {
      sender: 'sathi',
      text:
        language === 'as'
          ? `নমস্কাৰ ${patient.name} ডাঙৰীয়া! মই আপোনাৰ বন্ধু 'সাথী'। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?`
          : language === 'bn'
          ? `নমস্কার ${patient.name} মশাই! আমি আপনার বন্ধু 'সাথী'। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?`
          : language === 'hi'
          ? `नमस्ते ${patient.name} जी! मैं आपकी सहेली 'साथी' हूँ। आज आप कैसा महसूस कर रहे हैं?`
          : `Hello ${patient.name}! I am your companion Sathi. How can I help you today?`,
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        language === 'as' ? 'as-IN' : language === 'bn' ? 'bn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSpeechText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is starting or not supported in this browser. You can also type below!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      soundService.playClick();
      setSpeechText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || speechText;
    if (!query.trim() || isThinking) return;

    soundService.playClick();
    const userMsg = query.trim();
    setSpeechText('');
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Add User Message
    const updatedMessages = [...messages, { sender: 'user' as const, text: userMsg }];
    setMessages(updatedMessages);
    setIsThinking(true);

    // Call Sathi AI Companion backend
    const sathiResponse = await askSathiCompanion({
      patientName: patient.name,
      patientLocation: patient.location,
      language,
      userMessage: userMsg,
      conversationHistory: updatedMessages.map((m) => ({ role: m.sender, content: m.text })),
      pendingMeds,
    });

    setIsThinking(false);
    setMessages((prev) => [...prev, { sender: 'sathi', text: sathiResponse.text }]);

    // Speak Sathi response
    soundService.speak(sathiResponse.text, language);
  };

  const promptSuggestions = [
    language === 'as' ? 'মোৰ ঔষধ খোৱাৰ সময় হʼলনে?' : 'What medicines should I take?',
    language === 'as' ? 'তেজপুৰৰ কথা অলপ কোৱাচোন' : 'Tell me a story about Tezpur',
    language === 'as' ? 'মোৰ জীয়াৰী সুনীতা কʼত?' : 'Where is my daughter Sunita?',
    language === 'as' ? 'আজি কি বাৰ আৰু বতৰ কেনেকুৱা?' : 'What is the date and weather today?',
  ];

  return (
    <div
      id="voice-assistant-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="voice-assistant-modal-container"
        className="bg-[#181427] border border-purple-800/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[85vh] text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-950/60 bg-[#141022]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/50">
                <Sparkles className="w-6 h-6 text-purple-200 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#141022]" />
            </div>

            <div>
              <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                <span>Sathi · সাথী</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/70 text-purple-300 border border-purple-700/50">
                  AI Companion
                </span>
              </h3>
              <p className="text-xs text-purple-300 font-medium">
                Voice & Memory Assistant
              </p>
            </div>
          </div>

          <button
            id="close-voice-assistant-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/60 transition-all"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-[#201A38] border border-purple-800/40 text-purple-100 rounded-bl-none shadow-lg'
                }`}
              >
                <p>{msg.text}</p>

                {msg.sender === 'sathi' && (
                  <button
                    onClick={() => soundService.speak(msg.text, language)}
                    className="mt-2 text-[11px] text-purple-300 hover:text-white flex items-center gap-1 opacity-80 hover:opacity-100"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen again</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-[#201A38] border border-purple-800/40 p-3 rounded-2xl w-fit animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Sathi is thinking with warmth...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#141022] border-t border-purple-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {promptSuggestions.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-[#201A38] hover:bg-purple-900/40 border border-purple-800/40 text-purple-200 text-[11px] whitespace-nowrap active:scale-95 transition-all"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Voice Input & Action Bar */}
        <div className="p-4 bg-[#141022] border-t border-purple-950/60 flex items-center gap-2">
          {/* Big Mic Listening Button */}
          <button
            id="voice-sathi-listen-toggle-btn"
            onClick={toggleListening}
            className={`p-3.5 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-600 text-white shadow-xl shadow-red-600/50 animate-bounce'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 shadow-md'
            }`}
            title={isListening ? 'Listening... Tap to stop' : 'Tap to speak to Sathi'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input field for fallback */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={isListening ? 'Listening to your voice...' : 'Type or speak to Sathi...'}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="w-full px-4 py-3 rounded-2xl bg-[#201A38] border border-purple-800/50 text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-purple-400 pr-10"
            />

            <button
              id="voice-sathi-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!speechText.trim()}
              className="absolute right-2 top-2 p-1.5 rounded-xl text-purple-300 hover:text-white disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
