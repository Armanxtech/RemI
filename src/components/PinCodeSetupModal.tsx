import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Check,
  X,
  Compass,
  Sparkles,
  CloudSun,
  AlertCircle,
  Building2,
  Navigation
} from 'lucide-react';
import { soundService } from '../services/soundService';
import {
  PIN_CODE_DIRECTORY,
  POPULAR_PIN_CODES,
  lookupPinCode,
  PinCodeInfo
} from '../data/weatherData';

interface PinCodeSetupModalProps {
  currentPincode?: string;
  currentLocation: string;
  onClose: () => void;
  onSelectPinCode: (pinInfo: PinCodeInfo) => void;
}

export const PinCodeSetupModal: React.FC<PinCodeSetupModalProps> = ({
  currentPincode = '784001',
  currentLocation,
  onClose,
  onSelectPinCode,
}) => {
  const [pinInput, setPinInput] = useState(currentPincode);
  const [resolvedInfo, setResolvedInfo] = useState<PinCodeInfo | null>(
    lookupPinCode(currentPincode) || PIN_CODE_DIRECTORY['784001']
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-resolve as user types 6 digits
  useEffect(() => {
    const cleaned = pinInput.replace(/\D/g, '').slice(0, 6);
    if (cleaned.length === 6) {
      const result = lookupPinCode(cleaned);
      if (result) {
        setResolvedInfo(result);
        setErrorMsg(null);
      } else {
        setErrorMsg('Could not find region for this PIN code. Please verify the 6-digit code.');
      }
    } else if (cleaned.length > 0 && cleaned.length < 6) {
      setErrorMsg(`Enter 6 digits (${cleaned.length}/6 entered)`);
    } else {
      setErrorMsg(null);
    }
  }, [pinInput]);

  const handleApply = (info: PinCodeInfo) => {
    soundService.playSuccess();
    soundService.speak(
      `Weather location updated to ${info.cityName}, ${info.state}. Current temperature is ${info.temperature}.`,
      'en'
    );
    onSelectPinCode(info);
    onClose();
  };

  const handleSelectQuickPin = (pin: string) => {
    soundService.playClick();
    setPinInput(pin);
    const res = lookupPinCode(pin);
    if (res) {
      setResolvedInfo(res);
      setErrorMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div
        id="pincode-setup-modal"
        className="bg-[#171326] border border-purple-800/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-white my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Weather City & PIN Code Setup
              </h3>
              <p className="text-xs text-purple-300/80">
                Enter your 6-digit Indian Postal PIN Code to set live weather
              </p>
            </div>
          </div>

          <button
            id="close-pincode-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#221B3A] transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Main PIN Code Input Form */}
          <div className="p-4 rounded-2xl bg-[#1F1935] border border-purple-700/50 space-y-3">
            <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
              <span>Enter 6-Digit Indian PIN Code</span>
              <span className="text-[11px] text-purple-300/80 font-normal">
                e.g. 784001 (Tezpur), 781001 (Guwahati)
              </span>
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  id="pincode-input-field"
                  placeholder="e.g. 784001"
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPinInput(val);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#120D22] border-2 border-purple-600/70 text-white text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                />
                <MapPin className="w-5 h-5 text-amber-400 absolute left-3 top-3.5" />
              </div>

              <button
                type="button"
                id="apply-pincode-btn"
                disabled={!resolvedInfo || pinInput.length !== 6}
                onClick={() => {
                  if (resolvedInfo) handleApply(resolvedInfo);
                }}
                className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  resolvedInfo && pinInput.length === 6
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold shadow-amber-900/40'
                    : 'bg-[#2A2244] text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Set City</span>
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Resolved Location & Live Weather Preview */}
          {resolvedInfo && (
            <div
              id="resolved-location-preview-card"
              className="p-4 rounded-2xl bg-gradient-to-br from-[#241B42] to-[#161228] border border-purple-500/40 shadow-lg space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ✓ PIN Code Verified
                    </span>
                    <span className="font-mono text-xs text-amber-300 font-bold">
                      [{resolvedInfo.pincode}]
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mt-1">
                    {resolvedInfo.cityName}, {resolvedInfo.state}
                  </h4>
                  <p className="text-xs text-purple-200">
                    District: {resolvedInfo.district} {resolvedInfo.postOffice ? `• ${resolvedInfo.postOffice}` : ''}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-amber-300">
                    {resolvedInfo.temperature}
                  </div>
                  <span className="text-[11px] text-slate-300 block font-medium">
                    {resolvedInfo.condition}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-xs text-slate-200">
                <p className="line-clamp-2">
                  <span className="font-semibold text-amber-300">Forecast Note: </span>
                  {resolvedInfo.note}
                </p>
              </div>

              <button
                type="button"
                id="confirm-resolved-city-btn"
                onClick={() => handleApply(resolvedInfo)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm & Set Weather to {resolvedInfo.cityName}</span>
              </button>
            </div>
          )}

          {/* Quick 1-Tap Popular PIN Codes */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Popular North East & Indian Hub PIN Codes</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_PIN_CODES.map((item) => {
                const isCurrent = (pinInput === item.pincode) || (resolvedInfo?.pincode === item.pincode);
                return (
                  <button
                    key={item.pincode}
                    type="button"
                    onClick={() => handleSelectQuickPin(item.pincode)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-purple-950/80 border-amber-400/80 ring-2 ring-amber-400/40'
                        : 'bg-[#141022] border-purple-900/50 hover:bg-[#201A38] text-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {item.pincode}
                      </span>
                      {item.isNE && (
                        <span className="text-[9px] bg-purple-900/80 text-purple-200 px-1 py-0.2 rounded font-semibold">
                          NE
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-purple-300/80 truncate">
                      {item.state}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-purple-900/60 flex items-center justify-between">
          <p className="text-[11px] text-purple-300/70">
            Current: {currentLocation} ({currentPincode || '784001'})
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#201A38] hover:bg-[#2B234B] text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
