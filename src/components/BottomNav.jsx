import React from 'react';
import { Scan, BookOpen, Settings } from 'lucide-react';
import { sound } from '../utils/sound';

export default function BottomNav({ activeTab, setActiveTab, collectionCount }) {
  const handleTabChange = (tab) => {
    sound.playBeep(700, 0.05);
    setActiveTab(tab);
  };

  const navItems = [
    {
      id: 'scanner',
      label: 'Scanner',
      icon: Scan,
      badge: null
    },
    {
      id: 'collection',
      label: 'My Dex',
      icon: BookOpen,
      badge: collectionCount > 0 ? collectionCount : null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto glass-nav px-4 py-2 border-t border-emerald-500/20 backdrop-blur-xl bg-[#05110a]/90">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-5 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active glow pill */}
              {isActive && (
                <div className="absolute inset-0 bg-emerald-500/15 rounded-2xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)] animate-pulse" />
              )}

              <div className="relative">
                <Icon
                  size={24}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'group-hover:scale-105'
                  }`}
                />
                
                {/* Badge for caught count */}
                {item.badge !== null && (
                  <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-sm border border-emerald-200/40">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[11px] mt-1 tracking-wide z-10 transition-colors ${
                isActive ? 'text-emerald-300 font-medium' : 'text-slate-400'
              }`}>
                {item.label}
              </span>

              {/* Glowing active indicator dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 shadow-[0_0_6px_#00ff87]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
