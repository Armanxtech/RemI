import React, { useState } from 'react';
import { Phone, Stethoscope, Asterisk, Plus, AlertTriangle, ShieldCheck, HeartPulse, User } from 'lucide-react';
import { EmergencyContact } from '../types';
import { soundService } from '../services/soundService';

interface EmergencyScreenProps {
  contacts: EmergencyContact[];
  onTriggerSOS: () => void;
  onAddContact: (contact: Partial<EmergencyContact>) => void;
  patientName: string;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  contacts,
  onTriggerSOS,
  onAddContact,
  patientName,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [callActiveContact, setCallActiveContact] = useState<EmergencyContact | null>(null);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Family Member');
  const [newPhone, setNewPhone] = useState('');

  const handleCall = (contact: EmergencyContact) => {
    soundService.playClick();
    setCallActiveContact(contact);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    onAddContact({
      name: newName.trim(),
      role: newRole,
      relationship: 'Emergency Contact',
      phone: newPhone.trim(),
      type: 'caregiver',
    });

    soundService.playSuccess();
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
  };

  return (
    <div id="emergency-screen" className="space-y-6 pb-24">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Emergency Contacts
        </h2>
        <p className="text-sm text-purple-200/80 leading-relaxed">
          Tap a card to call immediately.
        </p>
      </div>

      {/* Big 1-Tap SOS Beacon Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-rose-900/60 to-red-950/80 border border-red-700/50 shadow-2xl shadow-red-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-3 rounded-2xl bg-red-600/30 text-red-300 border border-red-500/40">
            <HeartPulse className="w-8 h-8 animate-pulse text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              One-Touch Emergency SOS
            </h3>
            <p className="text-xs text-red-200/80">
              Immediately alerts family & sends your GPS location.
            </p>
          </div>
        </div>

        <button
          id="instant-sos-beacon-btn"
          onClick={() => {
            soundService.playSOSBeep();
            onTriggerSOS();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Asterisk className="w-5 h-5 stroke-[3]" />
          <span>Broadcast SOS Alert</span>
        </button>
      </div>

      {/* Contacts Cards (Exact visual styling as Emergency Contacts.png) */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            id={`contact-card-${contact.id}`}
            className={`rounded-3xl p-5 border transition-all ${
              contact.isUrgent
                ? 'bg-[#1D1218] border-red-900/50 hover:border-red-600/60'
                : 'bg-[#1C172E] border-purple-900/40 hover:border-purple-600/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                {/* Avatar / Icon */}
                {contact.avatarUrl ? (
                  <img
                    src={contact.avatarUrl}
                    alt={contact.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border ${
                      contact.isUrgent
                        ? 'bg-red-600/20 text-red-400 border-red-500/40'
                        : 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                    }`}
                  >
                    {contact.type === 'doctor' ? (
                      <Stethoscope className="w-7 h-7" />
                    ) : contact.isUrgent ? (
                      <Asterisk className="w-8 h-8 stroke-[2.8]" />
                    ) : (
                      <User className="w-7 h-7" />
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {contact.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#282142] text-purple-200 text-xs font-semibold">
                      {contact.role}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      • {contact.relationship}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-300 mb-3">
                {contact.phone}
              </p>

              {/* Call Now Button */}
              <button
                id={`call-contact-${contact.id}-btn`}
                onClick={() => handleCall(contact)}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] ${
                  contact.isUrgent
                    ? 'bg-gradient-to-r from-rose-400 to-red-400 text-black font-extrabold hover:bg-rose-300 shadow-red-950/40'
                    : 'bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-300 hover:to-indigo-400 text-black font-extrabold shadow-purple-950/40'
                }`}
              >
                {contact.isUrgent ? (
                  <>
                    <Asterisk className="w-5 h-5 stroke-[3]" />
                    <span>Call Ambulance</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 fill-current" />
                    <span>Call Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Dotted Add New Contact Card */}
        <button
          id="open-add-contact-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="w-full p-6 rounded-3xl border-2 border-dashed border-purple-800/60 hover:border-purple-500 bg-transparent flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-white transition-all group active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-full bg-purple-950/60 group-hover:bg-purple-900 text-purple-300 flex items-center justify-center transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold">Add New Contact</span>
        </button>
      </div>

      {/* CALLING SIMULATION MODAL */}
      {callActiveContact && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181427] border border-purple-700/50 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center animate-pulse">
              <Phone className="w-8 h-8 text-white fill-white" />
            </div>

            <div>
              <p className="text-xs text-purple-300 uppercase tracking-widest font-semibold">Calling...</p>
              <h3 className="text-2xl font-bold text-white mt-1">{callActiveContact.name}</h3>
              <p className="text-sm text-slate-300 mt-0.5">{callActiveContact.phone}</p>
            </div>

            <p className="text-xs text-purple-200/80 bg-purple-950/50 p-3 rounded-xl">
              Connecting voice line. In an actual situation, your telephone dialer connects directly.
            </p>

            <button
              onClick={() => setCallActiveContact(null)}
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-950/50"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* ADD CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181427] border border-purple-800/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Emergency Contact</h3>

            <form onSubmit={handleSaveContact} className="space-y-3">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Neighbor, Dr. Roy, Son"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Role / Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Secondary Caregiver, Doctor"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#282142] text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
