import React, { useState } from 'react';
import { 
  User, 
  Volume2, 
  VolumeX, 
  Cpu, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ExternalLink,
  Key,
  BadgeCheck,
  Zap,
  Leaf
} from 'lucide-react';
import { sound } from '../utils/sound';
import { MOCK_SPECIES } from '../data/mockSpecies';

export default function SettingsPage({ 
  settings, 
  onUpdateSettings, 
  onResetCollection, 
  onSeedFullRoster,
  collectionCount
}) {
  const envKey = import.meta.env.VITE_GEMMA_API_KEY || import.meta.env.GEMMA_API_KEY || '';
  const [apiKey, setApiKey] = useState(settings.visionApiKey || envKey);
  const [activeEngine, setActiveEngine] = useState(settings.scanEngine || 'mock');
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) {
      sound.playBeep(880, 0.1);
    }
    onUpdateSettings({ ...settings, soundEnabled: nextState });
  };

  const handleSaveApiKey = () => {
    onUpdateSettings({ ...settings, visionApiKey: apiKey, scanEngine: activeEngine });
    sound.playSuccess();
    setStatusMessage('Settings updated successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSeedAll = () => {
    sound.playDiscovery();
    onSeedFullRoster();
    setStatusMessage('All 8 field specimens loaded into LifeDex!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleReset = () => {
    sound.playBeep(440, 0.15);
    onResetCollection();
    setStatusMessage('LifeDex reset to starter specimens.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Bio-Ranger Trainer ID Card */}
      <div className="relative rounded-3xl p-5 overflow-hidden bg-gradient-to-br from-[#0c2419] to-[#06170f] border-2 border-emerald-500/40 shadow-2xl">
        {/* Holographic background sweep */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="text-3xl">🧑‍🌾</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono font-bold text-emerald-400">ID #884-LD</span>
                <BadgeCheck size={14} className="text-emerald-400" />
              </div>
              <h2 className="text-lg font-display font-extrabold text-white">
                Bio-Ranger Leo
              </h2>
              <p className="text-xs font-mono text-cyan-300">
                Rank: Master Field Naturalist
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-black/50 border border-emerald-500/30 text-right">
            <span className="text-[10px] font-mono text-slate-400 block">LEVEL</span>
            <span className="text-base font-display font-extrabold text-emerald-400">
              {Math.max(1, Math.floor(collectionCount / 2) + 1)}
            </span>
          </div>
        </div>

        {/* Ranger Badges */}
        <div className="pt-2 border-t border-emerald-500/20">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Earned Field Badges
          </span>
          <div className="flex space-x-2">
            <div className="flex-1 p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-center">
              <span className="text-lg block">🌿</span>
              <span className="text-[10px] font-mono text-slate-300">Botanist</span>
            </div>
            <div className="flex-1 p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-center">
              <span className="text-lg block">🦅</span>
              <span className="text-[10px] font-mono text-slate-300">Ornitho</span>
            </div>
            <div className="flex-1 p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-center">
              <span className="text-lg block">🐞</span>
              <span className="text-[10px] font-mono text-slate-300">Entomo</span>
            </div>
            <div className="flex-1 p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-center">
              <span className="text-lg block">🐾</span>
              <span className="text-[10px] font-mono text-slate-300">Zoologist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio & Haptics Settings */}
      <div className="glass-hud p-4 rounded-3xl border border-emerald-500/20 space-y-3">
        <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Zap size={14} />
          <span>Device Audio & Preferences</span>
        </h3>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-emerald-500/15">
          <div className="flex items-center space-x-3">
            {soundEnabled ? (
              <Volume2 size={20} className="text-emerald-400" />
            ) : (
              <VolumeX size={20} className="text-slate-400" />
            )}
            <div>
              <span className="text-sm font-semibold text-slate-200 block">Sci-Fi Sound Effects</span>
              <span className="text-xs text-slate-400">Synthesizer audio for scanner, shutter & locks</span>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* AI Vision Classification Engine Setup */}
      <div className="glass-hud p-4 sm:p-5 rounded-3xl border border-emerald-500/25 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu size={18} className="text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Classification Engine
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GEMMA / GEMINI AI ACTIVE</span>
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          LifeDex is powered by <strong>Google Gemma / Gemini Vision AI</strong> using your API key. Every image captured or uploaded is classified with high taxonomic precision.
        </p>

        {/* Engine Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveEngine('gemma')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeEngine !== 'mock'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-black/30 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-bold block text-emerald-300">✓ Gemma / Gemini Vision</span>
            <span className="text-[10px] text-slate-400">High accuracy real-time AI</span>
          </button>

          <button
            onClick={() => setActiveEngine('mock')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeEngine === 'mock'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-black/30 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-bold block">Offline Mock Demo</span>
            <span className="text-[10px] text-slate-400">Randomized simulation</span>
          </button>
        </div>

        {/* API Key Input */}
        <div className="space-y-2 p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
          <label className="text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Key size={13} />
              <span>ACTIVE GEMMA / GOOGLE AI KEY</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">CONNECTED</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AQ.Ab8..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 font-mono"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3.5 py-2 rounded-xl btn-neon-emerald text-slate-950 font-bold text-xs"
            >
              Update
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Loaded from <code className="text-emerald-300">env.local</code>. You can update this key anytime.
          </p>
        </div>

        {/* Production AI Docs Guide */}
        <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/15 space-y-2 text-xs">
          <span className="font-mono font-bold text-emerald-400 text-[11px] block">
            Recommended Production APIs:
          </span>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li className="flex items-start space-x-1.5">
              <span className="text-emerald-400">•</span>
              <span><strong>Google Cloud Vision API:</strong> General entity detection for birds, mammals, insects.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-emerald-400">•</span>
              <span><strong>Plant.id / PlantNet API:</strong> Botanical vision engine specialized for flora taxonomy.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-emerald-400">•</span>
              <span><strong>HuggingFace Inference API:</strong> Open-source vision models (ViT / BioCLIP).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Database Controls */}
      <div className="glass-hud p-4 rounded-3xl border border-emerald-500/20 space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          LifeDex Data Controls
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSeedAll}
            className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
          >
            <Sparkles size={14} />
            <span>Load All 8 Demo Species</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
          >
            <RotateCcw size={14} />
            <span>Reset to Starter Dex</span>
          </button>
        </div>

        {statusMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-mono animate-in fade-in duration-200">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
