import React, { useState } from 'react';
import {
  User,
  Phone,
  Calendar,
  Heart,
  MapPin,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { PatientProfile, LanguageCode } from '../types';
import { soundService } from '../services/soundService';
import { saveSignUpToSupabase } from '../services/supabaseService';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  onSavePatient: (updated: PatientProfile) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSavePatient,
}) => {
  const [formData, setFormData] = useState({
    name: patient.name || '',
    age: patient.age || 70,
    phone: patient.phone || patient.primaryCaregiver?.phone || '+91 9876543210',
    email: patient.email || '',
    gender: patient.gender || 'Male',
    bloodGroup: patient.bloodGroup || 'O+',
    location: patient.location || 'Tezpur, Assam',
    state: patient.state || 'Assam',
    pincode: patient.pincode || '784001',
    primaryCaregiverName: patient.primaryCaregiver?.name || 'Sunita Das',
    primaryCaregiverPhone: patient.primaryCaregiver?.phone || '+91 9876543210',
    primaryCaregiverRelationship: patient.primaryCaregiver?.relationship || 'Daughter',
    notes: patient.notes || 'Mild Cognitive Impairment, memory assistance',
    preferredLanguage: patient.preferredLanguage || 'as',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSaving(true);
    soundService.playSuccess();

    const updatedProfile: PatientProfile = {
      ...patient,
      name: formData.name.trim(),
      age: Number(formData.age) || 70,
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      location: formData.location.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      bloodGroup: formData.bloodGroup.trim(),
      notes: formData.notes.trim(),
      primaryCaregiver: {
        name: formData.primaryCaregiverName.trim() || 'Caregiver',
        relationship: formData.primaryCaregiverRelationship.trim() || 'Family',
        phone: formData.primaryCaregiverPhone.trim() || formData.phone.trim(),
      },
      preferredLanguage: formData.preferredLanguage as LanguageCode,
    };

    // Save to Supabase
    try {
      await saveSignUpToSupabase({
        fullName: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone || updatedProfile.primaryCaregiver.phone,
        role: 'patient',
        age: updatedProfile.age,
        gender: updatedProfile.gender,
        location: updatedProfile.location,
        state: updatedProfile.state,
        pincode: updatedProfile.pincode,
        bloodGroup: updatedProfile.bloodGroup,
        primaryCaregiverName: updatedProfile.primaryCaregiver.name,
        primaryCaregiverPhone: updatedProfile.primaryCaregiver.phone,
        primaryCaregiverRelationship: updatedProfile.primaryCaregiver.relationship,
        preferredLanguage: updatedProfile.preferredLanguage,
        medicalConditions: updatedProfile.notes,
      });
    } catch (e) {
      console.warn('Supabase profile sync note:', e);
    }

    onSavePatient(updatedProfile);
    setSaveSuccess(true);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      id="edit-patient-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="edit-patient-modal-container"
        className="bg-[#181427] border border-purple-800/60 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col relative overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-950/60 pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/50">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Edit Patient Profile</h2>
              <p className="text-xs text-purple-300/80">Customize personal details for any patient or user</p>
            </div>
          </div>

          <button
            id="close-edit-patient-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#221B3A] hover:bg-[#2F2550] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Section: Basic Identity */}
          <div className="bg-[#130F20] p-4 rounded-2xl border border-purple-900/50 space-y-3.5">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Patient Core Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Patient Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="edit-patient-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Arpan Das / Devi Baruah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white placeholder:text-purple-400/40 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Age (Years) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="edit-patient-age"
                  type="number"
                  required
                  min={18}
                  max={120}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">Gender</label>
                <select
                  id="edit-patient-gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  id="edit-patient-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">Blood Group</label>
                <select
                  id="edit-patient-bloodgroup"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="O+">O positive (O+)</option>
                  <option value="O-">O negative (O-)</option>
                  <option value="A+">A positive (A+)</option>
                  <option value="A-">A negative (A-)</option>
                  <option value="B+">B positive (B+)</option>
                  <option value="B-">B negative (B-)</option>
                  <option value="AB+">AB positive (AB+)</option>
                  <option value="AB-">AB negative (AB-)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Location & Region */}
          <div className="bg-[#130F20] p-4 rounded-2xl border border-purple-900/50 space-y-3.5">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Location & Postal PIN Code</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">City / Town, State</label>
                <input
                  id="edit-patient-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Tezpur, Assam / Guwahati / Shillong"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">PIN Code</label>
                <input
                  id="edit-patient-pincode"
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="784001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm font-mono focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Emergency & Primary Caregiver */}
          <div className="bg-[#130F20] p-4 rounded-2xl border border-purple-900/50 space-y-3.5">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Primary Family Caregiver / Emergency Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">Caregiver Name</label>
                <input
                  id="edit-caregiver-name"
                  type="text"
                  value={formData.primaryCaregiverName}
                  onChange={(e) => setFormData({ ...formData, primaryCaregiverName: e.target.value })}
                  placeholder="Sunita Das"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">Relationship</label>
                <input
                  id="edit-caregiver-rel"
                  type="text"
                  value={formData.primaryCaregiverRelationship}
                  onChange={(e) => setFormData({ ...formData, primaryCaregiverRelationship: e.target.value })}
                  placeholder="Daughter / Son / Spouse"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">Caregiver Phone</label>
                <input
                  id="edit-caregiver-phone"
                  type="tel"
                  value={formData.primaryCaregiverPhone}
                  onChange={(e) => setFormData({ ...formData, primaryCaregiverPhone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Medical Notes / Conditions */}
          <div className="bg-[#130F20] p-4 rounded-2xl border border-purple-900/50 space-y-2">
            <label className="block text-xs font-semibold text-purple-200">
              Medical Conditions / Caregiver Notes
            </label>
            <textarea
              id="edit-patient-notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Mild Cognitive Impairment, needs gentle morning walking reminder"
              className="w-full px-3.5 py-2 rounded-xl bg-[#201A38] border border-purple-700/60 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-purple-950/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#221B3A] hover:bg-[#2E244E] text-slate-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>

            <button
              id="save-patient-profile-btn"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                  <span>Profile Saved!</span>
                </>
              ) : isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
