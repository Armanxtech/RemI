import React from 'react';

interface RemILogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  withIcon?: boolean;
}

export const RemILogo: React.FC<RemILogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  withIcon = false,
}) => {
  const sizeMap = {
    sm: { text: 'text-xl', icon: 'w-6 h-6', sub: 'text-[10px]' },
    md: { text: 'text-2xl', icon: 'w-8 h-8', sub: 'text-xs' },
    lg: { text: 'text-4xl', icon: 'w-10 h-10', sub: 'text-sm' },
    xl: { text: 'text-5xl sm:text-6xl', icon: 'w-14 h-14', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-2">
        {withIcon && (
          <div className="relative flex items-center justify-center">
            {/* Glowing orb halo */}
            <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-md animate-pulse" />
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-400 p-0.5 shadow-lg shadow-purple-950/60 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#171228] flex items-center justify-center">
                {/* Neural brain icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-purple-300 stroke-current stroke-[1.8]"
                >
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Custom Script Stylized RemI Brand mark */}
        <div className="relative">
          <span
            className={`font-serif tracking-tight font-bold bg-gradient-to-r from-[#D8B4FE] via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(168,85,247,0.35)] ${currentSize.text}`}
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
            }}
          >
            Rem<span className="font-sans not-italic font-extrabold text-[#E9D5FF]">I</span>
          </span>
        </div>
      </div>

      {showSubtitle && (
        <span
          className={`text-purple-300/80 font-medium tracking-wide mt-1 ${currentSize.sub}`}
        >
          Your AI Cognitive Companion
        </span>
      )}
    </div>
  );
};
