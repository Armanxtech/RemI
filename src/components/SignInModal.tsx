import React, { useState } from 'react';
import {
  Sparkles,
  User,
  HeartHandshake,
  Lock,
  ArrowRight,
  ShieldCheck,
  Check,
  UserPlus,
  LogIn,
  Database,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';
import { UserRole, PatientProfile, LanguageCode, SignUpFormData } from '../types';
import { saveSignUpToSupabase } from '../services/supabaseService';
import { soundService } from '../services/soundService';

interface SignInModalProps {
  onSignIn: (role: UserRole) => void;
  isOpen: boolean;
  onClose: () => void;
  onRegisteredPatient?: (newProfile: PatientProfile) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  onSignIn,
  isOpen,
  onClose,
  onRegisteredPatient,
}) => {
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [pinCode, setPinCode] = useState('');

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'patient',
    age: 70,
    gender: 'Male',
    location: 'Tezpur, Assam',
    state: 'Assam',
    pincode: '784001',
    bloodGroup: 'O+',
    primaryCaregiverName: 'Sunita Das',
    primaryCaregiverPhone: '+91 9876543210',
    primaryCaregiverRelationship: 'Daughter',
    preferredLanguage: 'en',
    medicalConditions: 'Mild Cognitive Impairment (Early Stage)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playSuccess();
    onSignIn(selectedRole);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.fullName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await saveSignUpToSupabase(signUpData);
      soundService.playSuccess();
      setSignUpSuccess(true);

      const newPatientProfile: PatientProfile = {
        id: `pat_${Date.now()}`,
        name: signUpData.fullName,
        age: Number(signUpData.age) || 70,
        gender: signUpData.gender,
        location: `${signUpData.location}`,
        state: signUpData.state,
        pincode: signUpData.pincode,
        bloodGroup: signUpData.bloodGroup,
        primaryCaregiver: {
          name: signUpData.primaryCaregiverName,
          relationship: signUpData.primaryCaregiverRelationship,
          phone: signUpData.primaryCaregiverPhone,
        },
        preferredLanguage: signUpData.preferredLanguage,
        fontSize: 'large',
        soundEnabled: true,
        highContrast: false,
        avatarUrl:
          signUpData.gender === 'Female'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=face'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face',
      };

      if (onRegisteredPatient) {
        onRegisteredPatient(newPatientProfile);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSignUpSuccess(false);
        onSignIn(signUpData.role);
      }, 1200);
    } catch (err) {
      console.error('Sign up submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="sign-in-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="sign-in-modal-container"
        className="bg-[#181427] border border-purple-800/50 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Mode Switch */}
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-xl shadow-purple-900/60 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                RemI
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-semibold">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Backend (kbggcjvqiepvbtlewwgf)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#141022] p-1 rounded-2xl border border-purple-900/60">
            <button
              onClick={() => {
                soundService.playClick();
                setModalMode('signin');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                modalMode === 'signin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setModalMode('signup');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                modalMode === 'signup'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {modalMode === 'signin' ? (
          /* ================= SIGN IN MODE ================= */
          <div className="space-y-5 pt-3 overflow-y-auto flex-1 text-center">
            {/* Role Selector Buttons */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#141022] border border-purple-950/80">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setSelectedRole('patient');
                }}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'patient'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Elderly Patient</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setSelectedRole('caretaker');
                }}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  selectedRole === 'caretaker'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Caregiver / Doctor</span>
              </button>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-left">
              {selectedRole === 'patient' ? (
                <div className="p-4 rounded-2xl bg-[#201A38] border border-purple-800/40 text-center space-y-2">
                  <p className="text-xs text-purple-200 font-semibold">
                    Welcome, Arpan Das (Tezpur, Assam)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    1-Touch Instant Access configured for senior convenience.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-purple-300 font-semibold block mb-1.5">
                    Caregiver Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter 4-digit PIN (default: 1234)"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                    <Lock className="w-4 h-4 text-purple-400 absolute right-4 top-4" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-900/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Enter RemI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setModalMode('signup')}
                className="text-xs text-purple-300 hover:text-white underline underline-offset-4"
              >
                Need to register a new senior or caregiver? Click here to Sign Up
              </button>
            </div>
          </div>
        ) : (
          /* ================= SIGN UP / REGISTRATION FORM ================= */
          <div className="space-y-4 pt-2 overflow-y-auto flex-1 text-left pr-1">
            {signUpSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold text-white">Registration Successful!</h3>
                <p className="text-xs text-purple-200">
                  Data synced to Supabase <code className="bg-purple-950 px-1 py-0.5 rounded text-emerald-300">signups</code> table. Loading personalized profile...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Create New Account / Patient Record
                  </h3>
                  <p className="text-[11px] text-purple-300/80">
                    Saves profile to Supabase database (kbggcjvqiepvbtlewwgf)
                  </p>
                </div>

                {/* Role Switch */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpData({ ...signUpData, role: 'patient' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      signUpData.role === 'patient'
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#141022] border border-purple-900/50 text-slate-400'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Elderly Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpData({ ...signUpData, role: 'caretaker' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      signUpData.role === 'caretaker'
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#141022] border border-purple-900/50 text-slate-400'
                    }`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Caregiver / Guardian</span>
                  </button>
                </div>

                {/* Full Name & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arpan Das / Ramesh Baruah"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      Age
                    </label>
                    <input
                      type="number"
                      value={signUpData.age}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          age: parseInt(e.target.value) || 70,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                      min={10}
                      max={120}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="family.care@remi.in"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={signUpData.phone}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Location & PIN Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      Location / City (North East India)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tezpur, Guwahati, Shillong, Imphal"
                      value={signUpData.location}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, location: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="784001"
                      value={signUpData.pincode}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, pincode: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Primary Caregiver Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      Primary Caregiver / Guardian Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sunita Das (Daughter)"
                      value={signUpData.primaryCaregiverName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          primaryCaregiverName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                      Blood Group
                    </label>
                    <select
                      value={signUpData.bloodGroup}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, bloodGroup: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                    Preferred Language for RemI Voice Assistant
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'as', label: 'অসমীয়া' },
                      { code: 'bn', label: 'বাংলা' },
                      { code: 'hi', label: 'हिन्दी' },
                      { code: 'mni', label: 'মৈতৈলোন্' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() =>
                          setSignUpData({
                            ...signUpData,
                            preferredLanguage: lang.code as LanguageCode,
                          })
                        }
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold ${
                          signUpData.preferredLanguage === lang.code
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#141022] text-slate-300 border border-purple-900/40'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medical Condition notes */}
                <div>
                  <label className="text-[11px] text-purple-300 font-semibold block mb-0.5">
                    Medical Notes / Stage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mild Dementia, Early Alzheimer's, Memory Support"
                    value={signUpData.medicalConditions}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        medicalConditions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-xs sm:text-sm text-white shadow-xl shadow-purple-900/50 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Registration to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 text-emerald-300" />
                        <span>Sign Up & Connect to Supabase</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-purple-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>🔒 Supabase Cloud Database Linked</span>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
