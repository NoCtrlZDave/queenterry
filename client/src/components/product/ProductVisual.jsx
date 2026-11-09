import { useId } from 'react';
import { cn } from '../../lib/format';

const palettes = [
  { bg1: '#F3EFFF', bg2: '#E5DCFF', body: '#22212A', screen1: '#6730D6', screen2: '#C4B5FD' },
  { bg1: '#F5F5F8', bg2: '#E7E7ED', body: '#2B2B33', screen1: '#475569', screen2: '#AAB4C5' },
  { bg1: '#FFF7EE', bg2: '#FBE6D2', body: '#2C2A27', screen1: '#C9834D', screen2: '#F4D0AC' },
  { bg1: '#EEF7F5', bg2: '#D8EDE8', body: '#212C2A', screen1: '#2F7D72', screen2: '#A6D6CB' },
  { bg1: '#F1F5FB', bg2: '#E0E9F5', body: '#242B35', screen1: '#4A6C93', screen2: '#BCD2E8' },
  { bg1: '#FDF1F4', bg2: '#F7DDE4', body: '#2B2327', screen1: '#A34E6B', screen2: '#E7B4C4' },
];

function hash(value = '') {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 9973;
  }
  return h;
}

function Phone({ body, screen }) {
  return (
    <>
      <rect x="150" y="54" width="100" height="48" rx="16" fill={body} />
      <circle cx="172" cy="72" r="7" fill="#0B0B0F" opacity="0.8" />
      <circle cx="194" cy="72" r="7" fill="#0B0B0F" opacity="0.65" />
      <rect x="126" y="74" width="148" height="268" rx="30" fill={body} />
      <rect x="135" y="83" width="130" height="250" rx="24" fill={screen} />
      <rect x="180" y="92" width="40" height="9" rx="4.5" fill="#0B0B0F" opacity="0.55" />
      <circle cx="200" cy="200" r="46" fill="white" opacity="0.16" />
      <circle cx="200" cy="200" r="28" fill="white" opacity="0.25" />
      <rect x="158" y="272" width="84" height="7" rx="3.5" fill="white" opacity="0.5" />
      <rect x="158" y="288" width="56" height="7" rx="3.5" fill="white" opacity="0.3" />
      <rect x="184" y="314" width="32" height="4" rx="2" fill="white" opacity="0.55" />
    </>
  );
}

function Tablet({ body, screen }) {
  return (
    <>
      <rect x="86" y="88" width="228" height="236" rx="22" fill={body} />
      <rect x="96" y="98" width="208" height="216" rx="14" fill={screen} />
      <circle cx="200" cy="108" r="3.5" fill="#0B0B0F" opacity="0.5" />
      <rect x="120" y="134" width="160" height="10" rx="5" fill="white" opacity="0.34" />
      <rect x="120" y="154" width="104" height="9" rx="4.5" fill="white" opacity="0.2" />
      <rect x="120" y="192" width="74" height="86" rx="12" fill="white" opacity="0.14" />
      <rect x="206" y="192" width="74" height="86" rx="12" fill="white" opacity="0.2" />
      <rect x="156" y="304" width="88" height="6" rx="3" fill="white" opacity="0.35" />
    </>
  );
}

function Laptop({ body, screen }) {
  return (
    <>
      <rect x="104" y="84" width="192" height="142" rx="12" fill={body} />
      <rect x="114" y="94" width="172" height="122" rx="6" fill={screen} />
      <circle cx="200" cy="90" r="2.6" fill="white" opacity="0.5" />
      <rect x="84" y="234" width="232" height="20" rx="6" fill={body} />
      <path d="M66 266h268l-16 16H82l-16-16Z" fill={body} />
      <rect x="160" y="270" width="80" height="5" rx="2.5" fill="white" opacity="0.28" />
      <rect x="132" y="118" width="136" height="8" rx="4" fill="white" opacity="0.3" />
      <rect x="132" y="136" width="92" height="7" rx="3.5" fill="white" opacity="0.18" />
      <rect x="132" y="170" width="60" height="34" rx="7" fill="white" opacity="0.14" />
      <rect x="202" y="170" width="60" height="34" rx="7" fill="white" opacity="0.22" />
    </>
  );
}

function Watch({ body, screen }) {
  return (
    <>
      <rect x="164" y="52" width="72" height="92" rx="24" fill={body} opacity="0.85" />
      <rect x="164" y="238" width="72" height="92" rx="24" fill={body} opacity="0.85" />
      <rect x="140" y="124" width="120" height="148" rx="34" fill={body} />
      <rect x="150" y="134" width="100" height="128" rx="26" fill={screen} />
      <circle cx="200" cy="198" r="40" fill="white" opacity="0.18" />
      <circle cx="200" cy="198" r="26" fill="white" opacity="0.28" />
      <circle cx="200" cy="198" r="13" fill="white" opacity="0.4" />
      <rect x="262" y="166" width="10" height="26" rx="5" fill={body} />
      <rect x="160" y="244" width="52" height="6" rx="3" fill="white" opacity="0.4" />
    </>
  );
}

function Earbuds({ body, screen }) {
  return (
    <>
      <rect x="120" y="214" width="160" height="96" rx="30" fill={body} />
      <rect x="126" y="220" width="148" height="40" rx="20" fill="white" opacity="0.06" />
      <rect x="180" y="288" width="40" height="5" rx="2.5" fill="white" opacity="0.4" />
      <rect x="146" y="112" width="42" height="88" rx="21" fill={body} />
      <circle cx="167" cy="112" r="25" fill={body} />
      <circle cx="167" cy="112" r="13" fill={screen} />
      <rect x="212" y="112" width="42" height="88" rx="21" fill={body} />
      <circle cx="233" cy="112" r="25" fill={body} />
      <circle cx="233" cy="112" r="13" fill={screen} />
      <circle cx="200" cy="262" r="5" fill="white" opacity="0.35" />
    </>
  );
}

function Headphones({ body, screen }) {
  return (
    <>
      <path
        d="M104 214v-18c0-58 43-100 96-100s96 42 96 100v18"
        stroke={body}
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M112 214v-18c0-52 39-90 88-90s88 38 88 90v18"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.18"
      />
      <rect x="82" y="200" width="58" height="104" rx="26" fill={body} />
      <rect x="260" y="200" width="58" height="104" rx="26" fill={body} />
      <rect x="92" y="216" width="38" height="72" rx="18" fill={screen} />
      <rect x="270" y="216" width="38" height="72" rx="18" fill={screen} />
    </>
  );
}

function Speaker({ body, screen }) {
  const dots = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={176 + col * 16}
          cy={146 + row * 18}
          r="3.2"
          fill="white"
          opacity="0.28"
        />
      );
    }
  }
  return (
    <>
      <ellipse cx="200" cy="330" rx="86" ry="14" fill={body} opacity="0.15" />
      <rect x="146" y="104" width="108" height="220" rx="54" fill={body} />
      <rect x="158" y="118" width="84" height="192" rx="42" fill={screen} />
      {dots}
      <rect x="172" y="296" width="56" height="6" rx="3" fill="white" opacity="0.4" />
      <circle cx="200" cy="128" r="6" fill="white" opacity="0.35" />
    </>
  );
}

function Charger({ body, screen }) {
  return (
    <>
      <rect x="150" y="96" width="30" height="34" rx="6" fill={body} />
      <rect x="220" y="96" width="30" height="34" rx="6" fill={body} />
      <rect x="128" y="126" width="144" height="132" rx="30" fill={body} />
      <rect x="142" y="140" width="116" height="104" rx="22" fill="white" opacity="0.07" />
      <rect x="176" y="238" width="48" height="12" rx="6" fill={screen} />
      <circle cx="200" cy="190" r="20" fill="white" opacity="0.14" />
      <path
        d="M246 268c26 16 26 40 0 56s-26 40 0 56"
        stroke={body}
        strokeWidth="11"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="238" y="372" width="22" height="16" rx="5" fill={body} transform="rotate(-14 249 380)" />
    </>
  );
}

function PowerBank({ body, screen }) {
  return (
    <>
      <rect x="128" y="94" width="144" height="228" rx="28" fill={body} />
      <rect x="142" y="112" width="116" height="64" rx="14" fill={screen} />
      <text x="200" y="140" textAnchor="middle" fill="white" opacity="0.9" fontSize="22" fontFamily="Inter, sans-serif">
        24K
      </text>
      <rect x="154" y="148" width="40" height="6" rx="3" fill="white" opacity="0.4" />
      <g fill="white" opacity="0.7">
        <circle cx="176" cy="250" r="5" />
        <circle cx="194" cy="250" r="5" />
        <circle cx="212" cy="250" r="5" />
        <circle cx="230" cy="250" r="5" opacity="0.25" />
      </g>
      <rect x="186" y="290" width="28" height="10" rx="5" fill="white" opacity="0.3" />
    </>
  );
}

function Cable({ screen }) {
  return (
    <>
      <path
        d="M140 300c-40-34-24-96 30-96s64 58 30 86-88 10-88-36 46-78 104-78 86 44 86 84"
        stroke={screen}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="286" y="238" width="34" height="20" rx="7" fill="#23222A" />
      <rect x="306" y="242" width="16" height="12" rx="3" fill="#B9B9C2" />
      <rect x="122" y="286" width="34" height="20" rx="7" fill="#23222A" transform="rotate(24 139 296)" />
      <rect x="116" y="296" width="16" height="12" rx="3" fill="#B9B9C2" transform="rotate(24 124 302)" />
    </>
  );
}

function Gamepad({ body, screen }) {
  return (
    <>
      <rect x="94" y="166" width="212" height="112" rx="50" fill={body} />
      <rect x="110" y="182" width="180" height="80" rx="40" fill="white" opacity="0.05" />
      <rect x="142" y="196" width="14" height="46" rx="6" fill="white" opacity="0.55" />
      <rect x="126" y="212" width="46" height="14" rx="6" fill="white" opacity="0.55" />
      <circle cx="248" cy="208" r="9" fill={screen} />
      <circle cx="270" cy="228" r="9" fill="white" opacity="0.4" />
      <circle cx="226" cy="228" r="9" fill="white" opacity="0.28" />
      <circle cx="248" cy="248" r="9" fill="white" opacity="0.2" />
      <rect x="180" y="238" width="40" height="8" rx="4" fill="white" opacity="0.22" />
    </>
  );
}

function Band({ body, screen }) {
  return (
    <>
      <rect x="176" y="62" width="48" height="86" rx="20" fill={body} opacity="0.9" />
      <rect x="176" y="252" width="48" height="86" rx="20" fill={body} opacity="0.9" />
      <rect x="152" y="126" width="96" height="148" rx="34" fill={body} />
      <rect x="161" y="135" width="78" height="130" rx="26" fill={screen} />
      <circle cx="200" cy="188" r="30" fill="white" opacity="0.18" />
      <rect x="178" y="222" width="44" height="6" rx="3" fill="white" opacity="0.4" />
      <circle cx="200" cy="246" r="5" fill="white" opacity="0.35" />
    </>
  );
}

const artwork = {
  smartphones: Phone,
  tablets: Tablet,
  laptops: Laptop,
  smartwatches: Watch,
  earbuds: Earbuds,
  headphones: Headphones,
  speakers: Speaker,
  chargers: Charger,
  'power-banks': PowerBank,
  'phone-accessories': Cable,
  'gaming-accessories': Gamepad,
  'other-gadgets': Band,
};

export default function ProductVisual({ category = '', seed = '', className = '', alt = '' }) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const palette = palettes[hash(seed || category) % palettes.length];
  const Art = artwork[category] || Band;

  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden', className)}
      style={{ background: `linear-gradient(145deg, ${palette.bg1}, ${palette.bg2})` }}
      role="img"
      aria-label={alt || 'Illustrative product visual'}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
      <svg viewBox="0 0 400 400" className="relative h-[88%] w-[88%]">
        <defs>
          <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#41414B" />
            <stop offset="100%" stopColor={palette.body} />
          </linearGradient>
          <linearGradient id={`screen-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.screen1} />
            <stop offset="100%" stopColor={palette.screen2} />
          </linearGradient>
          <filter id={`shadow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#0B0B0F" floodOpacity="0.18" />
          </filter>
        </defs>
        <g filter={`url(#shadow-${uid})`}>
          <Art body={`url(#body-${uid})`} screen={`url(#screen-${uid})`} />
        </g>
      </svg>
    </div>
  );
}
