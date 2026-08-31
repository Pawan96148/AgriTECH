import { CropPresetKnowledge } from '../types';

export const CROP_KNOWLEDGE_BASE: CropPresetKnowledge[] = [
  {
    id: 'crop_wheat',
    name: 'Wheat (Winter / Rabi)',
    scientificName: 'Triticum aestivum',
    category: 'Cereal',
    idealSoil: ['Loamy', 'Clay', 'Black'],
    durationDays: 125,
    sowingMonths: 'October - November',
    waterDemand: 'Moderate',
    idealTempRange: '15°C - 25°C',
    averageYieldPerAcre: '1,800 - 2,400 kg',
    description: 'A staple winter cereal crop requiring 4-6 scheduled irrigations at critical growth stages (CRI, tillering, jointing, flowering, milk, dough).',
    fertilizerPlan: 'Basal: NPK 12:32:16 (50kg/acre) + Urea top-dressing at 1st irrigation (21 DAS) and 2nd irrigation (45 DAS).',
    pestRisks: ['Yellow Rust', 'Aphids', 'Termites', 'Loose Smut'],
    harvestingSigns: 'Grains turn hard and golden amber; moisture drops below 14%; straw turns brittle dry.',
    keyStages: [
      {
        stage: 'Sowing',
        dayOffset: 0,
        description: 'Seed germination & Crown Root Initiation (CRI at 21 days).',
        recommendedActivities: ['Basal Fertilizer Application', 'First Irrigation (CRI 20-25 DAS)']
      },
      {
        stage: 'Vegetative',
        dayOffset: 30,
        description: 'Active tillering and stem elongation.',
        recommendedActivities: ['Top-dress Urea (45kg)', 'Broadleaf weed control']
      },
      {
        stage: 'Flowering',
        dayOffset: 70,
        description: 'Ear emergence, anthesis, and grain pollination.',
        recommendedActivities: ['Foliar micronutrient spray', 'Critical 3rd irrigation']
      },
      {
        stage: 'Maturity',
        dayOffset: 110,
        description: 'Milk and dough stage ripening.',
        recommendedActivities: ['Pre-harvest inspection', 'Stop irrigation 10 days before harvest']
      },
      {
        stage: 'Harvested',
        dayOffset: 125,
        description: 'Grain ready for mechanical combine or manual cutting.',
        recommendedActivities: ['Threshing & bagging', 'Moisture check']
      }
    ]
  },
  {
    id: 'crop_tomato',
    name: 'Tomato (Hybrid Roma)',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    idealSoil: ['Loamy', 'Sandy', 'Red', 'Black'],
    durationDays: 95,
    sowingMonths: 'Year-round (Aug-Nov & Jan-Feb best)',
    waterDemand: 'Moderate',
    idealTempRange: '18°C - 30°C',
    averageYieldPerAcre: '10,000 - 15,000 kg',
    description: 'High-value horticultural crop with intensive nutrient requirements and delicate disease sensitivity to excess surface moisture.',
    fertilizerPlan: 'Basal: Well-decomposed FYM (5 tonnes) + DAP (50kg). Fertigation with 19:19:19 every 4 days, potassium nitrate during fruit setting.',
    pestRisks: ['Early Blight', 'Fruit Borer (Helicoverpa)', 'Whitefly (Leaf Curl Virus)', 'Bacterial Wilt'],
    harvestingSigns: 'Breaker stage (blush color turning red), firm fruit walls with glossy finish.',
    keyStages: [
      {
        stage: 'Sowing',
        dayOffset: 0,
        description: 'Nursery seedling transplanting to raised beds with mulch.',
        recommendedActivities: ['Root dip fungicide treatment', 'Light initial drip irrigation']
      },
      {
        stage: 'Vegetative',
        dayOffset: 20,
        description: 'Branching and staking/trellising setup.',
        recommendedActivities: ['Side-shoot pruning', 'Preventive copper fungicide spray']
      },
      {
        stage: 'Flowering',
        dayOffset: 45,
        description: 'Flower cluster emergence and initial fruit set.',
        recommendedActivities: ['Boron & Calcium spray for blossom end rot prevention', 'Bee pollination friendly intervals']
      },
      {
        stage: 'Maturity',
        dayOffset: 75,
        description: 'Fruit swelling and color development.',
        recommendedActivities: ['Potassium booster application', 'Pheromone trap monitoring']
      },
      {
        stage: 'Harvested',
        dayOffset: 95,
        description: 'Multiple picking cycles every 3-4 days.',
        recommendedActivities: ['Grade & crate sorting', 'Cold storage dispatch']
      }
    ]
  },
  {
    id: 'crop_rice',
    name: 'Rice / Paddy (Basmati)',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    idealSoil: ['Clay', 'Loamy', 'Silt'],
    durationDays: 140,
    sowingMonths: 'June - July (Kharif)',
    waterDemand: 'High',
    idealTempRange: '22°C - 34°C',
    averageYieldPerAcre: '1,600 - 2,200 kg',
    description: 'Kharif season staple requiring saturated to submerged soil conditions until 2 weeks before harvesting.',
    fertilizerPlan: 'Basal: NPK 10:26:26 (50kg) + Zinc Sulphate (10kg). Split Urea top dressing at 20, 40, and 60 days after transplanting.',
    pestRisks: ['Stem Borer', 'Blast Disease', 'Brown Planthopper (BPH)', 'Bacterial Leaf Blight'],
    harvestingSigns: '80% of grains on panicles turn straw golden yellow; flag leaf starts drying.',
    keyStages: [
      {
        stage: 'Sowing',
        dayOffset: 0,
        description: 'Nursery raising and puddled field transplanting.',
        recommendedActivities: ['Puddle field leveling', 'Pre-emergence herbicide']
      },
      {
        stage: 'Vegetative',
        dayOffset: 30,
        description: 'Maximum tillering phase with continuous shallow water.',
        recommendedActivities: ['First Urea split', 'Stem borer scouting']
      },
      {
        stage: 'Flowering',
        dayOffset: 85,
        description: 'Panicle emergence and anthesis.',
        recommendedActivities: ['Tricyclazole preventive spray for blast', 'Maintain 3cm water depth']
      },
      {
        stage: 'Maturity',
        dayOffset: 120,
        description: 'Grain filling and physiological maturity.',
        recommendedActivities: ['Drain standing water', 'Field drying for machinery access']
      },
      {
        stage: 'Harvested',
        dayOffset: 140,
        description: 'Combine harvesting at 18-20% grain moisture.',
        recommendedActivities: ['Sun drying on tarpaulins', 'Milling / storage']
      }
    ]
  },
  {
    id: 'crop_maize',
    name: 'Maize / Corn (Hybrid)',
    scientificName: 'Zea mays',
    category: 'Cereal',
    idealSoil: ['Loamy', 'Black', 'Red', 'Silt'],
    durationDays: 105,
    sowingMonths: 'June - July / Feb - March',
    waterDemand: 'Moderate',
    idealTempRange: '20°C - 32°C',
    averageYieldPerAcre: '2,500 - 3,200 kg',
    description: 'High photosynthetic efficiency C4 crop highly vulnerable to waterlogging and Fall Armyworm.',
    fertilizerPlan: 'Basal: DAP (50kg) + MOP (25kg). Urea split at knee-high (30 DAS) and tasseling stage (55 DAS).',
    pestRisks: ['Fall Armyworm (Spodoptera frugiperda)', 'Stem Borer', 'Turcicum Leaf Blight'],
    harvestingSigns: 'Black layer formation at grain base; husks turn papery pale brown.',
    keyStages: [
      {
        stage: 'Sowing',
        dayOffset: 0,
        description: 'Ridge and furrow planting with 60cm row spacing.',
        recommendedActivities: ['Seed treatment with Imidacloprid', 'Basal fertilizer placement']
      },
      {
        stage: 'Vegetative',
        dayOffset: 25,
        description: 'Knee-high growth stage with rapid nutrient uptake.',
        recommendedActivities: ['Top dress Urea', 'Earthing up soil to support roots']
      },
      {
        stage: 'Flowering',
        dayOffset: 55,
        description: 'Tasseling (male) and silking (female) stage.',
        recommendedActivities: ['Critical irrigation', 'Fall armyworm whorl scouting']
      },
      {
        stage: 'Maturity',
        dayOffset: 85,
        description: 'Dent stage and grain dry down.',
        recommendedActivities: ['Monitor cob moisture', 'Protect against bird damage']
      },
      {
        stage: 'Harvested',
        dayOffset: 105,
        description: 'Cob de-husking and mechanical sheller separation.',
        recommendedActivities: ['Grain drying to 12% moisture', 'Stover chopping for fodder']
      }
    ]
  },
  {
    id: 'crop_soybean',
    name: 'Soybean (Legume)',
    scientificName: 'Glycine max',
    category: 'Pulse',
    idealSoil: ['Black', 'Loamy', 'Clay'],
    durationDays: 95,
    sowingMonths: 'June - July',
    waterDemand: 'Moderate',
    idealTempRange: '21°C - 30°C',
    averageYieldPerAcre: '900 - 1,400 kg',
    description: 'Nitrogen-fixing oilseed pulse that restores soil fertility while requiring good drainage.',
    fertilizerPlan: 'Basal: Single Super Phosphate (SSP 150kg) + MOP (20kg) + Rhizobium culture seed inoculation.',
    pestRisks: ['Girdle Beetle', 'Spodoptera caterpillar', 'Yellow Mosaic Virus', 'Rust'],
    harvestingSigns: 'Leaves turn yellow and shed; pods turn light golden and rattle when shaken.',
    keyStages: [
      {
        stage: 'Sowing',
        dayOffset: 0,
        description: 'Broadbed furrow sowing after monsoon arrival.',
        recommendedActivities: ['Rhizobium seed treatment', 'Broad-spectrum pre-emergence spray']
      },
      {
        stage: 'Vegetative',
        dayOffset: 25,
        description: 'Branching and root nodule formation.',
        recommendedActivities: ['Interculture weeding', 'Girdle beetle inspection']
      },
      {
        stage: 'Flowering',
        dayOffset: 50,
        description: 'Purple/white blossom emergence.',
        recommendedActivities: ['Water stress avoidance', 'Emamectin benzoate spray if pods attacked']
      },
      {
        stage: 'Maturity',
        dayOffset: 80,
        description: 'Pod filling and leaf senescence.',
        recommendedActivities: ['Stop supplemental irrigation', 'Scout for pod shatter risk']
      },
      {
        stage: 'Harvested',
        dayOffset: 95,
        description: 'Harvesting when seed moisture is 13-15% to avoid shattering.',
        recommendedActivities: ['Gentle threshing', 'Seed grading for next season']
      }
    ]
  },
  {
    id: 'crop_cotton',
    name: 'Cotton (Bt Hybrid)',
    scientificName: 'Gossypium hirsutum',
    category: 'Cash Crop',
    idealSoil: ['Black', 'Loamy', 'Silt'],
    durationDays: 160,
    sowingMonths: 'May - June',
    waterDemand: 'Moderate',
    idealTempRange: '25°C - 35°C',
    averageYieldPerAcre: '1,000 - 1,600 kg seed cotton',
    description: 'Long-duration cash crop producing natural lint fibers with distinct square, flowering, and boll development windows.',
    fertilizerPlan: 'Basal: NPK 10:26:26 (60kg). Top-dressing nitrogen and magnesium sulphate at square and peak boll formation.',
    pestRisks: ['Pink Bollworm', 'Thrips & Jassids', 'Whitefly', 'Bacterial Blight'],
    harvestingSigns: 'Bolls burst open with fluffy white lint; leaves start drying.',
    keyStages: [
      {
        stage: 'Sowing',
        dayOffset: 0,
        description: 'Square bed sowing with 90x60 cm spacing.',
        recommendedActivities: ['Imidacloprid treated seed sowing', 'Initial furrow irrigation']
      },
      {
        stage: 'Vegetative',
        dayOffset: 35,
        description: 'Square (flower bud) initiation and sympodial branching.',
        recommendedActivities: ['Sucking pest management', 'Urea + Potash top-dress']
      },
      {
        stage: 'Flowering',
        dayOffset: 70,
        description: 'Peak blooming and early boll formation.',
        recommendedActivities: ['Pheromone trap installation for PBW', 'Magnesium foliar spray']
      },
      {
        stage: 'Maturity',
        dayOffset: 120,
        description: 'Boll maturation and lint fluffing.',
        recommendedActivities: ['Defoliation management', 'Prevent late waterlogging']
      },
      {
        stage: 'Harvested',
        dayOffset: 160,
        description: 'Multiple hand-picking sessions of clean lint on dry mornings.',
        recommendedActivities: ['Clean sun-drying', 'Grading by staple length']
      }
    ]
  }
];
