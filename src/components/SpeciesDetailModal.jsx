import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Volume2, 
  Trash2, 
  ShieldCheck, 
  Share2, 
  Award,
  Globe,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/sound';

export default function SpeciesDetailModal({ species, onClose, onDelete }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!species) return null;

  const handlePlaySound = () => {
    setIsPlayingAudio(true);
    if (species.category === 'Bird') {
      sound.playBeep(1300, 0.1);
      setTimeout(() => sound.playBeep(1700, 0.15), 110);
      setTimeout(() => sound.playBeep(2100, 0.2), 240);
    } else if (species.category === 'Plant') {
      sound.playBeep(520, 0.25);
    } else {
      sound.playBeep(800, 0.12);
      setTimeout(() => sound.playBeep(650, 0.18), 120);
    }
    setTimeout(() => setIsPlayingAudio(false), 600);
  };

  const formattedDate = species.discoveredAt 
    ? new Date(species.discoveredAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown Date';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0a1e13] border-t sm:border border-emerald-500/40 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom-8 duration-300">
        {/* Header bar */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0 bg-slate-950">
          <img
            src={species.userPhotoUrl || species.imageUrl}
            alt={species.commonName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e13] via-transparent to-black/60" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
          >
            <X size={18} />
          </button>

          {/* Dex Number & Category */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-300">
              {species.dexNumber}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md border border-white/10 text-slate-200">
              {species.categoryBadge}
            </span>
          </div>

          {/* Title overlay on bottom of image */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${species.rarityColor || 'text-emerald-300 border-emerald-500/30 bg-emerald-500/20'}`}>
                ★ {species.rarity}
              </span>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {species.confidence}% Match
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {species.commonName}
            </h2>
            <p className="text-sm font-mono italic text-emerald-300">
              {species.scientificName}
            </p>
          </div>
        </div>

        {/* Scrollable specs & field notes */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-slate-200 text-sm">
          {/* Discovery Metadata Card */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-3 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center space-x-2 text-slate-300">
              <Calendar size={15} className="text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Logged</span>
                <span className="font-semibold">{formattedDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin size={15} className="text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-semibold truncate block max-w-[130px]">{species.userLocation || 'Field Sighting'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-500/15">
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Species Overview</h4>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {species.briefDescription}
            </p>
          </div>

          {/* Field Notes */}
          {species.fieldNotes && (
            <div className="space-y-1 bg-cyan-950/20 p-3.5 rounded-2xl border border-cyan-500/20">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles size={13} />
                <span>Ranger Field Observation</span>
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {species.fieldNotes}
              </p>
            </div>
          )}

          {/* Biological Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/15">
              <span className="text-slate-400 block text-[10px] uppercase">Taxonomy Family</span>
              <span className="font-semibold text-slate-200">{species.family || 'Plantae'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/15">
              <span className="text-slate-400 block text-[10px] uppercase">Conservation</span>
              <span className="font-semibold text-emerald-300">{species.status || 'Least Concern'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/15 col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase">Natural Habitat & Range</span>
              <span className="font-semibold text-slate-200">{species.habitat || 'Forest & Meadowlands'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              onClick={handlePlaySound}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-500/30 text-emerald-300 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Volume2 size={16} className={isPlayingAudio ? 'animate-bounce' : ''} />
              <span>{isPlayingAudio ? 'Synthesizing...' : 'Acoustic Call'}</span>
            </button>

            {confirmDelete ? (
              <button
                onClick={() => onDelete(species.id)}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center space-x-1 transition-all"
              >
                <span>Confirm?</span>
              </button>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 text-rose-400 transition-all"
                title="Remove from LifeDex"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
