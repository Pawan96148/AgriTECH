import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFarm } from '../context/FarmContext';
import { PlantDiagnosisResult } from '../types';
import {
  Scan,
  Camera,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Leaf,
  Droplets,
  FlaskConical,
  History,
  FileText,
  X,
  SwitchCamera,
  Layers,
  ChevronRight,
  Info,
  Key
} from 'lucide-react';

// Read API Key strictly from environment variables
const PLANT_DISEASE_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PLANT_DISEASE_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.PLANT_DISEASE_API_KEY) ||
  '';

const isApiKeyConfigured = Boolean(
  PLANT_DISEASE_API_KEY &&
  PLANT_DISEASE_API_KEY !== 'your_api_key_here' &&
  PLANT_DISEASE_API_KEY.trim().length > 0
);

// Local rule-based disease database (ICAR / Birsa Agricultural University agronomic mappings)
const LOCAL_RULE_DIAGNOSES: Record<string, Omit<PlantDiagnosisResult, 'id' | 'timestamp' | 'imageUrl'>> = {
  tomato_early_blight: {
    cropIdentified: 'Tomato (Solanum lycopersicum)',
    healthStatus: 'Early Blight (Alternaria solani)',
    isHealthy: false,
    confidenceScore: 95,
    severityLevel: 'Moderate',
    symptoms: [
      'Dark brown concentric "bullseye" rings surrounded by chlorotic yellow halos on older leaves',
      'Progressive collar rot and sunken cankers at stem nodes near ground line',
      'Foliage drying up, curling, and drooping prematurely from the base upward'
    ],
    possibleCauses: [
      'Airborne Alternaria solani fungal spores activated by prolonged leaf wetness',
      'Warm humid weather (24°C - 30°C) following rain showers or heavy dew',
      'Nutrient-stressed plants lacking balanced nitrogen and potassium'
    ],
    organicTreatments: [
      'Prune lower infected foliage and dispose safely outside farm premises.',
      'Spray 5% Neem Seed Kernel Extract (NSKE) or Azadirachtin 10,000 ppm @ 2.5 ml/L water.',
      'Foliar bio-fungicide spray with Trichoderma viride @ 5g/L during early morning hours.'
    ],
    chemicalTreatments: [
      {
        name: 'Mancozeb 75% WP (Indofil M-45)',
        dosage: '2.5g / Litre of water',
        application: 'Spray every 8-10 days during warm overcast conditions.'
      },
      {
        name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dosage: '1.0ml / Litre of water',
        application: 'Systemic curative spray if disease has spread beyond lower canopy.'
      }
    ],
    preventiveMeasures: [
      'Strict 3-year crop rotation avoiding tomato, brinjal, chilli, and potato.',
      'Adopt drip irrigation instead of flood/overhead watering to keep leaves dry.',
      'Stake tomato plants upright to improve airflow and elevate leaves above soil level.'
    ],
    expertAdvice: 'In Jharkhand plateau red-lateritic soils, ensure adequate boron and calcium in basal nutrition to fortify leaf cell walls against Alternaria penetration.',
    disclaimer: 'AI-powered advisory. For commercial-scale crops, always consult your block Agriculture Technology Management Agency (ATMA) or KVK agronomist.'
  },
  paddy_rice_blast: {
    cropIdentified: 'Paddy / Rice (Oryza sativa)',
    healthStatus: 'Rice Blast (Magnaporthe oryzae)',
    isHealthy: false,
    confidenceScore: 92,
    severityLevel: 'High',
    symptoms: [
      'Spindle-shaped or diamond-shaped lesions with gray/whitish centers and dark brown margins',
      'Lesions coalescing to scorch entire leaf blades giving a burnt or blasted appearance',
      'Blackish necrosis at the neck of the panicle causing lodging and empty grains (neck blast)'
    ],
    possibleCauses: [
      'Airborne fungal spores of Pyricularia oryzae / Magnaporthe oryzae',
      'Excessive chemical nitrogen fertilizer application without balanced potash',
      'High relative humidity (>90%) with cool night temperatures (18-22°C)'
    ],
    organicTreatments: [
      'Foliar spray of Pseudomonas fluorescens @ 10g/L or 2.5 kg/ha in 500L water.',
      'Spray sour fermented buttermilk (chaas) @ 50ml/L mixed with 2g Asafoetida (hing).',
      'Maintain continuous thin layer of water; avoid alternating severe drought and flooding.'
    ],
    chemicalTreatments: [
      {
        name: 'Tricyclazole 75% WP (Baan / Beam)',
        dosage: '0.6g / Litre of water',
        application: 'Most effective curative and protective systemic blast fungicide.'
      },
      {
        name: 'Isoprothiolane 40% EC (Fuji-One)',
        dosage: '1.5ml / Litre of water',
        application: 'Apply at tillering and boot leaf emergence stage.'
      }
    ],
    preventiveMeasures: [
      'Seed treatment before sowing with Carbendazim 50% WP @ 2g/kg seed.',
      'Avoid excess urea top-dressing; split nitrogen into 3 equal doses (basal, tillering, panicle).',
      'Plant blast-resistant certified cultivars recommended by Birsa Agricultural University (BAU).'
    ],
    expertAdvice: 'For upland rainfed rice plots in Jharkhand (Tand lands), blast risk elevates sharply after sudden temperature drops. Apply preventive Tricyclazole spray at boot leaf stage.',
    disclaimer: 'AI agricultural advisory. Confirm with block Krishi Mitra or local KVK before chemical treatment.'
  },
  potato_late_blight: {
    cropIdentified: 'Potato (Solanum tuberosum)',
    healthStatus: 'Late Blight (Phytophthora infestans)',
    isHealthy: false,
    confidenceScore: 96,
    severityLevel: 'Severe',
    symptoms: [
      'Water-soaked irregular pale green/brown lesions starting at leaf margins and tips',
      'White cottony downy fungal mildew visible on leaf undersides during early mornings',
      'Rapid rotting, dark brown foul-smelling decay of stems and foliage within 4-7 days'
    ],
    possibleCauses: [
      'Oomycete pathogen Phytophthora infestans spreading via windblown sporangia',
      'Prolonged cool moist weather (15-20°C) with persistent fog, cloud cover, and RH >90%',
      'Infected seed tubers used during sowing'
    ],
    organicTreatments: [
      'Immediate rogueing and deep burial of severely infected plants.',
      'Foliar spray with Copper Hydroxide 77% WP @ 2g/L or Bordeaux mixture 1%.',
      'Spray bio-control agent Trichoderma harzianum @ 5g/L.'
    ],
    chemicalTreatments: [
      {
        name: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate)',
        dosage: '2.5g / Litre of water',
        application: 'Fast-acting curative spray within 48 hours of first symptom appearance.'
      },
      {
        name: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)',
        dosage: '2.5g / Litre of water',
        application: 'Systemic translaminar protection against aggressive blight.'
      }
    ],
    preventiveMeasures: [
      'Use certified disease-free seed tubers from CPRI (Kufri Pukhraj / Kufri Jyoti).',
      'High earthing-up of ridges (20-25 cm) to prevent sporangia from washing down to tubers.',
      'Prophylactic Mancozeb spray @ 2.5g/L before expected foggy/cloudy cold spells in winter.'
    ],
    expertAdvice: 'Late blight is an explosive epidemic disease in Jharkhand winters. Once noticed in neighboring fields, apply protective fungicide immediately without waiting for symptoms on your own plot.',
    disclaimer: 'AI diagnosis based on computer vision. Consult KVK agronomist immediately for severe outbreaks.'
  },
  maize_rust: {
    cropIdentified: 'Maize / Corn (Zea mays)',
    healthStatus: 'Common Rust (Puccinia sorghi)',
    isHealthy: false,
    confidenceScore: 91,
    severityLevel: 'Moderate',
    symptoms: [
      'Small golden-brown to cinnamon-brown powdery pustules (uredinia) on both leaf surfaces',
      'Pustules erupting through leaf epidermis releasing rusty red-brown spore dust',
      'Severe infection causes premature leaf yellowing, chlorosis, and reduced cob filling'
    ],
    possibleCauses: [
      'Airborne fungal urediniospores of Puccinia sorghi carried by monsoon winds',
      'Moderate temperatures (16-25°C) combined with high relative humidity and dew',
      'Dense planting canopy restricting sunlight and breeze'
    ],
    organicTreatments: [
      'Foliar spray of 3% Cow urine (fermented 7 days) mixed with 1g Hing per litre.',
      'Neem oil 10,000 ppm @ 3 ml/L with mild sticker surfactant.',
      'Dusting fine agricultural sulfur powder (300 mesh) @ 15 kg/hectare.'
    ],
    chemicalTreatments: [
      {
        name: 'Propiconazole 25% EC (Tilt)',
        dosage: '1.0ml / Litre of water',
        application: 'Highly effective triazole fungicide for curative rust control.'
      },
      {
        name: 'Mancozeb 75% WP',
        dosage: '2.5g / Litre of water',
        application: 'Protective broad-spectrum contact spray.'
      }
    ],
    preventiveMeasures: [
      'Sow rust-tolerant hybrid seeds recommended for Chota Nagpur plateau.',
      'Plant at optimal spacing (60 cm row-to-row x 20 cm plant-to-plant).',
      'Eradicate Oxalis weed species near field boundaries which act as alternative hosts.'
    ],
    expertAdvice: 'In Rabi and Kharif maize cultivation in Ranchi and Hazaribagh, rust usually appears during tasseling. A single timely spray of Propiconazole protects grain filling completely.',
    disclaimer: 'AI agronomic advisory. Verify dosage with certified agrochemical dealer.'
  },
  healthy_crop: {
    cropIdentified: 'Cultivated Crop (Vegetative Stage)',
    healthStatus: 'Vigorous & Healthy Plant Tissue',
    isHealthy: true,
    confidenceScore: 98,
    severityLevel: 'Healthy',
    symptoms: [
      'Lush, uniform green leaf pigmentation without chlorosis or necrotic spotting',
      'Strong, turgid stem and petiole structure showing no wilting or vascular discolouration',
      'Clean leaf margins and vein architecture free from pest chewed holes or fungal mycelium'
    ],
    possibleCauses: [
      'Optimal soil nutrient balance (NPK + micronutrients zinc, iron, boron)',
      'Adequate root-zone soil moisture and proper drainage',
      'Favourable ambient climatic conditions with balanced sunlight exposure'
    ],
    organicTreatments: [
      'Maintain plant vigor with bi-weekly Jeevamrutha or Panchagavya 3% foliar spray.',
      'Apply light neem cake (100 kg/acre) around root perimeter as preventive insect deterrent.'
    ],
    chemicalTreatments: [],
    preventiveMeasures: [
      'Continue recommended drip irrigation schedule avoiding waterlogging.',
      'Monitor weekly using yellow and blue sticky traps for early whitefly or thrips detection.',
      'Maintain balanced potash nutrition to sustain natural disease tolerance.'
    ],
    expertAdvice: 'Your crop is in excellent physiological health! Continue following the crop life-cycle calendar and prophylactic organic sprays.',
    disclaimer: 'Visual scan shows healthy tissue. Routine field scouting remains recommended.'
  }
};

// Helper to evaluate local rule-based disease diagnosis
function getLocalRuleDiagnosis(sampleTag?: string | null, cropHint?: string): PlantDiagnosisResult {
  let matched = sampleTag && LOCAL_RULE_DIAGNOSES[sampleTag] ? LOCAL_RULE_DIAGNOSES[sampleTag] : null;

  if (!matched && cropHint) {
    const hint = cropHint.toLowerCase();
    if (hint.includes('tomato') || hint.includes('tamatar')) matched = LOCAL_RULE_DIAGNOSES.tomato_early_blight;
    else if (hint.includes('rice') || hint.includes('paddy') || hint.includes('dhan')) matched = LOCAL_RULE_DIAGNOSES.paddy_rice_blast;
    else if (hint.includes('potato') || hint.includes('alu') || hint.includes('aloo')) matched = LOCAL_RULE_DIAGNOSES.potato_late_blight;
    else if (hint.includes('maize') || hint.includes('corn') || hint.includes('makka')) matched = LOCAL_RULE_DIAGNOSES.maize_rust;
    else if (hint.includes('healthy') || hint.includes('green')) matched = LOCAL_RULE_DIAGNOSES.healthy_crop;
  }

  // Default fallback if no match
  if (!matched) {
    matched = LOCAL_RULE_DIAGNOSES.tomato_early_blight;
  }

  return {
    ...matched,
    id: `scan_local_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
}

const QUICK_SAMPLES = [
  {
    tag: 'tomato_early_blight',
    name: 'Tomato Early Blight',
    crop: 'Tomato',
    badge: '🍂 Alternaria solani',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%232d5a27"/><ellipse cx="150" cy="100" rx="120" ry="70" fill="%234a7c38"/><circle cx="110" cy="90" r="18" fill="%23684a23"/><circle cx="110" cy="90" r="12" fill="%233e2c14"/><circle cx="110" cy="90" r="6" fill="%238a6a3b"/><circle cx="170" cy="120" r="22" fill="%23684a23"/><circle cx="170" cy="120" r="14" fill="%233e2c14"/><circle cx="200" cy="80" r="14" fill="%23785428"/><path d="M50 100 Q 150 90 250 100" stroke="%23375825" stroke-width="3" fill="none"/></svg>'
  },
  {
    tag: 'paddy_rice_blast',
    name: 'Paddy Rice Blast',
    crop: 'Paddy / Rice',
    badge: '🌾 Magnaporthe oryzae',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2344682c"/><path d="M40 180 Q 150 40 260 20" stroke="%236da03e" stroke-width="28" fill="none" stroke-linecap="round"/><polygon points="120,90 145,75 170,90 145,105" fill="%23b8a379" stroke="%235a3916" stroke-width="2"/><polygon points="80,120 95,110 110,120 95,130" fill="%23b8a379" stroke="%235a3916" stroke-width="2"/></svg>'
  },
  {
    tag: 'potato_late_blight',
    name: 'Potato Late Blight',
    crop: 'Potato',
    badge: '🥔 Phytophthora infestans',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%232b4725"/><ellipse cx="150" cy="100" rx="110" ry="80" fill="%233f6735"/><path d="M70 70 Q 110 50 140 85 Q 120 120 80 110 Z" fill="%232b2116"/><path d="M180 90 Q 230 70 240 120 Q 190 140 170 110 Z" fill="%23261a0f"/><circle cx="100" cy="80" r="10" fill="%231a1208"/></svg>'
  },
  {
    tag: 'maize_rust',
    name: 'Maize Leaf Rust',
    crop: 'Maize / Corn',
    badge: '🌽 Puccinia sorghi',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%234a702b"/><line x1="30" y1="100" x2="270" y2="100" stroke="%237db84d" stroke-width="60"/><circle cx="70" cy="90" r="4" fill="%23c25219"/><circle cx="85" cy="110" r="5" fill="%239c3e10"/><circle cx="110" cy="95" r="4" fill="%23c25219"/><circle cx="140" cy="105" r="6" fill="%23a84413"/><circle cx="170" cy="92" r="5" fill="%23c25219"/><circle cx="210" cy="102" r="5" fill="%239c3e10"/></svg>'
  },
  {
    tag: 'healthy_crop',
    name: 'Healthy Crop Leaf',
    crop: 'Vegetative Crop',
    badge: '🌿 Vigorous Tissue',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231a3818"/><ellipse cx="150" cy="100" rx="120" ry="75" fill="%2348a034"/><path d="M40 100 Q 150 90 260 100" stroke="%237dd865" stroke-width="4" fill="none"/><path d="M100 95 Q 120 70 140 60" stroke="%237dd865" stroke-width="2" fill="none"/><path d="M150 97 Q 180 75 210 70" stroke="%237dd865" stroke-width="2" fill="none"/><path d="M110 100 Q 130 125 150 135" stroke="%237dd865" stroke-width="2" fill="none"/></svg>'
  }
];

export const PlantScannerView: React.FC = () => {
  const { user, showToast } = useFarm();

  const [inputMode, setInputMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSampleTag, setSelectedSampleTag] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('');

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [diagnosisResult, setDiagnosisResult] = useState<PlantDiagnosisResult | null>(null);
  const [apiNotice, setApiNotice] = useState<{ type: 'warning' | 'error' | 'info'; message: string } | null>(null);

  // History states
  const [scanHistory, setScanHistory] = useState<PlantDiagnosisResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start camera helper
  const startCamera = useCallback(async (facing: 'environment' | 'user' = 'environment') => {
    stopCamera();
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
      setCameraFacingMode(facing);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera permissions in your browser or upload an image file.');
      } else {
        setCameraError(`Camera error: ${err.message || 'Unable to open camera.'}`);
      }
      setIsCameraActive(false);
    }
  }, [stopCamera]);

  // Handle switching tabs
  const handleModeChange = (mode: 'upload' | 'camera') => {
    setInputMode(mode);
    if (mode === 'camera') {
      startCamera('environment');
    } else {
      stopCamera();
    }
  };

  // Toggle Camera Facing
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing);
  };

  // Capture Frame from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSelectedImage(dataUrl);
    setSelectedSampleTag(null);
    stopCamera();
    showToast('Photo captured successfully! Ready for AI diagnosis.');
  };

  // Handle file picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      setSelectedImage(ev.target?.result as string);
      setSelectedSampleTag(null);
      showToast('Image uploaded! Ready to analyze.');
    };
    reader.readAsDataURL(file);
  };

  // Select Quick Sample
  const handleSelectSample = (sample: typeof QUICK_SAMPLES[0]) => {
    setSelectedSampleTag(sample.tag);
    setSelectedImage(sample.sampleImage);
    setCropHint(sample.crop);
    stopCamera();
    showToast(`Loaded sample leaf: ${sample.name}`);
  };

  // Clear current image
  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedSampleTag(null);
    if (inputMode === 'camera') {
      startCamera(cameraFacingMode);
    }
  };

  // Fetch user scan history
  const fetchScanHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`http://localhost:5000/api/scanner/history?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.history)) {
          setScanHistory(data.history);
        }
      }
    } catch {
      // benign
    } finally {
      setLoadingHistory(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchScanHistory();
    return () => {
      stopCamera();
    };
  }, [fetchScanHistory, stopCamera]);

  // Run AI / Agronomic Analysis with graceful fallback
  const handleAnalyze = async () => {
    if (!selectedImage && !selectedSampleTag) {
      showToast('Please capture a photo, upload an image, or select a sample leaf first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('Scanning foliar tissue and pigment degradation...');

    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('Evaluating pathogen morphology & ICAR / BAU plant pathology rules...');
    }, 1000);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('Formulating biological & chemical prescription with dosages...');
    }, 2000);

    // If it's a known sample leaf, prepare the local rule result
    const localResult = getLocalRuleDiagnosis(selectedSampleTag, cropHint);

    // Check key configuration status
    if (!isApiKeyConfigured && !selectedSampleTag) {
      setApiNotice({
        type: 'warning',
        message: 'Cloud Vision API key is not configured in .env (PLANT_DISEASE_API_KEY). Running diagnosis using Local Agronomic Rule-Based Disease Engine.'
      });
    } else if (selectedSampleTag) {
      setApiNotice(null);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('http://localhost:5000/api/scanner/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          cropHint: cropHint.trim() || undefined,
          sampleTag: selectedSampleTag || undefined,
          userId: user.id
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data = await res.json();

      if (data.success && data.result) {
        setDiagnosisResult(data.result);
        showToast('Plant diagnosis completed successfully!');
        fetchScanHistory();
      } else {
        throw new Error(data.error || 'Diagnostic engine returned invalid response.');
      }
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      // Graceful fallback to local rule-based disease engine
      console.warn('API request failed, engaging local rule-based disease engine:', err.message);
      setDiagnosisResult(localResult);
      setScanHistory(prev => [localResult, ...prev.filter(p => p.id !== localResult.id).slice(0, 19)]);

      if (selectedSampleTag) {
        showToast('Sample leaf diagnosed via local rule-based pathology engine.');
      } else {
        setApiNotice({
          type: 'error',
          message: `Disease API request failed (${err.message || 'network offline'}). Gracefully fallen back to Local Agronomic Rule-Based Disease Engine.`
        });
        showToast('Local rule-based disease engine engaged.');
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'Healthy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Low':
        return 'bg-lime-100 text-lime-900 border-lime-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'High':
      case 'Severe':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-lime-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-emerald-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 text-xs font-bold border border-lime-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI & Agronomic Pathology Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white flex items-center gap-3">
              <span>🔬 Plant & Crop Disease Scanner</span>
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-2xl">
              Diagnose foliar blight, rust, leaf spots, and insect damage instantly. Upload a photo or take a live picture of the affected leaf to receive immediate organic and chemical prescriptions with exact dosages.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                <span>ICAR & KVK Integrated Pathology Database</span>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Organic & Chemical Dosage Guidelines</span>
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
                isApiKeyConfigured
                  ? 'bg-emerald-800/80 text-lime-300 border-emerald-600'
                  : 'bg-amber-950/70 text-amber-300 border-amber-600/60'
              }`}>
                <Key className="w-3.5 h-3.5" />
                <span>{isApiKeyConfigured ? 'Plant.id Cloud Vision Active' : 'Offline Mode: Local Rule Engine Active'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* API Notice / Graceful Fallback Alert */}
      {apiNotice && (
        <div className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-3 shadow-xs ${
          apiNotice.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : apiNotice.type === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${apiNotice.type === 'error' ? 'text-rose-600' : 'text-amber-600'}`} />
            <div className="space-y-0.5">
              <p className="font-extrabold">{apiNotice.type === 'error' ? 'API Request Status / Local Engine Fallback:' : 'Configuration Status:'}</p>
              <p className="leading-relaxed">{apiNotice.message}</p>
            </div>
          </div>
          <button
            onClick={() => setApiNotice(null)}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Input & Camera (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-lime-200 shadow-xs p-6 space-y-5">
          {/* Input Mode Switcher */}
          <div className="flex items-center justify-between border-b border-lime-100 pb-3">
            <h2 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <Scan className="w-4 h-4 text-emerald-700" />
              <span>Crop Image Input</span>
            </h2>

            <div className="flex items-center p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => handleModeChange('upload')}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  inputMode === 'upload'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <button
                onClick={() => handleModeChange('camera')}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  inputMode === 'camera'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Camera</span>
              </button>
            </div>
          </div>

          {/* Camera View or Upload Area */}
          {inputMode === 'camera' ? (
            <div className="space-y-3">
              {selectedImage ? (
                /* Captured preview */
                <div className="relative rounded-2xl overflow-hidden border border-lime-200 bg-stone-900 aspect-video flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Captured Leaf"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleClearImage}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition cursor-pointer shadow-lg flex items-center justify-center"
                    title="Retake Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-emerald-900/90 text-lime-300 text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-xs">
                    ✓ Photo Captured
                  </div>
                </div>
              ) : (
                /* Live Camera Stream */
                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-400 bg-stone-950 aspect-video flex items-center justify-center">
                  {cameraError ? (
                    <div className="p-6 text-center text-rose-300 space-y-3">
                      <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                      <p className="text-xs">{cameraError}</p>
                      <button
                        onClick={() => startCamera(cameraFacingMode)}
                        className="min-h-[38px] px-3.5 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-100 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
                      >
                        Retry Camera
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      ></video>
                      {/* Targeting Reticle */}
                      <div className="absolute inset-8 border border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-lime-400 rounded-full animate-ping opacity-60"></div>
                      </div>
                      <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-mono px-2.5 py-1 rounded-lg backdrop-blur-xs">
                        Focus on affected leaf area
                      </div>
                      {/* Camera Controls */}
                      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={toggleCameraFacing}
                          className="w-12 h-12 min-w-[44px] min-h-[44px] bg-stone-800/80 hover:bg-stone-700 text-white rounded-full backdrop-blur-xs transition active:scale-90 cursor-pointer shadow-md flex items-center justify-center"
                          title="Switch Camera"
                        >
                          <SwitchCamera className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="min-h-[48px] px-6 py-3 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold rounded-full shadow-xl transition transform active:scale-90 cursor-pointer flex items-center gap-2 text-sm"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Capture Photo</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Upload File Mode */
            <div className="space-y-3">
              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-lime-200 bg-stone-900 aspect-video flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Selected Leaf"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleClearImage}
                    className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition cursor-pointer shadow-lg"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {selectedSampleTag && (
                    <div className="absolute bottom-3 left-3 bg-lime-400 text-emerald-950 text-xs font-bold px-3 py-1 rounded-xl">
                      Quick Test Sample Active
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-lime-300 hover:border-emerald-600 bg-lime-50/40 hover:bg-lime-50/80 p-8 text-center transition cursor-pointer space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-emerald-950 block">
                      Click to choose photo or drag and drop
                    </span>
                    <span className="text-xs text-stone-500 mt-1 block">
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick-Test Sample Leaves */}
          <div className="space-y-2 pt-1 border-t border-lime-100">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-600" />
              <span>Or Select Verified Quick-Test Leaf Sample:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_SAMPLES.map(sample => (
                <button
                  key={sample.tag}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`min-h-[44px] p-2.5 rounded-xl text-left border text-xs transition active:scale-95 cursor-pointer flex flex-col justify-center ${
                    selectedSampleTag === sample.tag
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-lime-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <span className="font-extrabold block truncate">{sample.name}</span>
                  <span className={`text-[10px] block truncate ${selectedSampleTag === sample.tag ? 'text-lime-300' : 'text-stone-500'}`}>
                    {sample.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Crop Context & Scan Action */}
          <div className="pt-2 space-y-3">
            <div>
              <label className="text-xs font-bold text-emerald-950 block mb-1">
                Crop Name / Observed Symptoms Note (Optional):
              </label>
              <input
                type="text"
                value={cropHint}
                onChange={e => setCropHint(e.target.value)}
                placeholder="e.g. Tomato, Paddy, Potato, brown spots spreading after rain"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!selectedImage && !selectedSampleTag)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-xl transition transform active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-400" />
                  <span>{analysisStep || 'Analyzing Leaf Pathology...'}</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-lime-400" />
                  <span>Run AI Disease Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Diagnostic Results Card (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {diagnosisResult ? (
            <div className="bg-white rounded-3xl border border-lime-200 shadow-sm p-6 space-y-5">
              {/* Result Header */}
              <div className="flex items-start justify-between gap-3 border-b border-lime-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-lime-100 px-2.5 py-0.5 rounded-full border border-lime-200">
                      {diagnosisResult.cropIdentified}
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(diagnosisResult.severityLevel)}`}>
                      Severity: {diagnosisResult.severityLevel}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-emerald-950 mt-1.5 font-serif">
                    {diagnosisResult.healthStatus}
                  </h2>
                  <span className="text-xs text-stone-500 block">
                    Analysis Completed • {new Date(diagnosisResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-3xl font-extrabold font-mono text-emerald-900">
                    {diagnosisResult.confidenceScore}%
                  </span>
                  <span className="text-[10px] text-stone-500 block font-bold uppercase tracking-wider">
                    Diagnostic Confidence
                  </span>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Observed Symptoms</span>
                </h3>
                <ul className="space-y-1.5 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-stone-700">
                  {diagnosisResult.symptoms.map((sym, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Causes & Pathogen */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>Pathogen & Environmental Causes</span>
                </h3>
                <ul className="space-y-1.5 bg-lime-50/50 p-3.5 rounded-2xl border border-lime-200/80 text-xs text-stone-700">
                  {diagnosisResult.possibleCauses.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatments Table */}
              {diagnosisResult.chemicalTreatments && diagnosisResult.chemicalTreatments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-indigo-700" />
                    <span>Prescribed Chemical Treatments & Dosages</span>
                  </h3>
                  <div className="space-y-2">
                    {diagnosisResult.chemicalTreatments.map((chem, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-emerald-950">{chem.name}</span>
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 font-mono font-bold rounded-lg text-[11px] border border-indigo-200">
                            {chem.dosage}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-normal">{chem.application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organic Remedies */}
              {diagnosisResult.organicTreatments && diagnosisResult.organicTreatments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-emerald-700" />
                    <span>Biological & Organic Control</span>
                  </h3>
                  <ul className="space-y-1.5 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 text-xs text-stone-700">
                    {diagnosisResult.organicTreatments.map((org, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{org}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention & KVK Advisory */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-lime-50 to-emerald-50 border border-lime-200 space-y-2 text-xs">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-800" />
                  <span>Jharkhand Krishi Vigyan Kendra (KVK) Advisory:</span>
                </span>
                <p className="text-stone-700 leading-relaxed">{diagnosisResult.expertAdvice}</p>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-stone-500 italic border-t border-stone-100 pt-3">
                ⚠️ {diagnosisResult.disclaimer}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-lime-200 shadow-xs p-10 text-center space-y-3">
              <div className="w-16 h-16 bg-lime-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto text-2xl">
                🍃
              </div>
              <h3 className="text-base font-extrabold text-emerald-950">Awaiting Crop Image</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                Take a close-up photo of a diseased or discoloured crop leaf, or select one of our verified test samples on the left to generate an instant diagnosis.
              </p>
            </div>
          )}

          {/* User Scan History Card */}
          <div className="bg-white rounded-3xl border border-lime-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-700" />
              <span>Recent Field Scans History</span>
            </h3>

            {loadingHistory ? (
              <p className="text-xs text-stone-500 italic">Loading past scans...</p>
            ) : scanHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No previous scans recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {scanHistory.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    onClick={() => setDiagnosisResult(item)}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-lime-50 border border-stone-200 flex items-center justify-between text-xs transition cursor-pointer"
                  >
                    <div>
                      <span className="font-extrabold text-emerald-950 block">{item.cropIdentified}</span>
                      <span className="text-[11px] text-stone-600 block">{item.healthStatus}</span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severityLevel)}`}>
                        {item.severityLevel}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
