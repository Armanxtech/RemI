import React from 'react';
import { Home, Calendar, Puzzle, BookOpen, Asterisk } from 'lucide-react';
import { soundService } from '../services/soundService';

export type NavTab = 'home' | 'reminders' | 'games' | 'memories' | 'help';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  pendingRitualsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  pendingRitualsCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'reminders' as NavTab, label: 'Reminders', icon: Calendar, badge: pendingRitualsCount > 0 ? pendingRitualsCount : undefined },
    { id: 'games' as NavTab, label: 'Games', icon: Puzzle },
    { id: 'memories' as NavTab, label: 'Memories', icon: BookOpen },
    { id: 'help' as NavTab, label: 'Help', icon: Asterisk, isSOS: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141022]/95 backdrop-blur-lg border-t border-purple-950/60 pb-safe">
      <div className="max-w-3xl mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}-btn`}
              onClick={() => {
                soundService.playClick();
                onChangeTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-300 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-purple-600/20 rounded-xl blur-sm" />
              )}

              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'text-purple-300 scale-110' : tab.isSOS ? 'text-rose-400' : 'text-slate-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {/* Badge for pending reminders */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-purple-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#141022]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 tracking-tight ${
                  isActive ? 'text-purple-200 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
