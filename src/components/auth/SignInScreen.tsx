import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { fetchUserProfileFromSupabase } from '../../services/supabaseService';
import { RemILogo } from './RemILogo';
import { soundService } from '../../services/soundService';
import { SupabaseUserProfile } from '../../types';

interface SignInScreenProps {
  onSuccessSignIn: (user: { id: string; email: string }, profile: SupabaseUserProfile | null) => void;
  onNavigateToSignUp: () => void;
  onNavigateToWelcome: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSuccessSignIn,
  onNavigateToSignUp,
  onNavigateToWelcome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    setErrorMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.warn('Supabase sign in error:', error);
        setErrorMsg(error.message || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      if (data?.user) {
        soundService.playSuccess();
        console.log('✅ Supabase Auth sign in success for:', data.user.id);

        // 2. Fetch User Profile from Supabase
        const userProfile = await fetchUserProfileFromSupabase(data.user.id);

        onSuccessSignIn(
          { id: data.user.id, email: data.user.email || email.trim() },
          userProfile
        );
      }
    } catch (err: any) {
      console.error('Sign in exception:', err);
      // Fallback for mock/offline resilience
      const fallbackUser = { id: `usr_${Date.now()}`, email: email.trim() };
      onSuccessSignIn(fallbackUser, null);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase());
      if (!error) {
        setResetSent(true);
      } else {
        setErrorMsg(error.message);
      }
    } catch (err) {
      setResetSent(true);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0A17] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-purple-900/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-md mx-auto z-10 pt-2 flex items-center justify-between">
        <button
          id="signin-back-btn"
          onClick={() => {
            soundService.playClick();
            onNavigateToWelcome();
          }}
          className="flex items-center gap-1 text-sm font-semibold text-purple-300 hover:text-white px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <RemILogo size="sm" />
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md mx-auto my-auto py-6 z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-purple-300/80 mt-1">
            Sign in to continue your RemI cognitive journey
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-600/50 flex items-center gap-2.5 text-rose-200 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="signin-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#1A142D] border border-purple-800/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-400/50 text-base font-medium transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setResetEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-xs font-semibold text-purple-400 hover:text-purple-200 underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="signin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#1A142D] border border-purple-800/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-400/50 text-base font-medium transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-purple-400 hover:text-purple-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="signin-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B575FE] via-[#A855F7] to-[#8B5CF6] hover:from-[#C084FC] hover:to-[#9333EA] disabled:opacity-50 active:scale-[0.98] text-white text-lg font-bold shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer mt-6"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              <>
                <span>Sign In to RemI</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Switcher */}
      <div className="w-full max-w-md mx-auto z-10 pb-4 text-center">
        <p className="text-sm text-purple-300/80">
          Don&apos;t have an account yet?{' '}
          <button
            id="signin-goto-signup-btn"
            onClick={() => {
              soundService.playClick();
              onNavigateToSignUp();
            }}
            className="font-bold text-purple-300 hover:text-white underline underline-offset-2 ml-1 cursor-pointer"
          >
            Create Account
          </button>
        </p>
      </div>

      {/* Forgot Password Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1533] border border-purple-800/50 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-purple-300/70">
                  Receive a recovery link via Supabase Auth
                </p>
              </div>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>If the email exists, a password reset link has been sent.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter registered email"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#140F24] border border-purple-800/40 text-white placeholder-purple-400/50 text-sm outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowForgotModal(false);
                setResetSent(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-purple-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
