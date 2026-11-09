import { useI18n } from '../lib/i18n';

export default function FloridaBeamMap() {
  const { t } = useI18n();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Florida state outline, clockwise from NW panhandle corner
  // ViewBox: 0 0 240 345
  const FLORIDA = [
    "M 5,55",
    "C 70,48 140,47 186,50",        // panhandle north coast
    "C 197,51 206,57 210,68",        // NE corner → Jacksonville
    "C 213,82 213,100 213,120",      // east coast
    "C 213,140 213,160 212,180",
    "C 212,200 212,220 212,240",
    "C 212,253 211,262 210,270",     // Palm Beach / Fort Lauderdale area
    "C 208,278 204,287 200,296",     // Miami approach
    "C 196,304 189,311 181,314",     // southern tip
    "C 172,317 160,315 147,312",
    "C 133,309 119,312 110,316",     // Keys going SW
    "C 104,319 98,322 94,323",       // Key West
    // back up west coast
    "C 99,317 106,308 110,296",
    "C 112,282 112,268 112,253",
    "C 112,238 112,223 112,208",     // Fort Myers / Charlotte Harbor / Sarasota
    "C 112,193 113,180 114,170",     // approaching Tampa Bay
    "C 116,162 120,157 122,158",     // Tampa Bay — indent east
    "C 124,160 122,168 118,173",     // inner Tampa Bay
    "C 115,175 112,172 112,163",     // exit bay going north
    "C 111,153 108,140 106,128",     // Crystal River / nature coast
    "C 104,116 103,104 104,96",      // Big Bend — coast turns west
    "C 96,92 76,95 52,97",           // panhandle gulf coast going west
    "C 30,99 12,99 5,97",
    "L 5,55 Z",                      // Alabama border, close
  ].join(" ");

  const cities = [
    { id: "jacksonville",    x: 210, y: 68,  label: "Jacksonville" },
    { id: "orlando",         x: 188, y: 148, label: "Orlando"      },
    { id: "tampa",           x: 120, y: 160, label: "Tampa"        },
    { id: "fortlauderdale",  x: 210, y: 262, label: "Ft. Lauderdale" },
    { id: "miami",           x: 204, y: 284, label: "Miami"        },
  ];

  const lanes = [
    {
      id: "lane-tampa-ftlaud",
      d: "M 120,160 C 158,198 190,232 210,262",
      color: "hsl(var(--primary))",
      length: 158,
      dur: "2.4s",
      delay: "0s",
      label: t('laneTampaFt'),
    },
    {
      id: "lane-orlando-jax",
      d: "M 188,148 C 196,120 204,95 210,68",
      color: "hsl(var(--accent))",
      length: 105,
      dur: "1.9s",
      delay: "0.7s",
      label: t('laneOrlandoJacksonville'),
    },
    {
      id: "lane-ftlaud-orlando",
      d: "M 210,262 C 202,228 196,188 188,148",
      color: "hsl(var(--primary))",
      length: 128,
      dur: "2.2s",
      delay: "1.4s",
      label: t('laneFtOrlando'),
    },
    {
      id: "lane-miami-tampa",
      d: "M 204,284 C 168,258 143,215 120,160",
      color: "#34D399",
      length: 172,
      dur: "2.8s",
      delay: "0.3s",
      label: t('laneMiamiTampa'),
    },
  ];

  return (
    <div className="bg-[#080C12] rounded-2xl shadow-2xl border border-[#1a2744] overflow-hidden relative">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {lanes.map(lane => (
          <div key={lane.id} className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 rounded-full inline-block" style={{ backgroundColor: lane.color }} />
            <span className="text-[9px] font-sans font-medium tracking-wide" style={{ color: lane.color, opacity: 0.85 }}>
              {lane.label}
            </span>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 240 345" className="w-full h-auto" style={{ display: 'block' }}>
        <defs>
          <filter id="fbm-city-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fbm-beam-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="fbm-state-fill" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="100%" stopColor="#0e1a30" />
          </radialGradient>
        </defs>

        {/* State fill */}
        <path d={FLORIDA} fill="url(#fbm-state-fill)" stroke="#2a4a6b" strokeWidth="1.2" />

        {/* Lane base paths — dim ghost routes */}
        {lanes.map(lane => (
          <path
            key={`${lane.id}-base`}
            d={lane.d}
            fill="none"
            stroke={lane.color}
            strokeWidth="1"
            opacity="0.18"
            strokeDasharray="3 4"
          />
        ))}

        {/* Animated beams */}
        {lanes.map(lane => (
          <path
            key={`${lane.id}-beam`}
            d={lane.d}
            fill="none"
            stroke={lane.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`12 ${lane.length + 4}`}
            filter="url(#fbm-beam-glow)"
          >
            {!reduceMotion && <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={`${-(lane.length + 16)}`}
              dur={lane.dur}
              begin={lane.delay}
              repeatCount="indefinite"
            />}
          </path>
        ))}

        {/* City pulse rings */}
        {cities.map(city => (
          <circle
            key={`${city.id}-pulse`}
            cx={city.x}
            cy={city.y}
            r="7"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="0.8"
            opacity="0"
          >
            {!reduceMotion && <animate attributeName="r" values="4;10;4" dur="2.8s" begin={`${cities.indexOf(city) * 0.5}s`} repeatCount="indefinite" />}
            {!reduceMotion && <animate attributeName="opacity" values="0.6;0;0.6" dur="2.8s" begin={`${cities.indexOf(city) * 0.5}s`} repeatCount="indefinite" />}
          </circle>
        ))}

        {/* City dots */}
        {cities.map(city => (
          <g key={city.id} filter="url(#fbm-city-glow)">
            <circle cx={city.x} cy={city.y} r="3.5" fill="#0A0E14" stroke="hsl(var(--accent))" strokeWidth="1.5" />
            <circle cx={city.x} cy={city.y} r="1.5" fill="hsl(var(--accent))" />
          </g>
        ))}

        {/* City labels */}
        {cities.map(city => {
          const onRight = city.x < 140;
          return (
            <text
              key={`${city.id}-label`}
              x={city.x + (onRight ? 6 : -6)}
              y={city.y + 1}
              fontSize="7.5"
              fill="#c8d8e8"
              fontFamily="DM Sans, sans-serif"
              fontWeight="600"
              textAnchor={onRight ? "start" : "end"}
              dominantBaseline="middle"
              letterSpacing="0.3"
            >
              {city.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
