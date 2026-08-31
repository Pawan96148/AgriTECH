import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useFarm } from '../context/FarmContext';
import { 
  SeedPacketData, 
  EquipmentData, 
  ScannedQRResult, 
  Crop,
  MaintenanceLog 
} from '../types';
import { 
  SEED_PACKET_REGISTRY, 
  EQUIPMENT_REGISTRY, 
  decodeQRText 
} from '../data/qrRegistryData';
import { CropDoodle } from './CropDoodle';
import {
  QrCode,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Tractor,
  Sprout,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  X,
  Plus,
  Search,
  BookOpen,
  CheckSquare,
  Square,
  FileText,
  Printer,
  ChevronRight,
  Droplets,
  Gauge,
  Zap,
  Info
} from 'lucide-react';

interface CropQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickSowCrop?: (seed: SeedPacketData) => void;
}

type ScanTab = 'camera' | 'upload' | 'presets' | 'manual';

export const CropQRScanner: React.FC<CropQRScannerProps> = ({
  isOpen,
  onClose,
  onQuickSowCrop
}) => {
  const { 
    crops, 
    farms, 
    setActiveTab, 
    showToast, 
    addActivity, 
    setIsAddCropModalOpen, 
    setPreselectedCropForModal 
  } = useFarm();

  const [activeScanTab, setActiveScanTab] = useState<ScanTab>('camera');
  const [scannedResult, setScannedResult] = useState<ScannedQRResult | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [checkedPreOpItems, setCheckedPreOpItems] = useState<Record<string, boolean>>({});

  // Equipment new service modal sub-state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceType, setNewServiceType] = useState<MaintenanceLog['serviceType']>('Routine Service');
  const [newServiceCost, setNewServiceCost] = useState('');
  const [newServiceTech, setNewServiceTech] = useState('');
  const [newServiceDetails, setNewServiceDetails] = useState('');
  const [activeEquipmentData, setActiveEquipmentData] = useState<EquipmentData | null>(null);

  // Field Tag Generator sub-modal
  const [isPrintTagOpen, setIsPrintTagOpen] = useState(false);
  const [tagToPrint, setTagToPrint] = useState<{ title: string; subtitle: string; code: string; type: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start / Stop camera when tab changes or modal opens/closes
  useEffect(() => {
    if (isOpen && activeScanTab === 'camera' && !scannedResult) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeScanTab, scannedResult, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestAnimationFrame(tickVideoScan);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsScanning(false);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. You can still scan by uploading an image or selecting a certified sample below.'
          : 'Unable to start camera. Please switch to image upload or preset demo tags.'
      );
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const tickVideoScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          handleQRDetected(code.data);
          return; // Stop scan loop on match
        }
      }
    }

    if (isOpen && activeScanTab === 'camera' && !scannedResult) {
      animationFrameRef.current = requestAnimationFrame(tickVideoScan);
    }
  };

  const handleQRDetected = (rawText: string) => {
    stopCamera();
    // Audio-visual feedback
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio optional
    }

    const decoded = decodeQRText(rawText, crops);
    setScannedResult(decoded);
    if (decoded.type === 'EQUIPMENT') {
      setActiveEquipmentData(decoded.data);
      setCheckedPreOpItems({});
    }
    showToast(`QR Decoded: ${decoded.type === 'SEED' ? decoded.data.variety : decoded.type === 'EQUIPMENT' ? decoded.data.name : rawText}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleQRDetected(code.data);
          } else {
            showToast('No QR code detected in image. Try zooming in or selecting a clearer photo.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (code: string) => {
    handleQRDetected(code);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleQRDetected(manualInput.trim());
  };

  const handleResetScan = () => {
    setScannedResult(null);
    setManualInput('');
    setActiveEquipmentData(null);
    setCheckedPreOpItems({});
    if (activeScanTab === 'camera') {
      startCamera();
    }
  };

  // Pre-operation checklist toggle
  const togglePreOpItem = (itemText: string) => {
    setCheckedPreOpItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  // Sowing action
  const handleSowSeed = (seed: SeedPacketData) => {
    if (onQuickSowCrop) {
      onQuickSowCrop(seed);
      onClose();
      return;
    }

    setPreselectedCropForModal(seed.cropName);
    setIsAddCropModalOpen(true);
    onClose();
    showToast(`Pre-filling sowing form with certified ${seed.variety}...`);
  };

  // Schedule seed treatment activity
  const handleScheduleSeedTreatment = (seed: SeedPacketData) => {
    const defaultFarm = farms[0];
    addActivity({
      farmId: defaultFarm?.id || 'farm_01',
      cropId: crops[0]?.id || '',
      activityType: 'FERTILIZER',
      title: `Seed Treatment: ${seed.variety}`,
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      dosageOrVolume: seed.seedTreatment,
      cost: 450,
      priority: 'HIGH',
      notes: `Apply certified seed dressing (${seed.seedTreatment}) before sowing Lot ${seed.lotNumber}. Certified germination: ${seed.germinationRate}%.`
    });
    showToast(`Scheduled Seed Treatment for ${seed.variety} in Activities!`);
  };

  // Add equipment maintenance record
  const handleAddEquipmentService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEquipmentData || !newServiceTitle.trim()) return;

    const newLog: MaintenanceLog = {
      id: `maint_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: newServiceTitle.trim(),
      serviceType: newServiceType,
      technician: newServiceTech.trim() || 'Co-op Service Center',
      costInr: Number(newServiceCost) || 0,
      details: newServiceDetails.trim() || 'Scheduled service recorded via QR diagnostic interface.'
    };

    const updatedEq: EquipmentData = {
      ...activeEquipmentData,
      status: 'Optimal',
      lastServiceDate: newLog.date,
      maintenanceHistory: [newLog, ...activeEquipmentData.maintenanceHistory]
    };

    setActiveEquipmentData(updatedEq);
    setIsAddServiceOpen(false);
    setNewServiceTitle('');
    setNewServiceCost('');
    setNewServiceTech('');
    setNewServiceDetails('');
    showToast(`Service log for ${activeEquipmentData.name} saved (₹${newLog.costInr})!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-lime-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold shadow-md">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif">
                  AGRITECH Smart Scanner
                </h2>
                <span className="bg-lime-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Seed & Machine QR
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Scan seed packets, certified seed tags, or equipment barcodes to retrieve instant lifecycles and maintenance logs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50/50 space-y-5">
          
          {/* If NO result is scanned yet, show Scanner Interfaces */}
          {!scannedResult ? (
            <div className="space-y-5">
              
              {/* Scan Mode Switcher Tabs */}
              <div className="flex bg-stone-200/70 p-1 rounded-2xl border border-stone-300 max-w-xl mx-auto text-xs font-bold">
                <button
                  onClick={() => { setActiveScanTab('camera'); startCamera(); }}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeScanTab === 'camera'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900'
                  }`}
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Live Camera</span>
                </button>

                <button
                  onClick={() => { setActiveScanTab('upload'); stopCamera(); }}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeScanTab === 'upload'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900'
                  }`}
                >
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Upload Image</span>
                </button>

                <button
                  onClick={() => { setActiveScanTab('presets'); stopCamera(); }}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeScanTab === 'presets'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Seed & Machine Presets</span>
                </button>

                <button
                  onClick={() => { setActiveScanTab('manual'); stopCamera(); }}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeScanTab === 'manual'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900'
                  }`}
                >
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>Tag Lookup</span>
                </button>
              </div>

              {/* TAB 1: LIVE CAMERA SCANNER */}
              {activeScanTab === 'camera' && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-full max-w-md aspect-square bg-stone-900 rounded-3xl overflow-hidden shadow-inner border-4 border-emerald-900/30 flex items-center justify-center">
                    
                    {cameraError ? (
                      <div className="p-6 text-center text-white space-y-3">
                        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                        <p className="text-xs text-stone-300 leading-relaxed">{cameraError}</p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            onClick={() => startCamera()}
                            className="bg-lime-400 text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-lime-300 transition flex items-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Retry Camera
                          </button>
                          <button
                            onClick={() => setActiveScanTab('presets')}
                            className="bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                          >
                            Use Preset Demos
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          playsInline
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Viewfinder Target HUD */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="relative w-64 h-64 border-2 border-lime-400/70 rounded-2xl">
                            {/* Animated Laser Scanning Line */}
                            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-lime-300 to-transparent shadow-[0_0_12px_#a3e635] animate-pulse top-1/2 -translate-y-1/2" />
                            
                            {/* 4 Corner Markers */}
                            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-lime-400 rounded-tl-lg" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-lime-400 rounded-tr-lg" />
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-lime-400 rounded-bl-lg" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-lime-400 rounded-br-lg" />

                            <div className="absolute -bottom-8 inset-x-0 text-center">
                              <span className="text-[11px] font-mono font-bold text-lime-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-lime-400/40">
                                Point camera at QR / Barcode
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Camera Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-lime-50 transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                      Switch Camera ({facingMode === 'environment' ? 'Back' : 'Front'})
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-lime-50 transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-700" />
                      Scan from Photo Gallery
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: UPLOAD IMAGE */}
              {activeScanTab === 'upload' && (
                <div className="max-w-md mx-auto">
                  <label
                    htmlFor="qr-file-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-lime-300 hover:border-emerald-600 rounded-3xl bg-lime-50/30 hover:bg-lime-50/70 transition cursor-pointer p-6 text-center space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-950">
                        Click to select or drag & drop QR image
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Supports PNG, JPG, WEBP from seed packets, fertilizer bags, or equipment tags
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-white border border-lime-300 px-3 py-1 rounded-xl shadow-2xs">
                      Browse Files
                    </span>
                    <input
                      id="qr-file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}

              {/* TAB 3: PRESET SEED & MACHINE LIBRARY */}
              {activeScanTab === 'presets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Certified Seed Packets (Click to Simulate Scan)
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-semibold">5 Certified Lots Available</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SEED_PACKET_REGISTRY.map(seed => (
                      <div
                        key={seed.qrCode}
                        onClick={() => handleSelectPreset(seed.qrCode)}
                        className="bg-white border border-lime-200 hover:border-emerald-600 hover:shadow-md p-3.5 rounded-2xl cursor-pointer transition group flex flex-col justify-between space-y-2.5"
                      >
                        <div className="flex items-start gap-3">
                          <CropDoodle cropName={seed.cropName} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-lime-100 text-emerald-900 truncate">
                                {seed.lotNumber.split('-').slice(-2).join('-')}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                {seed.germinationRate}% Germ
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition truncate mt-0.5">
                              {seed.variety}
                            </h4>
                            <p className="text-[11px] text-stone-500 truncate">{seed.brand}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-lime-100 flex items-center justify-between text-[11px]">
                          <span className="text-stone-500 font-mono">Rate: {seed.recommendedSeedRateKgPerAcre} kg/ac</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                            Simulate Scan <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Machinery & Field Implement Tags (Click to Inspect)
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-semibold">4 Registered Assets</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EQUIPMENT_REGISTRY.map(eq => (
                      <div
                        key={eq.qrCode}
                        onClick={() => handleSelectPreset(eq.qrCode)}
                        className="bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-md p-3.5 rounded-2xl cursor-pointer transition group flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition">
                          {eq.category === 'Tractor & Tillage' ? (
                            <Tractor className="w-5 h-5" />
                          ) : eq.category === 'Sprayers & Protection' ? (
                            <Droplets className="w-5 h-5" />
                          ) : (
                            <Wrench className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                              {eq.assetTag}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              eq.status === 'Optimal'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900 font-bold'
                            }`}>
                              {eq.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition truncate mt-0.5">
                            {eq.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-mono">
                            {eq.operatingHours} hrs • Next due: {eq.nextServiceDue.split(' ')[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MANUAL TAG ENTRY */}
              {activeScanTab === 'manual' && (
                <form onSubmit={handleManualSubmit} className="max-w-md mx-auto space-y-3 bg-white p-5 rounded-2xl border border-lime-200 shadow-xs">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Enter QR Payload, Serial No, or Lot Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SEED_WHEAT_HD2967_B8821 or EQ_MAHINDRA_575_TRAC"
                      value={manualInput}
                      onChange={e => setManualInput(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-4 h-4" />
                    Decode Tag & Retrieve Information
                  </button>
                </form>
              )}

            </div>
          ) : (
            /* IF A RESULT IS SCANNED, RENDER THE RICH INSPECTION SCREEN */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Scan Bar Action Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs">
                    <CheckCircle2 className="w-4 h-4 text-lime-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      QR Successfully Decoded
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      Type: {scannedResult.type} • Tag: {scannedResult.type === 'SEED' ? scannedResult.data.qrCode : scannedResult.type === 'EQUIPMENT' ? scannedResult.data.assetTag : 'Custom Tag'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (scannedResult.type === 'SEED') {
                        setTagToPrint({
                          title: scannedResult.data.variety,
                          subtitle: `Lot: ${scannedResult.data.lotNumber}`,
                          code: scannedResult.data.qrCode,
                          type: 'Certified Seed'
                        });
                        setIsPrintTagOpen(true);
                      } else if (scannedResult.type === 'EQUIPMENT') {
                        setTagToPrint({
                          title: scannedResult.data.name,
                          subtitle: `Asset: ${scannedResult.data.assetTag} (S/N: ${scannedResult.data.serialNumber})`,
                          code: scannedResult.data.qrCode,
                          type: 'Farm Equipment'
                        });
                        setIsPrintTagOpen(true);
                      }
                    }}
                    className="text-xs font-semibold px-2.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-stone-700 flex items-center gap-1 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-stone-500" />
                    Print Field Tag
                  </button>

                  <button
                    onClick={handleResetScan}
                    className="text-xs font-bold px-3 py-1.5 bg-emerald-800 text-white hover:bg-emerald-900 rounded-xl flex items-center gap-1 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Scan Another QR
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* CASE 1: SEED PACKET DETAILED LIFECYCLE CERTIFICATE   */}
              {/* ---------------------------------------------------- */}
              {scannedResult.type === 'SEED' && (
                <div className="space-y-6">
                  {/* Main Seed Profile Header */}
                  <div className="bg-white rounded-2xl border border-lime-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <CropDoodle cropName={scannedResult.data.cropName} size="lg" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                            {scannedResult.data.certifiedTagColor}
                          </span>
                          <span className="text-xs font-mono font-bold text-stone-500">
                            Lot: {scannedResult.data.lotNumber}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-serif">
                          {scannedResult.data.variety}
                        </h3>
                        <p className="text-xs text-stone-600 font-medium">
                          Producer / Breeder: <strong className="text-emerald-900">{scannedResult.data.brand}</strong> • Certified by {scannedResult.data.certificationAgency}
                        </p>
                      </div>
                    </div>

                    {/* SOWING CALL TO ACTION */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => handleSowSeed(scannedResult.data)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Sprout className="w-4 h-4 text-lime-400" />
                        <span>Sow into Farm Plot</span>
                      </button>

                      <button
                        onClick={() => handleScheduleSeedTreatment(scannedResult.data)}
                        className="bg-lime-100 hover:bg-lime-200 text-emerald-950 font-bold text-xs py-2.5 px-3 rounded-xl border border-lime-300 transition flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Schedule Dressing</span>
                      </button>
                    </div>
                  </div>

                  {/* Certified Lab Quality Metrics Bento Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-lime-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Germination Rate</span>
                      <span className="text-2xl font-extrabold text-emerald-900 font-mono mt-0.5 block">
                        {scannedResult.data.germinationRate}%
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">Standard Passed (≥85%)</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-lime-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Genetic Purity</span>
                      <span className="text-2xl font-extrabold text-emerald-900 font-mono mt-0.5 block">
                        {scannedResult.data.geneticPurity}%
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">True-to-Type</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-lime-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Seed Moisture</span>
                      <span className="text-2xl font-extrabold text-emerald-900 font-mono mt-0.5 block">
                        {scannedResult.data.moisturePercent}%
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">Max Limit: 12.0%</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-lime-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Seed Rate</span>
                      <span className="text-2xl font-extrabold text-emerald-900 font-mono mt-0.5 block">
                        {scannedResult.data.recommendedSeedRateKgPerAcre} <span className="text-sm font-sans font-normal">kg/ac</span>
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">Depth: {scannedResult.data.idealSowingDepthCm}</span>
                    </div>
                  </div>

                  {/* Seed Treatment & Chemical Coating Card */}
                  <div className="bg-lime-50/70 rounded-2xl border border-lime-200 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-800" />
                      <h4 className="text-sm font-bold text-emerald-950">
                        Seed Treatment & Biological Coating Applied
                      </h4>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-mono bg-white p-2.5 rounded-xl border border-lime-100">
                      {scannedResult.data.seedTreatment}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600 pt-1">
                      <span>Certified Spacing: <strong>{scannedResult.data.recommendedSpacing}</strong></span>
                      <span>Batch Expiry Date: <strong className="text-amber-800">{scannedResult.data.expiryDate}</strong></span>
                    </div>
                  </div>

                  {/* Complete Crop Lifecycle Stage Breakdown Timeline */}
                  <div className="bg-white rounded-2xl border border-lime-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-lime-100 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-emerald-950 font-serif">
                          Stage-by-Stage Lifecycle & Field Operations Guide
                        </h4>
                        <p className="text-xs text-stone-500">
                          Deterministic agronomic schedule calibrated for {scannedResult.data.variety}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        PHI: {scannedResult.data.preHarvestIntervalDays} Days
                      </span>
                    </div>

                    <div className="space-y-3">
                      {scannedResult.data.stageGuide.map((stg, idx) => (
                        <div
                          key={stg.stage}
                          className="p-3.5 rounded-xl border border-lime-100 bg-stone-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-bold text-emerald-950">{stg.stage} Stage</h5>
                                <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-lime-100 px-1.5 py-0.2 rounded">
                                  {stg.dayRange}
                                </span>
                              </div>
                              <p className="text-xs text-stone-600 mt-0.5">{stg.advice}</p>
                            </div>
                          </div>

                          <div className="sm:text-right bg-white p-2 sm:p-0 rounded-lg sm:bg-transparent border sm:border-0 border-lime-200 shrink-0 w-full sm:w-auto">
                            <span className="text-[10px] uppercase font-bold text-amber-800 block">Critical Task</span>
                            <span className="text-xs font-semibold text-stone-800 block">{stg.criticalTask}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* CASE 2: EQUIPMENT / MACHINERY HEALTH & LOGS          */}
              {/* ---------------------------------------------------- */}
              {scannedResult.type === 'EQUIPMENT' && activeEquipmentData && (
                <div className="space-y-6">
                  {/* Equipment Header Profile */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-stone-100 text-emerald-900 flex items-center justify-center shrink-0 border border-stone-200">
                        {activeEquipmentData.category === 'Tractor & Tillage' ? (
                          <Tractor className="w-6 h-6" />
                        ) : activeEquipmentData.category === 'Sprayers & Protection' ? (
                          <Droplets className="w-6 h-6" />
                        ) : (
                          <Wrench className="w-6 h-6" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                            activeEquipmentData.status === 'Optimal'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {activeEquipmentData.status}
                          </span>
                          <span className="text-xs font-mono font-bold text-stone-500">
                            Asset ID: {activeEquipmentData.assetTag}
                          </span>
                          <span className="text-xs font-mono text-stone-400">
                            S/N: {activeEquipmentData.serialNumber}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-serif">
                          {activeEquipmentData.name}
                        </h3>
                        <p className="text-xs text-stone-600">
                          Model: <strong>{activeEquipmentData.model}</strong> • Purchased: {activeEquipmentData.purchaseYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => setIsAddServiceOpen(true)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Wrench className="w-4 h-4 text-lime-400" />
                        <span>Log Service Record</span>
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Total Runtime</span>
                      <span className="text-2xl font-extrabold text-emerald-950 font-mono mt-0.5 block">
                        {activeEquipmentData.operatingHours} <span className="text-xs font-sans font-normal text-stone-500">Hours</span>
                      </span>
                      <span className="text-[10px] text-stone-500">{activeEquipmentData.acreageServiced} Acres Serviced</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Last Service</span>
                      <span className="text-sm font-extrabold text-emerald-950 font-mono mt-2 block">
                        {activeEquipmentData.lastServiceDate}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">Logged in System</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Next Due Date</span>
                      <span className="text-xs font-bold text-amber-900 font-mono mt-2 block leading-tight">
                        {activeEquipmentData.nextServiceDue}
                      </span>
                      <span className="text-[10px] text-stone-500">Service Alert Active</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-stone-500 block">Oil & Filtration</span>
                      <span className="text-xs font-bold text-stone-800 mt-2 block truncate">
                        {activeEquipmentData.oilAndFilterStatus.split(' ')[0]} OK
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">120-Mesh Clean</span>
                    </div>
                  </div>

                  {/* Pre-Operation Safety Checklist with Interactive Checkmarks */}
                  <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-amber-800" />
                        <h4 className="text-sm font-bold text-amber-950">
                          Pre-Field Operation Checklist & Calibration
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                        {Object.values(checkedPreOpItems).filter(Boolean).length} of {activeEquipmentData.preOperationChecklist.length} Verified
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeEquipmentData.preOperationChecklist.map((item, idx) => {
                        const isChecked = !!checkedPreOpItems[item];
                        return (
                          <div
                            key={idx}
                            onClick={() => togglePreOpItem(item)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-white border-amber-100 text-stone-700 hover:bg-amber-50/60'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-stone-400 shrink-0" />
                            )}
                            <span className={`text-xs font-medium ${isChecked ? 'line-through opacity-80' : ''}`}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-stone-500 italic pt-1">
                      Safety Warning: {activeEquipmentData.safetyNotes}
                    </p>
                  </div>

                  {/* Maintenance History Log */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-emerald-950 font-serif">
                          Maintenance & Calibration History Ledger
                        </h4>
                        <p className="text-xs text-stone-500">
                          {activeEquipmentData.maintenanceHistory.length} historical service records verified
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddServiceOpen(true)}
                        className="text-xs font-bold text-emerald-800 bg-lime-100 hover:bg-lime-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Log Service
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeEquipmentData.maintenanceHistory.map(log => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-950">{log.title}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-stone-200 text-stone-800">
                                {log.serviceType}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-900">
                              ₹{log.costInr.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed">{log.details}</p>

                          <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200/60 font-mono">
                            <span>Service Date: {log.date}</span>
                            <span>Technician: {log.technician}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* CASE 3: ACTIVE FARM CROP INSTANT SUMMARY             */}
              {/* ---------------------------------------------------- */}
              {scannedResult.type === 'FARM_CROP' && (
                <div className="bg-white rounded-2xl border border-lime-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-4">
                    <CropDoodle cropName={scannedResult.data.cropName} stage={scannedResult.data.stage} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-white">
                          {scannedResult.data.stage} Stage
                        </span>
                        <span className="text-xs font-mono text-stone-500">Plot ID: {scannedResult.data.farmId}</span>
                      </div>
                      <h3 className="text-xl font-bold text-emerald-950 mt-1">{scannedResult.data.cropName}</h3>
                      <p className="text-xs text-stone-500">Variety: {scannedResult.data.variety || 'Hybrid Strain'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl">
                      <span className="text-stone-500 block">Planted Date</span>
                      <strong className="text-emerald-950 font-mono">{scannedResult.data.plantingDate}</strong>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl">
                      <span className="text-stone-500 block">Harvest Target</span>
                      <strong className="text-emerald-950 font-mono">{scannedResult.data.expectedHarvestDate}</strong>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl">
                      <span className="text-stone-500 block">Health Index</span>
                      <strong className="text-emerald-800 font-mono">{scannedResult.data.healthScore || 95}/100</strong>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl">
                      <span className="text-stone-500 block">Estimated Yield</span>
                      <strong className="text-emerald-950 font-mono">{scannedResult.data.estimatedYieldKg || 2000} kg</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      setActiveTab('crops');
                    }}
                    className="w-full py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>View Crop Lifecycle in Farm Ledger</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* CASE 4: RAW DATA PAYLOAD                             */}
              {/* ---------------------------------------------------- */}
              {scannedResult.type === 'RAW_DATA' && (
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Info className="w-5 h-5 text-emerald-700" />
                    <h4 className="text-sm font-bold text-emerald-950">Raw QR Payload Captured</h4>
                  </div>
                  <pre className="p-3 bg-stone-900 text-lime-400 rounded-xl text-xs font-mono overflow-x-auto">
                    {scannedResult.text}
                  </pre>
                  <p className="text-xs text-stone-500">
                    This QR code is not pre-indexed in the certified seed or implement catalog, but was captured successfully.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-white border-t border-lime-100 p-3.5 sm:p-4 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AGRITECH Deterministic Zero-Sensor Optical Scanner</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* SUB-MODAL: LOG EQUIPMENT SERVICE RECORD                   */}
      {/* ========================================================= */}
      {isAddServiceOpen && activeEquipmentData && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-emerald-950">Log Service & Maintenance</h3>
                <p className="text-xs text-stone-500">{activeEquipmentData.name}</p>
              </div>
              <button onClick={() => setIsAddServiceOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEquipmentService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Service Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engine Oil Flush & Nozzle Calibration"
                  value={newServiceTitle}
                  onChange={e => setNewServiceTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Service Type</label>
                  <select
                    value={newServiceType}
                    onChange={e => setNewServiceType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  >
                    <option value="Routine Service">Routine Service</option>
                    <option value="Part Replacement">Part Replacement</option>
                    <option value="Calibration">Calibration</option>
                    <option value="Emergency Repair">Emergency Repair</option>
                    <option value="Pre-Season Overhaul">Pre-Season Overhaul</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={newServiceCost}
                    onChange={e => setNewServiceCost(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Technician / Workshop</label>
                <input
                  type="text"
                  placeholder="e.g. Ludhiana Co-op Mechanics or Self-Maintenance"
                  value={newServiceTech}
                  onChange={e => setNewServiceTech(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Notes & Replaced Parts</label>
                <textarea
                  rows={2}
                  placeholder="Describe parts fitted, oil grade, and recalibrated metrics..."
                  value={newServiceDetails}
                  onChange={e => setNewServiceDetails(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Service Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-MODAL: FIELD TAG PRINTER / EXPORTER                   */}
      {/* ========================================================= */}
      {isPrintTagOpen && tagToPrint && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-stone-200 text-center">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-mono">
                {tagToPrint.type} Tag Preview
              </span>
              <button onClick={() => setIsPrintTagOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Card Design */}
            <div className="bg-white border-2 border-dashed border-stone-400 p-4 rounded-xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 border-b border-stone-200 pb-1">
                <span>AGRITECH FIELD TAG</span>
                <span className="font-mono text-emerald-900">VERIFIED</span>
              </div>

              <div className="w-36 h-36 mx-auto bg-stone-100 rounded-lg flex items-center justify-center border border-stone-300 p-2">
                {/* SVG Visual QR Mockup */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-950" fill="currentColor">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="14" height="14" fill="currentColor" />
                  
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="74" y="12" width="14" height="14" fill="currentColor" />
                  
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="74" width="14" height="14" fill="currentColor" />

                  {/* QR random data dots */}
                  <rect x="42" y="10" width="7" height="7" />
                  <rect x="52" y="10" width="7" height="7" />
                  <rect x="42" y="24" width="7" height="7" />
                  <rect x="52" y="32" width="7" height="7" />
                  <rect x="10" y="45" width="7" height="7" />
                  <rect x="22" y="45" width="7" height="7" />
                  <rect x="34" y="45" width="7" height="7" />
                  <rect x="46" y="45" width="7" height="7" />
                  <rect x="58" y="45" width="7" height="7" />
                  <rect x="70" y="45" width="7" height="7" />
                  <rect x="82" y="45" width="7" height="7" />
                  <rect x="45" y="60" width="7" height="7" />
                  <rect x="60" y="60" width="7" height="7" />
                  <rect x="75" y="60" width="7" height="7" />
                  <rect x="45" y="75" width="7" height="7" />
                  <rect x="60" y="75" width="7" height="7" />
                  <rect x="75" y="75" width="7" height="7" />
                  <rect x="50" y="87" width="7" height="7" />
                  <rect x="65" y="87" width="7" height="7" />
                  <rect x="80" y="87" width="7" height="7" />
                </svg>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-emerald-950 font-serif">{tagToPrint.title}</h4>
                <p className="text-[11px] text-stone-500 font-mono">{tagToPrint.subtitle}</p>
                <p className="text-[9px] text-stone-400 font-mono">{tagToPrint.code}</p>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
                showToast('Print dialog initiated.');
              }}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF Field Tag
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
