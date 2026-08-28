import React, { useState, useRef } from 'react';
import {
  User,
  Globe,
  Settings,
  ShieldCheck,
  FileText,
  PhoneCall,
  Volume2,
  Moon,
  Sun,
  Eye,
  Type,
  UserCheck,
  MapPin,
  Camera,
  Upload,
  Check,
  Sparkles,
  RefreshCw,
  Search,
  X,
  Compass,
  Building2,
  Image as ImageIcon,
  Pencil,
  Phone,
  Mail,
  UserPlus,
  LogIn,
  Database,
  Edit3,
} from 'lucide-react';
import { PatientProfile, LanguageCode, UserRole } from '../types';
import { soundService } from '../services/soundService';
import { getWeatherForLocation, PinCodeInfo } from '../data/weatherData';
import { PinCodeSetupModal } from './PinCodeSetupModal';
import { EditPatientModal } from './EditPatientModal';

interface ProfileScreenProps {
  patient: PatientProfile;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onNavigateToEmergency: () => void;
  onNavigateToHealthRecords: () => void;
  onToggleRole: () => void;
  currentRole: UserRole;
  fontSize: 'normal' | 'large' | 'xlarge';
  onSetFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onUpdatePatient?: (updated: Partial<PatientProfile>) => void;
  onOpenSignIn?: () => void;
}

const AVATAR_PRESETS = [
  {
    id: 'preset_1',
    name: 'Gentle Grandfather (Tezpur)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face',
    desc: 'Gentleman in warm collared shirt',
  },
  {
    id: 'preset_2',
    name: 'Serene Grandmother (Guwahati)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=face',
    desc: 'Elderly woman in warm traditional shawl',
  },
  {
    id: 'preset_3',
    name: 'Elder with Traditional Gamosa',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&crop=face',
    desc: 'Elderly gentleman with gentle smile',
  },
  {
    id: 'preset_4',
    name: 'Smiling Elder (Shillong)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=face',
    desc: 'Warm smiling elder in garden sunlight',
  },
  {
    id: 'preset_5',
    name: 'Wise Elder Matriarch (Imphal)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=face',
    desc: 'Serene grandmother with gentle expression',
  },
  {
    id: 'preset_6',
    name: 'Assam Tea Estate Elder',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&h=240&fit=crop&crop=face',
    desc: 'Senior grandfather in cotton kurta',
  },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  patient,
  currentLanguage,
  onChangeLanguage,
  onNavigateToEmergency,
  onNavigateToHealthRecords,
  onToggleRole,
  currentRole,
  fontSize,
  onSetFontSize,
  highContrast,
  onToggleHighContrast,
  onUpdatePatient,
  onOpenSignIn,
}) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPinCodeModal, setShowPinCodeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'mni', label: 'Manipuri', native: 'মৈতৈলোন্' },
  ];

  const currentWeather = getWeatherForLocation(patient.location, patient.pincode);

  const handleSelectAvatar = (url: string) => {
    soundService.playSuccess();
    if (onUpdatePatient) {
      onUpdatePatient({ avatarUrl: url });
    }
    setShowAvatarModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleSelectAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPinCode = (pinInfo: PinCodeInfo) => {
    soundService.playSuccess();
    if (onUpdatePatient) {
      onUpdatePatient({
        location: `${pinInfo.cityName}, ${pinInfo.state}`,
        state: pinInfo.state,
        pincode: pinInfo.pincode,
      });
    }
    setShowPinCodeModal(false);
  };

  return (
    <div id="profile-screen" className="space-y-6 pb-24 text-white">
      {/* Avatar & Basic Info */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        <div className="relative group">
          <img
            src={patient.avatarUrl}
            alt={patient.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/40 shadow-xl shadow-purple-950/40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#120F1D]" />

          {/* Edit photo badge button */}
          <button
            id="change-avatar-icon-btn"
            onClick={() => {
              soundService.playClick();
              setShowAvatarModal(true);
            }}
            className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer text-white text-xs font-semibold"
            title="Change Profile Picture"
          >
            <Camera className="w-6 h-6 mb-0.5 text-amber-300" />
            <span className="text-[10px]">Change</span>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">{patient.name}</h2>
            <button
              id="edit-profile-pencil-btn"
              onClick={() => {
                soundService.playClick();
                setShowEditModal(true);
              }}
              className="p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-300 hover:text-white border border-purple-700/50 transition-all cursor-pointer"
              title="Edit Patient Name, Phone & Age"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-0.5 flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <p className="text-xs text-purple-300 font-semibold">{patient.location}</p>
            {patient.pincode && (
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                PIN: {patient.pincode}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit Details, Change Photo, PIN Code */}
        <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
          <button
            id="edit-patient-details-btn"
            onClick={() => {
              soundService.playClick();
              setShowEditModal(true);
            }}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-950/40 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile (Name, Phone, Age)</span>
          </button>

          <button
            id="change-profile-photo-btn"
            onClick={() => {
              soundService.playClick();
              setShowAvatarModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#221B3A] hover:bg-[#2F2550] border border-purple-700/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-purple-300" />
            <span>Photo</span>
          </button>

          <button
            id="change-location-weather-btn"
            onClick={() => {
              soundService.playClick();
              setShowPinCodeModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#221B3A] hover:bg-[#2F2550] border border-purple-700/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>PIN ({patient.pincode || '784001'})</span>
          </button>
        </div>
      </div>

      {/* WEATHER & PIN CODE REGION CARD */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Weather & PIN Code Setup</h3>
              <p className="text-[11px] text-purple-300/70">Automatic forecast resolution via 6-digit postal code</p>
            </div>
          </div>
          <button
            id="switch-pincode-profile-btn"
            onClick={() => setShowPinCodeModal(true)}
            className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Set PIN</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-300/80 block">Current Weather City</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/60 font-mono text-[10px] text-amber-300 font-bold border border-purple-700/40">
                PIN: {patient.pincode || '784001'}
              </span>
            </div>
            <span className="text-base font-bold text-white mt-0.5 block">{patient.location}</span>
            <p className="text-xs text-slate-300 mt-1">{currentWeather.condition} • {currentWeather.temperature}</p>
          </div>
          <div className="text-right">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
              {currentWeather.dayName}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Details Card (Interactive & Editable) */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-white">Personal & Contact Details</h3>
              <p className="text-[11px] text-purple-300/70">Fully editable for any patient or family user</p>
            </div>
          </div>

          <button
            id="edit-personal-details-card-btn"
            onClick={() => {
              soundService.playClick();
              setShowEditModal(true);
            }}
            className="px-3 py-1 rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-purple-300" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Patient Name */}
          <div className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40 flex items-center justify-between">
            <div>
              <span className="text-purple-300/70 block text-[11px]">Full Name</span>
              <span className="text-sm font-bold text-white">{patient.name}</span>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-purple-400 hover:text-purple-200 p-1"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Patient Phone Number */}
          <div className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40 flex items-center justify-between">
            <div>
              <span className="text-purple-300/70 block text-[11px]">Patient Phone</span>
              <span className="text-sm font-bold text-emerald-300 font-mono">
                {patient.phone || patient.primaryCaregiver?.phone || '+91 9876543210'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={`tel:${patient.phone || patient.primaryCaregiver?.phone || '+919876543210'}`}
                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                title="Call Patient"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setShowEditModal(true)}
                className="text-purple-400 hover:text-purple-200 p-1"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Age */}
          <div className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40 flex items-center justify-between">
            <div>
              <span className="text-purple-300/70 block text-[11px]">Age</span>
              <span className="text-sm font-bold text-white">{patient.age} Years</span>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-purple-400 hover:text-purple-200 p-1"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gender */}
          <div className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40 flex items-center justify-between">
            <div>
              <span className="text-purple-300/70 block text-[11px]">Gender</span>
              <span className="text-sm font-bold text-white">{patient.gender}</span>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-purple-400 hover:text-purple-200 p-1"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Blood Group */}
          <div className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40">
            <span className="text-purple-300/70 block text-[11px]">Blood Group</span>
            <span className="text-sm font-bold text-rose-300">{patient.bloodGroup}</span>
          </div>

          {/* Primary Caregiver & Phone */}
          <div className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40">
            <span className="text-purple-300/70 block text-[11px]">Primary Family Caregiver</span>
            <span className="text-sm font-bold text-purple-200 block">
              {patient.primaryCaregiver?.name || 'Sunita Das'} ({patient.primaryCaregiver?.relationship || 'Daughter'})
            </span>
            <span className="text-xs text-purple-300/80 font-mono mt-0.5 block">
              {patient.primaryCaregiver?.phone || '+91 9876543210'}
            </span>
          </div>
        </div>

        {patient.notes && (
          <div className="p-3 rounded-2xl bg-[#141022]/80 border border-purple-900/40 text-xs">
            <span className="text-purple-300/70 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Care & Memory Notes
            </span>
            <p className="text-slate-300">{patient.notes}</p>
          </div>
        )}
      </div>

      {/* Preferred Languages (NER Regional) */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">Preferred Languages (North East India)</h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-select-${lang.code}`}
                onClick={() => {
                  soundService.playClick();
                  onChangeLanguage(lang.code);
                  const greeting =
                    lang.code === 'as'
                      ? 'নমস্কাৰ, মই সাথী। আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?'
                      : lang.code === 'bn'
                      ? 'নমস্কার, আমি সাথী। আপনাকে কিভাবে সাহায্য করতে পারি?'
                      : lang.code === 'hi'
                      ? 'नमस्ते, मैं साथी हूँ। आज आप कैसा महसूस कर रहे हैं?'
                      : lang.code === 'mni'
                      ? 'খুরুমজরি, ঐ সাথীনি। কদাইদা তেংবাংগদগে?'
                      : 'Hello, I am Sathi. How may I assist you today?';
                  soundService.speak(greeting, lang.code);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-900/40 ring-2 ring-purple-300'
                    : 'bg-[#141022] border border-purple-800/40 text-purple-200 hover:bg-purple-900/30'
                }`}
              >
                <span>{lang.native}</span>
                <span className="text-[10px] opacity-75">({lang.label})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility & Voice Settings */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">Accessibility & Large Display</h3>
        </div>

        <div className="space-y-3">
          {/* Font Size Chooser */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141022] border border-purple-900/40">
            <div>
              <span className="text-xs font-bold text-white block">Text Display Size</span>
              <span className="text-[11px] text-purple-300/70">Optimized for senior readability</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#1C172E] p-1 rounded-xl border border-purple-800/40">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  id={`font-size-${size}`}
                  onClick={() => {
                    soundService.playClick();
                    onSetFontSize(size);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    fontSize === size
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'XL'}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141022] border border-purple-900/40">
            <div>
              <span className="text-xs font-bold text-white block">High Contrast Mode</span>
              <span className="text-[11px] text-purple-300/70">Sharper borders and pure dark canvas</span>
            </div>

            <button
              id="high-contrast-toggle-btn"
              onClick={() => {
                soundService.playClick();
                onToggleHighContrast();
              }}
              className={`w-12 h-6 rounded-full transition-all relative p-1 ${
                highContrast ? 'bg-purple-600' : 'bg-purple-950 border border-purple-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation to Emergency & Health Records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          id="profile-nav-emergency-btn"
          onClick={() => {
            soundService.playClick();
            onNavigateToEmergency();
          }}
          className="p-4 rounded-2xl bg-[#1C172E] hover:bg-[#251E3C] border border-purple-900/40 text-left flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Emergency SOS</span>
              <span className="text-xs text-purple-300/70">Contacts & Tezpur 108</span>
            </div>
          </div>
        </button>

        <button
          id="profile-nav-records-btn"
          onClick={() => {
            soundService.playClick();
            onNavigateToHealthRecords();
          }}
          className="p-4 rounded-2xl bg-[#1C172E] hover:bg-[#251E3C] border border-purple-900/40 text-left flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Health Records</span>
              <span className="text-xs text-purple-300/70">Conditions, Allergies & MRI</span>
            </div>
          </div>
        </button>
      </div>

      {/* Account & Profile Switcher (Sign In / Register New Patient) */}
      <div className="p-5 rounded-3xl bg-[#1C172E] border border-purple-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Sign In & Patient Accounts</h4>
            <p className="text-xs text-purple-300/75">
              Sign in with existing credentials or register a new patient profile into Supabase.
            </p>
          </div>
        </div>

        <button
          id="profile-open-signin-btn"
          onClick={() => {
            soundService.playClick();
            if (onOpenSignIn) onOpenSignIn();
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 active:scale-95 transition-all shrink-0 flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In / New Account</span>
        </button>
      </div>

      {/* Switch to Caregiver View */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/70 via-[#1D1630] to-indigo-950/70 border border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Caregiver & Family Portal</h4>
          <p className="text-xs text-purple-300/80 mt-0.5">
            Access clinical trends, adherence graphs, cognitive test reports & voice dispatch.
          </p>
        </div>

        <button
          id="profile-switch-caregiver-btn"
          onClick={() => {
            soundService.playSuccess();
            onToggleRole();
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 active:scale-95 transition-all shrink-0"
        >
          Switch to Caregiver View
        </button>
      </div>

      {/* --- MODAL 1: CHANGE PROFILE PICTURE --- */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181427] border border-purple-800/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-white my-auto max-h-[92vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Change Profile Picture</h3>
                  <p className="text-xs text-purple-300/80">Select a senior portrait or upload your own</p>
                </div>
              </div>

              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#221B3A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Option A: Upload from Device */}
              <div className="p-4 rounded-2xl bg-[#141022] border border-dashed border-purple-700/60 text-center space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-purple-900/50 text-purple-300 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Upload Photo from Device
                  </button>
                  <p className="text-[11px] text-purple-300/70 mt-1">Supports JPG, PNG, WebP</p>
                </div>
              </div>

              {/* Option B: Curated Regional Avatars Gallery */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-purple-300">Curated Elder Portraits</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVATAR_PRESETS.map((preset) => {
                    const isCurrent = patient.avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectAvatar(preset.url)}
                        className={`p-2.5 rounded-2xl bg-[#141022] border text-left flex flex-col items-center text-center gap-2 transition-all group ${
                          isCurrent
                            ? 'border-purple-400 ring-2 ring-purple-400/40 bg-purple-950/40'
                            : 'border-purple-900/50 hover:border-purple-600'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-all"
                            referrerPolicy="no-referrer"
                          />
                          {isCurrent && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-white line-clamp-1">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option C: Custom Web URL */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-purple-300">Or Paste Image URL</h4>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAvatarUrl.trim()) handleSelectAvatar(customAvatarUrl.trim());
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 rounded-xl bg-[#201A38] text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CHANGE PIN CODE & WEATHER REGION --- */}
      {showPinCodeModal && (
        <PinCodeSetupModal
          currentPincode={patient.pincode || '784001'}
          currentLocation={patient.location}
          onClose={() => setShowPinCodeModal(false)}
          onSelectPinCode={handleSelectPinCode}
        />
      )}

      {/* --- MODAL 3: EDIT PATIENT DETAILS (NAME, PHONE, AGE, ETC.) --- */}
      {showEditModal && (
        <EditPatientModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          patient={patient}
          onSavePatient={(updated) => {
            if (onUpdatePatient) {
              onUpdatePatient(updated);
            }
          }}
        />
      )}
    </div>
  );
};

