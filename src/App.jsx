import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  BookOpen, 
  Settings, 
  Compass, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Leaf,
  Shield,
  Layers
} from 'lucide-react';

import Viewfinder from './components/Viewfinder';
import ScanningOverlay from './components/ScanningOverlay';
import ResultCard from './components/ResultCard';
import DexCollection from './components/DexCollection';
import SpeciesDetailModal from './components/SpeciesDetailModal';
import SettingsPage from './components/SettingsPage';
import BottomNav from './components/BottomNav';

import { MOCK_SPECIES } from './data/mockSpecies';
import { identifySpeciesWithAI } from './utils/aiClassifier';
import { 
  getSavedCollection, 
  saveCollectionItem, 
  removeCollectionItem, 
  resetCollection, 
  getSettings, 
  saveSettings 
} from './utils/storage';
import { sound } from './utils/sound';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'collection' | 'settings'
  const [collection, setCollection] = useState([]);
  const [settings, setSettings] = useState(getSettings());
  
  // Scanner state machine
  // 'idle': showing viewfinder ready to capture/upload
  // 'scanning': 2s radar scan animation over captured image
  // 'result': displaying ResultCard
  const [scanState, setScanState] = useState('idle');
  const [activeCapturedImage, setActiveCapturedImage] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [selectedSpeciesDetail, setSelectedSpeciesDetail] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const saved = getSavedCollection();
    setCollection(saved);

    const userSettings = getSettings();
    setSettings(userSettings);
    sound.enabled = userSettings.soundEnabled ?? true;
  }, []);

  // Handle image selected from file input, camera, or quick preset
  const handleImageSelected = async (imageDataUrl, forcedSpeciesId = null) => {
    setActiveCapturedImage(imageDataUrl);
    setScanState('scanning');
    setIsAILoading(true);

    try {
      // Execute true AI vision classification
      const matchedSpecies = await identifySpeciesWithAI(
        imageDataUrl, 
        forcedSpeciesId, 
        settings.visionApiKey
      );
      setCurrentResult(matchedSpecies);
    } catch (err) {
      console.error('Failed to classify image:', err);
      // Fallback
      const randomMock = MOCK_SPECIES[Math.floor(Math.random() * MOCK_SPECIES.length)];
      setCurrentResult({
        ...randomMock,
        imageUrl: imageDataUrl
      });
    } finally {
      setIsAILoading(false);
    }
  };

  // Called after ScanningOverlay completes its radar scan animation
  const handleScanAnimationComplete = () => {
    setScanState('result');
  };

  // Rescan / restart viewfinder
  const handleRescan = () => {
    sound.playBeep(700, 0.05);
    setScanState('idle');
    setActiveCapturedImage(null);
    setCurrentResult(null);
  };

  // Save specimen to LifeDex
  const handleSaveToDex = (species, userPhoto) => {
    const { updated } = saveCollectionItem(species, userPhoto);
    setCollection(updated);
  };

  // Delete from Dex
  const handleDeleteSpecies = (id) => {
    sound.playBeep(400, 0.1);
    const updated = removeCollectionItem(id);
    setCollection(updated);
    setSelectedSpeciesDetail(null);
  };

  // Seed all mock species
  const handleSeedFullRoster = () => {
    const all = MOCK_SPECIES.map((s, idx) => ({
      ...s,
      discoveredAt: new Date(Date.now() - idx * 3600000 * 6).toISOString(),
      userPhotoUrl: s.imageUrl,
      userLocation: 'Regional Bio-Reserve'
    }));
    localStorage.setItem('lifedex_collection_v1', JSON.stringify(all));
    setCollection(all);
  };

  // Reset collection
  const handleResetCollection = () => {
    const starter = resetCollection();
    setCollection(starter);
  };

  // Update settings
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const isAlreadyInDex = currentResult 
    ? collection.some(item => item.id === currentResult.id)
    : false;

  return (
    <div className="min-h-screen bg-[#05110a] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-30 w-full max-w-lg mx-auto px-4 py-3 bg-[#05110a]/80 backdrop-blur-xl border-b border-emerald-500/15 flex items-center justify-between">
        <div 
          onClick={() => {
            sound.playBeep(800, 0.05);
            setActiveTab('scanner');
          }}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          {/* Glowing LifeDex Logo Badge */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <div className="w-full h-full bg-[#05110a] rounded-[11px] flex items-center justify-center">
              <span className="text-base select-none">🌿</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-display font-black text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Life<span className="text-emerald-400">Dex</span>
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff87] animate-pulse" />
            </div>
            <p className="text-[10px] font-mono text-emerald-400/80 -mt-0.5 tracking-wider">
              REAL-WORLD POKÉDEX
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Collection Count Pill */}
          <button
            onClick={() => setActiveTab('collection')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-900/40 transition-colors"
          >
            <BookOpen size={13} className="text-emerald-400" />
            <span className="font-bold">{collection.length}</span>
            <span className="text-[10px] text-slate-400">CAUGHT</span>
          </button>

          {/* Audio Quick Mute Toggle */}
          <button
            onClick={() => {
              const nextState = !settings.soundEnabled;
              handleUpdateSettings({ ...settings, soundEnabled: nextState });
              sound.enabled = nextState;
              if (nextState) sound.playBeep(880, 0.08);
            }}
            className="p-1.5 rounded-full bg-black/40 hover:bg-emerald-950/50 border border-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-colors"
            title="Toggle Sound Effects"
          >
            {settings.soundEnabled ? (
              <Volume2 size={16} className="text-emerald-400" />
            ) : (
              <VolumeX size={16} className="text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-4 overflow-y-auto">
        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-4">
            {scanState === 'idle' && (
              <Viewfinder
                onImageSelected={handleImageSelected}
                isScanning={false}
              />
            )}

            {scanState === 'scanning' && activeCapturedImage && (
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_0_40px_rgba(0,255,135,0.3)]">
                {/* Captured image preview */}
                <img
                  src={activeCapturedImage}
                  alt="Scanning target"
                  className="w-full h-full object-cover"
                />
                
                {/* 2-Second Futuristic Radar & Laser Scanning Overlay */}
                <ScanningOverlay
                  onScanComplete={handleScanAnimationComplete}
                  isAILoading={isAILoading}
                />
              </div>
            )}

            {scanState === 'result' && currentResult && (
              <ResultCard
                result={currentResult}
                capturedImage={activeCapturedImage}
                onSave={handleSaveToDex}
                onRescan={handleRescan}
                isAlreadySaved={isAlreadyInDex}
              />
            )}
          </div>
        )}

        {/* My Dex Collection Tab */}
        {activeTab === 'collection' && (
          <DexCollection
            collection={collection}
            onSelectSpecies={setSelectedSpeciesDetail}
            onOpenScanner={() => {
              setActiveTab('scanner');
              handleRescan();
            }}
          />
        )}

        {/* Settings & Trainer ID Tab */}
        {activeTab === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetCollection={handleResetCollection}
            onSeedFullRoster={handleSeedFullRoster}
            collectionCount={collection.length}
          />
        )}
      </main>

      {/* Detail Modal when inspecting an entry */}
      {selectedSpeciesDetail && (
        <SpeciesDetailModal
          species={selectedSpeciesDetail}
          onClose={() => setSelectedSpeciesDetail(null)}
          onDelete={handleDeleteSpecies}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If returning to scanner from another tab and was in result, stay or reset
          if (tab === 'scanner' && scanState === 'scanning') {
            setScanState('idle');
          }
        }}
        collectionCount={collection.length}
      />
    </div>
  );
}
