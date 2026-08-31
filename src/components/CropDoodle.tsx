import React from 'react';

interface CropDoodleProps {
  cropName: string;
  stage?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const CropDoodle: React.FC<CropDoodleProps> = ({
  cropName,
  stage,
  className = '',
  size = 'md'
}) => {
  const nameLower = (cropName || '').toLowerCase();

  // Size mapping
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44'
  };

  const dimClass = sizeClasses[size] || sizeClasses.md;

  // Determine crop type
  let cropType: 'wheat' | 'rice' | 'tomato' | 'corn' | 'cotton' | 'soybean' | 'potato' | 'sugarcane' | 'mustard' | 'onion' | 'pulse' | 'generic' = 'generic';

  if (nameLower.includes('wheat') || nameLower.includes('gehun') || nameLower.includes('kanak')) {
    cropType = 'wheat';
  } else if (nameLower.includes('rice') || nameLower.includes('paddy') || nameLower.includes('dhan') || nameLower.includes('basmati')) {
    cropType = 'rice';
  } else if (nameLower.includes('tomato') || nameLower.includes('tamatar')) {
    cropType = 'tomato';
  } else if (nameLower.includes('corn') || nameLower.includes('maize') || nameLower.includes('makka')) {
    cropType = 'corn';
  } else if (nameLower.includes('cotton') || nameLower.includes('kapas')) {
    cropType = 'cotton';
  } else if (nameLower.includes('soybean') || nameLower.includes('soya')) {
    cropType = 'soybean';
  } else if (nameLower.includes('potato') || nameLower.includes('aloo')) {
    cropType = 'potato';
  } else if (nameLower.includes('sugarcane') || nameLower.includes('ganna')) {
    cropType = 'sugarcane';
  } else if (nameLower.includes('mustard') || nameLower.includes('sarson') || nameLower.includes('oilseed')) {
    cropType = 'mustard';
  } else if (nameLower.includes('onion') || nameLower.includes('pyaz') || nameLower.includes('garlic')) {
    cropType = 'onion';
  } else if (nameLower.includes('gram') || nameLower.includes('pulse') || nameLower.includes('chana') || nameLower.includes('dal') || nameLower.includes('lentil')) {
    cropType = 'pulse';
  }

  // Render SVG doodle according to cropType
  const renderSvg = () => {
    switch (cropType) {
      case 'wheat':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background aura circle */}
            <circle cx="50" cy="50" r="44" fill="#FEF9C3" opacity="0.6" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 3" />
            {/* Soil patch doodle */}
            <path d="M25 82 C35 78, 65 78, 75 82 C65 86, 35 86, 25 82 Z" fill="#D97706" opacity="0.3" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            {/* Main Central Wheat Stem */}
            <path d="M50 82 Q49 55 50 25" stroke="#CA8A04" strokeWidth="3.5" strokeLinecap="round" />
            {/* Left bent stalk */}
            <path d="M48 80 Q36 60 38 38" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
            {/* Right bent stalk */}
            <path d="M52 80 Q64 60 62 38" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Main Wheat Head Grains */}
            {/* Center ear */}
            <g fill="#FACC15" stroke="#A16207" strokeWidth="1.8" strokeLinejoin="round">
              <ellipse cx="44" cy="28" rx="4" ry="7" transform="rotate(-25 44 28)" />
              <ellipse cx="56" cy="28" rx="4" ry="7" transform="rotate(25 56 28)" />
              <ellipse cx="45" cy="38" rx="4.5" ry="7.5" transform="rotate(-20 45 38)" />
              <ellipse cx="55" cy="38" rx="4.5" ry="7.5" transform="rotate(20 55 38)" />
              <ellipse cx="46" cy="48" rx="4.5" ry="7.5" transform="rotate(-15 46 48)" />
              <ellipse cx="54" cy="48" rx="4.5" ry="7.5" transform="rotate(15 54 48)" />
              <ellipse cx="50" cy="20" rx="3.5" ry="6" />
            </g>
            {/* Awns / Bristles (Doodle whiskers) */}
            <path d="M41 24 L28 12 M59 24 L72 12 M42 34 L26 25 M58 34 L74 25 M50 16 L50 4" stroke="#A16207" strokeWidth="1.8" strokeLinecap="round" />
            
            {/* Left Stalk Grains */}
            <g fill="#FDE047" stroke="#A16207" strokeWidth="1.5">
              <ellipse cx="34" cy="40" rx="3.5" ry="5.5" transform="rotate(-35 34 40)" />
              <ellipse cx="42" cy="42" rx="3.5" ry="5.5" transform="rotate(10 42 42)" />
              <ellipse cx="37" cy="34" rx="3" ry="5" transform="rotate(-30 37 34)" />
              <path d="M34 32 L22 22 M37 28 L30 16" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Right Stalk Grains */}
            <g fill="#FDE047" stroke="#A16207" strokeWidth="1.5">
              <ellipse cx="66" cy="40" rx="3.5" ry="5.5" transform="rotate(35 66 40)" />
              <ellipse cx="58" cy="42" rx="3.5" ry="5.5" transform="rotate(-10 58 42)" />
              <ellipse cx="63" cy="34" rx="3" ry="5" transform="rotate(30 63 34)" />
              <path d="M66 32 L78 22 M63 28 L70 16" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Green Leaf Details */}
            <path d="M50 68 Q30 64 24 50 Q36 60 50 64" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
            <path d="M50 72 Q70 66 76 54 Q64 64 50 68" fill="#84CC16" stroke="#365314" strokeWidth="1.5" />

            {/* Cute Sparkle */}
            <path d="M78 18 L80 23 L85 25 L80 27 L78 32 L76 27 L71 25 L76 23 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          </svg>
        );

      case 'rice':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#ECFCCB" opacity="0.6" stroke="#84CC16" strokeWidth="2" strokeDasharray="4 3" />
            {/* Water Ripple Base */}
            <ellipse cx="50" cy="82" rx="30" ry="6" fill="#BAE6FD" opacity="0.7" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 2" />
            
            {/* Paddy Drooping Stalk (Characteristic arch) */}
            <path d="M42 82 Q42 55 48 38 Q54 22 75 28" stroke="#65A30D" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M38 82 Q34 60 30 42" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" />

            {/* Drooping Golden Grains along the curve */}
            <g fill="#FDE047" stroke="#854D0E" strokeWidth="1.5">
              <ellipse cx="56" cy="24" rx="3.5" ry="6" transform="rotate(45 56 24)" />
              <ellipse cx="63" cy="25" rx="3.5" ry="6" transform="rotate(65 63 25)" />
              <ellipse cx="70" cy="29" rx="3.5" ry="6" transform="rotate(85 70 29)" />
              <ellipse cx="76" cy="35" rx="3.5" ry="6" transform="rotate(110 76 35)" />
              <ellipse cx="78" cy="43" rx="3.5" ry="6" transform="rotate(130 78 43)" />
              <ellipse cx="76" cy="51" rx="3" ry="5.5" transform="rotate(145 76 51)" />

              {/* Sub-branches grains */}
              <ellipse cx="52" cy="30" rx="3" ry="5" transform="rotate(30 52 30)" />
              <ellipse cx="59" cy="33" rx="3" ry="5" transform="rotate(50 59 33)" />
              <ellipse cx="66" cy="38" rx="3" ry="5" transform="rotate(80 66 38)" />
            </g>

            {/* Slender Long Paddy Leaves */}
            <path d="M42 65 Q18 50 14 30 Q28 45 42 58" fill="#84CC16" stroke="#365314" strokeWidth="1.5" />
            <path d="M42 55 Q20 30 32 14 Q32 30 45 48" fill="#4D7C0F" stroke="#1A2E05" strokeWidth="1.5" />
            
            {/* Water Drops */}
            <circle cx="28" cy="74" r="2.5" fill="#38BDF8" />
            <circle cx="72" cy="76" r="2" fill="#38BDF8" />
            <path d="M50 82 L50 86" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'tomato':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#FFE4E6" opacity="0.6" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="4 3" />
            {/* Vine stem */}
            <path d="M30 85 Q45 70 48 50 Q52 30 40 18" stroke="#4D7C0F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M48 50 Q65 42 72 52" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
            <path d="M46 62 Q32 58 24 64" stroke="#4D7C0F" strokeWidth="2.5" strokeLinecap="round" />

            {/* Big Ripe Red Tomato */}
            <g>
              {/* Tomato Body */}
              <ellipse cx="68" cy="62" rx="19" ry="17" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
              {/* Highlight Gloss */}
              <path d="M58 55 Q63 50 70 51" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="76" cy="56" r="1.5" fill="#FFFFFF" />
              {/* Green Calyx / Sepals Doodle */}
              <path d="M68 47 L64 41 M68 47 L73 40 M68 47 L60 48 M68 47 L76 48 M68 47 L68 38" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="68" cy="46" rx="4" ry="2.5" fill="#22C55E" />
            </g>

            {/* Small Baby Tomato (Green/Orange) */}
            <g>
              <ellipse cx="28" cy="68" rx="11" ry="10" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
              <path d="M24 63 Q27 60 31 61" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M28 59 L25 54 M28 59 L31 54 M28 59 L22 58 M28 59 L34 58" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Serrated Tomato Foliage Leaves */}
            <path d="M40 28 Q22 22 20 12 Q32 20 42 24" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
            <path d="M48 36 Q70 20 78 14 Q68 28 52 34" fill="#84CC16" stroke="#365314" strokeWidth="1.5" />

            {/* Yellow Tomato Blossom */}
            <path d="M38 18 L34 14 M38 18 L42 14 M38 18 L32 18 M38 18 L44 18 M38 18 L38 22" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="38" cy="18" r="2.5" fill="#FACC15" />
          </svg>
        );

      case 'corn':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#FEF08A" opacity="0.5" stroke="#FACC15" strokeWidth="2" strokeDasharray="4 3" />
            {/* Thick Green Corn Stalk */}
            <path d="M50 86 L50 18" stroke="#4D7C0F" strokeWidth="4.5" strokeLinecap="round" />
            {/* Tassel at the Top */}
            <path d="M50 18 L50 8 M50 18 L42 10 M50 18 L58 10 M50 22 L38 16 M50 22 L62 16" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />

            {/* Arching Broad Leaves */}
            <path d="M50 70 Q20 62 12 40 Q28 54 50 64" fill="#84CC16" stroke="#365314" strokeWidth="2" />
            <path d="M50 60 Q80 50 88 28 Q72 45 50 54" fill="#65A30D" stroke="#365314" strokeWidth="2" />
            <path d="M50 45 Q22 35 16 18 Q30 30 50 38" fill="#84CC16" stroke="#365314" strokeWidth="2" />

            {/* Golden Cob with Green Husk */}
            <g transform="translate(50, 42) rotate(22)">
              {/* Golden Cob Body */}
              <rect x="0" y="-8" width="22" height="13" rx="6.5" fill="#FACC15" stroke="#B45309" strokeWidth="1.8" />
              {/* Kernel Grid Dots */}
              <circle cx="6" cy="-3" r="1.2" fill="#B45309" />
              <circle cx="11" cy="-3" r="1.2" fill="#B45309" />
              <circle cx="16" cy="-3" r="1.2" fill="#B45309" />
              <circle cx="6" cy="1" r="1.2" fill="#B45309" />
              <circle cx="11" cy="1" r="1.2" fill="#B45309" />
              <circle cx="16" cy="1" r="1.2" fill="#B45309" />
              {/* Corn Silk Tassels */}
              <path d="M22 -4 Q28 -8 32 -6 M22 -1 Q30 -2 34 0 M22 2 Q28 4 32 6" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
              {/* Green Husk Peeling Leaves */}
              <path d="M-2 -8 Q6 -14 16 -10 Q8 -6 0 -4" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
              <path d="M-2 5 Q8 12 18 8 Q8 4 0 2" fill="#84CC16" stroke="#365314" strokeWidth="1.5" />
            </g>
          </svg>
        );

      case 'cotton':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#F1F5F9" opacity="0.7" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 3" />
            {/* Woody Branch Stem */}
            <path d="M48 85 Q46 60 52 40" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M48 65 Q32 55 24 45" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 50 Q66 42 74 32" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

            {/* Main Center Fluffy Cotton Boll */}
            <g>
              {/* Brown Bract Leaves below boll */}
              <path d="M52 40 L44 32 M52 40 L52 28 M52 40 L60 32 M52 40 L40 40 M52 40 L64 40" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              {/* 4 Soft Puffy Cloud Lobes */}
              <circle cx="44" cy="24" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="60" cy="24" r="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="52" cy="15" r="9" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="52" cy="28" r="9" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.8" />
              {/* Cute fluffy creases */}
              <path d="M50 20 Q52 24 54 20" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Left Side Cotton Boll */}
            <g>
              <path d="M24 45 L18 38 M24 45 L24 34 M24 45 L30 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
              <circle cx="18" cy="32" r="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
              <circle cx="28" cy="32" r="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
              <circle cx="23" cy="25" r="6.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
            </g>

            {/* Right Side Opening Cotton Boll */}
            <g>
              <path d="M74 32 L80 26 M74 32 L74 22 M74 32 L68 26" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
              <circle cx="74" cy="20" r="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
              <circle cx="81" cy="24" r="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
            </g>

            {/* Palmately Lobed Leaves */}
            <path d="M48 70 Q62 68 70 78 Q58 82 48 74" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
            <path d="M48 60 Q28 62 20 72 Q34 76 46 64" fill="#84CC16" stroke="#365314" strokeWidth="1.5" />
          </svg>
        );

      case 'soybean':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#ECFCCB" opacity="0.6" stroke="#A3E635" strokeWidth="2" strokeDasharray="4 3" />
            {/* Plant Stem */}
            <path d="M50 85 Q48 55 50 25" stroke="#4D7C0F" strokeWidth="3.5" strokeLinecap="round" />

            {/* Trifoliate Leaves (Classic Soybean 3-leaf clusters) */}
            <g>
              <ellipse cx="50" cy="20" rx="9" ry="13" fill="#65A30D" stroke="#365314" strokeWidth="2" />
              <ellipse cx="36" cy="28" rx="8" ry="11" transform="rotate(-35 36 28)" fill="#84CC16" stroke="#365314" strokeWidth="2" />
              <ellipse cx="64" cy="28" rx="8" ry="11" transform="rotate(35 64 28)" fill="#84CC16" stroke="#365314" strokeWidth="2" />
            </g>

            {/* Cluster of Fuzzy Soybean Pods hanging */}
            {/* Left Pod with 3 bumps */}
            <g transform="translate(30, 45) rotate(-20)">
              <path d="M0 0 Q6 -8 20 -4 Q28 0 24 8 Q14 12 0 0 Z" fill="#CA8A04" stroke="#713F12" strokeWidth="1.8" />
              <circle cx="7" cy="0" r="2.5" fill="#EAB308" />
              <circle cx="14" cy="1" r="2.5" fill="#EAB308" />
              <circle cx="20" cy="3" r="2.5" fill="#EAB308" />
            </g>

            {/* Right Pod with 3 bumps */}
            <g transform="translate(48, 52) rotate(25)">
              <path d="M0 0 Q6 -8 20 -4 Q28 0 24 8 Q14 12 0 0 Z" fill="#84CC16" stroke="#3F6212" strokeWidth="1.8" />
              <circle cx="7" cy="0" r="2.5" fill="#A3E635" />
              <circle cx="14" cy="1" r="2.5" fill="#A3E635" />
              <circle cx="20" cy="3" r="2.5" fill="#A3E635" />
            </g>

            {/* Lower Hanging Pod */}
            <g transform="translate(38, 65) rotate(-10)">
              <path d="M0 0 Q6 -8 18 -4 Q25 0 21 8 Q12 11 0 0 Z" fill="#EAB308" stroke="#854D0E" strokeWidth="1.8" />
              <circle cx="6" cy="0" r="2" fill="#FEF08A" />
              <circle cx="12" cy="1" r="2" fill="#FEF08A" />
            </g>

            {/* Lower Side Leaves */}
            <path d="M48 60 Q24 50 18 36 Q32 46 48 56" fill="#84CC16" stroke="#365314" strokeWidth="1.5" />
            <path d="M52 60 Q76 50 82 36 Q68 46 52 56" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
          </svg>
        );

      case 'potato':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#FEF3C7" opacity="0.6" stroke="#FDE68A" strokeWidth="2" strokeDasharray="4 3" />
            {/* Ground Soil Divider Line */}
            <path d="M15 54 Q50 50 85 54" stroke="#92400E" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />

            {/* Above Ground Foliage */}
            <path d="M50 54 L50 25" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="50" cy="20" rx="9" ry="11" fill="#65A30D" stroke="#365314" strokeWidth="2" />
            <ellipse cx="38" cy="28" rx="8" ry="10" transform="rotate(-30 38 28)" fill="#84CC16" stroke="#365314" strokeWidth="2" />
            <ellipse cx="62" cy="28" rx="8" ry="10" transform="rotate(30 62 28)" fill="#84CC16" stroke="#365314" strokeWidth="2" />
            <ellipse cx="44" cy="38" rx="7" ry="9" transform="rotate(-20 44 38)" fill="#65A30D" stroke="#365314" strokeWidth="1.8" />
            <ellipse cx="56" cy="38" rx="7" ry="9" transform="rotate(20 56 38)" fill="#84CC16" stroke="#365314" strokeWidth="1.8" />

            {/* Star Potato Flower */}
            <circle cx="50" cy="10" r="4" fill="#E0E7FF" stroke="#4338CA" strokeWidth="1.5" />
            <circle cx="50" cy="10" r="1.5" fill="#FACC15" />

            {/* Underground Roots & Plump Tubers */}
            <path d="M50 54 L40 68 M50 54 L62 66 M50 54 L50 78" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            
            {/* Large Potato Tuber */}
            <ellipse cx="36" cy="74" rx="14" ry="10" transform="rotate(-15 36 74)" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            {/* Potato Eyes */}
            <circle cx="30" cy="72" r="1" fill="#78350F" />
            <circle cx="38" cy="76" r="1" fill="#78350F" />
            <circle cx="42" cy="71" r="1" fill="#78350F" />

            {/* Second Potato Tuber */}
            <ellipse cx="64" cy="72" rx="12" ry="9" transform="rotate(20 64 72)" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
            <circle cx="60" cy="70" r="1" fill="#78350F" />
            <circle cx="68" cy="74" r="1" fill="#78350F" />

            {/* Baby Tuber */}
            <circle cx="50" cy="84" r="6" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
          </svg>
        );

      case 'sugarcane':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#F0FDF4" opacity="0.6" stroke="#86EFAC" strokeWidth="2" strokeDasharray="4 3" />
            {/* Segmented Tall Thick Stalks */}
            {/* Main stalk */}
            <g stroke="#15803D" strokeWidth="1.8">
              {/* Segment 1 */}
              <rect x="45" y="66" width="10" height="18" rx="2" fill="#84CC16" />
              <line x1="44" y1="66" x2="56" y2="66" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" />
              {/* Segment 2 */}
              <rect x="45" y="48" width="10" height="18" rx="2" fill="#A3E635" />
              <line x1="44" y1="48" x2="56" y2="48" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" />
              {/* Segment 3 */}
              <rect x="45" y="30" width="10" height="18" rx="2" fill="#65A30D" />
              <line x1="44" y1="30" x2="56" y2="30" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Side stalk */}
            <g stroke="#15803D" strokeWidth="1.5">
              <rect x="32" y="55" width="8" height="28" rx="2" fill="#4D7C0F" />
              <line x1="31" y1="68" x2="41" y2="68" stroke="#1A2E05" strokeWidth="2" />
            </g>

            {/* Long Gracefully Arching Crown Ribbon Leaves */}
            <path d="M50 30 Q25 15 15 28 Q30 18 48 30" fill="#84CC16" stroke="#365314" strokeWidth="1.8" />
            <path d="M50 30 Q75 15 85 28 Q70 18 52 30" fill="#65A30D" stroke="#365314" strokeWidth="1.8" />
            <path d="M50 30 Q35 5 50 0 Q45 15 50 30" fill="#A3E635" stroke="#365314" strokeWidth="1.8" />
            <path d="M50 30 Q65 8 72 2 Q60 18 50 30" fill="#4D7C0F" stroke="#1A2E05" strokeWidth="1.8" />
          </svg>
        );

      case 'mustard':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#FEF9C3" opacity="0.6" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 3" />
            {/* Stems */}
            <path d="M50 85 L50 30" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 55 L35 40 M50 45 L65 32" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round" />

            {/* Seed Pods (Siliques) */}
            <path d="M48 65 L36 60 M52 60 L64 56 M48 50 L38 46 M52 45 L62 40" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />

            {/* Bright Yellow 4-Petal Mustard Flower Clusters */}
            {/* Top Cluster */}
            <g fill="#FACC15" stroke="#B45309" strokeWidth="1.2">
              <circle cx="50" cy="24" r="4" />
              <circle cx="44" cy="20" r="3.5" />
              <circle cx="56" cy="20" r="3.5" />
              <circle cx="50" cy="15" r="3.5" />
              <circle cx="50" cy="20" r="2" fill="#CA8A04" />
            </g>

            {/* Left Branch Cluster */}
            <g fill="#FACC15" stroke="#B45309" strokeWidth="1.2">
              <circle cx="34" cy="38" r="3.5" />
              <circle cx="30" cy="34" r="3" />
              <circle cx="38" cy="34" r="3" />
            </g>

            {/* Right Branch Cluster */}
            <g fill="#FACC15" stroke="#B45309" strokeWidth="1.2">
              <circle cx="66" cy="30" r="3.5" />
              <circle cx="62" cy="26" r="3" />
              <circle cx="70" cy="26" r="3" />
            </g>

            {/* Basal Leaves */}
            <path d="M50 78 Q28 72 20 60 Q34 70 50 75" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
            <path d="M50 75 Q72 70 80 58 Q66 68 50 72" fill="#84CC16" stroke="#365314" strokeWidth="1.5" />
          </svg>
        );

      case 'onion':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#FCE7F3" opacity="0.6" stroke="#F472B6" strokeWidth="2" strokeDasharray="4 3" />
            {/* Soil Line */}
            <path d="M20 58 Q50 56 80 58" stroke="#92400E" strokeWidth="2" strokeDasharray="3 3" />

            {/* Round Purple-Pink Onion Bulb */}
            <ellipse cx="50" cy="68" rx="20" ry="18" fill="#DB2777" stroke="#831843" strokeWidth="2.5" />
            {/* Onion Skin Contours */}
            <path d="M40 54 Q36 68 44 84" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50 50 Q50 68 50 86" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M60 54 Q64 68 56 84" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" />

            {/* Root Strands at the bottom */}
            <path d="M46 86 L44 94 M50 86 L50 96 M54 86 L56 94 M42 85 L38 91 M58 85 L62 91" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" />

            {/* Green Tubular Scallion Shoots */}
            <path d="M48 52 Q44 32 38 12 Q44 26 50 50" fill="#84CC16" stroke="#365314" strokeWidth="2" />
            <path d="M50 50 Q50 28 50 8 Q52 28 52 50" fill="#65A30D" stroke="#365314" strokeWidth="2" />
            <path d="M52 50 Q58 32 64 14 Q58 26 50 52" fill="#84CC16" stroke="#365314" strokeWidth="2" />
          </svg>
        );

      case 'pulse':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#FEF3C7" opacity="0.6" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M50 85 Q48 55 50 25" stroke="#4D7C0F" strokeWidth="3.5" strokeLinecap="round" />

            {/* Chickpea / Gram Pods with swollen peas */}
            <g transform="translate(32, 40) rotate(-15)">
              <path d="M0 0 Q8 -10 22 -6 Q30 0 24 10 Q12 14 0 0 Z" fill="#84CC16" stroke="#365314" strokeWidth="2" />
              <circle cx="10" cy="2" r="3.5" fill="#BEF264" />
              <circle cx="18" cy="2" r="3.5" fill="#BEF264" />
            </g>

            <g transform="translate(48, 50) rotate(20)">
              <path d="M0 0 Q8 -10 22 -6 Q30 0 24 10 Q12 14 0 0 Z" fill="#EAB308" stroke="#854D0E" strokeWidth="2" />
              <circle cx="10" cy="2" r="3.5" fill="#FEF08A" />
              <circle cx="18" cy="2" r="3.5" fill="#FEF08A" />
            </g>

            {/* Fine Feathered Compound Leaves */}
            <ellipse cx="50" cy="20" rx="8" ry="11" fill="#65A30D" stroke="#365314" strokeWidth="1.8" />
            <ellipse cx="38" cy="26" rx="7" ry="9" transform="rotate(-30 38 26)" fill="#84CC16" stroke="#365314" strokeWidth="1.8" />
            <ellipse cx="62" cy="26" rx="7" ry="9" transform="rotate(30 62 26)" fill="#84CC16" stroke="#365314" strokeWidth="1.8" />
          </svg>
        );

      default:
        // Generic Happy Sprout Doodle
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#ECFCCB" opacity="0.6" stroke="#A3E635" strokeWidth="2" strokeDasharray="4 3" />
            {/* Mound of fertile soil */}
            <ellipse cx="50" cy="80" rx="26" ry="8" fill="#B45309" opacity="0.3" stroke="#78350F" strokeWidth="2" />
            {/* Sprouting Tender Stem */}
            <path d="M50 80 Q48 55 50 35" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round" />
            {/* Left Vibrant Leaf */}
            <path d="M50 48 Q20 38 18 20 Q36 28 50 42" fill="#84CC16" stroke="#365314" strokeWidth="2.5" />
            {/* Right Vibrant Leaf */}
            <path d="M50 42 Q78 30 80 14 Q62 24 50 38" fill="#65A30D" stroke="#365314" strokeWidth="2.5" />
            {/* Top Baby Leaf */}
            <ellipse cx="50" cy="28" rx="6" ry="8" fill="#A3E635" stroke="#365314" strokeWidth="2" />
            {/* Glistening Dewdrop */}
            <circle cx="70" cy="22" r="2.5" fill="#38BDF8" />
            <circle cx="71" cy="21" r="0.8" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dimClass} ${className}`}>
      {renderSvg()}
      {/* Dynamic Stage Pill Badge if provided */}
      {stage && (
        <span className="absolute -bottom-1 -right-1 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-950 text-lime-300 border border-lime-400 shadow-2xs font-mono scale-90">
          {stage.slice(0, 3)}
        </span>
      )}
    </div>
  );
};
