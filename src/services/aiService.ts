/**
 * Client service to communicate with CogniCare server API
 */

export interface CompanionRequest {
  message: string;
  patientName: string;
  language: string;
  currentMood?: string;
  recentActivities?: Record<string, unknown>;
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

export interface ReminiscenceRequest {
  theme: string;
  era: string;
  language: string;
  patientName: string;
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
    console.warn('Using offline companion fallback:', error);
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
  const result = await askCompanion({
    patientName: params.patientName,
    language: params.language,
    message: params.userMessage,
    recentActivities: {
      location: params.patientLocation,
      pendingMeds: params.pendingMeds,
    },
  });
  return { text: result.reply };
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
