import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Building2,
  Stethoscope,
  Video,
  Home,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { MedicalAppointment } from '../types';
import { saveAppointmentToSupabase } from '../services/supabaseService';
import { soundService } from '../services/soundService';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientPhone?: string;
  onAppointmentBooked: (appointment: MedicalAppointment) => void;
}

const DOCTOR_PRESETS = [
  {
    name: 'Dr. B. K. Sharma, MD (AIIMS)',
    specialty: 'Cognitive Neurologist & Dementia Care',
    hospital: 'Tezpur Medical College & Hospital (TMCH)',
    fee: '₹600',
    availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM'],
  },
  {
    name: 'Dr. Ananya Barua, DNB (Neuro)',
    specialty: 'Geriatric Cognitive Specialist',
    hospital: 'Tezpur Baptist Hospital / Memory Clinic',
    fee: '₹700',
    availableSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
  },
  {
    name: 'Dr. R. K. Singha, MD',
    specialty: 'Neuro-Psychiatrist & Memory Assessment',
    hospital: 'Gauhati Medical College & Hospital (GMCH)',
    fee: '₹800',
    availableSlots: ['09:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'],
  },
  {
    name: 'Dr. P. Hazarika, MBBS, MD',
    specialty: 'General Physician & Elder Care',
    hospital: 'Apollo Clinic Tezpur (Mission Chariali)',
    fee: '₹500',
    availableSlots: ['08:30 AM', '10:30 AM', '01:30 PM', '06:00 PM'],
  },
  {
    name: 'NIMHANS Tele-Neurology Panel',
    specialty: 'Virtual Cognitive Consultation',
    hospital: 'National Tele-Consultation Portal',
    fee: '₹400',
    availableSlots: ['11:00 AM', '02:00 PM', '04:00 PM', '07:00 PM'],
  },
];

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientPhone = '+91 9876543210',
  onAppointmentBooked,
}) => {
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(0);
  const [consultationType, setConsultationType] = useState<
    'hospital_visit' | 'video_teleconsult' | 'home_visit'
  >('hospital_visit');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [symptoms, setSymptoms] = useState('Routine cognitive follow-up & memory assessment');
  const [phone, setPhone] = useState(patientPhone);
  const [email, setEmail] = useState('family.care@remi.in');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<MedicalAppointment | null>(null);

  if (!isOpen) return null;

  const currentDoctor = DOCTOR_PRESETS[selectedDoctorIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const appointmentPayload: Partial<MedicalAppointment> = {
      patientName: patientName || 'Arpan Das',
      doctorName: currentDoctor.name,
      specialty: currentDoctor.specialty,
      hospital: currentDoctor.hospital,
      dateTime: `${date} at ${timeSlot}`,
      timeSlot,
      consultationType,
      symptoms: symptoms.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim() || `Consultation type: ${consultationType}. Fee: ${currentDoctor.fee}`,
      status: 'confirmed',
    };

    try {
      const res = await saveAppointmentToSupabase(appointmentPayload);
      soundService.playSuccess();
      const bookedData: MedicalAppointment = (res.data as MedicalAppointment) || {
        id: `apt_${Date.now()}`,
        patientName: appointmentPayload.patientName!,
        doctorName: appointmentPayload.doctorName!,
        specialty: appointmentPayload.specialty!,
        hospital: appointmentPayload.hospital!,
        dateTime: appointmentPayload.dateTime!,
        timeSlot: appointmentPayload.timeSlot,
        consultationType: appointmentPayload.consultationType,
        symptoms: appointmentPayload.symptoms,
        phone: appointmentPayload.phone,
        status: 'confirmed',
        notes: appointmentPayload.notes,
        createdAt: new Date().toISOString(),
      };

      setSuccessResult(bookedData);
      onAppointmentBooked(bookedData);
    } catch (err) {
      console.error('Error saving appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setSuccessResult(null);
    onClose();
  };

  return (
    <div
      id="appointment-booking-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="appointment-booking-container"
        className="bg-[#181427] border border-purple-800/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Book Medical Appointment</span>
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-purple-300/80">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Live Sync (Project: kbggcjvqiepvbtlewwgf)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#221B3A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {successResult ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Appointment Confirmed!</h4>
              <p className="text-xs text-purple-200 mt-1">
                Saved into Supabase backend table <code className="bg-purple-950 px-1.5 py-0.5 rounded text-emerald-300">appointments</code>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/60 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Booking ID:</span>
                <span className="font-mono font-bold text-amber-300">{successResult.id}</span>
              </div>
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Patient:</span>
                <span className="font-bold text-white">{successResult.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Doctor:</span>
                <span className="font-bold text-purple-200">{successResult.doctorName}</span>
              </div>
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Hospital/Clinic:</span>
                <span className="font-bold text-slate-200">{successResult.hospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Date & Slot:</span>
                <span className="font-bold text-emerald-400">{successResult.dateTime}</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-sm text-white shadow-xl shadow-purple-900/40 active:scale-95 transition-all"
            >
              Done & View In Care Plan
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 pt-3">
            {/* Doctor Selection */}
            <div>
              <label className="text-xs text-purple-300 font-semibold block mb-1.5">
                Select Specialist / Doctor (North East Region)
              </label>
              <div className="space-y-2">
                {DOCTOR_PRESETS.map((doc, idx) => {
                  const isSelected = selectedDoctorIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        soundService.playClick();
                        setSelectedDoctorIndex(idx);
                        setTimeSlot(doc.availableSlots[0]);
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-400/40'
                          : 'bg-[#141022] border-purple-900/40 hover:border-purple-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{doc.name}</h4>
                          <p className="text-[11px] text-purple-300">{doc.specialty}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{doc.hospital}</p>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-900 text-amber-300 font-bold border border-purple-700/40">
                          {doc.fee}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="text-xs text-purple-300 font-semibold block mb-1.5">
                Consultation Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hospital_visit', label: 'Hospital Visit', icon: Building2 },
                  { id: 'video_teleconsult', label: 'Video Call', icon: Video },
                  { id: 'home_visit', label: 'Home Visit', icon: Home },
                ].map((type) => {
                  const isTypeSelected = consultationType === type.id;
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setConsultationType(type.id as any);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        isTypeSelected
                          ? 'bg-purple-600 text-white border-purple-300 shadow-md'
                          : 'bg-[#141022] border-purple-900/50 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none focus:border-purple-400"
                    required
                  />
                  <Calendar className="w-4 h-4 text-purple-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  {currentDoctor.availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141022] border border-purple-900/60 text-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Symptoms & Concerns */}
            <div>
              <label className="text-xs text-purple-300 font-semibold block mb-1">
                Reason / Clinical Symptoms
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Memory recall difficulties, prescription renewal, sleep issues"
                className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-xs sm:text-sm text-white shadow-xl shadow-purple-900/50 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Supabase Backend...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-emerald-300" />
                    <span>Confirm & Save to Supabase</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
