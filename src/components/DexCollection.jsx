import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  BookOpen, 
  Compass, 
  Award, 
  Camera,
  Layers,
  Leaf,
  Bird,
  Bug,
  PawPrint,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/sound';

const CATEGORIES = [
  { id: 'All', label: 'All', icon: Layers },
  { id: 'Plant', label: 'Plants', icon: Leaf },
  { id: 'Animal', label: 'Animals', icon: PawPrint },
  { id: 'Bird', label: 'Birds', icon: Bird },
  { id: 'Insect', label: 'Insects', icon: Bug },
];

export default function DexCollection({ collection, onSelectSpecies, onOpenScanner }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollection = useMemo(() => {
    return collection.filter((item) => {
      // Category check
      const matchesCategory =
        activeCategory === 'All' ||
        item.category === activeCategory ||
        (activeCategory === 'Animal' && (item.category === 'Mammal' || item.category === 'Reptile'));

      // Search query check
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.commonName.toLowerCase().includes(q) ||
        item.scientificName.toLowerCase().includes(q) ||
        (item.family && item.family.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [collection, activeCategory, searchQuery]);

  // Gamified completion percentage based on total 150 real-world Dex target
  const DEX_TARGET = 150;
  const progressPercent = Math.min(100, Math.round((collection.length / DEX_TARGET) * 100));

  const handleCardClick = (species) => {
    sound.playBeep(850, 0.05);
    onSelectSpecies(species);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Header & Dex Stats */}
      <div className="glass-hud p-4 sm:p-5 rounded-3xl relative overflow-hidden border border-emerald-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white tracking-tight">
                My LifeDex
              </h2>
              <p className="text-[11px] font-mono text-emerald-300/80">
                FIELD ARCHIVE & TAXONOMY
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs text-slate-400 block">DISCOVERED</span>
            <span className="font-display font-extrabold text-lg text-emerald-400">
              {collection.length} <span className="text-xs text-slate-400 font-sans font-normal">/ {DEX_TARGET}</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-300">
            <span>REGIONAL DEX PROGRESS</span>
            <span className="text-emerald-300 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-emerald-500/20">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,255,135,0.6)]"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by common name, species, family..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border border-emerald-500/25 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all backdrop-blur-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playBeep(650, 0.04);
                setActiveCategory(cat.id);
              }}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-300'
                  : 'bg-black/40 hover:bg-emerald-950/40 text-slate-300 border border-emerald-500/20'
              }`}
            >
              <Icon size={14} className={isSelected ? 'text-slate-950' : 'text-emerald-400'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Gallery of Caught Species */}
      {filteredCollection.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {filteredCollection.map((species) => (
            <div
              key={species.id}
              onClick={() => handleCardClick(species)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-black/40 hover:bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] flex flex-col active:scale-[0.98]"
            >
              {/* Photo Area */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                <img
                  src={species.userPhotoUrl || species.imageUrl}
                  alt={species.commonName}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Dex Number Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/70 backdrop-blur-sm text-emerald-300 border border-emerald-500/30">
                  {species.dexNumber}
                </div>

                {/* Category Icon Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] bg-black/70 backdrop-blur-sm border border-white/10">
                  {species.categoryBadge?.split(' ')[0] || '🌿'}
                </div>

                {/* Match Confidence Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-emerald-300">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    <span>Logged</span>
                  </span>
                  <span className="text-slate-300">{species.confidence}%</span>
                </div>
              </div>

              {/* Text Info Area */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {species.commonName}
                  </h3>
                  <p className="text-[11px] font-mono italic text-emerald-400/80 truncate">
                    {species.scientificName}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[80px]">{species.category}</span>
                  <span className="text-emerald-400 font-mono font-medium">Inspect →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 rounded-3xl bg-black/30 border border-emerald-500/15 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
            <Compass size={30} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-slate-200">
              No Specimens Found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
              {searchQuery
                ? `No results matching "${searchQuery}". Try a different keyword.`
                : `You haven't logged any ${activeCategory === 'All' ? 'species' : activeCategory} yet.`}
            </p>
          </div>
          <button
            onClick={() => {
              sound.playBeep(750, 0.05);
              onOpenScanner();
            }}
            className="btn-neon-emerald py-2.5 px-5 rounded-2xl text-xs font-bold text-slate-950 inline-flex items-center space-x-1.5 shadow-neon-green"
          >
            <Camera size={14} />
            <span>Open Scanner</span>
          </button>
        </div>
      )}
    </div>
  );
}
