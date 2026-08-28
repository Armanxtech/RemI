export type LanguageCode = 'en' | 'as' | 'bn' | 'hi' | 'mni';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  locale: string;
}

export type UserRole = 'patient' | 'caretaker';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  email?: string;
  location: string;
  state: string;
  pincode?: string;
  bloodGroup: string;
  notes?: string;
  primaryCaregiver: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredLanguage: LanguageCode;
  fontSize: 'normal' | 'large' | 'xlarge';
  soundEnabled: boolean;
  highContrast: boolean;
  avatarUrl: string;
}

export interface DailyRitual {
  id: string;
  title: string;
  subtitle: string;
  timeStr: string;
  type: 'medication' | 'hydration' | 'game' | 'walk' | 'meal';
  completed: boolean;
  completedAt?: string;
  iconType: 'meds' | 'water' | 'brain' | 'sun' | 'moon' | 'walk';
  requiredCount?: number;
  currentCount?: number;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  timeCategory: 'morning' | 'afternoon' | 'evening' | 'as_needed';
  timeScheduled: string;
  completed: boolean;
  completedAt?: string;
  purpose?: string;
  isAsNeeded?: boolean;
  stockDoses?: number;
  totalPackSize?: number;
  refillThreshold?: number;
  refillRequested?: boolean;
  refillRequestedAt?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
}

export interface MedicalAppointment {
  id: string;
  patientId?: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  dateTime: string;
  timeSlot?: string;
  consultationType?: 'hospital_visit' | 'video_teleconsult' | 'home_visit';
  symptoms?: string;
  phone?: string;
  email?: string;
  status?: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
}

export interface CaregiverBooking {
  id: string;
  patientId?: string;
  patientName: string;
  serviceType: 'elder_care' | 'dementia_nurse' | 'cognitive_companion' | 'physiotherapy' | 'med_delivery';
  serviceName?: string;
  duration: 'hourly' | 'shift_8h' | 'shift_12h' | 'full_day_24h' | 'weekly';
  startDate: string;
  preferredTimeSlot?: string;
  address: string;
  pincode?: string;
  contactName: string;
  contactPhone: string;
  specialNeeds?: string;
  status?: 'confirmed' | 'pending' | 'active' | 'completed' | 'cancelled';
  costEstimate?: string;
  createdAt?: string;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  age: number;
  gender: string;
  location: string;
  state: string;
  pincode: string;
  bloodGroup: string;
  primaryCaregiverName: string;
  primaryCaregiverPhone: string;
  primaryCaregiverRelationship: string;
  preferredLanguage: LanguageCode;
  medicalConditions?: string;
}


export interface CognitiveGame {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'memory' | 'logic' | 'focus' | 'cultural';
  isFeatured?: boolean;
  badge?: string;
  imageUrl: string;
  difficulty: 'Gentle' | 'Normal' | 'Challenging';
  playedCount: number;
  bestScore: number;
  lastPlayed?: string;
  isPremium?: boolean;
}

export interface MemoryStory {
  id: string;
  title: string;
  tag: string;
  year: string;
  imageUrl: string;
  description: string;
  culturalTheme: string;
  location: string;
  audioDuration: string;
  recordedBy: string;
  hasVoiceNote: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  relationship: string;
  phone: string;
  avatarUrl?: string;
  isUrgent?: boolean;
  type: 'caregiver' | 'doctor' | 'ambulance' | 'other';
}

export interface LabReport {
  id: string;
  title: string;
  date: string;
  type: 'blood' | 'mri' | 'mmse' | 'ecg';
  doctor: string;
  summary: string;
  fileSize: string;
  details?: string;
}

export interface HealthRecord {
  conditions: Array<{ name: string; info: string; diagnosedYear: string }>;
  allergies: Array<{ name: string; severity: 'mild' | 'moderate' | 'severe' }>;
  reports: LabReport[];
  vaccinations: Array<{ name: string; date: string; isCompleted: boolean }>;
}

export interface CaregiverAlert {
  id: string;
  type:
    | 'sos'
    | 'missed_med'
    | 'low_activity'
    | 'cognitive_drop'
    | 'sync_update'
    | 'medication'
    | 'game'
    | 'routine'
    | 'appointment'
    | 'booking';
  title?: string;
  description?: string;
  message?: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low' | 'urgent' | 'warning' | 'info';
  resolved?: boolean;
  acknowledged?: boolean;
}

export interface CognitiveProgressLog {
  date: string;
  mmseScore: number;
  memoryScore: number;
  attentionScore: number;
  logicScore: number;
  dailyRitualPercent: number;
  gamesPlayed: number;
  reactionTimeMs: number;
}
