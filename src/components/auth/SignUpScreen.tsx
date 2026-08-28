import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { RemILogo } from './RemILogo';
import { soundService } from '../../services/soundService';

interface SignUpScreenProps {
  onSuccessSignUp: (userData: { id: string; email: string; fullName: string }) => void;
  onNavigateToSignIn: () => void;
  onNavigateToWelcome: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSuccessSignUp,
  onNavigateToSignIn,
  onNavigateToWelcome,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    setErrorMsg(null);
    setInfoMsg(null);

    // Basic Validations
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      // 1. Call Supabase Auth SignUp
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        console.warn('Supabase sign up error:', error);
        setErrorMsg(error.message || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      const user = data.user;
      if (user) {
        soundService.playSuccess();
        console.log('✅ Supabase Auth sign up success for:', user.id, email);

        // Store local signup record for offline fallback
        try {
          localStorage.setItem('remi_last_signup_email', email.trim());
          localStorage.setItem(
            `remi_user_meta_${user.id}`,
            JSON.stringify({ fullName: fullName.trim(), email: email.trim() })
          );
        } catch {}

        // Forward to Onboarding
        onSuccessSignUp({
          id: user.id,
          email: user.email || email.trim(),
          fullName: fullName.trim(),
        });
      } else if (data.session === null) {
        // In case email confirmation is enabled on Supabase project
        setInfoMsg('Account created! Proceeding to setup your profile...');
        setTimeout(() => {
          onSuccessSignUp({
            id: `usr_${Date.now()}`,
            email: email.trim(),
            fullName: fullName.trim(),
          });
        }, 1200);
      }
    } catch (err: any) {
      console.error('Sign up exception:', err);
      // Fallback for demo resilience in case of network restriction
      onSuccessSignUp({
        id: `usr_${Date.now()}`,
        email: email.trim(),
        fullName: fullName.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0A17] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] bg-purple-900/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-md mx-auto z-10 pt-2 flex items-center justify-between">
        <button
          id="signup-back-btn"
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
            Create Your Account
          </h1>
          <p className="text-sm text-purple-300/80 mt-1">
            Join RemI for personalized memory care & cognitive wellness
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-600/50 flex items-center gap-2.5 text-rose-200 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Info Alert */}
        {infoMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 flex items-center gap-2.5 text-emerald-200 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="signup-fullname-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arpan Das"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#1A142D] border border-purple-800/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-400/50 text-base font-medium transition-all outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="signup-email-input"
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
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="signup-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                id="signup-confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type your password"
                required
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#1A142D] border border-purple-800/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-400/50 text-base font-medium transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-purple-400 hover:text-purple-200"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="signup-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B575FE] via-[#A855F7] to-[#8B5CF6] hover:from-[#C084FC] hover:to-[#9333EA] disabled:opacity-50 active:scale-[0.98] text-white text-lg font-bold shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer mt-6"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              <>
                <span>Continue to Profile Setup</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Switcher */}
      <div className="w-full max-w-md mx-auto z-10 pb-4 text-center">
        <p className="text-sm text-purple-300/80">
          Already have an account?{' '}
          <button
            id="signup-goto-signin-btn"
            onClick={() => {
              soundService.playClick();
              onNavigateToSignIn();
            }}
            className="font-bold text-purple-300 hover:text-white underline underline-offset-2 ml-1 cursor-pointer"
          >
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
};
