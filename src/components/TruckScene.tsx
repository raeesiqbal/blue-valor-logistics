import { useEffect, useId, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';

export type TruckKind = 'dry' | 'reefer' | 'flatbed';
export type SceneId = 'road' | 'load' | 'inside' | 'sealed' | 'precool' | 'strapped' | 'tarped';

/*
  Drawing notes
  - The truck body is drawn facing left, then flipped so the cab faces right.
  - Everything else (cargo, labels, forklift, cables, badges) is drawn directly in
    on-screen positions, so text never appears backwards.
  - On screen: rear doors at x 175, front of trailer at x 826, cab out to about x 1016.
*/

const LOOK: Record<TruckKind, { c: string; dk: string; lt: string; skin: string }> = {
  dry: { c: '#d9483f', dk: '#a8352d', lt: '#ea6157', skin: '#fcd5ce' },
  reefer: { c: '#3a8fd6', dk: '#2a6fae', lt: '#5aa8ea', skin: '#d4a276' },
  flatbed: { c: '#f2b632', dk: '#cf9417', lt: '#f7ca5c', skin: '#7f5539' },
};
const HAT = '#3b82bb';

// Backgrounds matched to each page's real photo
const SKY: Record<TruckKind, { stops: [string, string][]; hills: string; ground: string; shoulder: string }> = {
  dry: {
    stops: [['0', '#5b4fa3'], ['0.45', '#a873b8'], ['0.75', '#e48aa0'], ['1', '#f6b98a']],
    hills: '#7d78a6',
    ground: '#b49a7c',
    shoulder: '#a68c6e',
  },
  reefer: {
    stops: [['0', '#7fa9d2'], ['0.55', '#bcd6ec'], ['1', '#eaf4fb']],
    hills: '#a9bfd4',
    ground: '#d9e3ec',
    shoulder: '#c9d5e0',
  },
  flatbed: {
    stops: [['0', '#4f9ddc'], ['0.6', '#a6d2f2'], ['1', '#e3f1fb']],
    hills: '#7fa77a',
    ground: '#b9c79a',
    shoulder: '#a9b88a',
  },
};

// ---------- Truck body (drawn facing left, flipped later) ----------

function Cab({ kind }: { kind: TruckKind }) {
  const { c, dk, lt, skin } = LOOK[kind];
  return (
    <g>
      <rect x={200} y={50} width={9} height={160} rx={3} fill="#b3b9c2" />
      <rect x={196} y={46} width={17} height={8} rx={3} fill="#8d95a1" />
      <rect x={188} y={62} width={7} height={60} rx={3} fill="#9aa1ab" />
      <path d="M48 150 L128 146 L128 218 L48 218 Z" fill={c} />
      <path d="M48 150 L128 146 L128 156 L48 160 Z" fill={lt} />
      <path d="M24 156 L48 150 L48 218 L24 218 Z" fill={dk} />
      <rect x={27} y={160} width={18} height={40} rx={2} fill="#dfe3e8" />
      {[30, 34.5, 39].map((x) => <rect key={x} x={x} y={163} width={2.5} height={34} fill="#9aa1ab" />)}
      <rect x={26} y={202} width={20} height={8} rx={2} fill="#fff3c4" />
      <rect x={14} y={212} width={58} height={16} rx={4} fill="#5d6573" />
      <rect x={14} y={212} width={34} height={16} rx={4} fill="#4a5261" />
      <path d="M50 222 Q50 186 88 186 Q124 186 126 222 Z" fill={dk} />
      <path d="M112 146 L122 90 L132 90 L128 146 Z" fill={dk} />
      <path d="M115 140 L123 96 L130 96 L127 140 Z" fill="#6fa9d1" />
      <path d="M128 220 L128 146 L132 90 L198 86 Q204 86 204 92 L204 224 L128 224 Z" fill={c} />
      <rect x={128} y={80} width={78} height={10} rx={3} fill={dk} />
      {[134, 146, 158].map((x) => <rect key={x} x={x} y={82} width={6} height={5} rx={1} fill="#f2a43a" />)}
      <path d="M138 98 L196 96 L196 140 L136 140 Z" fill="#8fc3e6" />
      <circle cx={172} cy={122} r={8} fill={skin} />
      <path d="M163 119 Q172 107 181 119 Z" fill={HAT} />
      <rect x={157} y={117} width={10} height={3} rx={1.5} fill={HAT} />
      <rect x={164} y={131} width={16} height={9} rx={3} fill={HAT} />
      <path d="M142 136 L152 100" stroke="#d2ecfa" strokeWidth={3} />
      <rect x={138} y={96} width={62} height={118} rx={4} fill="none" stroke={dk} strokeWidth={2.5} />
      <rect x={186} y={152} width={10} height={4} rx={2} fill={dk} />
      <rect x={210} y={222} width={62} height={24} rx={10} fill="#d4d8de" />
      <rect x={220} y={220} width={5} height={28} fill="#9aa1ab" />
      <rect x={257} y={220} width={5} height={28} fill="#9aa1ab" />
    </g>
  );
}

function Wheel({ x, arch = true }: { x: number; arch?: boolean }) {
  return (
    <g>
      {arch && <path d={`M${x - 34} 230 A34 34 0 0 1 ${x + 34} 230 Z`} fill="#2b313c" />}
      <g className="bv-wheel">
        <circle cx={x} cy={246} r={26} fill="#2f3542" />
        <circle cx={x} cy={246} r={15} fill="#e8ebef" />
        <rect x={x - 2} y={232} width={4} height={28} rx={1} fill="#8a929e" />
        <rect x={x - 14} y={244} width={28} height={4} rx={1} fill="#8a929e" />
        <circle cx={x} cy={246} r={5} fill="#5d6573" />
      </g>
    </g>
  );
}

const Chassis = () => (
  <g>
    <rect x={60} y={214} width={805} height={16} fill="#3a4250" />
    <rect x={460} y={230} width={80} height={10} rx={3} fill="#4a5363" />
  </g>
);

const Wheels = () => (
  <g>
    <Wheel x={88} arch={false} />
    {[310, 370, 670, 730, 790].map((x) => <Wheel key={x} x={x} />)}
  </g>
);

const VanBox = () => (
  <g>
    <rect x={214} y={72} width={651} height={142} rx={4} fill="#e4e7ec" />
    <rect x={224} y={82} width={631} height={122} rx={2} fill="none" stroke="#cdd2d9" strokeWidth={3} />
    {[106, 130, 154, 178].map((y) => <line key={y} x1={226} y1={y} x2={853} y2={y} stroke="#cdd2d9" strokeWidth={2} />)}
    <rect x={214} y={196} width={651} height={8} fill="#3b82bb" />
  </g>
);

const ReeferUnit = () => (
  <g>
    <rect x={214} y={84} width={28} height={84} rx={4} fill="#8f98a4" />
    <circle cx={228} cy={102} r={8} fill="#6f7884" />
    <g className="bv-fan">
      <rect x={226.5} y={95} width={3} height={14} rx={1.5} fill="#4a525c" />
      <rect x={221} y={100.5} width={14} height={3} rx={1.5} fill="#4a525c" />
    </g>
    {[118, 126, 134, 142].map((y) => <rect key={y} x={219} y={y} width={18} height={3} rx={1.5} fill="#5f6873" />)}
    <rect x={216} y={150} width={24} height={14} rx={2} fill="#0d1b2a" />
  </g>
);

const Deck = () => (
  <g>
    <rect x={214} y={196} width={651} height={18} fill="#8d95a1" />
    <rect x={214} y={208} width={651} height={6} fill="#6b7380" />
  </g>
);

const Headache = () => (
  <g fill="#7d8591">
    <rect x={220} y={92} width={8} height={106} />
    <rect x={220} y={92} width={22} height={7} />
    <rect x={236} y={92} width={6} height={106} />
    <rect x={220} y={130} width={22} height={5} />
    <rect x={220} y={165} width={22} height={5} />
  </g>
);

// The truck body, flipped to face right
function TruckBody({ kind }: { kind: TruckKind }) {
  return (
    <g transform="translate(1040 0) scale(-1 1)">
      {kind === 'flatbed' ? <><Deck /><Headache /></> : <VanBox />}
      {kind === 'reefer' && <ReeferUnit />}
      <Chassis />
      <Cab kind={kind} />
      <Wheels />
    </g>
  );
}

// ---------- Background and road (on-screen positions) ----------

function Backdrop({ kind, gid, moving }: { kind: TruckKind; gid: string; moving: boolean }) {
  const s = SKY[kind];
  const hills = `M-3000 250 L-3000 228 ${Array.from({ length: 70 }, (_, i) => {
    const x = -3000 + i * 100;
    return `Q${x + 50} ${i % 2 ? 196 : 214} ${x + 100} 228`;
  }).join(' ')} L4000 250 Z`;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" y1="-400" x2="0" y2="250" gradientUnits="userSpaceOnUse">
          {s.stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </linearGradient>
      </defs>
      <rect x={-3000} y={-2000} width={7000} height={2252} fill={`url(#${gid})`} />
      <path d={hills} fill={s.hills} opacity={0.75} />
      <rect x={-3000} y={248} width={7000} height={30} fill={s.ground} />
      <rect x={-3000} y={312} width={7000} height={400} fill={s.shoulder} />
      <rect x={-3000} y={272} width={7000} height={40} fill="#3a3f4a" />
      <g className={moving ? 'bv-dashes' : undefined}>
        {Array.from({ length: 70 }, (_, i) => -3000 + i * 110).map((x) => (
          <rect key={x} x={x} y={290} width={50} height={5} rx={2} fill="#f4f5f7" />
        ))}
      </g>
    </g>
  );
}

// ---------- Cargo (on-screen positions) ----------

type Product = { name: string; icon: (x: number, y: number) => ReactNode };

const P = (name: string, icon: (x: number, y: number) => ReactNode): Product => ({ name, icon });

type Crate = 'wood' | 'milk' | 'fish';
type ReeferItem = { name: string; crate: Crate; item: (x: number, y: number, k: number) => ReactNode };

// Produce and dairy shown heaped in open crates, like the reference pictures
const R = (name: string, item: ReeferItem['item'], crate: Crate = 'wood'): ReeferItem => ({ name, crate, item });
const leaf = (x: number, y: number) => <path d={`M${x} ${y} q5 -6 10 -2 q-5 5 -10 2`} fill="#3f8f3a" />;
const REEFER_ITEMS: ReeferItem[] = [
  R('Apples', (x, y, k) => <g><circle cx={x} cy={y} r={8} fill="#d9262f" /><circle cx={x - 3} cy={y - 3} r={2.2} fill="#f06a6f" />{k % 2 === 0 && leaf(x, y - 7)}</g>),
  R('Lemons', (x, y, k) => <g><ellipse cx={x} cy={y} rx={9} ry={7} fill="#f5d83a" /><ellipse cx={x - 3} cy={y - 2} rx={3} ry={2} fill="#fbea8a" />{k % 3 === 0 && leaf(x + 2, y - 6)}</g>),
  R('Mangoes', (x, y) => <g><ellipse cx={x} cy={y} rx={9} ry={8} fill="#f7a52b" /><ellipse cx={x + 3} cy={y - 2} rx={4.5} ry={4} fill="#ef6b2f" opacity={0.8} /></g>),
  R('Tomatoes', (x, y) => <g><circle cx={x} cy={y} r={8.5} fill="#e5372c" /><path d={`M${x - 5} ${y - 7} L${x} ${y - 4} L${x + 5} ${y - 7} L${x + 2} ${y - 3} L${x - 2} ${y - 3} Z`} fill="#3f8f3a" /></g>),
  R('Grapes', (x, y) => <g fill="#7b3f8f">{[[-5, -4], [0, -5], [5, -4], [-3, 0], [3, 0], [0, 4], [-6, 2], [6, 2]].map(([a, b]) => <circle key={`${a}${b}`} cx={x + a} cy={y + b} r={3.6} />)}<circle cx={x - 2} cy={y - 6} r={1.2} fill="#b98ac9" /></g>),
  R('Leeks', (x, y) => <g><rect x={x - 3} y={y - 2} width={6} height={12} rx={2} fill="#f2f4e6" /><path d={`M${x - 3} ${y} L${x - 7} ${y - 10} L${x - 1} ${y - 4} L${x} ${y - 12} L${x + 2} ${y - 4} L${x + 7} ${y - 10} L${x + 3} ${y} Z`} fill="#5fae47" /></g>),
  R('Peppers', (x, y) => <g><path d={`M${x - 8} ${y - 4} Q${x - 9} ${y + 8} ${x - 3} ${y + 9} Q${x} ${y + 6} ${x + 3} ${y + 9} Q${x + 9} ${y + 8} ${x + 8} ${y - 4} Q${x} ${y - 9} ${x - 8} ${y - 4} Z`} fill="#e3242b" /><rect x={x - 1.5} y={y - 11} width={3} height={5} rx={1} fill="#3f8f3a" /></g>),
  R('Pears', (x, y) => <g><circle cx={x} cy={y + 3} r={7} fill="#c9d43a" /><circle cx={x} cy={y - 4} r={4.5} fill="#c9d43a" /><rect x={x - 0.8} y={y - 11} width={1.6} height={4} fill="#6b4a36" /><circle cx={x - 2} cy={y + 4} r={0.8} fill="#9aa32a" /><circle cx={x + 3} cy={y + 2} r={0.8} fill="#9aa32a" /></g>),
  R('Milk', (x, y) => <g><rect x={x - 5} y={y - 4} width={10} height={16} rx={3} fill="#ffffff" stroke="#c9d3de" /><rect x={x - 3} y={y - 9} width={6} height={6} rx={1} fill="#eef2f6" stroke="#c9d3de" /><rect x={x - 3.5} y={y - 11} width={7} height={3} rx={1} fill="#c9d3de" /></g>, 'milk'),
  R('Eggplant', (x, y) => <g><ellipse cx={x} cy={y + 1} rx={10} ry={6} fill="#5a2a7a" transform={`rotate(-20 ${x} ${y})`} /><path d={`M${x + 6} ${y - 7} l6 -3 l-2 6 Z`} fill="#3f8f3a" /><ellipse cx={x - 3} cy={y - 1} rx={3} ry={1.5} fill="#8c5aa8" /></g>),
  R('Fish', (x, y) => <g><ellipse cx={x} cy={y} rx={11} ry={5.5} fill="#c9cbe8" /><path d={`M${x + 9} ${y} l7 -6 l0 12 Z`} fill="#f5c542" /><circle cx={x - 6} cy={y - 1} r={1.4} fill="#1d2b3a" /><path d={`M${x - 2} ${y - 3} q2 3 0 6 M${x + 2} ${y - 3} q2 3 0 6`} stroke="#9fa2cf" strokeWidth={1} fill="none" /></g>, 'fish'),
  R('Cauliflower', (x, y) => <g><path d={`M${x - 11} ${y + 4} q2 -9 8 -6 M${x + 11} ${y + 4} q-2 -9 -8 -6`} stroke="#5fae47" strokeWidth={4} fill="none" />{[[-4, -2], [3, -3], [0, 2], [-6, 3], [6, 2]].map(([a, b]) => <circle key={`${a}${b}`} cx={x + a} cy={y + b} r={4.2} fill="#f4f1e4" stroke="#ddd6bd" strokeWidth={0.8} />)}</g>),
];

const DRY_PRODUCTS: Product[] = [
  P('Canned Goods', (x, y) => <g>{[-8, 8].map((a) => <g key={a}><rect x={x + a - 7} y={y - 9} width={14} height={20} fill="#c9ced4" /><rect x={x + a - 7} y={y - 3} width={14} height={8} fill="#d9483f" /><ellipse cx={x + a} cy={y - 9} rx={7} ry={2} fill="#e8ebef" /></g>)}</g>),
  P('Bottled Water', (x, y) => <g>{[-8, 8].map((a) => <g key={a}><rect x={x + a - 5} y={y - 6} width={10} height={20} rx={3} fill="#9fd3f2" /><rect x={x + a - 3} y={y - 12} width={6} height={6} fill="#3b82bb" /></g>)}</g>),
  P('Paper Towels', (x, y) => <g>{[-8, 8].map((a) => <g key={a}><rect x={x + a - 7} y={y - 10} width={14} height={22} fill="#fff" stroke="#c9ced4" /><ellipse cx={x + a} cy={y - 10} rx={7} ry={2.5} fill="#f1f3f5" stroke="#c9ced4" /></g>)}</g>),
  P('Cereal', (x, y) => <g><rect x={x - 10} y={y - 12} width={20} height={26} fill="#f2a43a" /><circle cx={x} cy={y + 3} r={6} fill="#fff" /><rect x={x - 7} y={y - 9} width={14} height={4} fill="#d9483f" /></g>),
  P('Snacks', (x, y) => <g><path d={`M${x - 11} ${y - 12} L${x + 11} ${y - 12} L${x + 13} ${y + 14} L${x - 13} ${y + 14} Z`} fill="#f5c542" /><circle cx={x} cy={y + 1} r={5} fill="#e5483c" /></g>),
  P('Electronics', (x, y) => <g><rect x={x - 15} y={y - 10} width={30} height={19} rx={2} fill="#2f3542" /><rect x={x - 12} y={y - 7} width={24} height={13} fill="#5aa8ea" /><rect x={x - 6} y={y + 10} width={12} height={3} fill="#2f3542" /></g>),
  P('Furniture', (x, y) => <g><rect x={x - 10} y={y - 12} width={4} height={26} fill="#8a5a32" /><rect x={x - 10} y={y + 2} width={20} height={4} fill="#a8693a" /><rect x={x + 6} y={y + 2} width={4} height={12} fill="#8a5a32" /><rect x={x - 10} y={y - 12} width={14} height={4} fill="#a8693a" /></g>),
  P('Appliances', (x, y) => <g><rect x={x - 11} y={y - 12} width={22} height={26} rx={2} fill="#f1f3f5" stroke="#9aa3ae" /><circle cx={x} cy={y + 3} r={7} fill="#9fd3f2" stroke="#9aa3ae" /><rect x={x - 8} y={y - 9} width={6} height={3} fill="#9aa3ae" /></g>),
  P('Clothing', (x, y) => <path d={`M${x - 6} ${y - 12} L${x + 6} ${y - 12} L${x + 15} ${y - 5} L${x + 10} ${y + 1} L${x + 8} ${y - 2} L${x + 8} ${y + 14} L${x - 8} ${y + 14} L${x - 8} ${y - 2} L${x - 10} ${y + 1} L${x - 15} ${y - 5} Z`} fill="#62c0de" />),
  P('Books', (x, y) => <g><rect x={x - 13} y={y + 6} width={26} height={7} fill="#d9483f" /><rect x={x - 11} y={y - 1} width={24} height={7} fill="#3b82bb" /><rect x={x - 12} y={y - 8} width={22} height={7} fill="#4c9a43" /></g>),
  P('Detergent', (x, y) => <g><path d={`M${x - 10} ${y - 8} L${x + 4} ${y - 8} L${x + 10} ${y - 2} L${x + 10} ${y + 14} L${x - 10} ${y + 14} Z`} fill="#f2a43a" /><rect x={x - 7} y={y - 13} width={7} height={5} fill="#3b82bb" /><rect x={x - 6} y={y + 1} width={12} height={8} fill="#fff" /></g>),
  P('Toys', (x, y) => <g><circle cx={x - 6} cy={y + 4} r={9} fill="#f27ab0" /><path d={`M${x - 15} ${y + 4} Q${x - 6} ${y - 2} ${x + 3} ${y + 4}`} stroke="#fff" strokeWidth={2} fill="none" /><rect x={x + 3} y={y - 8} width={11} height={11} fill="#62c0de" /></g>),
];

// Cargo grid inside the trailer: 2 rows x 6 columns, filled from the front (cab end) to the rear
type Slot = { x: number; y: number; w: number; h: number; col: number; i: number };
function cargoSlots(reefer: boolean): Slot[] {
  const w = 100;
  const h = reefer ? 52 : 60;
  const rows = reefer ? [92, 148] : [84, 146];
  const out: Slot[] = [];
  for (let col = 0; col < 6; col++) {
    const x = 711 - col * 105;
    rows.forEach((y) => out.push({ x, y, w, h, col, i: out.length }));
  }
  return out;
}

// Wooden crate (or blue milk crate / fish bin). Closed shows a label; open shows the product heaped inside.
function CrateBox({ s, crate = 'wood', name, item }: { s: Slot; crate?: Crate; name?: string; item?: ReeferItem['item'] }) {
  const open = !!item;
  const top = open ? s.y + 20 : s.y;
  const blue = crate === 'milk' ? '#2f6fd1' : '#3346a8';
  const heap = open ? (
    <g>
      {[0, 1, 2, 3, 4].map((k) => <g key={k}>{item!(s.x + 14 + k * 18, s.y + 12, k)}</g>)}
      {[0, 1, 2, 3].map((k) => <g key={k + 5}>{item!(s.x + 23 + k * 18, s.y + 17, k + 5)}</g>)}
    </g>
  ) : null;
  const label = name ? (
    open ? (
      <text x={s.x + s.w / 2} y={s.y + s.h - 5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#fff8ec" fontFamily="system-ui, sans-serif">{name}</text>
    ) : (
      <g>
        <rect x={s.x + s.w / 2 - 36} y={s.y + s.h / 2 - 10} width={72} height={20} rx={3} fill="#fbf6ec" stroke="#b9a07c" />
        <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 4} textAnchor="middle" fontSize={name.length > 10 ? 9.5 : 11} fontWeight={700} fill="#4a3420" fontFamily="system-ui, sans-serif">{name}</text>
      </g>
    )
  ) : null;
  if (crate !== 'wood') {
    return (
      <g>
        {heap}
        <rect x={s.x} y={top} width={s.w} height={s.y + s.h - top} rx={4} fill={blue} />
        <rect x={s.x} y={top} width={s.w} height={4} rx={2} fill="#ffffff" opacity={0.25} />
        {crate === 'milk' && open && <rect x={s.x + s.w / 2 - 12} y={top + 4} width={24} height={5} rx={2.5} fill="#1f4f9e" />}
        {label}
      </g>
    );
  }
  const step = (s.h - 4) / 4;
  const planks = open ? [s.y + 21, s.y + 37] : [0, 1, 2, 3].map((k) => s.y + 2 + k * step);
  return (
    <g>
      {heap}
      {open && <rect x={s.x + 6} y={top} width={s.w - 12} height={s.y + s.h - top} fill="#5a3a20" />}
      {planks.map((py) => <rect key={py} x={s.x + 3} y={py} width={s.w - 6} height={open ? 13 : step - 2} rx={1.5} fill="#c48a52" stroke="#9c6a3a" strokeWidth={1} />)}
      <rect x={s.x} y={top} width={8} height={s.y + s.h - top} rx={1.5} fill="#7a4f2b" />
      <rect x={s.x + s.w - 8} y={top} width={8} height={s.y + s.h - top} rx={1.5} fill="#7a4f2b" />
      {label}
    </g>
  );
}

function CardboardBox({ s, children, light = false }: { s: Slot; children?: ReactNode; light?: boolean }) {
  return (
    <g>
      <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={2} fill={light ? '#f1e2c8' : '#d9b382'} stroke="#9c7445" strokeWidth={2} />
      {!light && <rect x={s.x + s.w / 2 - 4} y={s.y} width={8} height={s.h} fill="#c49a62" />}
      {children}
    </g>
  );
}

function LabeledBox({ s, reefer, flip, still, flipAt = 1.4 }: { s: Slot; reefer: boolean; flip: boolean; still: boolean; flipAt?: number }) {
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h / 2;
  let front: ReactNode;
  let back: ReactNode;
  if (reefer) {
    const r = REEFER_ITEMS[s.i];
    front = <CrateBox s={s} crate={r.crate} name={r.name} />;
    back = <CrateBox s={s} crate={r.crate} name={r.name} item={r.item} />;
  } else {
    const product = DRY_PRODUCTS[s.i];
    front = (
      <CardboardBox s={s}>
        <rect x={cx - 38} y={cy - 10} width={76} height={20} rx={3} fill="#fbf6ec" stroke="#b9a07c" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={product.name.length > 11 ? 9.5 : 11} fontWeight={700} fill="#4a3420" fontFamily="system-ui, sans-serif">
          {product.name}
        </text>
      </CardboardBox>
    );
    back = (
      <CardboardBox s={s} light>
        {product.icon(cx, cy - 6)}
        <text x={cx} y={s.y + s.h - 6} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#4a3420" fontFamily="system-ui, sans-serif">
          {product.name}
        </text>
      </CardboardBox>
    );
  }
  if (!flip) return <>{front}</>;
  if (still) return <>{back}</>;
  const delay = flipAt + s.i * 0.1;
  return (
    <g>
      <g className="bv-flip-out" style={{ animationDelay: `${delay}s` }}>{front}</g>
      <g className="bv-flip-in" style={{ animationDelay: `${delay + 0.3}s` }}>{back}</g>
    </g>
  );
}

function Cargo({ kind, mode, still, t0 = 0, flipAt }: { kind: TruckKind; mode: 'full' | 'load' | 'labels' | 'products'; still: boolean; t0?: number; flipAt?: number }) {
  const reefer = kind === 'reefer';
  const slots = cargoSlots(reefer);
  return (
    <g>
      {slots.map((s) => {
        if (mode === 'labels') return <LabeledBox key={s.i} s={s} reefer={reefer} flip still={still} />;
        if (mode === 'products') return <LabeledBox key={s.i} s={s} reefer={reefer} flip still />;
        const flips = flipAt !== undefined;
        const box = <LabeledBox s={s} reefer={reefer} flip={flips} still={still} flipAt={flipAt} />;
        if (mode === 'full') return <g key={s.i}>{box}</g>;
        // Loading: first column arrives with trip 1, second with trip 2, then the rest fills in
        if (still) return flips || s.col < 4 ? <g key={s.i}>{box}</g> : null;
        const delay = s.col === 0 ? t0 + 1.3 : s.col === 1 ? t0 + 3.7 : t0 + 4.2 + (s.col - 2) * 0.3;
        return <g key={s.i} className="bv-pop" style={{ animationDelay: `${delay}s` }}>{box}</g>;
      })}
    </g>
  );
}

const Interior = ({ reefer }: { reefer: boolean }) => (
  <rect x={181} y={78} width={639} height={130} fill={reefer ? '#2f4a63' : '#4a5363'} />
);

// Reefer air circulation: out along the ceiling toward the doors, back along the floor
const Air = () => (
  <g className="bv-air" strokeWidth={3} strokeDasharray="14 10" fill="none" stroke="#9fdcf5">
    <path d="M796 85 L186 85" />
    <path d="M186 204 L796 204" />
    <path d="M186 85 Q178 145 186 204" />
  </g>
);

// Highlight around the reefer unit on the Pre-cooled scene
const UnitGlow = ({ still }: { still: boolean }) => (
  <g className={still ? undefined : 'bv-glow'}>
    <rect x={790} y={76} width={44} height={100} rx={9} fill="#ffe14d" opacity={0.28} />
    <rect x={790} y={76} width={44} height={100} rx={9} fill="none" stroke="#ffd21f" strokeWidth={4} />
  </g>
);

// Cold air off the reefer unit: small ice crystals drifting down and away
const Flake = ({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className="bv-flake" style={{ animationDelay: `${delay}s` }} stroke="#3d9ad3" strokeWidth={2.6} strokeLinecap="round">
      <path d={`M${-r} 0H${r}M${-r / 2} ${-r * 0.87}L${r / 2} ${r * 0.87}M${-r / 2} ${r * 0.87}L${r / 2} ${-r * 0.87}`} />
      <circle r={2.2} fill="#ffffff" stroke="none" />
    </g>
  </g>
);
const Wisps = () => (
  <g>
    <Flake x={800} y={62} r={10} delay={0} />
    <Flake x={826} y={50} r={7} delay={0.7} />
    <Flake x={784} y={88} r={8} delay={1.3} />
    <Flake x={812} y={36} r={6} delay={1.9} />
  </g>
);

function ReeferDisplay({ countFrom = 0, startAt = 0, still }: { countFrom?: number; startAt?: number; still: boolean }) {
  const [temp, setTemp] = useState(countFrom && !still ? countFrom : 34);
  useEffect(() => {
    if (!countFrom || still || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTemp(34);
      return;
    }
    setTemp(countFrom);
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        setTemp((t) => {
          if (t <= 34) {
            window.clearInterval(id);
            return 34;
          }
          return t - 1;
        });
      }, 70);
    }, startAt * 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [countFrom, startAt, still]);
  return (
    <text x={812} y={161} fontSize={10} fontWeight={700} fontFamily="ui-monospace, monospace" fill="#5ef08a" textAnchor="middle">
      {temp}°
    </text>
  );
}

const Smoke = () => (
  <g fill="#e3e6ea">
    {[0, 0.85, 1.7].map((offset) => (
      <circle key={offset} className="bv-smoke" cx={835} cy={46} r={5} style={{ animationDelay: `calc(var(--smoke-start, 2.4s) + ${offset}s)` }} />
    ))}
  </g>
);

const CheckBadge = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className="bv-pop" style={{ animationDelay: `${delay}s` }}>
      <circle r={24} fill="#2f9e5b" stroke="#fff" strokeWidth={3} />
      <path d="M-10 0 L-3 7 L11 -8" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
);

// Forklift facing right, toward the trailer's rear doors
function Forklift({ reefer, still, delay }: { reefer: boolean; still: boolean; delay: number }) {
  const f = 46;
  return (
    <g className={still ? undefined : 'bv-forklift'} style={still ? undefined : { animationDelay: `${delay}s` }}>
      <rect x={f} y={196} width={70} height={44} rx={6} fill="#f2b632" />
      <rect x={f + 20} y={150} width={6} height={90} fill="#5d6573" />
      <rect x={f + 26} y={160} width={34} height={38} fill="none" stroke="#5d6573" strokeWidth={5} />
      <rect x={f + 70} y={150} width={6} height={82} fill="#7d8591" />
      <rect x={f + 72} y={226} width={60} height={5} fill="#5d6573" />
      <circle cx={f + 14} cy={246} r={11} fill="#2f3542" />
      <circle cx={f + 54} cy={246} r={13} fill="#2f3542" />
      <g className={still ? undefined : 'bv-fork-load'} style={still ? undefined : { animationDelay: `${delay}s` }}>
        {reefer ? <CrateBox s={{ x: f + 80, y: 186, w: 50, h: 40, col: 0, i: 0 }} /> : <CardboardBox s={{ x: f + 80, y: 186, w: 50, h: 40, col: 0, i: 0 }} />}
      </g>
    </g>
  );
}

// Open rear door panel; it swings shut again when closeAt is set
const OpenDoor = ({ delay, still, closeAt }: { delay: number; still: boolean; closeAt?: number }) => {
  if (still && closeAt !== undefined) return null;
  const anim = still ? undefined : closeAt !== undefined ? `bv-door .5s ease-out ${delay}s both, bv-door-shut .45s ease-in ${closeAt}s forwards` : `bv-door .5s ease-out ${delay}s both`;
  return (
    <g className={still ? undefined : 'bv-door'} style={anim ? { animation: anim } : undefined}>
      <rect x={134} y={76} width={38} height={134} fill="#e4e7ec" stroke="#cdd2d9" strokeWidth={2} />
      <rect x={150} y={110} width={4} height={60} rx={2} fill="#9aa1ab" />
    </g>
  );
};

// Seal on the rear door latch
const Seal = ({ delay, still, animate }: { delay: number; still: boolean; animate: boolean }) => (
  <g className={still || !animate ? undefined : 'bv-swing'} style={still || !animate ? undefined : { animationDelay: `${delay}s` }}>
    <rect x={168} y={150} width={14} height={40} rx={2} fill="#5d6573" />
    <circle cx={162} cy={196} r={7} fill="none" stroke="#3b82bb" strokeWidth={3} />
    <rect x={136} y={202} width={32} height={18} rx={3} fill="#3b82bb" />
  </g>
);

const TrailerSide = ({ delay, still }: { delay: number; still: boolean }) => (
  <g className={still ? undefined : 'bv-cover'} style={still ? undefined : { animationDelay: `${delay}s` }}>
    <rect x={175} y={72} width={651} height={142} rx={4} fill="#e4e7ec" />
    <rect x={185} y={82} width={631} height={122} rx={2} fill="none" stroke="#cdd2d9" strokeWidth={3} />
    {[106, 130, 154, 178].map((y) => <line key={y} x1={187} y1={y} x2={814} y2={y} stroke="#cdd2d9" strokeWidth={2} />)}
    <rect x={175} y={196} width={651} height={8} fill="#3b82bb" />
  </g>
);

// ---------- Flatbed load (on-screen positions) ----------

const LOG_ROWS = [
  { y: 166, x1: 198, x2: 794 },
  { y: 136, x1: 208, x2: 786 },
  { y: 106, x1: 192, x2: 800 },
];

function LogRow({ y, x1, x2, seed }: { y: number; x1: number; x2: number; seed: number }) {
  const w = x2 - x1;
  return (
    <g>
      <rect x={x1} y={y} width={w} height={30} rx={15} fill="#a8693a" />
      <rect x={x1 + 10} y={y + 4} width={w - 20} height={6} rx={3} fill="#c4834d" />
      <rect x={x1 + 10} y={y + 17} width={w - 20} height={3} rx={1.5} fill="#8a5129" />
      <rect x={x1 + 10} y={y + 24} width={w - 20} height={3} rx={1.5} fill="#7a4622" />
      {[0, 1, 2].map((k) => <ellipse key={k} cx={x1 + 110 + k * 180 + ((seed * 53) % 70)} cy={y + 13} rx={7} ry={3} fill="#8a5129" />)}
      {[x1 + 4, x2 - 4].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={y + 15} rx={8} ry={15} fill="#ecc89c" />
          <ellipse cx={cx} cy={y + 15} rx={5} ry={10} fill="none" stroke="#c99a68" strokeWidth={1.5} />
          <ellipse cx={cx} cy={y + 15} rx={2.2} ry={5} fill="none" stroke="#c99a68" strokeWidth={1.2} />
        </g>
      ))}
    </g>
  );
}

const Logs = () => <g>{LOG_ROWS.map((r, i) => <LogRow key={r.y} {...r} seed={i} />)}</g>;

// Crane at the back of the trailer: tower on the ground, arm out over the deck
const BOOM_Y = 0;
const HOOK_X = 497;
const Crane = () => (
  <g>
    <rect x={92} y={256} width={48} height={14} rx={2} fill="#5d6573" />
    <g fill="#f2b632">
      <rect x={106} y={BOOM_Y} width={4} height={258} />
      <rect x={122} y={BOOM_Y} width={4} height={258} />
      <rect x={60} y={BOOM_Y} width={460} height={4} />
      <rect x={60} y={BOOM_Y + 12} width={460} height={4} />
    </g>
    <g stroke="#f2b632" strokeWidth={2}>
      {Array.from({ length: 16 }, (_, i) => BOOM_Y + 16 + i * 15).map((y, i) => (
        <line key={y} x1={i % 2 ? 108 : 124} y1={y} x2={i % 2 ? 124 : 108} y2={y + 15} />
      ))}
      {Array.from({ length: 23 }, (_, i) => 62 + i * 20).map((x, i) => (
        <line key={x} x1={x} y1={i % 2 ? BOOM_Y + 2 : BOOM_Y + 14} x2={x + 20} y2={i % 2 ? BOOM_Y + 14 : BOOM_Y + 2} />
      ))}
    </g>
    <rect x={60} y={BOOM_Y + 16} width={34} height={22} rx={2} fill="#5d6573" />
    <rect x={HOOK_X - 9} y={BOOM_Y + 14} width={18} height={8} rx={2} fill="#3a4250" />
  </g>
);

// A row of logs hanging from the crane: one straight cable down to the hook, two slings in a V to the logs
function HangingRow({ row, seed, delay, still, clip }: { row: (typeof LOG_ROWS)[number]; seed: number; delay: number; still: boolean; clip: string }) {
  const a = row.x1 + 90;
  const b = row.x2 - 90;
  const hookY = row.y - 44;
  const rigging = (
    <g stroke="#3a4250" strokeLinecap="round" fill="none">
      <line x1={HOOK_X} y1={-400} x2={HOOK_X} y2={hookY - 6} strokeWidth={3} />
      <path d={`M${HOOK_X - 4} ${hookY - 7} h8 v6 q0 6 -5 6 q-4 0 -4 -4`} strokeWidth={3} />
      <line x1={HOOK_X} y1={hookY + 4} x2={a} y2={row.y + 2} strokeWidth={2} />
      <line x1={HOOK_X} y1={hookY + 4} x2={b} y2={row.y + 2} strokeWidth={2} />
    </g>
  );
  const drop = -(hookY - (BOOM_Y + 46));
  if (still) {
    return (
      <g clipPath={`url(#${clip})`}>
        <g transform={`translate(0 ${drop})`}>
          {rigging}
          <LogRow {...row} seed={seed} />
        </g>
      </g>
    );
  }
  return (
    <g clipPath={`url(#${clip})`}>
      <g className="bv-lower" style={{ animationDelay: `${delay}s`, ['--drop' as string]: `${drop}px` }}>
        <g className="bv-rigging" style={{ animationDelay: `${delay}s` }}>{rigging}</g>
        <LogRow {...row} seed={seed} />
      </g>
    </g>
  );
}

const STRAP_X = [231, 361, 531, 701];
const Straps = ({ animate = false }: { animate?: boolean }) => (
  <g>
    {STRAP_X.map((x, i) => (
      <g key={x} className={animate ? 'bv-strap' : undefined} style={animate ? { animationDelay: `${0.4 + i * 0.35}s` } : undefined}>
        <rect x={x} y={103} width={9} height={97} rx={2} fill="#f2c230" />
        <rect x={x} y={103} width={9} height={4} fill="#d9a91f" />
        <rect x={x - 3} y={180} width={15} height={12} rx={2} fill="#7d8591" />
        <rect x={x} y={183} width={9} height={3} fill="#c6cbd2" />
      </g>
    ))}
  </g>
);

const Tarp = ({ animate = false }: { animate?: boolean }) => (
  <g className={animate ? 'bv-tarp' : undefined} style={animate ? { animationDelay: '.4s' } : undefined}>
    <path d="M188 196 L188 112 Q188 96 204 96 L790 96 Q806 96 806 112 L806 196 Z" fill="#3d4a5c" />
    {[200, 280, 360, 440, 520, 600, 680].map((x) => (
      <path key={x} d={`M${x} 98 Q${x + 40} 112 ${x + 80} 98`} stroke="#2c3644" strokeWidth={3} fill="none" />
    ))}
    {Array.from({ length: 10 }, (_, i) => 210 + i * 62).map((x) => (
      <line key={x} x1={x} y1={196} x2={x} y2={206} stroke="#f2c230" strokeWidth={3} />
    ))}
  </g>
);

// ---------- Scene ----------

export default function TruckScene({ kind = 'dry', scene = 'road', still = false }: { kind?: TruckKind; scene?: SceneId; still?: boolean }) {
  const gid = `bvsky${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const reefer = kind === 'reefer';
  const flatbed = kind === 'flatbed';

  const arrives = scene === 'load' || scene === 'road' || (reefer && scene === 'precool');
  // Keeps rolling on the road (instead of parking) on these scenes
  const cruising = scene === 'road' || scene === 'inside' || (reefer && scene === 'precool');
  const t0 = arrives ? 2.6 : 0.4; // when the truck has stopped
  const doorShut = t0 + 5.8;
  const flipAt = doorShut + 0.5;
  const reeferCoverAt = flipAt + Math.max(...cargoSlots(true).map(({ i }) => i)) * 0.1 + 0.6 + 0.1;
  const reeferSealAt = reeferCoverAt + 1.4;
  const reeferCheckAt = reeferSealAt + 1.2;

  // Drives off to the right at the end of these scenes
  let exitAt: number | null = null;
  if (reefer && scene === 'load') exitAt = reeferCheckAt + 0.5;
  if (kind === 'dry' && scene === 'sealed') exitAt = 3.8;
  if (flatbed && scene === 'tarped') exitAt = 3.4;
  const leaves = exitAt !== null;

  let onTruck: ReactElement | null = null; // moves with the truck
  let around: ReactElement | null = null; // stays put

  if (scene === 'road') {
    onTruck = flatbed ? <><Logs /><Tarp /><Straps /></> : null;
  } else if (scene === 'load' && !flatbed) {
    // Fill up, shut the door, then flip the labels to show the products.
    onTruck = (
      <>
        <Interior reefer={reefer} />
        {reefer && <Air />}
        <Cargo kind={kind} mode="load" still={still} t0={t0} flipAt={flipAt} />
        {(reefer || still) && (
          <>
            <TrailerSide delay={reeferCoverAt} still={still} />
            <Seal delay={reeferSealAt} still={still} animate />
            <CheckBadge x={130} y={70} delay={reeferCheckAt} />
          </>
        )}
      </>
    );
    around = (
      <>
        <OpenDoor delay={t0} still={still} closeAt={doorShut} />
        <Forklift reefer={reefer} still={still} delay={t0 + 0.3} />
      </>
    );
  } else if (scene === 'load') {
    onTruck = still ? (
      <>
        <LogRow {...LOG_ROWS[0]} seed={0} />
        <LogRow {...LOG_ROWS[1]} seed={1} />
      </>
    ) : null;
    around = (
      <>
        <defs>
          <clipPath id={`${gid}c`}>
            <rect x={-3000} y={BOOM_Y + 22} width={7000} height={400} />
          </clipPath>
        </defs>
        <g className={still ? undefined : 'bv-fade'} style={still ? undefined : { animationDelay: `${t0 - 0.3}s` }}>
          {still ? (
            <HangingRow row={LOG_ROWS[2]} seed={2} delay={0} still clip={`${gid}c`} />
          ) : (
            LOG_ROWS.map((r, i) => <HangingRow key={r.y} row={r} seed={i} delay={t0 + 0.5 + i * 1.9} still={false} clip={`${gid}c`} />)
          )}
          <Crane />
        </g>
      </>
    );
  } else if (scene === 'inside') {
    onTruck = (
      <>
        <Interior reefer={reefer} />
        {reefer && <Air />}
        <Cargo kind={kind} mode="labels" still={still} />
      </>
    );
  } else if (scene === 'sealed') {
    // Close the side over the products, then seal, check, and drive away.
    onTruck = (
      <>
        <Interior reefer={false} />
        <Cargo kind={kind} mode="products" still={still} />
        <TrailerSide delay={0.6} still={still} />
        <Seal delay={2} still={still} animate />
        <CheckBadge x={130} y={70} delay={3.1} />
      </>
    );
  } else if (scene === 'precool') {
    onTruck = (
      <>
        <UnitGlow still={still} />
        <rect className={still ? undefined : 'bv-frost'} x={175} y={72} width={651} height={142} rx={4} fill="#9fdcf5" opacity={0.3} />
        <g className={still ? undefined : 'bv-snow'} stroke="#ffffff" strokeWidth={3} strokeLinecap="round">
          {[[260, 46], [380, 34], [520, 52], [660, 38], [760, 50], [210, 64]].map(([x, y], i) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <path d="M-9 0H9M0 -9V9M-6 -6L6 6M-6 6L6 -6" style={{ animationDelay: `${t0 + i * 0.3}s` }} />
            </g>
          ))}
        </g>
      </>
    );
  } else if (scene === 'strapped') {
    onTruck = (
      <>
        <Logs />
        <Straps animate={!still} />
        <CheckBadge x={130} y={70} delay={2.2} />
      </>
    );
  } else {
    onTruck = (
      <>
        <Logs />
        <Tarp animate={!still} />
        <Straps />
        <CheckBadge x={130} y={70} delay={2.4} />
      </>
    );
  }

  const classes = ['bv-scene', still ? 'bv-still' : 'bv-live', arrives ? 'bv-arrive' : '', cruising ? 'bv-cruise' : '', leaves ? 'bv-leave' : ''].join(' ');
  const style = leaves ? ({ ['--exit' as string]: `${exitAt}s` } as CSSProperties) : undefined;

  return (
    <svg viewBox="20 -10 1030 350" preserveAspectRatio="xMidYMax meet" overflow="visible" className={classes} style={style} role="img" aria-hidden="true">
      <Backdrop kind={kind} gid={gid} moving={cruising && !still} />
      <g className="bv-exit">
        <g className="bv-drive">
          <g className={cruising ? 'bv-idle' : undefined}>
            <TruckBody kind={kind} />
            {onTruck}
            {reefer && (
              <>
                <Wisps />
                <ReeferDisplay still={still} countFrom={scene === 'precool' ? 68 : 0} startAt={t0 + 0.2} />
              </>
            )}
            {(cruising || leaves) && <Smoke />}
          </g>
        </g>
      </g>
      {around}
    </svg>
  );
}