import React, { useState } from 'react';
import { 
  Check, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Volume2, 
  Share2, 
  Bookmark, 
  Award,
  ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

export default function ResultCard({ 
  result, 
  capturedImage, 
  onSave, 
  onRescan, 
  isAlreadySaved 
}) {
  const [isSaved, setIsSaved] = useState(isAlreadySaved);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handleSave = () => {
    sound.playDiscovery();
    
    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#00ff87', '#f59e0b', '#ffffff']
    });

    setIsSaved(true);
    if (onSave) {
      onSave(result, capturedImage);
    }
  };

  const handlePlaySound = () => {
    setIsPlayingSound(true);
    if (result.category === 'Bird') {
      sound.playBeep(1200, 0.1);
      setTimeout(() => sound.playBeep(1600, 0.15), 120);
      setTimeout(() => sound.playBeep(2000, 0.2), 260);
    } else if (result.category === 'Plant') {
      sound.playBeep(520, 0.2);
    } else {
      sound.playBeep(850, 0.15);
      setTimeout(() => sound.playBeep(720, 0.15), 140);
    }
    setTimeout(() => setIsPlayingSound(false), 600);
  };

  // Determine progress bar color based on confidence
  const getConfidenceColor = (conf) => {
    if (conf >= 95) return 'from-emerald-500 to-green-400';
    if (conf >= 85) return 'from-teal-500 to-cyan-400';
    return 'from-amber-500 to-yellow-400';
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Top Banner Alert */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
        <div className="flex items-center space-x-2 text-xs font-mono font-medium">
          <Sparkles size={16} className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>SPECIMEN IDENTIFIED</span>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">
          {result.dexNumber}
        </span>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="glass-hud rounded-3xl overflow-hidden p-4 sm:p-5 text-slate-100 shadow-2xl relative">
        {/* Glowing aura */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Thumbnail & Badges Header */}
        <div className="relative mb-4">
          <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden border border-emerald-500/30 group shadow-lg bg-slate-950">
            <img
              src={capturedImage || result.imageUrl}
              alt={result.commonName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Category Badge */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md border border-emerald-400/40 text-emerald-300 shadow-md flex items-center space-x-1.5">
              <span>{result.categoryBadge}</span>
            </div>

            {/* Rarity Badge */}
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-mono font-bold backdrop-blur-md border ${result.rarityColor || 'text-emerald-300 border-emerald-500/30 bg-emerald-500/20'}`}>
              ★ {result.rarity}
            </div>

            {/* Bottom Photo Overlay Info */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center space-x-1 text-slate-200">
                <MapPin size={13} className="text-emerald-400" />
                <span>Field Sighting</span>
              </span>
              <button 
                onClick={handlePlaySound}
                className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/90 border border-emerald-500/30 text-emerald-300 flex items-center space-x-1 transition-all active:scale-95"
                title="Play bio-acoustics"
              >
                <Volume2 size={13} className={isPlayingSound ? 'animate-bounce text-emerald-300' : ''} />
                <span className="text-[11px] font-sans">Audio Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scientific & Common Names */}
        <div className="space-y-1 mb-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white drop-shadow-sm">
              {result.commonName}
            </h2>
          </div>
          <p className="text-sm font-mono italic text-emerald-400/90 font-medium">
            {result.scientificName}
            {result.family && <span className="text-slate-400 not-italic ml-2 text-xs">({result.family})</span>}
          </p>
        </div>

        {/* Match Confidence Progress Bar */}
        <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center space-x-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Match Confidence</span>
            </span>
            <span className="font-mono font-bold text-emerald-300 text-sm">
              {result.confidence}% Match
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getConfidenceColor(result.confidence)} transition-all duration-700 shadow-[0_0_12px_rgba(16,185,129,0.7)]`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        {/* Brief Description */}
        <div className="space-y-2 mb-4 text-xs sm:text-sm text-slate-300 leading-relaxed bg-emerald-950/20 p-3 rounded-2xl border border-emerald-500/15">
          <p>{result.briefDescription}</p>
          {result.fieldNotes && (
            <div className="pt-2 border-t border-emerald-500/15 text-xs text-emerald-300/90">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-0.5">Field Note</span>
              {result.fieldNotes}
            </div>
          )}
        </div>

        {/* Environmental Metadata */}
        <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] font-mono text-slate-300">
          <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/20">
            <span className="text-slate-400 block text-[10px] uppercase">Habitat</span>
            <span className="truncate block font-semibold text-white">{result.habitat || 'Temperate Wilds'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/20">
            <span className="text-slate-400 block text-[10px] uppercase">Conservation</span>
            <span className="truncate block font-semibold text-emerald-300">{result.status || 'Protected'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 text-base transition-all duration-200 active:scale-[0.98] ${
              isSaved
                ? 'bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 cursor-default shadow-none'
                : 'btn-neon-emerald text-slate-950 hover:brightness-110 shadow-neon-green'
            }`}
          >
            {isSaved ? (
              <>
                <Check size={20} className="text-emerald-300" />
                <span>Saved to LifeDex!</span>
              </>
            ) : (
              <>
                <Bookmark size={20} className="text-slate-950 fill-slate-950" />
                <span>Add to LifeDex</span>
              </>
            )}
          </button>

          <button
            onClick={onRescan}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 flex items-center justify-center space-x-2 transition-all"
          >
            <RotateCcw size={15} />
            <span>Scan Another Specimen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
