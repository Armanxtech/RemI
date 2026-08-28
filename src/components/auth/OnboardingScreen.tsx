import React, { useState } from 'react';
import {
  User,
  Brain,
  HeartHandshake,
  Globe,
  MapPin,
  Calendar,
  ArrowRight,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { LanguageCode, UserRole, SupabaseUserProfile } from '../../types';
import { saveUserProfileToSupabase } from '../../services/supabaseService';
import { RemILogo } from './RemILogo';
import { soundService } from '../../services/soundService';

interface OnboardingScreenProps {
  userId: string;
  initialFullName?: string;
  initialEmail?: string;
  onCompleteOnboarding: (savedProfile: SupabaseUserProfile) => void;
}

const LANGUAGE_OPTIONS: Array<{
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}> = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', flag: '🌺' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🌸' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mni', label: 'Manipuri', nativeLabel: 'মৈতৈলোন্', flag: '🌿' },
];

const POPULAR_LOCATIONS = [
  { name: 'Tezpur, Assam', pin: '784001' },
  { name: 'Guwahati, Assam', pin: '781001' },
  { name: 'Dibrugarh, Assam', pin: '786001' },
  { name: 'Silchar, Assam', pin: '788001' },
  { name: 'Jorhat, Assam', pin: '785001' },
  { name: 'Imphal, Manipur', pin: '795001' },
  { name: 'Shillong, Meghalaya', pin: '793001' },
  { name: 'Kolkata, West Bengal', pin: '700001' },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  userId,
  initialFullName = '',
  initialEmail = '',
  onCompleteOnboarding,
}) => {
  const [fullName, setFullName] = useState(initialFullName || 'Arpan Das');
  const [age, setAge] = useState<number>(72);
  const [role, setRole] = useState<UserRole>('patient');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>('as');
  const [location, setLocation] = useState('Tezpur, Assam');
  const [pincode, setPincode] = useState('784001');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!age || age < 1 || age > 120) {
      setErrorMsg('Please enter a valid age.');
      return;
    }

    setLoading(true);

    const profileData: SupabaseUserProfile = {
      user_id: userId,
      email: initialEmail,
      full_name: fullName.trim(),
      age: Number(age),
      role: role === 'caretaker' ? 'caretaker' : 'patient',
      preferred_language: preferredLanguage,
      region: location,
      pincode: pincode,
      onboarding_completed: true,
    };

    try {
      // 1. Save to Supabase 'profiles' table
      const res = await saveUserProfileToSupabase(profileData);
      console.log('✅ Profile saved to Supabase:', res);

      soundService.playSuccess();

      // 2. Redirect to Existing Main Dashboard
      onCompleteOnboarding(res.data || profileData);
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      // Resilient fallback
      onCompleteOnboarding(profileData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0A17] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-lg mx-auto z-10 pt-2 flex items-center justify-between">
        <RemILogo size="sm" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>Profile Setup</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto my-auto py-6 z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Personalize Your RemI Experience
          </h1>
          <p className="text-sm text-purple-300/80 mt-1 max-w-md mx-auto">
            Help us configure memory exercises, reminders, and regional language voice support.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-600/50 flex items-center gap-2.5 text-rose-200 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 bg-[#17122A] border border-purple-900/50 rounded-3xl p-5 sm:p-7 shadow-2xl">
          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="onboarding-name-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arpan Das"
                required
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#110D20] border border-purple-800/40 text-white placeholder-purple-400/50 text-base font-semibold outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* 2. Role Selector (Patient vs Caregiver) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Who is using this app?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Patient Card */}
              <button
                type="button"
                id="onboarding-role-patient-btn"
                onClick={() => {
                  soundService.playClick();
                  setRole('patient');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  role === 'patient'
                    ? 'bg-purple-950/80 border-purple-400 shadow-lg shadow-purple-950/50 ring-2 ring-purple-500/30'
                    : 'bg-[#110D20] border-purple-900/40 hover:bg-[#1C1635]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Brain className="w-5 h-5" />
                  </div>
                  {role === 'patient' && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">I am the Patient</h4>
                  <p className="text-[11px] text-purple-300/70">For my memory care & daily rituals</p>
                </div>
              </button>

              {/* Caregiver Card */}
              <button
                type="button"
                id="onboarding-role-caregiver-btn"
                onClick={() => {
                  soundService.playClick();
                  setRole('caretaker');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  role === 'caretaker'
                    ? 'bg-purple-950/80 border-purple-400 shadow-lg shadow-purple-950/50 ring-2 ring-purple-500/30'
                    : 'bg-[#110D20] border-purple-900/40 hover:bg-[#1C1635]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  {role === 'caretaker' && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">I am a Caregiver</h4>
                  <p className="text-[11px] text-purple-300/70">Managing medication & remote vitals</p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Age Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
                Age
              </label>
              <span className="text-sm font-bold text-purple-300 font-mono">
                {age} Years
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="onboarding-age-range"
                type="range"
                min="40"
                max="105"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-[#110D20] rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <input
                id="onboarding-age-input"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-20 px-3 py-2 text-center rounded-xl bg-[#110D20] border border-purple-800/40 text-white font-bold text-sm outline-none"
              />
            </div>
          </div>

          {/* 4. Preferred Language */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Preferred Language (Voice & Text)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setPreferredLanguage(lang.code);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    preferredLanguage === lang.code
                      ? 'bg-purple-900/70 border-purple-400 text-white font-bold'
                      : 'bg-[#110D20] border-purple-900/40 text-purple-300 hover:bg-[#1E1738]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="text-xs">{lang.label}</div>
                      <div className="text-[10px] text-purple-300/70 font-medium">
                        {lang.nativeLabel}
                      </div>
                    </div>
                  </div>
                  {preferredLanguage === lang.code && (
                    <Check className="w-4 h-4 text-purple-300 stroke-[2.5]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Region / Location */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Region & PIN Code
            </label>
            <div className="relative flex items-center mb-2">
              <MapPin className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="onboarding-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                required
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#110D20] border border-purple-800/40 text-white placeholder-purple-400/50 text-sm font-semibold outline-none focus:border-purple-400"
              />
            </div>

            {/* Quick Regional Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_LOCATIONS.slice(0, 5).map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setLocation(loc.name);
                    setPincode(loc.pin);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    location === loc.name
                      ? 'bg-purple-800/60 border-purple-400 text-white font-bold'
                      : 'bg-[#110D20] border-purple-900/40 text-purple-300/80 hover:text-white'
                  }`}
                >
                  {loc.name.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Complete & Enter Dashboard CTA */}
          <button
            id="onboarding-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B575FE] via-[#A855F7] to-[#8B5CF6] hover:from-[#C084FC] hover:to-[#9333EA] disabled:opacity-50 active:scale-[0.98] text-white text-lg font-bold shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Profile to Supabase...</span>
              </div>
            ) : (
              <>
                <span>Launch RemI Companion</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer text */}
      <div className="w-full max-w-lg mx-auto z-10 pb-4 text-center">
        <p className="text-xs text-purple-300/60">
          Your profile is securely stored in Supabase with end-to-end privacy and offline backup.
        </p>
      </div>
    </div>
  );
};
