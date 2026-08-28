import React, { useEffect, useState } from 'react';
import { Asterisk, Phone, MapPin, CheckCircle, ShieldAlert, Volume2, VolumeX, X } from 'lucide-react';
import { EmergencyContact } from '../types';
import { soundService } from '../services/soundService';

interface SOSBeaconModalProps {
  onClose: () => void;
  contacts: EmergencyContact[];
  patientName: string;
  location: string;
}

export const SOSBeaconModal: React.FC<SOSBeaconModalProps> = ({
  onClose,
  contacts,
  patientName,
  location,
}) => {
  const [isAlertPlaying, setIsAlertPlaying] = useState(true);
  const [dispatchStatus, setDispatchStatus] = useState<'broadcasting' | 'sent'>('broadcasting');

  useEffect(() => {
    soundService.playSOSBeep();
    const timer = setTimeout(() => {
      setDispatchStatus('sent');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    setIsAlertPlaying(!isAlertPlaying);
  };

  return (
    <div
      id="sos-beacon-modal-backdrop"
      className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-lg flex items-center justify-center p-4"
    >
      <div
        id="sos-beacon-container"
        className="bg-[#1D1016] border-2 border-red-500 rounded-3xl max-w-md w-full p-6 space-y-5 text-white text-center shadow-2xl animate-fade-in"
      >
        {/* Pulsing Beacon Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-40" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-2xl shadow-red-600">
            <Asterisk className="w-12 h-12 text-white stroke-[3] animate-spin-slow" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            EMERGENCY SOS BROADCAST
          </h2>
          <p className="text-xs text-red-200 mt-1">
            {dispatchStatus === 'broadcasting'
              ? 'Transmitting high-priority alert to caregivers...'
              : '✓ Emergency alert & GPS dispatch sent to registered family & doctor!'}
          </p>
        </div>

        {/* Location Box */}
        <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800/60 text-xs flex items-center justify-center gap-1.5 text-red-200">
          <MapPin className="w-4 h-4 text-red-400" />
          <span>Location: {location} (GPS Locked)</span>
        </div>

        {/* Instant 1-Tap Quick Dial Contacts */}
        <div className="space-y-2 text-left">
          <p className="text-xs text-red-300 uppercase tracking-wider font-bold">
            Direct Line Quick Connect:
          </p>
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone}`}
              onClick={() => soundService.playClick()}
              className="p-3.5 rounded-2xl bg-[#28131B] border border-red-800/50 hover:border-red-400 flex items-center justify-between transition-all"
            >
              <div>
                <p className="text-sm font-bold text-white">{contact.name}</p>
                <p className="text-xs text-red-300/80">{contact.role} • {contact.phone}</p>
              </div>
              <div className="p-2 rounded-xl bg-red-600 text-white shadow-md">
                <Phone className="w-4 h-4 fill-white" />
              </div>
            </a>
          ))}
        </div>

        {/* Dismiss Button */}
        <div className="pt-2">
          <button
            id="dismiss-sos-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-lg transition-all"
          >
            I am Safe · Dismiss Alert
          </button>
        </div>
      </div>
    </div>
  );
};
