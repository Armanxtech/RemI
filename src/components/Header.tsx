import React from 'react';
import {
  Asterisk,
  Mic,
  Wifi,
  WifiOff,
  Type,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Calendar,
  LogIn,
  Database,
} from 'lucide-react';
import { PatientProfile, UserRole } from '../types';
import { soundService } from '../services/soundService';

interface HeaderProps {
  patient: PatientProfile;
  currentRole: UserRole;
  onToggleRole: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenSOS: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenProfile: () => void;
  onOpenAppointments?: () => void;
  onOpenSignIn?: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onCycleFontSize: () => void;
  unreadAlertCount?: number;
  appointmentsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  currentRole,
  onToggleRole,
  onOpenVoiceAssistant,
  onOpenSOS,
  isOnline,
  onToggleOnline,
  onOpenProfile,
  onOpenAppointments,
  onOpenSignIn,
  fontSize,
  onCycleFontSize,
  unreadAlertCount = 0,
  appointmentsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#120F1D]/90 backdrop-blur-md border-b border-purple-950/40 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Avatar & App Name */}
        <div className="flex items-center gap-2.5">
          <button
            id="header-profile-avatar-btn"
            onClick={onOpenProfile}
            className="relative rounded-full p-0.5 ring-2 ring-purple-500/40 hover:ring-purple-400 transition-all focus:outline-none"
            title="Open Profile & Settings"
          >
            <img
              src={patient.avatarUrl}
              alt={patient.name}
              className="w-10 h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#120F1D] ${
                isOnline ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1">
                <span className="bg-gradient-to-r from-purple-300 via-purple-200 to-indigo-200 bg-clip-text text-transparent font-semibold">
                  CogniCare
                </span>
              </h1>
              {currentRole === 'caretaker' ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/50">
                  Caregiver
                </span>
              ) : (
                <button
                  onClick={onOpenSignIn}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1C172E] text-purple-300 hover:text-white border border-purple-800/40 transition-colors hidden xs:inline-flex items-center gap-1"
                  title="Sign In / Sign Up to Supabase"
                >
                  <Database className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Account</span>
                </button>
              )}
            </div>
            <p className="text-xs text-purple-300/70 font-medium truncate max-w-[140px] sm:max-w-none">
              {patient.location}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Appointments & Booking Quick Trigger */}
          {onOpenAppointments && (
            <button
              id="header-appointments-btn"
              onClick={() => {
                soundService.playClick();
                onOpenAppointments();
              }}
              className="relative p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 border border-purple-800/30 transition-all text-xs font-semibold flex items-center gap-1"
              title="Doctor Appointments & Caregiver Bookings (Supabase)"
            >
              <Calendar className="w-4 h-4 text-purple-300" />
              {appointmentsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          )}

          {/* Connectivity toggle */}
          <button
            id="header-connectivity-toggle-btn"
            onClick={() => {
              soundService.playClick();
              onToggleOnline();
            }}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
              isOnline
                ? 'bg-purple-950/40 text-emerald-300 hover:bg-purple-900/40'
                : 'bg-amber-950/50 text-amber-300 border border-amber-800/40'
            }`}
            title={isOnline ? 'Online (Supabase Connected)' : 'Offline Mode (Local Storage Synced)'}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="hidden md:inline text-[11px]">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </button>

          {/* Font Size Scaling */}
          <button
            id="header-font-scale-btn"
            onClick={() => {
              soundService.playClick();
              onCycleFontSize();
            }}
            className="p-2 rounded-xl bg-purple-950/40 text-purple-200 hover:bg-purple-900/40 transition-all text-xs font-semibold flex items-center gap-0.5"
            title={`Font size: ${fontSize.toUpperCase()} (Tap to change)`}
          >
            <Type className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold text-purple-300">
              {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
            </span>
          </button>

          {/* Sathi AI Voice Assistant */}
          <button
            id="header-voice-sathi-btn"
            onClick={() => {
              soundService.playClick();
              onOpenVoiceAssistant();
            }}
            className="relative p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40 hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5"
            title="Talk to Sathi Voice Assistant"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
            <Mic className="w-4 h-4" />
            <span className="hidden md:inline text-xs font-medium pr-1">সাথী</span>
          </button>

          {/* SOS Star Button */}
          <button
            id="header-emergency-sos-btn"
            onClick={() => {
              soundService.playSOSBeep();
              onOpenSOS();
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            title="Emergency SOS & Family Contacts"
          >
            <Asterisk className="w-5 h-5 stroke-[2.8]" />
          </button>
        </div>
      </div>
    </header>
  );
};

