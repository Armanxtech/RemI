import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { ActivityGoalCard } from './components/ActivityGoalCard';
import { WeatherCard } from './components/WeatherCard';
import { DailyRitualsCard } from './components/DailyRitualsCard';
import { MemoryOfTheDayCard } from './components/MemoryOfTheDayCard';
import { GamesHub } from './components/GamesHub';
import { GamePlayerModal } from './components/GamePlayerModal';
import { MedicationScreen } from './components/MedicationScreen';
import { MemoriesScreen } from './components/MemoriesScreen';
import { EmergencyScreen } from './components/EmergencyScreen';
import { HealthRecordsScreen } from './components/HealthRecordsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SOSBeaconModal } from './components/SOSBeaconModal';
import { SignInModal } from './components/SignInModal';
import { ReliveMemoryModal } from './components/ReliveMemoryModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { CaregiverBookingModal } from './components/CaregiverBookingModal';
import { AppointmentsHubModal } from './components/AppointmentsHubModal';

// Auth & Onboarding Flow
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { SignInScreen } from './components/auth/SignInScreen';
import { OnboardingScreen } from './components/auth/OnboardingScreen';
import { RemILogo } from './components/auth/RemILogo';
import { supabase } from './services/supabaseClient';

import {
  initialPatientProfile,
  initialDailyRituals,
  initialCognitiveGames,
  initialMedications,
  initialMemoryStories,
  initialHealthRecord,
  initialEmergencyContacts,
  initialCaregiverAlerts,
  initialAppointments,
  initialBookings,
} from './data/mockData';

import {
  PatientProfile,
  DailyRitual,
  CognitiveGame,
  MedicationItem,
  MemoryStory,
  HealthRecord,
  LabReport,
  EmergencyContact,
  CaregiverAlert,
  LanguageCode,
  UserRole,
  MedicalAppointment,
  CaregiverBooking,
  AuthRoute,
  SupabaseUserProfile,
} from './types';

import { soundService } from './services/soundService';
import { syncCaregiverData } from './services/aiService';
import {
  fetchAppointmentsFromSupabase,
  fetchBookingsFromSupabase,
  fetchUserProfileFromSupabase,
} from './services/supabaseService';
import { getWeatherForLocation, PinCodeInfo } from './data/weatherData';
import { PinCodeSetupModal } from './components/PinCodeSetupModal';
import { Brain, Sparkles, Mic } from 'lucide-react';

export default function App() {
  // --- AUTHENTICATION & ONBOARDING ROUTE STATE ---
  const [authRoute, setAuthRoute] = useState<AuthRoute>('welcome');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null);
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(null);

  // --- EXISTING DASHBOARD STATE MANAGEMENT ---
  const [patient, setPatient] = useState<PatientProfile>(initialPatientProfile);
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [activeTab, setActiveTab] = useState<NavTab | 'profile' | 'health-records'>('home');
  const [rituals, setRituals] = useState<DailyRitual[]>(initialDailyRituals);
  const [games, setGames] = useState<CognitiveGame[]>(initialCognitiveGames);
  const [medications, setMedications] = useState<MedicationItem[]>(initialMedications);
  const [memories, setMemories] = useState<MemoryStory[]>(initialMemoryStories);
  const [healthRecords, setHealthRecords] = useState<HealthRecord>(initialHealthRecord);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(initialEmergencyContacts);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>(initialCaregiverAlerts);
  const [appointments, setAppointments] = useState<MedicalAppointment[]>(initialAppointments);
  const [caregiverBookings, setCaregiverBookings] = useState<CaregiverBooking[]>(initialBookings);

  // Settings & Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Just now');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Modals
  const [selectedGameForPlay, setSelectedGameForPlay] = useState<CognitiveGame | null>(null);
  const [selectedStoryForRelive, setSelectedStoryForRelive] = useState<MemoryStory | null>(null);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState<boolean>(false);
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [showPinCodeModal, setShowPinCodeModal] = useState<boolean>(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
  const [showCaregiverBookingModal, setShowCaregiverBookingModal] = useState<boolean>(false);
  const [showAppointmentsHubModal, setShowAppointmentsHubModal] = useState<boolean>(false);

  // --- 1. SUPABASE AUTH SESSION RESOLUTION ---
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        const session = data?.session;
        if (!session?.user) {
          // Check local cached session
          const cachedUserStr = localStorage.getItem('remi_active_user');
          if (cachedUserStr) {
            try {
              const cachedUser = JSON.parse(cachedUserStr);
              setAuthUser(cachedUser);
              const cachedProfile = await fetchUserProfileFromSupabase(cachedUser.id);
              if (cachedProfile && cachedProfile.onboarding_completed) {
                setUserProfile(cachedProfile);
                setPatient((prev) => ({
                  ...prev,
                  name: cachedProfile.full_name || prev.name,
                  age: cachedProfile.age || prev.age,
                  preferredLanguage: cachedProfile.preferred_language || prev.preferredLanguage,
                  location: cachedProfile.region || prev.location,
                  pincode: cachedProfile.pincode || prev.pincode,
                }));
                if (cachedProfile.role === 'caretaker' || cachedProfile.role === 'caregiver') {
                  setCurrentRole('caretaker');
                }
                setAuthRoute('dashboard');
                setAuthLoading(false);
                return;
              }
            } catch {}
          }

          setAuthUser(null);
          setAuthRoute('welcome');
          setAuthLoading(false);
          return;
        }

        const user = session.user;
        const userInfo = { id: user.id, email: user.email || '' };
        setAuthUser(userInfo);
        localStorage.setItem('remi_active_user', JSON.stringify(userInfo));

        // Check if user has completed onboarding in 'profiles' table
        const profile = await fetchUserProfileFromSupabase(user.id);
        if (profile && profile.onboarding_completed) {
          setUserProfile(profile);
          setPatient((prev) => ({
            ...prev,
            name: profile.full_name || prev.name,
            age: profile.age || prev.age,
            preferredLanguage: profile.preferred_language || prev.preferredLanguage,
            location: profile.region || prev.location,
            pincode: profile.pincode || prev.pincode,
          }));
          if (profile.role === 'caretaker' || profile.role === 'caregiver') {
            setCurrentRole('caretaker');
          }
          setAuthRoute('dashboard');
        } else {
          // User exists but has not finished profile setup
          setAuthRoute('onboarding');
        }
      } catch (err) {
        console.warn('Auth session check notice:', err);
        setAuthRoute('welcome');
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    checkSession();

    // Listen to Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        if (event === 'SIGNED_OUT' || !session) {
          setAuthUser(null);
          setUserProfile(null);
          localStorage.removeItem('remi_active_user');
          setAuthRoute('welcome');
        } else if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user;
          const userInfo = { id: user.id, email: user.email || '' };
          setAuthUser(userInfo);
          localStorage.setItem('remi_active_user', JSON.stringify(userInfo));

          const profile = await fetchUserProfileFromSupabase(user.id);
          if (profile && profile.onboarding_completed) {
            setUserProfile(profile);
            setPatient((prev) => ({
              ...prev,
              name: profile.full_name || prev.name,
              age: profile.age || prev.age,
              preferredLanguage: profile.preferred_language || prev.preferredLanguage,
              location: profile.region || prev.location,
              pincode: profile.pincode || prev.pincode,
            }));
            if (profile.role === 'caretaker' || profile.role === 'caregiver') {
              setCurrentRole('caretaker');
            }
            setAuthRoute('dashboard');
          } else {
            setAuthRoute('onboarding');
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // --- 2. AUTH HANDLERS ---
  const handleLogout = async () => {
    soundService.playClick();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setAuthUser(null);
    setUserProfile(null);
    localStorage.removeItem('remi_active_user');
    setAuthRoute('welcome');
  };

  const handleCompleteOnboarding = (savedProfile: SupabaseUserProfile) => {
    setUserProfile(savedProfile);
    setPatient((prev) => ({
      ...prev,
      name: savedProfile.full_name || prev.name,
      age: savedProfile.age || prev.age,
      preferredLanguage: savedProfile.preferred_language || prev.preferredLanguage,
      location: savedProfile.region || prev.location,
      pincode: savedProfile.pincode || prev.pincode,
    }));
    if (savedProfile.role === 'caretaker' || savedProfile.role === 'caregiver') {
      setCurrentRole('caretaker');
    }
    setAuthRoute('dashboard');
  };


  // Initial fetch from Supabase
  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const [remoteApts, remoteBks] = await Promise.all([
          fetchAppointmentsFromSupabase(),
          fetchBookingsFromSupabase(),
        ]);
        if (remoteApts && remoteApts.length > 0) {
          setAppointments(remoteApts);
        }
        if (remoteBks && remoteBks.length > 0) {
          setCaregiverBookings(remoteBks);
        }
      } catch (e) {
        console.warn('Initial Supabase load note:', e);
      }
    };
    loadSupabaseData();
  }, []);

  // Load from local storage for offline resilience
  useEffect(() => {
    try {
      const savedPatient = localStorage.getItem('cognicare_patient');
      if (savedPatient) setPatient(JSON.parse(savedPatient));

      const savedMeds = localStorage.getItem('cognicare_meds');
      if (savedMeds) setMedications(JSON.parse(savedMeds));

      const savedRituals = localStorage.getItem('cognicare_rituals');
      if (savedRituals) setRituals(JSON.parse(savedRituals));

      const savedApts = localStorage.getItem('cognicare_appointments');
      if (savedApts) setAppointments(JSON.parse(savedApts));

      const savedBks = localStorage.getItem('cognicare_bookings');
      if (savedBks) setCaregiverBookings(JSON.parse(savedBks));
    } catch {}
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('cognicare_patient', JSON.stringify(patient));
      localStorage.setItem('cognicare_meds', JSON.stringify(medications));
      localStorage.setItem('cognicare_rituals', JSON.stringify(rituals));
      localStorage.setItem('cognicare_appointments', JSON.stringify(appointments));
      localStorage.setItem('cognicare_bookings', JSON.stringify(caregiverBookings));
    } catch {}
  }, [patient, medications, rituals, appointments, caregiverBookings]);

  // Dynamic Weather for patient's chosen location and pincode
  const currentWeather = getWeatherForLocation(patient.location, patient.pincode);

  // Periodic offline / cloud sync simulation
  const handleTriggerSync = async () => {
    const res = await syncCaregiverData({
      patientId: patient.id,
      medications,
      completedRituals: rituals.filter((r) => r.completed).map((r) => r.title),
      gameScores: [{ gameId: 'recall', score: 95 }],
      alerts: [],
    });
    if (res.synced) {
      setLastSyncedAt('Just now');
    }
  };

  // --- HANDLERS ---
  const handleToggleRitual = (id: string) => {
    setRituals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleLogWater = () => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.type === 'hydration') {
          const current = (r.currentCount || 0) + 1;
          const isDone = current >= (r.requiredCount || 6);
          return { ...r, currentCount: current, completed: isDone };
        }
        return r;
      })
    );
  };

  const handleToggleMedication = (id: string) => {
    setMedications((prev) => {
      let triggeredLowAlert: MedicationItem | null = null;
      const updated = prev.map((m) => {
        if (m.id === id) {
          const nextCompleted = !m.completed;
          let nextStock = m.stockDoses !== undefined ? m.stockDoses : 30;
          if (nextCompleted) {
            nextStock = Math.max(0, nextStock - 1);
            if (nextStock <= (m.refillThreshold || 5) && !m.refillRequested) {
              triggeredLowAlert = { ...m, stockDoses: nextStock };
            }
          } else {
            nextStock = nextStock + 1;
          }
          return { ...m, completed: nextCompleted, stockDoses: nextStock };
        }
        return m;
      });

      if (triggeredLowAlert) {
        const alertMed = triggeredLowAlert as MedicationItem;
        const newAlert: CaregiverAlert = {
          id: `alert_refill_${Date.now()}`,
          type: 'medication',
          severity: 'warning',
          message: `⚠️ Low Stock Warning: ${patient.name}'s ${alertMed.name} (${alertMed.dosage}) is low with only ${alertMed.stockDoses} doses left. Refill order recommended.`,
          timestamp: 'Just now',
          acknowledged: false,
        };
        setAlerts((a) => [newAlert, ...a]);
      }

      return updated;
    });
  };

  const handleLogAsNeeded = (med: MedicationItem) => {
    soundService.playSuccess();
    const prevStock = med.stockDoses !== undefined ? med.stockDoses : 10;
    const remainingStock = Math.max(0, prevStock - 1);

    setMedications((prev) =>
      prev.map((m) =>
        m.id === med.id ? { ...m, stockDoses: remainingStock } : m
      )
    );

    const newAlert: CaregiverAlert = {
      id: `alert_${Date.now()}`,
      type: 'medication',
      severity: 'info',
      message: `${patient.name} took as-needed dose of ${med.name}. Remaining supply: ${remainingStock} doses.`,
      timestamp: 'Just now',
      acknowledged: false,
    };

    const isLow = remainingStock <= (med.refillThreshold || 4);
    const lowAlert: CaregiverAlert | null = isLow
      ? {
          id: `alert_refill_${Date.now()}`,
          type: 'medication',
          severity: 'warning',
          message: `⚠️ Refill Required: ${patient.name}'s ${med.name} is low with only ${remainingStock} doses remaining.`,
          timestamp: 'Just now',
          acknowledged: false,
        }
      : null;

    setAlerts((prev) => (lowAlert ? [lowAlert, newAlert, ...prev] : [newAlert, ...prev]));
  };

  const handleOrderRefill = (medId: string) => {
    const targetMed = medications.find((m) => m.id === medId);
    if (!targetMed) return;

    soundService.playSuccess();
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId
          ? { ...m, refillRequested: true, refillRequestedAt: 'Just now' }
          : m
      )
    );

    const newAlert: CaregiverAlert = {
      id: `alert_order_${Date.now()}`,
      type: 'medication',
      severity: 'warning',
      message: `📦 Refill Order Placed: Refill request sent for ${targetMed.name} (${targetMed.dosage}) to ${targetMed.pharmacyName || 'Apollo Pharmacy Tezpur'}. Caregiver notified.`,
      timestamp: 'Just now',
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleRestockMedication = (medId: string, addedCount: number) => {
    soundService.playSuccess();
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId
          ? {
              ...m,
              stockDoses: (m.stockDoses || 0) + addedCount,
              refillRequested: false,
            }
          : m
      )
    );

    const med = medications.find((m) => m.id === medId);
    const newAlert: CaregiverAlert = {
      id: `alert_restock_${Date.now()}`,
      type: 'medication',
      severity: 'info',
      message: `✓ Medicine Restocked: Added +${addedCount} doses for ${med?.name || 'Medicine'}. Current supply: ${(med?.stockDoses || 0) + addedCount} doses.`,
      timestamp: 'Just now',
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleUpdatePatient = (updated: Partial<PatientProfile>) => {
    soundService.playSuccess();
    setPatient((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('cognicare_patient', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleAddMedication = (newMed: Partial<MedicationItem>) => {
    const item: MedicationItem = {
      id: `med_${Date.now()}`,
      name: newMed.name || 'New Medicine',
      dosage: newMed.dosage || '1 Tablet',
      instructions: newMed.instructions || 'Take with water',
      timeCategory: newMed.timeCategory || 'morning',
      timeScheduled: newMed.timeScheduled || '8:00 AM',
      completed: false,
      isAsNeeded: newMed.isAsNeeded || false,
      stockDoses: newMed.stockDoses || 30,
      totalPackSize: newMed.totalPackSize || 30,
      refillThreshold: newMed.refillThreshold || 5,
      refillRequested: false,
      pharmacyName: newMed.pharmacyName || 'Apollo Pharmacy Tezpur',
      pharmacyPhone: newMed.pharmacyPhone || '+91 9854012345',
      purpose: newMed.purpose || 'General Health',
    };
    setMedications((prev) => [...prev, item]);
  };

  const handleAddStory = (newStory: Partial<MemoryStory>) => {
    const item: MemoryStory = {
      id: `story_${Date.now()}`,
      title: newStory.title || 'Family Memory',
      year: newStory.year || '1995',
      description: newStory.description || 'Memories in Tezpur, Assam.',
      location: newStory.location || 'Tezpur, Assam',
      imageUrl: newStory.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=380&fit=crop',
      culturalTheme: newStory.culturalTheme || 'Family & Heritage',
      audioDuration: '1:15 min',
      recordedBy: newStory.recordedBy || 'Sunita Das',
      hasVoiceNote: true,
      tag: 'Family Memory',
    };
    setMemories((prev) => [item, ...prev]);
  };

  const handleAddContact = (newContact: Partial<EmergencyContact>) => {
    const item: EmergencyContact = {
      id: `contact_${Date.now()}`,
      name: newContact.name || 'Contact',
      role: newContact.role || 'Family',
      relationship: newContact.relationship || 'Emergency Contact',
      phone: newContact.phone || '+91 9876543210',
      type: newContact.type || 'caregiver',
    };
    setEmergencyContacts((prev) => [...prev, item]);
  };

  const handleUploadHealthReport = (report: Partial<LabReport>) => {
    const newReport: LabReport = {
      id: `rep_${Date.now()}`,
      title: report.title || 'Clinical Report',
      date: 'Today',
      type: report.type || 'blood',
      doctor: report.doctor || 'Dr. B. Sharma',
      summary: report.summary || 'Routine laboratory investigation.',
      fileSize: '1.4 MB',
    };
    setHealthRecords((prev) => ({
      ...prev,
      reports: [newReport, ...prev.reports],
    }));
  };

  const handleGameCompleted = (gameId: string, finalScore: number, latencyMs: number) => {
    // Update game record
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? {
              ...g,
              lastScore: finalScore,
              playedCount: g.playedCount + 1,
            }
          : g
      )
    );

    // Also mark game ritual done if applicable
    setRituals((prev) =>
      prev.map((r) => (r.type === 'game' ? { ...r, completed: true } : r))
    );

    // Add caregiver alert
    const newAlert: CaregiverAlert = {
      id: `alert_${Date.now()}`,
      type: 'game',
      severity: 'info',
      message: `${patient.name} completed cognitive exercise with score ${finalScore}% (Latency ${Math.round(latencyMs / 1000)}s)`,
      timestamp: 'Just now',
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleTriggerSOS = () => {
    setShowSOSModal(true);
    const newAlert: CaregiverAlert = {
      id: `sos_${Date.now()}`,
      type: 'sos',
      severity: 'urgent',
      message: `🚨 EMERGENCY SOS TRIGGERED by ${patient.name} at ${patient.location}!`,
      timestamp: 'Just now',
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleSendCaregiverVoiceNote = (text: string) => {
    soundService.speak(`Message from family: "${text}"`, patient.preferredLanguage);
  };

  const handleAppointmentBooked = (newApt: MedicalAppointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    const newAlert: CaregiverAlert = {
      id: `alert_apt_${Date.now()}`,
      type: 'routine',
      severity: 'info',
      message: `📅 New Appointment Confirmed: ${newApt.doctorName} (${newApt.hospital}) on ${newApt.dateTime}. Saved to Supabase database.`,
      timestamp: 'Just now',
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleCaregiverBookingConfirmed = (newBk: CaregiverBooking) => {
    setCaregiverBookings((prev) => [newBk, ...prev]);
    const newAlert: CaregiverAlert = {
      id: `alert_bk_${Date.now()}`,
      type: 'routine',
      severity: 'info',
      message: `🤝 Caregiver Booked: ${newBk.serviceName} starting ${newBk.startDate}. Registered in Supabase backend.`,
      timestamp: 'Just now',
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Font size class mapping
  const fontSizeClass =
    fontSize === 'large'
      ? 'text-[17px]'
      : fontSize === 'xlarge'
      ? 'text-[19px]'
      : 'text-[15px]';

  // Calculate goal percentage
  const completedRitualCount = rituals.filter((r) => r.completed).length;
  const completedGameCount = games.filter((g) => g.playedCount > 0).length;
  const totalGoalItems = rituals.length + 1;
  const goalPercentage = Math.min(
    100,
    Math.round(((completedRitualCount + (completedGameCount > 0 ? 1 : 0)) / totalGoalItems) * 100)
  );

  const pendingRitualsCount = rituals.filter((r) => !r.completed).length;
  const pendingMedNames = medications.filter((m) => !m.completed && !m.isAsNeeded).map((m) => m.name);

  // --- RENDER 1: AUTH LOADING SPINNER ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0E0A17] flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
        <div className="absolute w-72 h-72 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <RemILogo size="lg" withIcon showSubtitle />
          <div className="flex items-center gap-2 mt-4 text-purple-300 text-sm font-medium">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to RemI Cognitive Cloud...</span>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER 2: WELCOME ONBOARDING CAROUSEL ---
  if (authRoute === 'welcome') {
    return (
      <WelcomeScreen
        onGetStarted={() => {
          soundService.playClick();
          setAuthRoute('signup');
        }}
        onSignIn={() => {
          soundService.playClick();
          setAuthRoute('signin');
        }}
      />
    );
  }

  // --- RENDER 3: SIGN UP SCREEN ---
  if (authRoute === 'signup') {
    return (
      <SignUpScreen
        onSuccessSignUp={(userData) => {
          setAuthUser(userData);
          setAuthRoute('onboarding');
        }}
        onNavigateToSignIn={() => {
          soundService.playClick();
          setAuthRoute('signin');
        }}
        onNavigateToWelcome={() => {
          soundService.playClick();
          setAuthRoute('welcome');
        }}
      />
    );
  }

  // --- RENDER 4: SIGN IN SCREEN ---
  if (authRoute === 'signin') {
    return (
      <SignInScreen
        onSuccessSignIn={(user, profile) => {
          setAuthUser(user);
          if (profile && profile.onboarding_completed) {
            setUserProfile(profile);
            setPatient((prev) => ({
              ...prev,
              name: profile.full_name || prev.name,
              age: profile.age || prev.age,
              preferredLanguage: profile.preferred_language || prev.preferredLanguage,
              location: profile.region || prev.location,
              pincode: profile.pincode || prev.pincode,
            }));
            if (profile.role === 'caretaker' || profile.role === 'caregiver') {
              setCurrentRole('caretaker');
            }
            setAuthRoute('dashboard');
          } else {
            setAuthRoute('onboarding');
          }
        }}
        onNavigateToSignUp={() => {
          soundService.playClick();
          setAuthRoute('signup');
        }}
        onNavigateToWelcome={() => {
          soundService.playClick();
          setAuthRoute('welcome');
        }}
      />
    );
  }

  // --- RENDER 5: PROFILE & ONBOARDING SETUP ---
  if (authRoute === 'onboarding') {
    return (
      <OnboardingScreen
        userId={authUser?.id || 'usr_local'}
        initialFullName={authUser?.email ? authUser.email.split('@')[0] : patient.name}
        initialEmail={authUser?.email || ''}
        onCompleteOnboarding={handleCompleteOnboarding}
      />
    );
  }

  // --- RENDER 6: EXISTING MAIN DASHBOARD (PRESERVED 100%) ---
  return (
    <div
      className={`min-h-screen bg-[#110D1D] text-slate-100 selection:bg-purple-500 selection:text-white transition-all ${
        highContrast ? 'contrast-125' : ''
      } ${fontSizeClass}`}
    >
      {/* Top Navigation Header */}
      <Header
        patient={patient}
        currentRole={currentRole}
        onToggleRole={() => setCurrentRole(currentRole === 'patient' ? 'caretaker' : 'patient')}
        onOpenVoiceAssistant={() => setShowVoiceAssistant(true)}
        onOpenSOS={() => handleTriggerSOS()}
        isOnline={isOnline}
        onToggleOnline={() => {
          setIsOnline(!isOnline);
          if (!isOnline) handleTriggerSync();
        }}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenAppointments={() => setShowAppointmentsHubModal(true)}
        onOpenSignIn={() => setShowSignInModal(true)}
        onLogout={handleLogout}
        appointmentsCount={appointments.length + caregiverBookings.length}
        fontSize={fontSize}
        onCycleFontSize={() => {
          setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal');
        }}
        unreadAlertCount={alerts.filter((a) => !a.acknowledged).length}
      />

      {/* Main Screen Container */}
      <main className="max-w-3xl mx-auto px-4 py-5">
        {currentRole === 'caretaker' ? (
          /* CAREGIVER DASHBOARD VIEW */
          <CaregiverDashboard
            patient={patient}
            rituals={rituals}
            games={games}
            medications={medications}
            records={healthRecords}
            alerts={alerts}
            onBackToPatient={() => setCurrentRole('patient')}
            onSendCaregiverVoiceNote={handleSendCaregiverVoiceNote}
            onOpenBookDoctor={() => setShowAppointmentModal(true)}
            onOpenBookCaregiver={() => setShowCaregiverBookingModal(true)}
          />
        ) : (
          /* PATIENT APPLICATION VIEW */
          <>
            {/* 1. HOME SCREEN */}
            {activeTab === 'home' && (
              <div className="space-y-6 pb-24 animate-fade-in">
                {/* Weather & Day Card (Dynamically reactive to PIN code / location changed) */}
                <WeatherCard
                  location={patient.location}
                  pincode={patient.pincode}
                  temperature={currentWeather.temperature}
                  dayName={currentWeather.dayName}
                  condition={currentWeather.condition}
                  note={currentWeather.note}
                  bgImage={currentWeather.bgImage}
                  language={patient.preferredLanguage}
                  onOpenPinCodeSetup={() => setShowPinCodeModal(true)}
                />

                {/* AI Voice Assistant Quick Action Card */}
                <div
                  id="home-ai-assistant-quick-card"
                  onClick={() => {
                    soundService.playClick();
                    setShowVoiceAssistant(true);
                  }}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-[#1E1736] to-indigo-950/60 border border-purple-700/50 hover:border-purple-500/70 shadow-lg shadow-purple-950/40 cursor-pointer flex items-center justify-between gap-3 group transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-900/60 group-hover:scale-105 transition-transform flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-purple-100 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">
                          {patient.preferredLanguage === 'as'
                            ? 'RemI এআই সহায়কৰ সৈতে কথা পাতক'
                            : patient.preferredLanguage === 'bn'
                            ? 'RemI এআই সহকারীর সাথে কথা বলুন'
                            : patient.preferredLanguage === 'hi'
                            ? 'RemI एआई सहायक से बात करें'
                            : 'Talk with RemI Voice Assistant'}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700/60 font-semibold">
                          Voice & Chat
                        </span>
                      </div>
                      <p className="text-xs text-purple-200/80 mt-0.5">
                        {patient.preferredLanguage === 'as'
                          ? 'ঔষধৰ সময়, মগজুৰ খেল বা যিকোনো সহায়ৰ বাবে মাইকত কওক'
                          : patient.preferredLanguage === 'bn'
                          ? 'ওষুধের সময়, মেমরি গেমস বা যে কোনো সহায়তার জন্য কথা বলুন'
                          : patient.preferredLanguage === 'hi'
                          ? 'दवाइयों के समय, दिमागी खेलों और दिनचर्या में सहायता पाएं'
                          : 'Ask about your reminders, memory games, or speak via microphone'}
                      </p>
                    </div>
                  </div>

                  <button
                    id="home-open-ai-assistant-btn"
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md flex-shrink-0"
                  >
                    <Mic className="w-4 h-4" />
                    <span className="hidden xs:inline">
                      {patient.preferredLanguage === 'as'
                        ? 'কওক'
                        : patient.preferredLanguage === 'bn'
                        ? 'বলুন'
                        : patient.preferredLanguage === 'hi'
                        ? 'बोलें'
                        : 'Speak'}
                    </span>
                  </button>
                </div>

                {/* Circular Activity Goal Card */}
                <ActivityGoalCard
                  percentage={goalPercentage}
                  completedRituals={completedRitualCount}
                  totalRituals={rituals.length}
                  completedGames={completedGameCount}
                  totalGames={games.length}
                />

                {/* Daily Rituals Checklist */}
                <DailyRitualsCard
                  rituals={rituals}
                  onToggleRitual={handleToggleRitual}
                  onLogWater={handleLogWater}
                  onPlayGame={() => setActiveTab('games')}
                />

                {/* Featured Memory of the Day */}
                {memories.length > 0 && (
                  <MemoryOfTheDayCard
                    memory={memories[0]}
                    onReliveMemory={(mem) => setSelectedStoryForRelive(mem)}
                    language={patient.preferredLanguage}
                  />
                )}
              </div>
            )}

            {/* 2. REMINDERS & MEDICATIONS SCREEN */}
            {activeTab === 'reminders' && (
              <MedicationScreen
                medications={medications}
                onToggleMedication={handleToggleMedication}
                onLogAsNeeded={handleLogAsNeeded}
                onAddMedication={handleAddMedication}
                onOrderRefill={handleOrderRefill}
                onRestockMedication={handleRestockMedication}
                language={patient.preferredLanguage}
                isOnline={isOnline}
                lastSyncedAt={lastSyncedAt}
              />
            )}

            {/* 3. COGNITIVE GAMES HUB */}
            {activeTab === 'games' && (
              <GamesHub
                games={games}
                onSelectGame={(game) => setSelectedGameForPlay(game)}
                language={patient.preferredLanguage}
              />
            )}

            {/* 4. MEMORIES & REMINISCENCE SCREEN */}
            {activeTab === 'memories' && (
              <MemoriesScreen
                stories={memories}
                onReliveMemory={(story) => setSelectedStoryForRelive(story)}
                onAddStory={handleAddStory}
                language={patient.preferredLanguage}
                patientName={patient.name}
              />
            )}

            {/* 5. EMERGENCY CONTACTS / HELP SCREEN */}
            {activeTab === 'help' && (
              <EmergencyScreen
                contacts={emergencyContacts}
                onTriggerSOS={handleTriggerSOS}
                onAddContact={handleAddContact}
                patientName={patient.name}
              />
            )}

            {/* 6. HEALTH RECORDS SCREEN */}
            {activeTab === 'health-records' && (
              <HealthRecordsScreen
                records={healthRecords}
                onUploadRecord={handleUploadHealthReport}
                patientName={patient.name}
              />
            )}

            {/* 7. PROFILE & SETTINGS SCREEN */}
            {activeTab === 'profile' && (
              <ProfileScreen
                patient={patient}
                currentLanguage={patient.preferredLanguage}
                onChangeLanguage={(lang) => handleUpdatePatient({ preferredLanguage: lang })}
                onNavigateToEmergency={() => setActiveTab('help')}
                onNavigateToHealthRecords={() => setActiveTab('health-records')}
                onToggleRole={() => setCurrentRole('caretaker')}
                currentRole={currentRole}
                fontSize={fontSize}
                onSetFontSize={setFontSize}
                highContrast={highContrast}
                onToggleHighContrast={() => setHighContrast(!highContrast)}
                onUpdatePatient={handleUpdatePatient}
                onOpenSignIn={() => setShowSignInModal(true)}
                onLogout={handleLogout}
                userEmail={authUser?.email}
              />
            )}
          </>
        )}
      </main>


      {/* Persistent Bottom Navigation */}
      {currentRole === 'patient' && (
        <BottomNav
          activeTab={
            activeTab === 'profile' || activeTab === 'health-records' ? 'home' : (activeTab as NavTab)
          }
          onChangeTab={(tab) => setActiveTab(tab)}
          pendingRitualsCount={pendingRitualsCount}
        />
      )}

      {/* --- MODALS & DIALOGS --- */}

      {/* Game Player Modal */}
      {selectedGameForPlay && (
        <GamePlayerModal
          game={selectedGameForPlay}
          onClose={() => setSelectedGameForPlay(null)}
          onCompleteSession={handleGameCompleted}
          language={patient.preferredLanguage}
        />
      )}

      {/* Relive Memory Modal */}
      {selectedStoryForRelive && (
        <ReliveMemoryModal
          story={selectedStoryForRelive}
          onClose={() => setSelectedStoryForRelive(null)}
          language={patient.preferredLanguage}
        />
      )}

      {/* Sathi Voice Assistant Modal */}
      {showVoiceAssistant && (
        <VoiceAssistantModal
          onClose={() => setShowVoiceAssistant(false)}
          patient={patient}
          patientName={patient.name}
          language={patient.preferredLanguage}
          onChangeLanguage={(lang) => handleUpdatePatient({ preferredLanguage: lang })}
          pendingMedications={pendingMedNames}
          pendingMeds={pendingMedNames}
          location={patient.location}
          rituals={rituals}
          medications={medications}
          games={games}
          userId={authUser?.id}
          onOpenSOS={() => {
            setShowVoiceAssistant(false);
            setShowSOSModal(true);
          }}
        />
      )}

      {/* SOS Beacon Trigger Modal */}
      {showSOSModal && (
        <SOSBeaconModal
          onClose={() => setShowSOSModal(false)}
          contacts={emergencyContacts}
          patientName={patient.name}
          location={patient.location}
        />
      )}

      {/* Sign In & Sign Up / Supabase Registration Modal */}
      {showSignInModal && (
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSignIn={(role) => {
            setCurrentRole(role);
            setShowSignInModal(false);
            setIsOnline(true);
            handleTriggerSync();
          }}
          onRegisteredPatient={(newProfile) => {
            setPatient(newProfile);
            setShowSignInModal(false);
            setIsOnline(true);
            handleTriggerSync();
          }}
        />
      )}

      {/* Doctor Appointment Booking Modal (Supabase) */}
      {showAppointmentModal && (
        <AppointmentBookingModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          patientName={patient.name}
          patientPhone={patient.primaryCaregiver?.phone || '+91 9876543210'}
          onAppointmentBooked={handleAppointmentBooked}
        />
      )}

      {/* In-Home Caregiver Booking Modal (Supabase) */}
      {showCaregiverBookingModal && (
        <CaregiverBookingModal
          isOpen={showCaregiverBookingModal}
          onClose={() => setShowCaregiverBookingModal(false)}
          patientName={patient.name}
          patientLocation={patient.location}
          patientPincode={patient.pincode}
          onBookingConfirmed={handleCaregiverBookingConfirmed}
        />
      )}

      {/* Appointments & Bookings Hub Modal (Supabase) */}
      {showAppointmentsHubModal && (
        <AppointmentsHubModal
          isOpen={showAppointmentsHubModal}
          onClose={() => setShowAppointmentsHubModal(false)}
          patientName={patient.name}
          appointments={appointments}
          bookings={caregiverBookings}
          onOpenBookDoctor={() => setShowAppointmentModal(true)}
          onOpenBookCaregiver={() => setShowCaregiverBookingModal(true)}
        />
      )}

      {/* Weather City & PIN Code Setup Modal */}
      {showPinCodeModal && (
        <PinCodeSetupModal
          currentPincode={patient.pincode || '784001'}
          currentLocation={patient.location}
          onClose={() => setShowPinCodeModal(false)}
          onSelectPinCode={(pinInfo: PinCodeInfo) => {
            handleUpdatePatient({
              location: `${pinInfo.cityName}, ${pinInfo.state}`,
              state: pinInfo.state,
              pincode: pinInfo.pincode,
            });
            setShowPinCodeModal(false);
          }}
        />
      )}
    </div>
  );
}

