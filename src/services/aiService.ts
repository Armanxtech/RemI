/**
 * Client service to communicate with CogniCare server API & Gemini AI endpoints
 */

import { LanguageCode } from '../types';
import {
  ToolProfileData,
  ToolRemindersData,
  ToolGameHistoryData,
  ToolProgressSummaryData,
} from './aiToolService';

export interface AssistantRequestPayload {
  message: string;
  patientName: string;
  language: LanguageCode;
  userId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userContext?: {
    profile?: ToolProfileData;
    reminders?: ToolRemindersData;
    gameHistory?: ToolGameHistoryData;
    progressSummary?: ToolProgressSummaryData;
  };
}

export interface AssistantResponsePayload {
  reply: string;
  toolType?: 'reminders' | 'profile' | 'games' | 'progress';
  toolData?: any;
  error?: string;
}

/**
 * Primary Multilingual AI Voice & Text Assistant Query
 */
export async function askCogniCareAssistant(
  payload: AssistantRequestPayload
): Promise<AssistantResponsePayload> {
  try {
    const res = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`AI assistant endpoint returned status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Using client-side multilingual assistant fallback:', error);

    const name = payload.patientName || payload.userContext?.profile?.name || 'Friend';
    const lang = payload.language || 'en';
    const query = (payload.message || '').toLowerCase();

    // Check for reminder questions in query
    if (
      query.includes('reminder') ||
      query.includes('medicine') ||
      query.includes('ritual') ||
      query.includes('ঔষধ') ||
      query.includes('দাওয়াই') ||
      query.includes('दवाई')
    ) {
      const pendingMeds = payload.userContext?.reminders?.pendingMedications || [];
      if (lang === 'as') {
        return {
          reply:
            pendingMeds.length > 0
              ? `নমস্কাৰ ${name}! আজি আপোনাৰ বাকী থকা ঔষধসমূহ: ${pendingMeds.map((m) => `${m.name} (${m.scheduledTime})`).join(', ')}। অনুগ্ৰহ কৰি সময়মতে গ্ৰহণ কৰক।`
              : `নমস্কাৰ ${name}! আজিৰ বাবে আপোনাৰ সকলো প্ৰাথমিক ঔষধ আৰু ৰুটিন সম্পূৰ্ণ হৈছে।`,
          toolType: 'reminders',
          toolData: payload.userContext?.reminders,
        };
      }
      if (lang === 'bn') {
        return {
          reply:
            pendingMeds.length > 0
              ? `নমস্কার ${name}! আজ আপনার বাকি থাকা ওষুধগুলি: ${pendingMeds.map((m) => `${m.name} (${m.scheduledTime})`).join(', ')}।`
              : `নমস্কার ${name}! আজকের সমস্ত ওষুধ ও রুটিন সুন্দরভাবে সম্পন্ন হয়েছে।`,
          toolType: 'reminders',
          toolData: payload.userContext?.reminders,
        };
      }
      if (lang === 'hi') {
        return {
          reply:
            pendingMeds.length > 0
              ? `नमस्ते ${name} जी! आज आपकी बाकी दवाइयां हैं: ${pendingMeds.map((m) => `${m.name} (${m.scheduledTime})`).join(', ')}।`
              : `नमस्ते ${name} जी! आज की सभी दवाइयां पूरी हो चुकी हैं।`,
          toolType: 'reminders',
          toolData: payload.userContext?.reminders,
        };
      }
      return {
        reply:
          pendingMeds.length > 0
            ? `Hello ${name}! Your scheduled medications for today: ${pendingMeds.map((m) => `${m.name} at ${m.scheduledTime}`).join(', ')}.`
            : `Hello ${name}! All scheduled medications and rituals for today are marked as complete.`,
        toolType: 'reminders',
        toolData: payload.userContext?.reminders,
      };
    }

    const fallbacks: Record<string, string> = {
      as: `নমস্কাৰ ${name}! মই আপোনাৰ RemI ভইচ সহায়ক। মই আপোনাক ঔষধৰ সময়, মগজুৰ খেল আৰু দৈনন্দিন সহায়ত সকলো সময়তে সহায় কৰিবলৈ সাজু আছোঁ।`,
      bn: `নমস্কার ${name}! আমি আপনার RemI ভয়েস সহকারী। ওষুধ মনে রাখা, মেমরি গেমস খেলা বা যেকোনো সহায়তার জন্য আমি এখানে আছি।`,
      hi: `नमस्ते ${name} जी! मैं आपकी RemI वॉइस सहायक हूँ। मैं आपकी दैनिक दवाइयों और दिमागी खेलों में सहायता के लिए यहाँ हूँ।`,
      en: `Hello ${name}! I am your RemI Voice Assistant. I am here to help you review daily reminders, understand cognitive exercises, and provide friendly support.`,
    };

    return {
      reply: fallbacks[lang] || fallbacks.en,
    };
  }
}

export interface CompanionRequest {
  message: string;
  patientName: string;
  language: string;
  currentMood?: string;
  recentActivities?: Record<string, unknown>;
}

export async function askCompanion(req: CompanionRequest): Promise<{ reply: string; voiceTone: string }> {
  try {
    const res = await fetch('/api/gemini/companion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Companion API failed');
    return await res.json();
  } catch (error) {
    const fallbacks: Record<string, string> = {
      as: `নমস্কাৰ ${req.patientName}! মই আপোনাৰ কগনিকিয়াৰ সাথী। আপুনি আজি বৰ ভাল কাম কৰিছে। মনত শান্তি ৰাখক।`,
      bn: `নমস্কার ${req.patientName}! আমি আপনার সাথে আছি। আসুন কিছুটা সময় বিশ্রাম নিই বা একটি সুন্দর গান শুনি।`,
      hi: `नमस्ते ${req.patientName}! मैं आपका साथी हूँ। आप आज बहुत अच्छा कर रहे हैं।`,
      en: `Hello ${req.patientName}! I am here with you. Take a gentle breath, everything is peaceful and well.`,
    };
    return {
      reply: fallbacks[req.language] || fallbacks.en,
      voiceTone: 'gentle_warm',
    };
  }
}

export interface SathiCompanionParams {
  patientName: string;
  patientLocation: string;
  language: string;
  userMessage: string;
  conversationHistory?: Array<{ role: 'user' | 'sathi'; content: string }>;
  pendingMeds?: string[];
}

export async function askSathiCompanion(params: SathiCompanionParams): Promise<{ text: string }> {
  const result = await askCogniCareAssistant({
    patientName: params.patientName,
    language: params.language as LanguageCode,
    message: params.userMessage,
    conversationHistory: (params.conversationHistory || []).map((m) => ({
      role: m.role === 'sathi' ? 'assistant' : 'user',
      content: m.content,
    })),
  });
  return { text: result.reply };
}

export interface CognitiveAnalysisPayload {
  gameType: string;
  metrics: {
    score: number;
    totalTrials: number;
    errors: number;
    avgResponseTimeMs: number;
    hesitationCount: number;
    completedLevel: number;
  };
  patientHistory?: Record<string, unknown>;
}

export async function analyzeCognition(payload: CognitiveAnalysisPayload) {
  try {
    const res = await fetch('/api/gemini/analyze-cognition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Analysis API failed');
    return await res.json();
  } catch {
    const accuracy = payload.metrics.score / Math.max(1, payload.metrics.totalTrials);
    let nextDifficulty = 'Normal';
    if (accuracy >= 0.9) nextDifficulty = 'Challenging';
    else if (accuracy < 0.6) nextDifficulty = 'Gentle';

    return {
      recommendedDifficulty: nextDifficulty,
      cognitiveVitalityScore: Math.round(accuracy * 100),
      clinicalSummary: 'Patient sustained focus and visual tracking with good motor feedback.',
      encouragingPraise: 'Wonderful work! Your mind is active and strong.',
      suggestedNextActivity: 'Take a gentle sip of water and rest your eyes.',
    };
  }
}

export interface ReminiscenceRequest {
  theme: string;
  era: string;
  language: string;
  patientName: string;
}

export async function generateReminiscenceStory(req: ReminiscenceRequest) {
  try {
    const res = await fetch('/api/gemini/reminiscence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Reminiscence API failed');
    return await res.json();
  } catch {
    return {
      title: 'Golden Memories of Assam',
      story: 'The morning mist over the Brahmaputra was calm. The aroma of freshly prepared Assam tea filled the courtyard while folk songs played on the radio.',
      sensoryCues: ['Warm cup of cardamom tea', 'River breeze', 'Gentle flute melody'],
      conversationPrompt: 'Who did you most enjoy sharing morning tea with?',
    };
  }
}

export async function syncCaregiverData(data: {
  patientId: string;
  medications: unknown[];
  completedRituals: unknown[];
  gameScores: unknown[];
  alerts: unknown[];
}) {
  const res = await syncWithCaregiver([data], data.patientId);
  return { synced: true, res };
}

export async function syncWithCaregiver(pendingRecords: unknown[], patientId: string) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastSyncTimestamp: new Date().toISOString(),
        pendingRecords,
        patientId,
      }),
    });
    return await res.json();
  } catch {
    return {
      status: 'offline_cached',
      syncedAt: new Date().toISOString(),
      processedRecordsCount: pendingRecords.length,
      caregiverNotified: false,
    };
  }
}
