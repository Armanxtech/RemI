import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Pill,
  Droplet,
  Brain,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { RemILogo } from './RemILogo';
import { soundService } from '../../services/soundService';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 3;

  const handleNext = () => {
    soundService.playClick();
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onGetStarted();
    }
  };

  const handlePrev = () => {
    soundService.playClick();
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    soundService.playClick();
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-[#0E0A17] text-white flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* --- TOP BAR --- */}
      <div className="w-full max-w-md mx-auto z-10 pt-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-300" />
            </div>
            <RemILogo size="sm" />
          </div>

          <button
            id="welcome-skip-btn"
            onClick={handleSkip}
            className="text-sm font-semibold text-purple-300/80 hover:text-white px-3 py-1.5 rounded-full hover:bg-purple-950/40 transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Progress Bar / Step Indicators */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                soundService.playClick();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-10 bg-purple-400 shadow-md shadow-purple-500/50'
                  : 'w-6 bg-purple-900/60 hover:bg-purple-800/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* --- MAIN SLIDE CONTENT CONTAINER --- */}
      <div className="w-full max-w-md mx-auto my-auto py-6 z-10 flex flex-col items-center text-center">
        {/* SLIDE 0: Welcome to RemI (Floating Sphere Companion) */}
        {currentSlide === 0 && (
          <div className="flex flex-col items-center animate-fadeIn w-full">
            {/* Companion Illustration */}
            <div className="relative my-6 sm:my-8 flex items-center justify-center">
              {/* Outer soft aura */}
              <div className="absolute w-56 h-56 rounded-full bg-gradient-to-b from-purple-600/25 to-indigo-600/10 blur-2xl animate-pulse" />

              {/* Sphere Robot Companion */}
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-[#1A142E] border-2 border-purple-400/40 shadow-[0_0_50px_rgba(168,85,247,0.35)] flex items-center justify-center overflow-hidden">
                {/* Metallic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-[#231A3E] to-purple-800/40" />

                {/* Companion Face & Glowing Brain Core */}
                <div className="relative z-10 flex flex-col items-center justify-center p-4">
                  {/* Glowing Brain Sphere */}
                  <div className="w-24 h-24 rounded-full bg-purple-950/80 border border-purple-400/60 shadow-[0_0_20px_rgba(192,132,252,0.6)] flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
                    <Brain className="w-12 h-12 text-purple-200 stroke-[1.8] animate-pulse" />
                  </div>

                  {/* Gentle friendly smiling eyes below */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="w-3.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_6px_#d8b4fe]" />
                    <div className="w-3.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_6px_#d8b4fe]" />
                  </div>
                </div>

                {/* Tech Rim light */}
                <div className="absolute -top-10 -left-10 w-28 h-28 bg-cyan-400/20 rounded-full blur-xl" />
              </div>
            </div>

            {/* Typography */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome to{' '}
              <span className="font-serif italic font-bold text-purple-300">
                RemI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-purple-200/80 mt-3 max-w-xs sm:max-w-sm leading-relaxed">
              Your personal companion for cognitive wellness and daily care.
            </p>
          </div>
        )}

        {/* SLIDE 1: Stay on Track (Medications & Hydration) */}
        {currentSlide === 1 && (
          <div className="flex flex-col items-center animate-fadeIn w-full">
            {/* Visual Card Feature */}
            <div className="w-full bg-[#18122B]/90 border border-purple-900/50 rounded-3xl p-6 my-6 sm:my-8 shadow-2xl shadow-purple-950/60">
              <div className="flex items-center justify-center gap-6 sm:gap-8 py-4">
                {/* Medications Icon */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-[#241B40] border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-950/50">
                    <Pill className="w-8 h-8 -rotate-45" />
                  </div>
                  <span className="text-sm font-semibold text-purple-200">
                    Medications
                  </span>
                </div>

                {/* Connecting subtle line */}
                <div className="w-8 h-0.5 bg-purple-800/60 rounded-full" />

                {/* Hydration Icon */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-[#241B40] border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-950/50">
                    <Droplet className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-semibold text-purple-200">
                    Hydration
                  </span>
                </div>
              </div>

              {/* Active Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-700/50 text-xs font-semibold text-purple-200">
                <Bell className="w-3.5 h-3.5 text-purple-300 animate-bounce" />
                <span>Smart Reminders Active</span>
              </div>
            </div>

            {/* Typography */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Stay on Track
            </h2>

            <p className="text-base sm:text-lg text-purple-200/80 mt-3 max-w-xs sm:max-w-sm leading-relaxed">
              Never miss a dose with smart reminders for medications and daily
              rituals. We adapt to your schedule.
            </p>
          </div>
        )}

        {/* SLIDE 2: Sharpen Your Mind (Brain Exercises) */}
        {currentSlide === 2 && (
          <div className="flex flex-col items-center animate-fadeIn w-full">
            {/* Visual Card Feature */}
            <div className="relative my-6 sm:my-8 flex items-center justify-center">
              <div className="w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-[#18122B] border border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center justify-center overflow-hidden p-3">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-purple-950 to-[#22173C] flex flex-col items-center justify-center p-4 border border-purple-700/30">
                  <div className="w-20 h-20 rounded-2xl bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-purple-300 mb-2 shadow-inner">
                    <Sparkles className="w-10 h-10 text-purple-300" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest">
                    Brain Gym
                  </span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Sharpen Your Mind
            </h2>

            <p className="text-base sm:text-lg text-purple-200/80 mt-3 max-w-xs sm:max-w-sm leading-relaxed">
              Engage in curated cognitive exercises designed to strengthen
              memory, recall, and focus.
            </p>
          </div>
        )}
      </div>

      {/* --- BOTTOM ACTION BAR --- */}
      <div className="w-full max-w-md mx-auto z-10 pb-4 flex flex-col gap-3">
        {/* Primary CTA (Get Started / Next / Start Journey) */}
        <button
          id="welcome-get-started-btn"
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B575FE] via-[#A855F7] to-[#8B5CF6] hover:from-[#C084FC] hover:to-[#9333EA] active:scale-[0.98] text-white text-lg font-bold shadow-xl shadow-purple-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>
            {currentSlide === 0
              ? 'Get Started'
              : currentSlide === 1
              ? 'Next'
              : 'Start Journey'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Secondary: Sign In Button */}
        <button
          id="welcome-sign-in-btn"
          onClick={() => {
            soundService.playClick();
            onSignIn();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1A142D] hover:bg-[#251D40] border border-purple-800/40 active:scale-[0.98] text-purple-200 hover:text-white text-base font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Already have an account?</span>
          <span className="font-bold text-purple-300 underline underline-offset-2">
            Sign In
          </span>
        </button>
      </div>
    </div>
  );
};
