import { supabase } from './supabaseClient';
import {
  DailyRitual,
  MedicationItem,
  CognitiveGame,
  PatientProfile,
  SupabaseUserProfile,
  AIChatMessage,
  LanguageCode,
} from '../types';
import { fetchUserProfileFromSupabase } from './supabaseService';

/**
 * AI Tool Context Provider
 * Reads minimum required data belonging exclusively to the authenticated user.
 */

export interface ToolProfileData {
  name: string;
  age: number;
  role: string;
  preferredLanguage: string;
  location: string;
  pincode?: string;
  caregiverName: string;
  caregiverPhone: string;
}

export interface ToolRemindersData {
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  pendingMedications: Array<{ name: string; dosage: string; scheduledTime: string; instructions: string }>;
  completedMedications: Array<{ name: string; time: string }>;
  pendingRituals: Array<{ title: string; time: string; type: string }>;
  completedRituals: Array<{ title: string }>;
}

export interface ToolGameHistoryData {
  gamesAvailable: number;
  gamesPlayedTotal: number;
  recentGames: Array<{ title: string; category: string; difficulty: string; bestScore: number; playedCount: number }>;
}

export interface ToolProgressSummaryData {
  completionPercentage: number;
  vitalityStatus: string;
  medsCompletedRatio: string;
  ritualsCompletedRatio: string;
  encouragementNote: string;
}

/**
 * 1. Tool: get_my_profile()
 */
export async function get_my_profile(
  userId: string,
  fallbackPatient?: PatientProfile
): Promise<ToolProfileData> {
  const profile = await fetchUserProfileFromSupabase(userId);
  if (profile) {
    return {
      name: profile.full_name,
      age: profile.age,
      role: profile.role,
      preferredLanguage: profile.preferred_language,
      location: profile.region,
      pincode: profile.pincode,
      caregiverName: fallbackPatient?.primaryCaregiver?.name || 'Family Caregiver',
      caregiverPhone: fallbackPatient?.primaryCaregiver?.phone || '',
    };
  }

  return {
    name: fallbackPatient?.name || 'Friend',
    age: fallbackPatient?.age || 70,
    role: 'patient',
    preferredLanguage: fallbackPatient?.preferredLanguage || 'en',
    location: fallbackPatient?.location || 'Assam, India',
    pincode: fallbackPatient?.pincode,
    caregiverName: fallbackPatient?.primaryCaregiver?.name || 'Sunita Das',
    caregiverPhone: fallbackPatient?.primaryCaregiver?.phone || '+91 9876543210',
  };
}

/**
 * 2. Tool: get_today_reminders()
 */
export function get_today_reminders(
  rituals: DailyRitual[],
  medications: MedicationItem[]
): ToolRemindersData {
  const pendingMeds = medications.filter((m) => !m.completed && !m.isAsNeeded);
  const completedMeds = medications.filter((m) => m.completed);
  const pendingRituals = rituals.filter((r) => !r.completed);
  const completedRituals = rituals.filter((r) => r.completed);

  return {
    totalCount: medications.length + rituals.length,
    pendingCount: pendingMeds.length + pendingRituals.length,
    completedCount: completedMeds.length + completedRituals.length,
    pendingMedications: pendingMeds.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      scheduledTime: m.timeScheduled,
      instructions: m.instructions,
    })),
    completedMedications: completedMeds.map((m) => ({
      name: m.name,
      time: m.completedAt || 'Earlier today',
    })),
    pendingRituals: pendingRituals.map((r) => ({
      title: r.title,
      time: r.timeStr,
      type: r.type,
    })),
    completedRituals: completedRituals.map((r) => ({
      title: r.title,
    })),
  };
}

/**
 * 3. Tool: get_game_history()
 */
export function get_game_history(games: CognitiveGame[]): ToolGameHistoryData {
  const totalPlayed = games.reduce((acc, g) => acc + (g.playedCount || 0), 0);
  return {
    gamesAvailable: games.length,
    gamesPlayedTotal: totalPlayed,
    recentGames: games.map((g) => ({
      title: g.title,
      category: g.category,
      difficulty: g.difficulty,
      bestScore: g.bestScore,
      playedCount: g.playedCount,
    })),
  };
}

/**
 * 4. Tool: get_progress_summary()
 */
export function get_progress_summary(
  rituals: DailyRitual[],
  medications: MedicationItem[],
  games: CognitiveGame[]
): ToolProgressSummaryData {
  const totalTasks = rituals.length + medications.filter((m) => !m.isAsNeeded).length;
  const completedTasks =
    rituals.filter((r) => r.completed).length + medications.filter((m) => m.completed).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const totalPlayed = games.reduce((acc, g) => acc + (g.playedCount || 0), 0);
  let vitalityStatus = 'Steady & Engaged';
  if (percentage >= 80) vitalityStatus = 'Excellent Vitality & High Engagement';
  else if (percentage >= 50) vitalityStatus = 'Consistent Daily Progress';

  return {
    completionPercentage: percentage,
    vitalityStatus,
    medsCompletedRatio: `${medications.filter((m) => m.completed).length}/${medications.filter((m) => !m.isAsNeeded).length}`,
    ritualsCompletedRatio: `${rituals.filter((r) => r.completed).length}/${rituals.length}`,
    encouragementNote:
      percentage === 100
        ? 'All daily rituals and medications completed today!'
        : `${totalTasks - completedTasks} activities remaining today. Take them at your comfortable pace.`,
  };
}

// ==========================================
// CONVERSATION HISTORY (SUPABASE + LOCAL STORAGE)
// ==========================================

export async function fetchChatMessagesFromSupabase(
  userId: string
): Promise<AIChatMessage[]> {
  const storageKey = `cognicare_ai_chat_${userId || 'guest'}`;

  // 1. Try Supabase
  if (userId && userId !== 'usr_local' && userId !== 'guest') {
    try {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          user_id: d.user_id,
          sender: d.sender,
          text: d.text,
          language: d.language,
          timestamp: d.created_at,
          toolData: d.tool_data ? (typeof d.tool_data === 'string' ? JSON.parse(d.tool_data) : d.tool_data) : undefined,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch chat notice:', e);
    }
  }

  // 2. Fallback to Local Storage
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Local storage chat read error:', e);
  }

  return [];
}

export async function saveChatMessageToSupabase(
  message: AIChatMessage
): Promise<void> {
  const userId = message.user_id || 'guest';
  const storageKey = `cognicare_ai_chat_${userId}`;

  // 1. Save to Local Storage Cache
  try {
    const existing: AIChatMessage[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = [...existing, message].slice(-60); // keep last 60
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local chat save error:', e);
  }

  // 2. Insert into Supabase if connected
  if (message.user_id && message.user_id !== 'guest' && message.user_id !== 'usr_local') {
    try {
      await supabase.from('ai_chat_messages').insert([
        {
          id: message.id,
          user_id: message.user_id,
          sender: message.sender,
          text: message.text,
          language: message.language || 'en',
          tool_data: message.toolData ? JSON.stringify(message.toolData) : null,
          created_at: message.timestamp || new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.warn('Supabase chat insert notice (table might need creation):', err);
    }
  }
}

export async function clearChatMessagesInSupabase(userId: string): Promise<void> {
  const storageKey = `cognicare_ai_chat_${userId || 'guest'}`;
  try {
    localStorage.removeItem(storageKey);
  } catch {}

  if (userId && userId !== 'guest' && userId !== 'usr_local') {
    try {
      await supabase.from('ai_chat_messages').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('Supabase clear chat notice:', err);
    }
  }
}
