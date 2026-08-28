import React, { useState } from 'react';
import {
  Pill,
  Sun,
  Moon,
  Plus,
  CheckCircle2,
  Circle,
  Cloud,
  Volume2,
  Clock,
  Calendar,
  Check,
  AlertTriangle,
  Package,
  ShoppingBag,
  RotateCw,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { MedicationItem, LanguageCode } from '../types';
import { soundService } from '../services/soundService';

interface MedicationScreenProps {
  medications: MedicationItem[];
  onToggleMedication: (id: string) => void;
  onLogAsNeeded: (med: MedicationItem) => void;
  onAddMedication: (med: Partial<MedicationItem>) => void;
  onOrderRefill?: (medId: string) => void;
  onRestockMedication?: (medId: string, count: number) => void;
  language: LanguageCode;
  isOnline: boolean;
  lastSyncedAt: string;
}

export const MedicationScreen: React.FC<MedicationScreenProps> = ({
  medications,
  onToggleMedication,
  onLogAsNeeded,
  onAddMedication,
  onOrderRefill,
  onRestockMedication,
  language,
  isOnline,
  lastSyncedAt,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedForRefill, setSelectedMedForRefill] = useState<MedicationItem | null>(null);
  const [restockModalMed, setRestockModalMed] = useState<MedicationItem | null>(null);
  const [restockAmount, setRestockAmount] = useState(30);

  // Form State for adding a dose
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTiming, setNewMedTiming] = useState<'morning' | 'afternoon' | 'evening' | 'as_needed'>('morning');
  const [newMedTimeStr, setNewMedTimeStr] = useState('8:00 AM');
  const [newMedInstructions, setNewMedInstructions] = useState('');
  const [newMedStock, setNewMedStock] = useState('30');
  const [newMedThreshold, setNewMedThreshold] = useState('5');
  const [newMedPharmacy, setNewMedPharmacy] = useState('Apollo Pharmacy Tezpur');
  const [newMedPurpose, setNewMedPurpose] = useState('');

  const morningMeds = medications.filter((m) => m.timeCategory === 'morning');
  const afternoonMeds = medications.filter((m) => m.timeCategory === 'afternoon');
  const eveningMeds = medications.filter((m) => m.timeCategory === 'evening');
  const asNeededMeds = medications.filter((m) => m.timeCategory === 'as_needed');

  const morningPending = morningMeds.filter((m) => !m.completed).length;
  const afternoonPending = afternoonMeds.filter((m) => !m.completed).length;
  const eveningPending = eveningMeds.filter((m) => !m.completed).length;

  // Calculate low stock items
  const lowStockMeds = medications.filter(
    (m) => (m.stockDoses !== undefined ? m.stockDoses : 30) <= (m.refillThreshold || 5)
  );

  const handleReadSchedule = () => {
    const pendingNames = medications
      .filter((m) => !m.completed && !m.isAsNeeded)
      .map((m) => `${m.name} ${m.dosage}`)
      .join(', ');

    const lowStockNames = lowStockMeds.map((m) => `${m.name} (${m.stockDoses} doses left)`).join(', ');

    let speech = '';
    if (language === 'as') {
      speech = pendingNames.length > 0
        ? `আজিৰ ঔষধসমূহ: ${pendingNames}। সময়মতে গ্ৰহণ কৰক।`
        : 'আজিৰ সকলো ঔষধ গ্ৰহণ কৰা হৈছে।';
      if (lowStockMeds.length > 0) {
        speech += ` সতৰ্কতা: ${lowStockNames} কম পৰিমাণে আছে। পুনৰ অৰ্ডাৰ কৰিব লাগিব।`;
      }
    } else if (language === 'bn') {
      speech = pendingNames.length > 0
        ? `আজকের ওষুধ: ${pendingNames}। যথাসময়ে গ্রহণ করুন।`
        : 'আজকের সব ওষুধ গ্রহণ সম্পন্ন হয়েছে।';
      if (lowStockMeds.length > 0) {
        speech += ` সতর্কবাণী: ${lowStockNames} কম অবশিষ্ট রয়েছে। রিফিল করা প্রয়োজন।`;
      }
    } else if (language === 'hi') {
      speech = pendingNames.length > 0
        ? `आज की दवाइयां: ${pendingNames}। समय पर लें।`
        : 'आज की सभी निर्धारित दवाइयां ली जा चुकी हैं।';
      if (lowStockMeds.length > 0) {
        speech += ` चेतावनी: ${lowStockNames} की मात्रा कम है। कृपया रिफिल ऑर्डर करें।`;
      }
    } else {
      speech = pendingNames.length > 0
        ? `Your scheduled medicines are: ${pendingNames}. Please take them on time.`
        : 'All scheduled medicines for today have been taken. Wonderful!';
      if (lowStockMeds.length > 0) {
        speech += ` Refill alert: ${lowStockNames} are running low on supply. Caregiver has been notified.`;
      }
    }

    soundService.speak(speech, language);
  };

  const handleSaveNewMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    onAddMedication({
      name: newMedName.trim(),
      dosage: newMedDosage.trim() || '1 Tablet',
      instructions: newMedInstructions.trim() || 'Take with warm water',
      timeCategory: newMedTiming,
      timeScheduled: newMedTimeStr,
      completed: false,
      isAsNeeded: newMedTiming === 'as_needed',
      stockDoses: parseInt(newMedStock, 10) || 30,
      totalPackSize: parseInt(newMedStock, 10) || 30,
      refillThreshold: parseInt(newMedThreshold, 10) || 5,
      refillRequested: false,
      pharmacyName: newMedPharmacy.trim() || 'Apollo Pharmacy Tezpur',
      pharmacyPhone: '+91 9854012345',
      purpose: newMedPurpose.trim() || 'Health support',
    });

    soundService.playSuccess();
    setNewMedName('');
    setNewMedDosage('');
    setNewMedInstructions('');
    setNewMedPurpose('');
    setShowAddModal(false);
  };

  const handleTriggerRefillOrder = (med: MedicationItem) => {
    soundService.playSuccess();
    if (onOrderRefill) {
      onOrderRefill(med.id);
    }
    setSelectedMedForRefill(null);
  };

  const handleOrderAllRefills = () => {
    soundService.playSuccess();
    lowStockMeds.forEach((m) => {
      if (onOrderRefill) onOrderRefill(m.id);
    });
  };

  const handleExecuteRestock = () => {
    if (!restockModalMed) return;
    if (onRestockMedication) {
      onRestockMedication(restockModalMed.id, restockAmount);
    }
    setRestockModalMed(null);
  };

  const renderStockBadge = (med: MedicationItem) => {
    const stock = med.stockDoses !== undefined ? med.stockDoses : 30;
    const threshold = med.refillThreshold || 5;
    const isLow = stock <= threshold;
    const totalPack = med.totalPackSize || 30;
    const percent = Math.min(100, Math.max(0, Math.round((stock / totalPack) * 100)));

    return (
      <div className="mt-2.5 pt-2.5 border-t border-purple-900/40">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Package className={`w-3.5 h-3.5 ${isLow ? 'text-amber-400 animate-pulse' : 'text-purple-400'}`} />
            <span className={`font-semibold ${isLow ? 'text-amber-300' : 'text-purple-200'}`}>
              Remaining: <strong className="text-white font-bold">{stock}</strong> doses
            </span>
            <span className="text-[11px] text-slate-400">({stock} days supply)</span>
          </div>

          <div className="flex items-center gap-2">
            {isLow && !med.refillRequested && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                Low Stock
              </span>
            )}
            {med.refillRequested && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Refill Requested
              </span>
            )}
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-[#0E0B17] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isLow ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Action Buttons for Refill & Restock */}
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-1">
          {isLow ? (
            <button
              id={`order-refill-btn-${med.id}`}
              onClick={() => setSelectedMedForRefill(med)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>{med.refillRequested ? 'View Refill Order Status' : 'Order Refill Now'}</span>
            </button>
          ) : (
            <div className="text-[11px] text-purple-300/70 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Supply Healthy • {med.pharmacyName || 'Apollo Pharmacy'}</span>
            </div>
          )}

          <button
            id={`restock-btn-${med.id}`}
            onClick={() => {
              soundService.playClick();
              setRestockModalMed(med);
            }}
            className="py-1 px-2.5 rounded-xl bg-[#201A38] hover:bg-[#2A234A] border border-purple-800/40 text-purple-300 hover:text-purple-100 text-[11px] font-semibold flex items-center gap-1 transition-all"
            title="Add stock from newly arrived pack"
          >
            <Plus className="w-3 h-3" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="medication-screen" className="space-y-6 pb-24">
      {/* Title & Sync Badge */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Medication & Health
        </h2>
        <p className="text-sm text-purple-200/80 leading-relaxed">
          Stay on top of your daily health routine with automated refill protection.
        </p>

        {/* Synced with Caregiver Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201A38] border border-purple-800/40 text-purple-200 text-xs font-semibold shadow-sm">
          <Cloud className="w-3.5 h-3.5 text-purple-400" />
          <span>Synced with Caregiver · {lastSyncedAt}</span>
        </div>
      </div>

      {/* REFILL ALERT BANNER (If any medicine is low) */}
      {lowStockMeds.length > 0 && (
        <div
          id="refill-alert-banner"
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#26171B] to-[#1C172E] border-2 border-amber-500/60 shadow-xl space-y-3 animate-fade-in"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-200">
                  {lowStockMeds.length === 1
                    ? '1 Medicine Needs a Refill'
                    : `${lowStockMeds.length} Medicines Need Refill`}
                </h3>
                <p className="text-xs text-amber-100/80 mt-0.5">
                  {lowStockMeds.map((m) => `${m.name} (${m.stockDoses} doses left)`).join(' • ')}
                </p>
              </div>
            </div>

            <button
              id="order-all-refills-banner-btn"
              onClick={handleOrderAllRefills}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order Refill</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-300/80 bg-black/30 p-2.5 rounded-xl border border-amber-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Caregiver Sunita Das & Apollo Pharmacy Tezpur receive automated dispatch updates.</span>
          </div>
        </div>
      )}

      {/* Voice Read Aloud & Add Medication bar */}
      <div className="flex items-center gap-3">
        <button
          id="read-aloud-meds-btn"
          onClick={handleReadSchedule}
          className="flex-1 py-2.5 px-4 rounded-2xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Volume2 className="w-4 h-4 text-purple-300" />
          <span>Listen Medicines & Refill Status</span>
        </button>

        <button
          id="open-add-med-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-semibold px-3.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dose</span>
        </button>
      </div>

      {/* Daily Routine Heading */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-amber-300 tracking-tight">
          Daily Routine & Inventory
        </h3>

        {/* MORNING SECTION */}
        {morningMeds.length > 0 && (
          <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl shadow-purple-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    Morning
                  </h4>
                  <p className="text-xs text-purple-300/80">
                    8:00 AM • After Breakfast
                  </p>
                </div>
              </div>

              {morningPending > 0 ? (
                <span className="px-3 py-1 rounded-full bg-purple-900/60 text-purple-200 text-xs font-semibold border border-purple-700/50">
                  {morningPending} Remaining
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> All Done
                </span>
              )}
            </div>

            <div className="space-y-3">
              {morningMeds.map((med) => (
                <div
                  key={med.id}
                  id={`med-item-${med.id}`}
                  className="bg-[#141022] border border-purple-900/40 rounded-2xl p-4 hover:border-purple-700/50 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 flex items-center justify-center border border-purple-800/40">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{med.name}</h5>
                          {med.purpose && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                              {med.purpose}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-300/80 mt-0.5">{med.dosage} • {med.instructions}</p>
                      </div>
                    </div>

                    <button
                      id={`toggle-med-${med.id}`}
                      onClick={() => {
                        if (!med.completed) soundService.playMedicationBell();
                        else soundService.playClick();
                        onToggleMedication(med.id);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        med.completed
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                          : 'bg-[#251E3C] border border-purple-700/50 text-purple-400 hover:border-purple-400'
                      }`}
                    >
                      {med.completed ? (
                        <Check className="w-5 h-5 stroke-[2.8]" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Stock Calculation & Refill Management */}
                  {renderStockBadge(med)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AFTERNOON SECTION */}
        {afternoonMeds.length > 0 && (
          <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl shadow-purple-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    Afternoon
                  </h4>
                  <p className="text-xs text-purple-300/80">
                    1:30 PM • After Lunch
                  </p>
                </div>
              </div>

              {afternoonPending > 0 ? (
                <span className="px-3 py-1 rounded-full bg-purple-900/60 text-purple-200 text-xs font-semibold border border-purple-700/50">
                  {afternoonPending} Remaining
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> All Done
                </span>
              )}
            </div>

            <div className="space-y-3">
              {afternoonMeds.map((med) => (
                <div
                  key={med.id}
                  id={`med-item-${med.id}`}
                  className="bg-[#141022] border border-purple-900/40 rounded-2xl p-4 hover:border-purple-700/50 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 flex items-center justify-center border border-purple-800/40">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{med.name}</h5>
                          {med.purpose && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                              {med.purpose}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-300/80 mt-0.5">{med.dosage} • {med.instructions}</p>
                      </div>
                    </div>

                    <button
                      id={`toggle-med-${med.id}`}
                      onClick={() => {
                        if (!med.completed) soundService.playMedicationBell();
                        else soundService.playClick();
                        onToggleMedication(med.id);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        med.completed
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                          : 'bg-[#251E3C] border border-purple-700/50 text-purple-400 hover:border-purple-400'
                      }`}
                    >
                      {med.completed ? (
                        <Check className="w-5 h-5 stroke-[2.8]" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {renderStockBadge(med)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENING SECTION */}
        {eveningMeds.length > 0 && (
          <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl shadow-purple-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    Evening
                  </h4>
                  <p className="text-xs text-purple-300/80">
                    8:00 PM • Before Bed
                  </p>
                </div>
              </div>

              {eveningPending > 0 ? (
                <span className="px-3 py-1 rounded-full bg-purple-900/60 text-purple-200 text-xs font-semibold border border-purple-700/50">
                  {eveningPending} Remaining
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> All Done
                </span>
              )}
            </div>

            <div className="space-y-3">
              {eveningMeds.map((med) => (
                <div
                  key={med.id}
                  id={`med-item-${med.id}`}
                  className="bg-[#141022] border border-purple-900/40 rounded-2xl p-4 hover:border-purple-700/50 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-300 flex items-center justify-center border border-purple-800/40">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{med.name}</h5>
                          {med.purpose && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                              {med.purpose}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-300/80 mt-0.5">{med.dosage} • {med.instructions}</p>
                      </div>
                    </div>

                    <button
                      id={`toggle-med-${med.id}`}
                      onClick={() => {
                        if (!med.completed) soundService.playMedicationBell();
                        else soundService.playClick();
                        onToggleMedication(med.id);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        med.completed
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                          : 'bg-[#251E3C] border border-purple-700/50 text-purple-400 hover:border-purple-400'
                      }`}
                    >
                      {med.completed ? (
                        <Check className="w-5 h-5 stroke-[2.8]" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {renderStockBadge(med)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AS NEEDED SECTION */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-amber-300 tracking-tight">
          As Needed (PRN)
        </h3>

        <div className="space-y-3">
          {asNeededMeds.map((med) => (
            <div
              key={med.id}
              id={`as-needed-item-${med.id}`}
              className="bg-[#141022] border border-purple-900/40 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/80 text-purple-300 flex items-center justify-center border border-purple-800/40">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{med.name}</h5>
                    <p className="text-xs text-purple-300/80">{med.dosage} • {med.instructions}</p>
                  </div>
                </div>

                <button
                  id={`log-as-needed-${med.id}`}
                  onClick={() => {
                    soundService.playMedicationBell();
                    onLogAsNeeded(med);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#282142] hover:bg-[#342C56] border border-purple-700/50 text-purple-200 text-xs font-bold shadow-sm active:scale-95 transition-all"
                >
                  Log Dose
                </button>
              </div>

              {renderStockBadge(med)}
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING APPOINTMENTS SECTION */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h4 className="text-base font-bold text-white">Upcoming Medical Appointment</h4>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40 space-y-1">
          <p className="text-sm font-bold text-white">Dr. B. Sharma (Neurologist)</p>
          <p className="text-xs text-purple-300/80">Thursday, 10:30 AM · Guwahati Medical Hospital</p>
          <p className="text-xs text-slate-400 mt-1">Routine 6-month dementia cognitive review.</p>
        </div>
      </div>

      {/* REFILL MODAL DIALOG */}
      {selectedMedForRefill && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181427] border border-amber-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Order Refill for {selectedMedForRefill.name}
                </h3>
                <p className="text-xs text-amber-200">
                  Current Stock: {selectedMedForRefill.stockDoses} doses left ({selectedMedForRefill.stockDoses} days supply)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/60 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-purple-300">Medicine:</span>
                <span className="font-bold text-white">{selectedMedForRefill.name} ({selectedMedForRefill.dosage})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Registered Pharmacy:</span>
                <span className="font-bold text-white">{selectedMedForRefill.pharmacyName || 'Apollo Pharmacy Tezpur'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Contact:</span>
                <span className="font-bold text-amber-300">{selectedMedForRefill.pharmacyPhone || '+91 9854012345'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Standard Pack:</span>
                <span className="font-bold text-white">1 Box (30 Tablets • 1 Month Supply)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40 text-[11px] text-purple-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Confirming this will notify caregiver Sunita Das and place a direct refill dispatch to your registered pharmacy.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedMedForRefill(null)}
                className="flex-1 py-3.5 rounded-2xl bg-[#201A38] text-slate-300 text-xs font-bold hover:bg-[#2A234A] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleTriggerRefillOrder(selectedMedForRefill)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Refill Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTOCK / INVENTORY REPLENISH MODAL */}
      {restockModalMed && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181427] border border-purple-800/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <RotateCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Add Stock to {restockModalMed.name}
                </h3>
                <p className="text-xs text-purple-300/80">
                  Current Stock: {restockModalMed.stockDoses} doses
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-purple-300">
                Select pack size received from pharmacy:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 30, 60].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setRestockAmount(count);
                    }}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                      restockAmount === count
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                        : 'bg-[#141022] border-purple-900/60 text-purple-200'
                    }`}
                  >
                    +{count} Doses
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRestockModalMed(null)}
                className="flex-1 py-3.5 rounded-2xl bg-[#201A38] text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRestock}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
              >
                Add +{restockAmount} to Inventory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEDICATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181427] border border-purple-800/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white my-auto max-h-[92vh] flex flex-col">
            <h3 className="text-lg font-bold text-white">Add Medication & Stock Routine</h3>

            <form onSubmit={handleSaveNewMed} className="space-y-3 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Donepezil, Calcium, Multivitamin"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Dosage & Strength</label>
                <input
                  type="text"
                  placeholder="e.g. 10mg • 1 Tablet"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Purpose / Treatment</label>
                <input
                  type="text"
                  placeholder="e.g. Memory & Cognitive Support, Blood Pressure"
                  value={newMedPurpose}
                  onChange={(e) => setNewMedPurpose(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-purple-300 font-semibold block mb-1">Timing Period</label>
                  <select
                    value={newMedTiming}
                    onChange={(e) => setNewMedTiming(e.target.value as any)}
                    className="w-full px-3 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="as_needed">As Needed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-purple-300 font-semibold block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={newMedTimeStr}
                    onChange={(e) => setNewMedTimeStr(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Initial Inventory & Refill Threshold Inputs */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#141022] border border-purple-900/60">
                <div>
                  <label className="text-[11px] text-purple-300 font-semibold block mb-1">
                    Initial Stock (Doses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={newMedStock}
                    onChange={(e) => setNewMedStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-purple-300 font-semibold block mb-1">
                    Low Stock Alert At
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newMedThreshold}
                    onChange={(e) => setNewMedThreshold(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Preferred Pharmacy</label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Pharmacy Tezpur"
                  value={newMedPharmacy}
                  onChange={(e) => setNewMedPharmacy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Instructions / Note</label>
                <input
                  type="text"
                  placeholder="e.g. After breakfast with warm water"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none focus:border-purple-400"
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
                  Save Dose & Track Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
