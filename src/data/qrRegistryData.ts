import { SeedPacketData, EquipmentData, ScannedQRResult, Crop } from '../types';

export const SEED_PACKET_REGISTRY: SeedPacketData[] = [
  {
    qrCode: 'SEED_WHEAT_HD2967_B8821',
    lotNumber: 'IND-PB-2026-WHT-8821',
    brand: 'National Seeds Corp / ICAR',
    variety: 'HD-2967 (Pusa Sindhu Ganga)',
    cropName: 'Wheat (Winter / Rabi)',
    category: 'Cereal',
    knowledgeBaseId: 'crop_wheat',
    germinationRate: 96,
    physicalPurity: 98.8,
    geneticPurity: 99.5,
    moisturePercent: 10.2,
    seedTreatment: 'Carbendazim 50% WP (2g/kg) + Trichoderma viride bio-fungicide (5g/kg)',
    recommendedSeedRateKgPerAcre: 40,
    idealSowingDepthCm: '4.0 - 5.0 cm',
    recommendedSpacing: '20 cm row-to-row with continuous drill',
    packingDate: '2026-09-15',
    expiryDate: '2027-06-30',
    certificationAgency: 'Punjab State Seed Certification Authority (PSSCA)',
    certifiedTagColor: 'Blue (Certified Class I)',
    lifecycleOverview: 'Semi-dwarf high yielding variety with high resistance to yellow and brown rust. Average maturity 125-130 days with bold amber grains.',
    stageGuide: [
      {
        stage: 'Sowing',
        dayRange: 'Day 0 - 21',
        advice: 'Ensure adequate seedbed moisture. Critical Crown Root Initiation (CRI) at 20-25 DAS.',
        criticalTask: 'Schedule 1st Irrigation exactly at CRI stage (21 days).'
      },
      {
        stage: 'Vegetative',
        dayRange: 'Day 22 - 60',
        advice: 'Active tillering and jointing. Apply 1st top-dressing of nitrogen.',
        criticalTask: 'Broadcast Urea (45 kg/acre) prior to 2nd irrigation.'
      },
      {
        stage: 'Flowering',
        dayRange: 'Day 61 - 95',
        advice: 'Heading and anthesis. Avoid water stress to ensure full spikelet fertility.',
        criticalTask: 'Apply foliar spray of 13:0:45 potassium nitrate if heat stress exceeds 30°C.'
      },
      {
        stage: 'Maturity',
        dayRange: 'Day 96 - 125',
        advice: 'Milking and dough formation. Cease irrigation 10 days before physiological maturity.',
        criticalTask: 'Monitor grain hardness and leaf yellowing.'
      },
      {
        stage: 'Harvested',
        dayRange: 'Day 125+',
        advice: 'Harvest when grain moisture drops below 12-14% to prevent storage fungal spoilage.',
        criticalTask: 'Clean combine thresher drum to prevent seed breakage.'
      }
    ],
    preHarvestIntervalDays: 14
  },
  {
    qrCode: 'SEED_RICE_PUSA1121_R409',
    lotNumber: 'IND-HR-2026-RIC-0409',
    brand: 'IARI Pusa / AgriGold Seeds',
    variety: 'Pusa Basmati 1121 Extra Long',
    cropName: 'Rice (Kharif / Basmati)',
    category: 'Cereal',
    knowledgeBaseId: 'crop_rice',
    germinationRate: 94,
    physicalPurity: 99.0,
    geneticPurity: 99.8,
    moisturePercent: 11.0,
    seedTreatment: 'Pseudomonas fluorescens 10g/kg + Streptocycline 1g/10L water for bacterial blight soak',
    recommendedSeedRateKgPerAcre: 6.5,
    idealSowingDepthCm: '2.0 - 3.0 cm in puddled nursery',
    recommendedSpacing: '20 cm × 15 cm (2-3 seedlings per hill)',
    packingDate: '2026-05-10',
    expiryDate: '2027-04-30',
    certificationAgency: 'Haryana Seeds Development Corporation',
    certifiedTagColor: 'White (Foundation Seed Class)',
    lifecycleOverview: 'World famous extra long slender aromatic Basmati grain with elongation ratio exceeding 2.2x upon cooking. Duration ~140 days.',
    stageGuide: [
      {
        stage: 'Sowing',
        dayRange: 'Day 0 - 25',
        advice: 'Nursery raising with raised beds and thin water film. Transplant 25-day old healthy seedlings.',
        criticalTask: 'Dip roots in Zinc sulfate & carbendazim slurry before transplanting.'
      },
      {
        stage: 'Vegetative',
        dayRange: 'Day 26 - 65',
        advice: 'Tillering and maximum panicle initiation. Maintain 2-3 cm standing water.',
        criticalTask: 'Intermittent drying (AWD) to strengthen root aeration and control stem borer.'
      },
      {
        stage: 'Flowering',
        dayRange: 'Day 66 - 105',
        advice: 'Booting, heading, and flowering. Critical water demand stage.',
        criticalTask: 'Install pheromone traps for Yellow Stem Borer.'
      },
      {
        stage: 'Maturity',
        dayRange: 'Day 106 - 140',
        advice: 'Grain hardening from milky to golden amber. Drain field water 12 days prior to harvest.',
        criticalTask: 'Check lower third of panicle grains for 85% straw color change.'
      }
    ],
    preHarvestIntervalDays: 21
  },
  {
    qrCode: 'SEED_TOMATO_ABHINAV_F1_552',
    lotNumber: 'SEM-MAH-2026-TOM-552',
    brand: 'Mahyco Seminis Hybrid Seeds',
    variety: 'Abhinav F1 High-Yield Hybrid',
    cropName: 'Tomato (Hybrid Roma)',
    category: 'Vegetable',
    knowledgeBaseId: 'crop_tomato',
    germinationRate: 98,
    physicalPurity: 99.5,
    geneticPurity: 99.9,
    moisturePercent: 7.5,
    seedTreatment: 'Imidacloprid 70WS (5g/kg) + Thiram (2g/kg) for early sucking pest and damping-off immunity',
    recommendedSeedRateKgPerAcre: 0.08, // 80 grams / acre for hybrid pro-tray nursery
    idealSowingDepthCm: '0.5 - 1.0 cm in cocopeat pro-trays',
    recommendedSpacing: '90 cm bed width × 45 cm plant distance on silver-black mulch',
    packingDate: '2026-08-01',
    expiryDate: '2027-07-31',
    certificationAgency: 'National Seed Association of India (NSAI Verified)',
    certifiedTagColor: 'Green (Hybrid Gold Class)',
    lifecycleOverview: 'Determinate vigorous hybrid with deep red, firm square-round fruits (90-100g) and excellent shelf life for long-distance transport. Resistant to TyLCV (Tomato Yellow Leaf Curl Virus).',
    stageGuide: [
      {
        stage: 'Sowing',
        dayRange: 'Day 0 - 25',
        advice: 'Raise in shade-net pro-trays with 104-cavities. Transplant at 4-leaf stage.',
        criticalTask: 'Soil drenching with Trichoderma & Mycorrhizae before transplanting.'
      },
      {
        stage: 'Vegetative',
        dayRange: 'Day 26 - 45',
        advice: 'Rapid vine extension. Install bamboo/trellis stakes with nylon string.',
        criticalTask: 'Prune suckers below first flower truss; start fertigation with 19:19:19.'
      },
      {
        stage: 'Flowering',
        dayRange: 'Day 46 - 70',
        advice: 'Heavy cluster blooming. Maintain regular drip cycles to avoid blossom end rot.',
        criticalTask: 'Foliar spray of Calcium Chelate + Boron 20% (1g/L).'
      },
      {
        stage: 'Maturity',
        dayRange: 'Day 71 - 95',
        advice: 'Fruit development and breaker stage coloring.',
        criticalTask: 'Harvest at breaker/pink stage for market transport or red ripe for local processing.'
      }
    ],
    preHarvestIntervalDays: 3
  },
  {
    qrCode: 'SEED_COTTON_BOLLGARD2_RCH659',
    lotNumber: 'BAY-IND-2026-COT-104',
    brand: 'Rasi Seeds / Bayer CropScience',
    variety: 'RCH-659 BG-II (Bollgard II Bt)',
    cropName: 'Cotton (Bt Hybrid)',
    category: 'Cash Crop',
    knowledgeBaseId: 'crop_cotton',
    germinationRate: 92,
    physicalPurity: 98.0,
    geneticPurity: 99.0,
    moisturePercent: 9.0,
    seedTreatment: 'Cruiser 70WS (Thiamethoxam 7g/kg) against early jassids and thrips',
    recommendedSeedRateKgPerAcre: 1.8,
    idealSowingDepthCm: '3.0 - 4.0 cm',
    recommendedSpacing: '90 cm × 60 cm on ridges',
    packingDate: '2026-04-20',
    expiryDate: '2027-03-31',
    certificationAgency: 'Gujarat State Seed Certification Agency',
    certifiedTagColor: 'Blue (Certified Bt Hybrid)',
    lifecycleOverview: 'High volume sympodial branching cotton with heavy boll retention (5.5 - 6.0g per boll) and superior fiber length (29-30 mm). Dual Bt gene protection against American & Pink bollworms.',
    stageGuide: [
      {
        stage: 'Sowing',
        dayRange: 'Day 0 - 30',
        advice: 'Sow on ridges after pre-soaking irrigation. Gap filling within 10 days.',
        criticalTask: 'Plant non-Bt refuge border rows around plot perimeter.'
      },
      {
        stage: 'Vegetative',
        dayRange: 'Day 31 - 70',
        advice: 'Square (bud) initiation and monopodial branch management.',
        criticalTask: 'Nipping/detopping of terminal shoot at 80-90 DAS to promote boll formation.'
      },
      {
        stage: 'Flowering',
        dayRange: 'Day 71 - 110',
        advice: 'Peak boll setting. High potassium and magnesium demand.',
        criticalTask: 'Spray 1% Magnesium Sulfate + 1% Urea to prevent leaf reddening.'
      },
      {
        stage: 'Maturity',
        dayRange: 'Day 111 - 160',
        advice: 'Boll bursting and lint fluffing.',
        criticalTask: 'Pick clean, dry bolls in morning hours to prevent leaf trash contamination.'
      }
    ],
    preHarvestIntervalDays: 15
  },
  {
    qrCode: 'SEED_MUSTARD_PUSA_JAIKISAN',
    lotNumber: 'IARI-2026-MUS-902',
    brand: 'IARI / Bharat BioSeeds',
    variety: 'Pusa Jai Kisan (Bio-902)',
    cropName: 'Mustard (Indian Sarson)',
    category: 'Cash Crop',
    knowledgeBaseId: 'crop_mustard',
    germinationRate: 95,
    physicalPurity: 99.0,
    geneticPurity: 99.5,
    moisturePercent: 8.0,
    seedTreatment: 'Apron 35SD (Metalaxyl 6g/kg) against Downy Mildew & White Rust',
    recommendedSeedRateKgPerAcre: 1.5,
    idealSowingDepthCm: '2.5 - 3.0 cm',
    recommendedSpacing: '30 cm × 10 cm with thinning at 15 DAS',
    packingDate: '2026-09-01',
    expiryDate: '2027-08-31',
    certificationAgency: 'Rajasthan State Seed & Organic Certification Agency',
    certifiedTagColor: 'Blue (Certified Class I)',
    lifecycleOverview: 'Somaclonal high-oil content (40%) variety with bold dark brown seeds and strong tolerance to lodging and aphids. Duration 115-120 days.',
    stageGuide: [
      {
        stage: 'Sowing',
        dayRange: 'Day 0 - 20',
        advice: 'Fine tilth seedbed with conserved moisture. Essential thinning at 15-20 days.',
        criticalTask: 'Maintain 1 plant every 10cm along the row to avoid crowding.'
      },
      {
        stage: 'Vegetative',
        dayRange: 'Day 21 - 50',
        advice: 'Stem branching and early rosette development.',
        criticalTask: 'Apply 1st irrigation at flowering initiation (30-35 DAS) along with Sulfur 20kg/acre.'
      },
      {
        stage: 'Flowering',
        dayRange: 'Day 51 - 85',
        advice: 'Dense bright yellow bloom. Crucial for honeybee foraging.',
        criticalTask: 'Avoid daytime insecticide sprays to protect pollinator bees.'
      },
      {
        stage: 'Maturity',
        dayRange: 'Day 86 - 120',
        advice: 'Siliquae (seed pods) turn golden yellow and seeds rattle inside.',
        criticalTask: 'Harvest early morning when pods are moist to prevent shattering loss.'
      }
    ],
    preHarvestIntervalDays: 14
  }
];

export const EQUIPMENT_REGISTRY: EquipmentData[] = [
  {
    qrCode: 'EQ_MAHINDRA_575_TRAC',
    assetTag: 'TRAC-MH-575-01',
    name: 'Mahindra 575 DI Sarpanch 45HP Tractor',
    model: '575 DI Bhoomiputra 4WD (45 HP)',
    category: 'Tractor & Tillage',
    serialNumber: 'MH-M575-2023-889104',
    purchaseYear: 2023,
    operatingHours: 642,
    acreageServiced: 185,
    status: 'Optimal',
    lastServiceDate: '2026-07-14',
    nextServiceDue: '2026-10-15 (at 700 Hours)',
    oilAndFilterStatus: 'Engine 15W40 Oil replaced 42 hrs ago (Good condition)',
    batteryOrPressureStatus: 'Exide 12V 88Ah (Voltage 13.8V Healthy)',
    preOperationChecklist: [
      'Check engine oil dipstick level between MIN & MAX markings',
      'Check radiator coolant overflow reservoir',
      'Inspect 3-point linkage hitch pins & linchpins',
      'Verify front tire pressure (24 PSI) & rear drive tires (14 PSI for tillage)',
      'Clean oil-bath air cleaner pre-filter bowl'
    ],
    safetyNotes: 'Always disengage PTO drive shaft before dismounting. Never tow heavy implements on slopes exceeding 15 degrees without ballast weights.',
    linkedPlotOrCrop: 'Assigned to North Field Plot (Wheat) & Riverside Orchard',
    maintenanceHistory: [
      {
        id: 'maint_trac_01',
        date: '2026-07-14',
        title: '600-Hour Scheduled Multi-Point Service',
        serviceType: 'Routine Service',
        technician: 'Mahindra Authorized Service Hub (Ludhiana)',
        costInr: 4850,
        details: 'Replaced engine oil, primary & secondary fuel filters, cleaned oil strainer, greased all 14 chassis nipples.'
      },
      {
        id: 'maint_trac_02',
        date: '2026-03-20',
        title: 'Hydraulic Lift Seal & O-Ring Replacement',
        serviceType: 'Part Replacement',
        technician: 'Ramesh Agro Mechanics',
        costInr: 2200,
        details: 'Replaced worn draft control piston seals to prevent slow lowering of 9-tyne cultivator.'
      },
      {
        id: 'maint_trac_03',
        date: '2025-10-05',
        title: 'Pre-Rabi Sowing Clutch Free-Play Calibration',
        serviceType: 'Calibration',
        technician: 'On-Farm Self Maintenance',
        costInr: 350,
        details: 'Adjusted clutch linkage pedal free play to 25mm and lubricated throw-out bearing.'
      }
    ]
  },
  {
    qrCode: 'EQ_STIHL_SR450_SPRAYER',
    assetTag: 'SPRY-ST-450-02',
    name: 'STIHL SR-450 2-in-1 Mistblower & Duster',
    model: 'SR-450 Professional Backpack Knapsack (14 Liter Tank)',
    category: 'Sprayers & Protection',
    serialNumber: 'ST-SR450-2024-44120',
    purchaseYear: 2024,
    operatingHours: 118,
    acreageServiced: 64,
    status: 'Due for Service',
    lastServiceDate: '2026-05-18',
    nextServiceDue: '2026-08-30 (Overdue by 5 hours for Spark Plug & Mesh Flush)',
    oilAndFilterStatus: '2-Stroke 50:1 Synthetic Mix (Strainer Clean)',
    batteryOrPressureStatus: 'Diaphragm Discharge Pressure: 42 PSI (Requires Nozzle Calibration)',
    preOperationChecklist: [
      'Calibrate hollow cone nozzle flow rate with pure clean water',
      'Check 14-liter chemical tank gasket for zero-leak seal',
      'Inspect backpack harness straps and quick-release chest buckle',
      'Confirm 50:1 2-stroke fuel mix (Do not use unmixed petrol)',
      'Wear PPE face shield, nitrile gloves, and chemical apron'
    ],
    safetyNotes: 'Never spray against wind direction exceeding 12 km/h. Flush pump assembly with clean soapy water immediately after pesticide application.',
    linkedPlotOrCrop: 'Assigned to South Vegetable Patch (Tomato Blight Protection)',
    maintenanceHistory: [
      {
        id: 'maint_spry_01',
        date: '2026-05-18',
        title: 'Carburetor Ultrasonic Cleaning & Diaphragm Kit',
        serviceType: 'Routine Service',
        technician: 'Kisan Power Tool Works',
        costInr: 850,
        details: 'Cleaned jet needles clogged with ethanol gum; replaced fuel tank breather grommet.'
      },
      {
        id: 'maint_spry_02',
        date: '2025-11-12',
        title: 'Replacement of Brass Swirl Plate & Nozzle Tips',
        serviceType: 'Part Replacement',
        technician: 'Self Service',
        costInr: 450,
        details: 'Installed new 1.2mm ceramic hollow-cone tip for ultra-fine micro-droplet misting.'
      }
    ]
  },
  {
    qrCode: 'EQ_JAIN_DRIP_PUMP_SYS',
    assetTag: 'IRR-JN-DRIP-99',
    name: 'Jain Solar Automation Drip Controller & Sand Filter',
    model: 'Automatic Multi-Venturi Fertigation Unit (5 HP)',
    category: 'Irrigation & Pumps',
    serialNumber: 'JN-AGRO-2023-77219',
    purchaseYear: 2023,
    operatingHours: 1420,
    acreageServiced: 12,
    status: 'Optimal',
    lastServiceDate: '2026-08-02',
    nextServiceDue: '2026-11-01',
    oilAndFilterStatus: 'Disc Filter 120 Mesh (Flushed weekly) & Sand Filter Backwashed',
    batteryOrPressureStatus: 'Operating Line Pressure: 2.2 kg/cm² (Nominal 1.8 - 2.5 kg/cm²)',
    preOperationChecklist: [
      'Check differential pressure gauge across sand filter (Delta P < 0.5 bar)',
      'Ensure Venturi suction valve is closed prior to pump boot',
      'Inspect sub-main flush valves at row ends for silt build-up',
      'Verify solar inverter DC input voltage from PV array (380V DC)',
      'Confirm fertigation acid wash dosing rate to prevent dripper calcium scaling'
    ],
    safetyNotes: 'Disconnect solar isolator DC switch before opening electrical control cabinet. Use safety goggles when handling Phosphoric acid for emitter cleaning.',
    linkedPlotOrCrop: 'Primary Drip Grid connected to South Farm (Tomato & Corn Beds)',
    maintenanceHistory: [
      {
        id: 'maint_irr_01',
        date: '2026-08-02',
        title: 'Seasonal Disc Filter Acid Cleansing & Backwash Valve Overhaul',
        serviceType: 'Routine Service',
        technician: 'Jain Irrigation Field Engineer',
        costInr: 1600,
        details: 'Soaked 120-mesh disc rings in 0.5% nitric acid solution to dissolve hard water carbonate scale.'
      },
      {
        id: 'maint_irr_02',
        date: '2026-01-15',
        title: 'Solenoid Master Valve Diaphragm Replacement',
        serviceType: 'Part Replacement',
        technician: 'Jain Field Service',
        costInr: 1250,
        details: 'Replaced split 2-inch rubber diaphragm that was causing continuous slow seepage to Zone 2.'
      }
    ]
  },
  {
    qrCode: 'EQ_SOIL_NPK_SENSOR_PROBE',
    assetTag: 'SENS-NPK-7IN1-01',
    name: 'AgroSense 7-in-1 Soil Optical & EC Probe',
    model: 'RS485 Modbus NPK + Temp + Moisture + pH + EC Field Sensor',
    category: 'Sensors & Testing',
    serialNumber: 'AGS-7N-2025-00912',
    purchaseYear: 2025,
    operatingHours: 290,
    acreageServiced: 25,
    status: 'Optimal',
    lastServiceDate: '2026-07-28',
    nextServiceDue: '2026-10-30',
    oilAndFilterStatus: 'Stainless Steel 316L Electrodes Polished',
    batteryOrPressureStatus: 'Li-Ion 18650 Pack: 88% (Solar recharge trickle intact)',
    preOperationChecklist: [
      'Clean 5-pin stainless steel probe tips with distilled water',
      'Check calibration zero-point using standard pH 4.0 & 7.0 buffer solution',
      'Insert vertically into undisturbed root-zone soil to 15 cm depth',
      'Wait 60 seconds for thermal equilibration before recording values'
    ],
    safetyNotes: 'Do not hammer probe into stony or compacted hardpan soil to prevent electrode bending.',
    linkedPlotOrCrop: 'Portable Field Tool for All Plots',
    maintenanceHistory: [
      {
        id: 'maint_sens_01',
        date: '2026-07-28',
        title: 'Buffer Calibration & Electrode De-oxidation',
        serviceType: 'Calibration',
        technician: 'AgroSense Lab Tech',
        costInr: 500,
        details: 'Calibrated pH 6.8 and EC 1.413 mS/cm standards. Precision confirmed within ±1.5%.'
      }
    ]
  }
];

/**
 * Universal QR code resolver: decodes text into either a SeedPacketData, EquipmentData,
 * Farm Crop (if matching crop ID or plot tag), or raw structured data.
 */
export function decodeQRText(rawText: string, farmCrops: Crop[] = []): ScannedQRResult {
  const trimmed = (rawText || '').trim();

  // 1. Try matching Seed Packet registry
  const matchedSeed = SEED_PACKET_REGISTRY.find(
    s => s.qrCode.toLowerCase() === trimmed.toLowerCase() ||
         s.lotNumber.toLowerCase() === trimmed.toLowerCase() ||
         trimmed.toLowerCase().includes(s.qrCode.toLowerCase())
  );
  if (matchedSeed) {
    return { type: 'SEED', data: matchedSeed };
  }

  // 2. Try fuzzy seed matches (e.g. "SEED:WHEAT", "WHEAT_HD2967", "TOMATO_ABHINAV", etc.)
  if (trimmed.toUpperCase().includes('WHEAT') || trimmed.toUpperCase().includes('HD2967')) {
    const wheatSeed = SEED_PACKET_REGISTRY.find(s => s.qrCode.includes('WHEAT'));
    if (wheatSeed) return { type: 'SEED', data: wheatSeed };
  }
  if (trimmed.toUpperCase().includes('RICE') || trimmed.toUpperCase().includes('PUSA1121') || trimmed.toUpperCase().includes('BASMATI')) {
    const riceSeed = SEED_PACKET_REGISTRY.find(s => s.qrCode.includes('RICE'));
    if (riceSeed) return { type: 'SEED', data: riceSeed };
  }
  if (trimmed.toUpperCase().includes('TOMATO') || trimmed.toUpperCase().includes('ABHINAV')) {
    const tomSeed = SEED_PACKET_REGISTRY.find(s => s.qrCode.includes('TOMATO'));
    if (tomSeed) return { type: 'SEED', data: tomSeed };
  }
  if (trimmed.toUpperCase().includes('COTTON') || trimmed.toUpperCase().includes('BOLLGARD')) {
    const cotSeed = SEED_PACKET_REGISTRY.find(s => s.qrCode.includes('COTTON'));
    if (cotSeed) return { type: 'SEED', data: cotSeed };
  }
  if (trimmed.toUpperCase().includes('MUSTARD') || trimmed.toUpperCase().includes('SARSON')) {
    const musSeed = SEED_PACKET_REGISTRY.find(s => s.qrCode.includes('MUSTARD'));
    if (musSeed) return { type: 'SEED', data: musSeed };
  }

  // 3. Try matching Equipment registry
  const matchedEq = EQUIPMENT_REGISTRY.find(
    e => e.qrCode.toLowerCase() === trimmed.toLowerCase() ||
         e.assetTag.toLowerCase() === trimmed.toLowerCase() ||
         e.serialNumber.toLowerCase() === trimmed.toLowerCase() ||
         trimmed.toLowerCase().includes(e.qrCode.toLowerCase())
  );
  if (matchedEq) {
    return { type: 'EQUIPMENT', data: matchedEq };
  }

  // Fuzzy equipment match
  if (trimmed.toUpperCase().includes('TRACTOR') || trimmed.toUpperCase().includes('MAHINDRA') || trimmed.toUpperCase().includes('TRAC')) {
    const trac = EQUIPMENT_REGISTRY.find(e => e.category === 'Tractor & Tillage');
    if (trac) return { type: 'EQUIPMENT', data: trac };
  }
  if (trimmed.toUpperCase().includes('SPRAYER') || trimmed.toUpperCase().includes('STIHL') || trimmed.toUpperCase().includes('SPRY')) {
    const spry = EQUIPMENT_REGISTRY.find(e => e.category === 'Sprayers & Protection');
    if (spry) return { type: 'EQUIPMENT', data: spry };
  }
  if (trimmed.toUpperCase().includes('DRIP') || trimmed.toUpperCase().includes('IRRIGATION') || trimmed.toUpperCase().includes('PUMP')) {
    const drip = EQUIPMENT_REGISTRY.find(e => e.category === 'Irrigation & Pumps');
    if (drip) return { type: 'EQUIPMENT', data: drip };
  }
  if (trimmed.toUpperCase().includes('SENSOR') || trimmed.toUpperCase().includes('NPK') || trimmed.toUpperCase().includes('SOIL')) {
    const sens = EQUIPMENT_REGISTRY.find(e => e.category === 'Sensors & Testing');
    if (sens) return { type: 'EQUIPMENT', data: sens };
  }

  // 4. Try matching existing farmer's active crops
  const matchedCrop = farmCrops.find(
    c => c.id.toLowerCase() === trimmed.toLowerCase() ||
         trimmed.toLowerCase().includes(c.id.toLowerCase()) ||
         trimmed.toLowerCase().includes(c.cropName.toLowerCase())
  );
  if (matchedCrop) {
    return { type: 'FARM_CROP', data: matchedCrop };
  }

  // 5. Try parsing JSON if encoded
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed.type === 'SEED' && parsed.data) return { type: 'SEED', data: parsed.data };
    if (parsed.type === 'EQUIPMENT' && parsed.data) return { type: 'EQUIPMENT', data: parsed.data };
    if (parsed.cropName && parsed.stage) return { type: 'FARM_CROP', data: parsed as Crop };
  } catch (e) {
    // Not json
  }

  return { type: 'RAW_DATA', text: trimmed };
}
