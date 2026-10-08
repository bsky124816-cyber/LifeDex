import React, { useEffect, useState } from 'react';
import { Cpu, Radio, ShieldCheck, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

const TELEMETRY_STEPS = [
  'INITIALIZING BIOMETRIC RETICLE...',
  'AI VISION NEURAL SCANNING...',
  'SPECTRAL TEXTURE & PATTERN ANALYSIS...',
  'CROSS-REFERENCING TAXONOMY DATABASE...',
  'EXTRACTING MORPHOLOGY & TRAITS...',
  'CONFIRMING TAXONOMIC CLASSIFICATION...'
];

export default function ScanningOverlay({ onScanComplete, isAILoading }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    sound.playRadarPing();

    const interval = setInterval(() => {
      setProgress((prev) => {
        // If AI is still loading, hold around 92% until ready
        if (isAILoading && prev >= 90) {
          return 92;
        }
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 4;
        if (next % 24 === 0) {
          sound.playRadarPing();
        }
        return next;
      });
    }, 90);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % TELEMETRY_STEPS.length);
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [isAILoading]);

  // When AI finishes and progress hits 100, trigger onScanComplete
  useEffect(() => {
    if (!isAILoading && progress >= 90) {
      setProgress(100);
      const doneTimer = setTimeout(() => {
        sound.playSuccess();
        if (onScanComplete) {
          onScanComplete();
        }
      }, 300);
      return () => clearTimeout(doneTimer);
    }
  }, [isAILoading, progress, onScanComplete]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 pointer-events-none rounded-2xl overflow-hidden bg-black/60 backdrop-blur-[2px]">
      {/* Laser scanline sweeping vertically */}
      <div className="absolute inset-x-0 scanline-beam animate-scan-line pointer-events-none z-20" />

      {/* Cyber radar grid background */}
      <div className="absolute inset-0 viewfinder-grid opacity-30 pointer-events-none" />

      {/* Rotating Radar Cone in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-emerald-500/30 flex items-center justify-center">
          {/* Inner concentric circles */}
          <div className="absolute w-36 h-36 rounded-full border border-emerald-400/20" />
          <div className="absolute w-20 h-20 rounded-full border border-emerald-400/40" />
          
          {/* Radar rotating beam */}
          <div className="absolute inset-0 rounded-full radar-sweep-cone animate-radar-spin" />
          
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-emerald-500/20" />
          <div className="absolute h-full w-[1px] bg-emerald-500/20" />
          
          {/* Center glowing node */}
          <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_#00ff87] animate-ping" />
        </div>
      </div>

      {/* Top HUD Telemetry */}
      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 z-10 bg-black/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00ff87]" />
          <span className="font-bold tracking-wider">AI RADAR CLASSIFIER</span>
        </div>
        <div className="flex items-center space-x-2 text-cyan-400">
          <Radio size={12} className="animate-pulse" />
          <span>GEMMA/GEMINI VISION</span>
        </div>
      </div>

      {/* Bottom Scanning Status & Progress Bar */}
      <div className="z-10 bg-black/80 p-3 rounded-xl border border-emerald-500/40 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1.5">
          <div className="flex items-center space-x-2">
            <Zap size={14} className="text-emerald-400 animate-bounce" />
            <span className="truncate max-w-[210px] font-semibold">{TELEMETRY_STEPS[stepIndex]}</span>
          </div>
          <span className="font-bold text-emerald-300">{Math.min(100, progress)}%</span>
        </div>

        {/* High-tech animated progress bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(0,255,135,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-slate-400">
          <span className="text-emerald-300">GEMMA VISION ENGINE</span>
          <span className="text-cyan-400">PRECISION: HIGH</span>
        </div>
      </div>
    </div>
  );
}
