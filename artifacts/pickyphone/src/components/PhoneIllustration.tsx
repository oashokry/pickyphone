interface Props {
  brand: string;
  name: string;
  primaryColor?: string;
}

const BRAND_COLORS: Record<string, { bg: string; accent: string; label: string }> = {
  Apple:     { bg: "#1c1c1e", accent: "#d4af37", label: "A" },
  Samsung:   { bg: "#1428a0", accent: "#d4af37", label: "S" },
  Google:    { bg: "#202124", accent: "#4285f4", label: "G" },
  OnePlus:   { bg: "#eb0029", accent: "#ffffff", label: "1+" },
  Xiaomi:    { bg: "#ff6900", accent: "#ffffff", label: "Mi" },
  Sony:      { bg: "#000000", accent: "#d4af37", label: "Xp" },
  Nothing:   { bg: "#1a1a1a", accent: "#ffffff", label: "N" },
  Motorola:  { bg: "#5c2d91", accent: "#ffffff", label: "M" },
  ASUS:      { bg: "#00539b", accent: "#d4af37", label: "ROG" },
  vivo:      { bg: "#415fff", accent: "#ffffff", label: "V" },
  Honor:     { bg: "#c41230", accent: "#ffffff", label: "H" },
  OPPO:      { bg: "#1d2088", accent: "#ffffff", label: "Op" },
  Realme:    { bg: "#ffd700", accent: "#1a1a1a", label: "R" },
  Fairphone: { bg: "#6abf4b", accent: "#ffffff", label: "Fp" },
};

export default function PhoneIllustration({ brand, name }: Props) {
  const theme = BRAND_COLORS[brand] ?? { bg: "#1a1a1a", accent: "#d4af37", label: brand[0] };

  // Derive a lighter version of bg for the screen
  const screenBg = "#0a0a0a";
  const isLight = theme.label.length > 2;

  return (
    <svg
      viewBox="0 0 200 380"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label={name}
    >
      <defs>
        <linearGradient id={`bodyGrad-${brand}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.bg} stopOpacity="1" />
          <stop offset="100%" stopColor={theme.bg} stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id={`screenGrad-${brand}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.15" />
          <stop offset="100%" stopColor={screenBg} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`shineGrad-${brand}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${brand}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id={`screenClip-${brand}`}>
          <rect x="18" y="38" width="164" height="298" rx="6" />
        </clipPath>
      </defs>

      {/* Phone body */}
      <rect x="8" y="8" width="184" height="364" rx="28" fill={`url(#bodyGrad-${brand})`} />

      {/* Body side shine */}
      <rect x="8" y="8" width="184" height="364" rx="28"
        fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.08" />

      {/* Left shine strip */}
      <rect x="8" y="8" width="30" height="364" rx="28"
        fill={`url(#shineGrad-${brand})`} />

      {/* Screen bezel */}
      <rect x="14" y="32" width="172" height="314" rx="18"
        fill="#050505" stroke={theme.accent} strokeWidth="0.5" strokeOpacity="0.4" />

      {/* Screen */}
      <rect x="18" y="38" width="164" height="298" rx="6"
        fill={`url(#screenGrad-${brand})`} />

      {/* Screen glow overlay */}
      <ellipse cx="100" cy="100" rx="70" ry="50"
        fill={theme.accent} opacity="0.06"
        clipPath={`url(#screenClip-${brand})`} />

      {/* Dynamic island / notch */}
      <rect x="72" y="44" width="56" height="14" rx="7"
        fill="#000000" />

      {/* Brand label on screen */}
      <text
        x="100"
        y={isLight ? "185" : "190"}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={theme.label.length > 2 ? "28" : theme.label.length > 1 ? "42" : "56"}
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        fill={theme.accent}
        opacity="0.9"
      >
        {theme.label}
      </text>

      {/* Subtle model name below */}
      <text
        x="100"
        y="225"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontWeight="400"
        fontFamily="system-ui, sans-serif"
        fill="#ffffff"
        opacity="0.25"
        letterSpacing="1"
      >
        {name.toUpperCase().slice(0, 18)}
      </text>

      {/* Home indicator bar */}
      <rect x="75" y="312" width="50" height="4" rx="2"
        fill="#ffffff" opacity="0.2" />

      {/* Power button */}
      <rect x="192" y="110" width="6" height="52" rx="3"
        fill={theme.bg} stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Volume buttons */}
      <rect x="2" y="100" width="6" height="34" rx="3"
        fill={theme.bg} stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" />
      <rect x="2" y="144" width="6" height="34" rx="3"
        fill={theme.bg} stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Rear camera bump (bottom strip) */}
      <rect x="28" y="352" width="80" height="8" rx="4"
        fill="#111111" stroke="#333333" strokeWidth="0.5" />
      <circle cx="44" cy="356" r="3.5" fill="#1a1a1a" stroke={theme.accent} strokeWidth="0.8" strokeOpacity="0.6" />
      <circle cx="44" cy="356" r="1.8" fill="#050505" />
      <circle cx="60" cy="356" r="3.5" fill="#1a1a1a" stroke={theme.accent} strokeWidth="0.8" strokeOpacity="0.6" />
      <circle cx="60" cy="356" r="1.8" fill="#050505" />
      <circle cx="76" cy="356" r="3.5" fill="#1a1a1a" stroke={theme.accent} strokeWidth="0.8" strokeOpacity="0.6" />
      <circle cx="76" cy="356" r="1.8" fill="#050505" />

      {/* Gold accent line at bottom */}
      <line x1="28" y1="374" x2="172" y2="374"
        stroke={theme.accent} strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}
