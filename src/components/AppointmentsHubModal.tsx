import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  HeartHandshake,
  Plus,
  RefreshCw,
  X,
  Building2,
  CheckCircle2,
  Database,
  Phone,
  Video,
  Home,
  Sparkles,
} from 'lucide-react';
import { MedicalAppointment, CaregiverBooking } from '../types';
import {
  fetchAppointmentsFromSupabase,
  fetchBookingsFromSupabase,
} from '../services/supabaseService';
import { soundService } from '../services/soundService';

interface AppointmentsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onOpenBookDoctor: () => void;
  onOpenBookCaregiver: () => void;
  appointments: MedicalAppointment[];
  bookings: CaregiverBooking[];
}

export const AppointmentsHubModal: React.FC<AppointmentsHubModalProps> = ({
  isOpen,
  onClose,
  patientName,
  onOpenBookDoctor,
  onOpenBookCaregiver,
  appointments: initialAppointments,
  bookings: initialBookings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'doctor' | 'caregiver'>('doctor');
  const [appointmentsList, setAppointmentsList] = useState<MedicalAppointment[]>(
    initialAppointments
  );
  const [bookingsList, setBookingsList] = useState<CaregiverBooking[]>(
    initialBookings
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleRefreshFromSupabase();
    }
  }, [isOpen]);

  const handleRefreshFromSupabase = async () => {
    setIsLoading(true);
    soundService.playClick();
    try {
      const [remoteApts, remoteBks] = await Promise.all([
        fetchAppointmentsFromSupabase(),
        fetchBookingsFromSupabase(),
      ]);

      if (remoteApts.length > 0) {
        setAppointmentsList(remoteApts);
      }
      if (remoteBks.length > 0) {
        setBookingsList(remoteBks);
      }
    } catch (e) {
      console.warn('Sync refresh warning:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="appointments-hub-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="appointments-hub-container"
        className="bg-[#181427] border border-purple-800/60 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col relative overflow-hidden"
      >
        {/* Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>Appointments & Bookings Hub</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-purple-300/80 mt-0.5">
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                <Database className="w-3 h-3" /> Supabase Connected (kbggcjvqiepvbtlewwgf)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshFromSupabase}
              disabled={isLoading}
              title="Refresh from Supabase Backend"
              className="p-2 rounded-xl text-purple-300 hover:text-white bg-[#221B3A] border border-purple-800/40 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#221B3A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="grid grid-cols-2 gap-2 pt-3">
          <button
            onClick={() => {
              soundService.playClick();
              setActiveSubTab('doctor');
            }}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSubTab === 'doctor'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-[#141022] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Appointments ({appointmentsList.length})</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setActiveSubTab('caregiver');
            }}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSubTab === 'caregiver'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-[#141022] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Caregiver Bookings ({bookingsList.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {activeSubTab === 'doctor' ? (
            <button
              onClick={() => {
                onClose();
                onOpenBookDoctor();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Doctor / Neurologist Consultation</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenBookCaregiver();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book In-Home Dementia Nurse / Caregiver</span>
            </button>
          )}
        </div>

        {/* Content Lists */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 pt-3">
          {activeSubTab === 'doctor' ? (
            appointmentsList.length === 0 ? (
              <div className="text-center py-10 space-y-2 bg-[#141022] rounded-2xl border border-purple-900/40 p-4">
                <Stethoscope className="w-8 h-8 text-purple-400/60 mx-auto" />
                <p className="text-sm font-semibold text-white">No Appointments Booked Yet</p>
                <p className="text-xs text-purple-300/70">
                  Book a consultation with Tezpur Medical College, Baptist Hospital, or GMCH.
                </p>
              </div>
            ) : (
              appointmentsList.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50 space-y-2.5 hover:border-purple-700/60 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{apt.doctorName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                          {apt.status || 'Confirmed'}
                        </span>
                      </div>
                      <p className="text-xs text-purple-300 font-semibold">{apt.specialty}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-purple-400" />
                        <span>{apt.hospital}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-300 block">{apt.dateTime}</span>
                      <span className="text-[10px] text-purple-300 font-mono">ID: {apt.id.slice(-6)}</span>
                    </div>
                  </div>

                  {apt.symptoms && (
                    <p className="text-xs text-slate-300 bg-[#1C172E] p-2 rounded-xl border border-purple-900/40">
                      <strong>Notes / Symptoms:</strong> {apt.symptoms}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-purple-300/70 pt-1 border-t border-purple-950/60">
                    <span>Patient: <strong className="text-white">{apt.patientName}</strong></span>
                    <span>Contact: {apt.phone || 'On file'}</span>
                  </div>
                </div>
              ))
            )
          ) : bookingsList.length === 0 ? (
            <div className="text-center py-10 space-y-2 bg-[#141022] rounded-2xl border border-purple-900/40 p-4">
              <HeartHandshake className="w-8 h-8 text-purple-400/60 mx-auto" />
              <p className="text-sm font-semibold text-white">No Caregiver Bookings Active</p>
              <p className="text-xs text-purple-300/70">
                Book certified in-home dementia nurses, cognitive activity companions, or physiotherapy.
              </p>
            </div>
          ) : (
            bookingsList.map((bk) => (
              <div
                key={bk.id}
                className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50 space-y-2.5 hover:border-purple-700/60 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{bk.serviceName || 'Caregiver Service'}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                        {bk.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-purple-300">
                      Duration: <strong className="text-white uppercase">{bk.duration}</strong> • {bk.startDate}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5">{bk.address} ({bk.pincode})</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-300 block">{bk.costEstimate || '₹650/shift'}</span>
                    <span className="text-[10px] text-purple-300 font-mono">ID: {bk.id.slice(-6)}</span>
                  </div>
                </div>

                {bk.specialNeeds && (
                  <p className="text-xs text-slate-300 bg-[#1C172E] p-2 rounded-xl border border-purple-900/40">
                    <strong>Special Instructions:</strong> {bk.specialNeeds}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-purple-300/70 pt-1 border-t border-purple-950/60">
                  <span>Contact: <strong className="text-white">{bk.contactName}</strong></span>
                  <span className="font-mono">{bk.contactPhone}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-purple-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#201A38] text-slate-300 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
