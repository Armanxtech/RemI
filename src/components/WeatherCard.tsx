import React from 'react';
import { Sun, CloudSun, MapPin, Volume2, Edit3, Compass } from 'lucide-react';
import { soundService } from '../services/soundService';

interface WeatherCardProps {
  location: string;
  pincode?: string;
  temperature: string;
  dayName: string;
  condition: string;
  note: string;
  language: string;
  bgImage?: string;
  onOpenPinCodeSetup?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  pincode,
  temperature,
  dayName,
  condition,
  note,
  language,
  bgImage = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=400&fit=crop',
  onOpenPinCodeSetup,
}) => {
  const handleReadWeather = () => {
    const cityName = location.split(',')[0] || location;
    const speechText =
      language === 'as'
        ? `আজি ${dayName}, পিন ক'ড ${pincode || '৭৮৪০০১'}, ${cityName}ত উত্তাপ ${temperature}। দিনটো ${condition} আৰু শান্ত। অলপ ফুৰিবলৈ বৰ ভাল সময়।`
        : language === 'bn'
        ? `আজ ${dayName}, পিন কোড ${pincode || '৭৮৪০০১'}, ${cityName} এ তাপমাত্রা ${temperature}। আবহাওয়া ${condition}।`
        : language === 'hi'
        ? `आज ${dayName} है, पिन कोड ${pincode || '784001'}, ${cityName} में तापमान ${temperature}। मौसम ${condition} और सुखद है।`
        : language === 'mni'
        ? `ঙসি ${dayName}নি, ${cityName}দা টেম্পারেচর ${temperature}নি। নুংঙাইরবা নোংজু-নুংশা।`
        : `Today is ${dayName}. Weather in ${location}, PIN Code ${pincode || '784001'}. Temperature is ${temperature}. Conditions are ${condition}. ${note}`;
    soundService.speak(speechText, language);
  };

  return (
    <div
      id="weather-card"
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl shadow-purple-950/25 border border-purple-800/30 group"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(16, 12, 28, 0.88), rgba(28, 20, 50, 0.7)), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          {/* Location & PIN Code Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-purple-300 text-xs font-semibold tracking-wide bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-700/40 backdrop-blur-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold">{location}</span>
              {pincode && (
                <span className="text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded-md font-mono text-[10px]">
                  PIN: {pincode}
                </span>
              )}
            </div>

            {onOpenPinCodeSetup && (
              <button
                type="button"
                id="weather-card-change-pincode-btn"
                onClick={() => {
                  soundService.playClick();
                  onOpenPinCodeSetup();
                }}
                className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-full border border-amber-400/40 flex items-center gap-1 transition-all cursor-pointer"
                title="Change PIN Code or City"
              >
                <Compass className="w-3 h-3 text-amber-300" />
                <span>Change PIN</span>
              </button>
            )}
          </div>

          <h2 className="text-2xl font-bold mt-2 text-white tracking-tight">
            {dayName}
          </h2>
          <div className="text-4xl font-extrabold text-white mt-1 tracking-tight">
            {temperature}
          </div>
          <p className="text-xs font-semibold text-purple-200 mt-0.5">
            {condition}
          </p>
        </div>

        {/* Sun Icon and TTS voice read button */}
        <div className="flex flex-col items-end gap-2">
          <div className="p-3 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-amber-300 backdrop-blur-md">
            <Sun className="w-8 h-8 animate-spin-slow text-amber-400" />
          </div>
          <button
            id="weather-read-aloud-btn"
            onClick={handleReadWeather}
            className="p-1.5 rounded-full bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs flex items-center gap-1 px-2.5 transition-all cursor-pointer"
            title="Read weather aloud in your language"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Listen</span>
          </button>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-200 mt-4 leading-relaxed max-w-md">
        {note}
      </p>
    </div>
  );
};
