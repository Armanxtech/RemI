import React, { useState } from 'react';
import {
  HeartHandshake,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  X,
  ShieldCheck,
  Database,
  Sparkles,
  Award,
} from 'lucide-react';
import { CaregiverBooking } from '../types';
import { saveBookingToSupabase } from '../services/supabaseService';
import { soundService } from '../services/soundService';

interface CaregiverBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientLocation: string;
  patientPincode?: string;
  onBookingConfirmed: (booking: CaregiverBooking) => void;
}

const SERVICE_OPTIONS = [
  {
    type: 'elder_care' as const,
    title: 'Dementia & Elder Support Caregiver',
    rate: '₹650 / 8-hr Shift',
    desc: 'Daily living assistance, routine reminders, gentle walks, and cognitive engagement.',
  },
  {
    type: 'dementia_nurse' as const,
    title: 'Certified Geriatric / Dementia Nurse',
    rate: '₹950 / 8-hr Shift',
    desc: 'Vital signs monitoring, medication administration, MMSE checks, and catheter/bed care.',
  },
  {
    type: 'cognitive_companion' as const,
    title: 'Regional Cognitive Companion (RemI)',
    rate: '₹400 / 4-hr Session',
    desc: 'Bilingual memory games, Assamese/Bengali reminiscence sessions, and photo album reliving.',
  },
  {
    type: 'physiotherapy' as const,
    title: 'Senior Neuro-Physiotherapist Visit',
    rate: '₹750 / Home Visit',
    desc: 'Gentle mobility drills, balance rehabilitation to prevent falls, and motor coordination.',
  },
  {
    type: 'med_delivery' as const,
    title: 'Urgent Medicine & Refill Delivery',
    rate: '₹150 / Delivery',
    desc: 'Direct pickup from Apollo / Tezpur Pharmacy with pharmacist dose verification.',
  },
];

export const CaregiverBookingModal: React.FC<CaregiverBookingModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientLocation,
  patientPincode = '784001',
  onBookingConfirmed,
}) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [duration, setDuration] = useState<
    'hourly' | 'shift_8h' | 'shift_12h' | 'full_day_24h' | 'weekly'
  >('shift_8h');
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (08:00 AM - 04:00 PM)');
  const [address, setAddress] = useState(
    `Tribeni Complex, Near Tezpur Park, ${patientLocation}`
  );
  const [pincode, setPincode] = useState(patientPincode);
  const [contactName, setContactName] = useState('Sunita Das (Daughter)');
  const [contactPhone, setContactPhone] = useState('+91 9876543210');
  const [specialNeeds, setSpecialNeeds] = useState(
    'Speaks Assamese, needs gentle supervision during meal and evening walks.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<CaregiverBooking | null>(null);

  if (!isOpen) return null;

  const currentService = SERVICE_OPTIONS[selectedServiceIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload: Partial<CaregiverBooking> = {
      patientName: patientName || 'Arpan Das',
      serviceType: currentService.type,
      serviceName: currentService.title,
      duration,
      startDate,
      preferredTimeSlot: timeSlot,
      address: address.trim(),
      pincode: pincode.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      specialNeeds: specialNeeds.trim(),
      costEstimate: currentService.rate,
      status: 'confirmed',
    };

    try {
      const res = await saveBookingToSupabase(bookingPayload);
      soundService.playSuccess();
      const bookedData: CaregiverBooking = (res.data as CaregiverBooking) || {
        id: `bk_${Date.now()}`,
        patientName: bookingPayload.patientName!,
        serviceType: bookingPayload.serviceType!,
        serviceName: bookingPayload.serviceName,
        duration: bookingPayload.duration!,
        startDate: bookingPayload.startDate!,
        preferredTimeSlot: bookingPayload.preferredTimeSlot,
        address: bookingPayload.address!,
        pincode: bookingPayload.pincode,
        contactName: bookingPayload.contactName!,
        contactPhone: bookingPayload.contactPhone!,
        specialNeeds: bookingPayload.specialNeeds,
        costEstimate: bookingPayload.costEstimate,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setSuccessBooking(bookedData);
      onBookingConfirmed(bookedData);
    } catch (err) {
      console.error('Error saving care booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setSuccessBooking(null);
    onClose();
  };

  return (
    <div
      id="caregiver-booking-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="caregiver-booking-container"
        className="bg-[#181427] border border-purple-800/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Book Caregiver / Home Visit</span>
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-purple-300/80">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Live Sync (Table: bookings)</span>
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
        {successBooking ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Caregiver Booking Registered!</h4>
              <p className="text-xs text-purple-200 mt-1">
                Saved into Supabase backend table <code className="bg-purple-950 px-1.5 py-0.5 rounded text-emerald-300">bookings</code>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/60 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Booking Reference:</span>
                <span className="font-mono font-bold text-amber-300">{successBooking.id}</span>
              </div>
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Service:</span>
                <span className="font-bold text-white">{successBooking.serviceName}</span>
              </div>
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Patient:</span>
                <span className="font-bold text-purple-200">{successBooking.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-purple-950 pb-1.5">
                <span className="text-purple-300">Start Date & Shift:</span>
                <span className="font-bold text-emerald-400">{successBooking.startDate} ({successBooking.preferredTimeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Address & Contact:</span>
                <span className="text-slate-300 font-semibold">{successBooking.contactPhone}</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-sm text-white shadow-xl shadow-purple-900/40 active:scale-95 transition-all"
            >
              Done & Return to App
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 pt-3">
            {/* Service Selection */}
            <div>
              <label className="text-xs text-purple-300 font-semibold block mb-1.5">
                Select Care Service
              </label>
              <div className="space-y-2">
                {SERVICE_OPTIONS.map((svc, idx) => {
                  const isSelected = selectedServiceIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        soundService.playClick();
                        setSelectedServiceIndex(idx);
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-400/40'
                          : 'bg-[#141022] border-purple-900/40 hover:border-purple-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="pr-2">
                          <h4 className="text-xs font-bold text-white">{svc.title}</h4>
                          <p className="text-[11px] text-slate-300 mt-0.5">{svc.desc}</p>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-900 text-amber-300 font-bold shrink-0 border border-purple-700/40">
                          {svc.rate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Duration Type */}
            <div>
              <label className="text-xs text-purple-300 font-semibold block mb-1.5">
                Care Schedule & Shift Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'hourly', label: 'Hourly (3-4h)' },
                  { id: 'shift_8h', label: '8h Day Shift' },
                  { id: 'shift_12h', label: '12h Night' },
                  { id: 'full_day_24h', label: '24/7 Live-In' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setDuration(dur.id as any);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                      duration === dur.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-[#141022] border border-purple-900/50 text-slate-300'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                    required
                  />
                  <Calendar className="w-4 h-4 text-purple-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Preferred Time Window
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                >
                  <option value="Morning (08:00 AM - 04:00 PM)">Morning (08:00 AM - 04:00 PM)</option>
                  <option value="Evening (04:00 PM - 10:00 PM)">Evening (04:00 PM - 10:00 PM)</option>
                  <option value="Night Stay (08:00 PM - 08:00 AM)">Night Stay (08:00 PM - 08:00 AM)</option>
                  <option value="Flexible / Full Day">Flexible / Full Day</option>
                </select>
              </div>
            </div>

            {/* Address & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Home Visit Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs font-mono focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Family Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Family Point of Contact
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs text-purple-300 font-semibold block mb-1">
                Language & Care Preferences
              </label>
              <textarea
                rows={2}
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                placeholder="e.g. Needs Assamese-speaking nurse, support with walking in garden"
                className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none resize-none"
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
                    <span>Registering with Supabase...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-emerald-300" />
                    <span>Confirm Booking & Save to Supabase</span>
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
