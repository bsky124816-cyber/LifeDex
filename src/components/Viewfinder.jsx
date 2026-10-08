import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Video, 
  VideoOff, 
  Compass, 
  Crosshair, 
  Zap, 
  Info,
  Maximize2
} from 'lucide-react';
import { QUICK_SAMPLES } from '../data/mockSpecies';
import { sound } from '../utils/sound';

export default function Viewfinder({ onImageSelected, isScanning }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Stop video stream when unmounting
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  const startLiveCamera = async () => {
    sound.playBeep(900, 0.08);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera streaming not supported on this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsLiveCameraActive(true);
      }
    } catch (err) {
      console.warn('Live camera stream not permitted or unavailable:', err);
      setCameraError('Camera access unavailable. Falling back to native capture.');
      // Open native file camera instead
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsLiveCameraActive(false);
  };

  const captureLiveFrame = () => {
    if (!videoRef.current) return;
    sound.playShutter();

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopLiveCamera();
    setPreviewImage(dataUrl);
    onImageSelected(dataUrl);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    sound.playShutter();
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = event.target.result;
      setPreviewImage(imgData);
      onImageSelected(imgData);
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  const handleQuickSample = (sample) => {
    sound.playShutter();
    setPreviewImage(sample.imageUrl);
    onImageSelected(sample.imageUrl, sample.targetId);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Viewfinder Box */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shadow-[0_0_35px_rgba(16,185,129,0.18)]">
        {/* Futuristic Background grid pattern */}
        <div className="absolute inset-0 viewfinder-grid opacity-35" />

        {/* Live Camera Video stream or Static Viewfinder */}
        {isLiveCameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : previewImage ? (
          <img
            src={previewImage}
            alt="Viewfinder preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-950/20">
                <Crosshair size={38} className="text-emerald-400/80 animate-pulse" />
              </div>
              <div className="absolute -inset-2 rounded-full border border-dashed border-emerald-400/20 animate-spin" style={{ animationDuration: '18s' }} />
            </div>
            <p className="font-display font-bold text-lg text-slate-200 mb-1">
              Optical Viewfinder Ready
            </p>
            <p className="text-xs text-slate-400 max-w-[240px]">
              Point at any plant, animal, bird, or insect to scan
            </p>
          </div>
        )}

        {/* Viewfinder Target Corner Brackets */}
        <div className="absolute inset-4 pointer-events-none border-2 border-transparent">
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 drop-shadow-[0_0_6px_#00ff87]" />
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 drop-shadow-[0_0_6px_#00ff87]" />
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 drop-shadow-[0_0_6px_#00ff87]" />
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 drop-shadow-[0_0_6px_#00ff87]" />

          {/* Centered Reticle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16 flex items-center justify-center opacity-60">
              <div className="w-full h-[1px] bg-emerald-400/60" />
              <div className="h-full w-[1px] bg-emerald-400/60 absolute" />
              <div className="w-8 h-8 rounded-full border border-emerald-400/40 absolute" />
            </div>
          </div>
        </div>

        {/* HUD Telemetry Top Bar */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[10px] font-mono text-emerald-300 pointer-events-none z-10 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-xl border border-emerald-500/20">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold tracking-wider">HUD // OPTICAL: ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <span>ISO 400</span>
            <span>•</span>
            <span className="text-cyan-400">BIO-RADAR</span>
          </div>
        </div>

        {/* HUD Telemetry Bottom Bar */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none z-10 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-xl border border-emerald-500/20">
          <span className="flex items-center space-x-1 text-emerald-400">
            <Compass size={11} />
            <span>37°46'N 122°25'W</span>
          </span>
          <span className="text-cyan-300">STATUS: STANDBY</span>
        </div>

        {/* Live Video Switcher Button */}
        <div className="absolute top-12 right-3 z-20">
          <button
            onClick={isLiveCameraActive ? stopLiveCamera : startLiveCamera}
            className="p-2 rounded-xl bg-black/70 hover:bg-black/90 border border-emerald-500/40 text-emerald-300 backdrop-blur-md transition-all shadow-md active:scale-95 flex items-center space-x-1 text-xs"
            title="Toggle Live Camera Stream"
          >
            {isLiveCameraActive ? (
              <>
                <VideoOff size={15} className="text-rose-400" />
                <span className="text-[10px] font-mono text-rose-300">STOP</span>
              </>
            ) : (
              <>
                <Video size={15} className="text-emerald-400" />
                <span className="text-[10px] font-mono">LIVE FEED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl text-center">
          {cameraError}
        </div>
      )}

      {/* Main Two Action Buttons (Take Photo & Upload Image) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Take Photo */}
        <button
          onClick={() => {
            if (isLiveCameraActive) {
              captureLiveFrame();
            } else {
              sound.playShutter();
              if (cameraInputRef.current) {
                cameraInputRef.current.click();
              }
            }
          }}
          disabled={isScanning}
          className="btn-neon-emerald py-3.5 px-4 rounded-2xl font-bold text-slate-950 flex items-center justify-center space-x-2 text-sm sm:text-base active:scale-95 disabled:opacity-50"
        >
          <Camera size={20} className="text-slate-950" />
          <span>{isLiveCameraActive ? 'Capture Frame' : 'Take Photo'}</span>
        </button>

        {/* Upload Image */}
        <button
          onClick={() => {
            sound.playBeep(650, 0.05);
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          disabled={isScanning}
          className="btn-neon-cyan py-3.5 px-4 rounded-2xl font-bold text-slate-950 flex items-center justify-center space-x-2 text-sm sm:text-base active:scale-95 disabled:opacity-50"
        >
          <Upload size={20} className="text-slate-950" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Quick Presets Test Strip */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
          <span className="flex items-center space-x-1 font-mono text-[11px] text-emerald-400">
            <Sparkles size={12} />
            <span>TEST PRESETS (ONE-CLICK SCAN)</span>
          </span>
          <span className="text-[10px] text-slate-400">Try without camera</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {QUICK_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickSample(sample)}
              disabled={isScanning}
              className="flex flex-col items-center p-1.5 rounded-xl bg-slate-900/60 hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-400/50 transition-all text-center group active:scale-95"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-1 border border-emerald-500/20">
                <img
                  src={sample.imageUrl}
                  alt={sample.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] font-medium text-slate-300 truncate w-full group-hover:text-emerald-300">
                {sample.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
