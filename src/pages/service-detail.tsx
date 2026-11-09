import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight,
  ArrowDownToLine,
  BellRing,
  Boxes,
  CalendarDays,
  DoorOpen,
  FileCheck2,
  FileText,
  Link2,
  Lock,
  Maximize2,
  RefreshCw,
  Ruler,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Truck,
  Umbrella,
  UserRound,
  Warehouse,
  Weight,
  type LucideIcon,
} from 'lucide-react';
import { HeroImage } from '../components/BannerMedia';
const refrigeratedImg = `${import.meta.env.BASE_URL}hero-reefer.webp`;
const dryVanImg = `${import.meta.env.BASE_URL}hero-dryvan.webp`;
const flatbedImg = `${import.meta.env.BASE_URL}hero-flatbed.webp`;
import TruckScene, { type SceneId, type TruckKind } from '../components/TruckScene';
import './service-detail.css';

type ServiceKey = 'refrigerated' | 'dry-van' | 'flatbed';

type Tile = { icon: LucideIcon; value: string; label: string };
type Handling = { title: string; text: string };
type ServiceData = {
  title: string;
  name: string;
  kicker: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePos?: string;
  equipment: string;
  kind: TruckKind;
  scenes: { id: SceneId; label: string }[];
  tiles: Tile[];
  overview: string;
  movedIntro: string;
  moved: string[];
  handling: Handling[];
};

const services: Record<ServiceKey, ServiceData> = {
  refrigerated: {
    title: 'REFRIGERATED FREIGHT',
    name: 'Refrigerated Freight',
    kicker: 'EQUIPMENT · REEFER',
    description: 'Temperature-controlled freight, handled with the care your product needs from the dock to delivery.',
    image: refrigeratedImg,
    imageAlt: 'Driver checking the temperature display on a refrigerated trailer unit',
    equipment: 'reefer',
    kind: 'reefer',
    scenes: [
      { id: 'precool', label: 'Pre-cooled' },
      { id: 'load', label: 'Loading' },
      { id: 'road', label: 'On the road' },
    ],
    tiles: [
      { icon: Truck, value: "53' refrigerated", label: 'Insulated trailer' },
      { icon: Boxes, value: '26 pallets', label: 'Single-stacked' },
      { icon: Weight, value: 'About 43,000 lbs', label: 'Typical max weight' },
      { icon: Thermometer, value: 'Frozen to fresh', label: 'Set to your product' },
      { icon: RefreshCw, value: 'Two unit modes', label: 'Continuous, start-stop' },
      { icon: Snowflake, value: 'Pre-cooled', label: 'Before loading' },
      { icon: FileCheck2, value: 'Temp in writing', label: 'On every rate con' },
      { icon: ShieldCheck, value: 'Breakdown coverage', label: 'Required of carriers' },
    ],
    overview:
      "When your freight has to stay cold, there's no room for guesswork. We match every refrigerated load with a vetted reefer carrier and confirm the details that matter before the truck ever arrives: the set temperature, pre-cool, and whether the unit runs continuous or start-stop. Everything is written on the rate confirmation, so the driver, the carrier, and you are all working from the same plan.",
    movedIntro: 'Anything that has to stay at a set temperature from pickup to delivery.',
    moved: ['Fresh Produce', 'Frozen Foods', 'Dairy & Eggs', 'Meat & Poultry', 'Seafood', 'Bakery', 'Flowers & Plants', 'Beverages', 'Chocolate & Candy', 'Pharmaceuticals', 'Cosmetics & Personal Care', 'Freeze-Sensitive Goods'],
    handling: [
      { title: 'Temperature in writing', text: 'Your set temperature, pre-cool, and unit setting are written on the rate confirmation before the truck is dispatched.' },
      { title: 'Pre-cooled before loading', text: 'We confirm the trailer is cooled to your set temperature before loading begins. Your product should also be at temperature when it\'s loaded, since a reefer holds temperature rather than cooling warm product down.' },
      { title: 'Continuous or start-stop', text: "Continuous mode keeps air circulating the whole trip, which most fresh produce needs. Start-stop cycles the unit on and off and works well for many frozen and packaged goods. Not sure which your freight needs? We'll help you figure it out." },
      { title: 'Protected loads', text: 'Every reefer carrier we work with must carry reefer breakdown coverage, and we stay in contact with the driver so any unit issue is caught early.' },
      { title: 'Kept from freezing', text: 'In winter, a reefer can hold your freight above freezing as well as keeping it cold.' },
      { title: 'Planned around peak season', text: 'We plan ahead for produce season, when refrigerated capacity tightens.' },
    ],
  },
  'dry-van': {
    title: 'DRY VAN FREIGHT',
    name: 'Dry Van Freight',
    kicker: 'EQUIPMENT · DRY VAN',
    description: 'Enclosed, weather-protected capacity for the freight that keeps your business running.',
    image: dryVanImg,
    imageAlt: 'Red semi truck pulling a white dry van trailer at sunset',
    equipment: 'dryvan',
    kind: 'dry',
    scenes: [
      { id: 'load', label: 'Loading' },
      { id: 'sealed', label: 'Sealed' },
      { id: 'road', label: 'On the road' },
    ],
    tiles: [
      { icon: Truck, value: "53' enclosed", label: 'Trailer' },
      { icon: Boxes, value: '26 pallets', label: 'Up to 52 stacked' },
      { icon: Weight, value: 'About 45,000 lbs', label: 'Typical max weight' },
      { icon: Ruler, value: "52.5' × 8.2' × 9'", label: 'Inside, approx.' },
      { icon: Warehouse, value: 'Dock-height', label: 'Loading' },
      { icon: DoorOpen, value: 'Swing doors', label: 'Rear access' },
      { icon: Umbrella, value: 'Weather-protected', label: 'Fully enclosed' },
      { icon: Lock, value: 'Sealed', label: 'Number on the BOL' },
    ],
    overview:
      "Dry van is the most common way to move freight that doesn't need temperature control. Before your truck is dispatched, we confirm your appointments, reference numbers, and how the freight will be braced inside the trailer, so it arrives the way it was loaded.",
    movedIntro: 'Dry van is built for freight that needs protection from weather but not temperature control.',
    moved: ['Packaged Food & Beverages', 'Canned & Bottled Goods', 'Retail & Consumer Products', 'Paper & Packaging', 'Household Goods & Furniture', 'Appliances & Electronics', 'Plastics & Raw Materials', 'Building Supplies'],
    handling: [
      { title: 'Appointments confirmed up front', text: 'Pickup and delivery times, dock hours, and reference numbers are confirmed and written on the rate confirmation before dispatch.' },
      { title: 'Secured inside the trailer', text: 'We confirm your freight will be braced with load bars or straps so nothing shifts in transit.' },
      { title: 'Sealed and recorded', text: 'The trailer is sealed after loading, and the seal number is recorded on the bill of lading so your receiver can verify the load wasn\'t opened.' },
      { title: 'Protected from the cold', text: 'For freeze-sensitive products on winter lanes, we can arrange a reefer set to keep your freight above freezing.' },
    ],
  },
  flatbed: {
    title: 'FLATBED FREIGHT',
    name: 'Flatbed Freight',
    kicker: 'EQUIPMENT · FLATBED',
    description: 'Open-deck capacity for heavy, oversized, and hard-to-load freight, planned and secured right.',
    image: flatbedImg,
    imageAlt: 'Yellow semi truck with an empty flatbed trailer',
    imagePos: 'left center',
    equipment: 'flatbed',
    kind: 'flatbed',
    scenes: [
      { id: 'load', label: 'Loading' },
      { id: 'strapped', label: 'Strapped down' },
      { id: 'tarped', label: 'Tarped' },
      { id: 'road', label: 'On the road' },
    ],
    tiles: [
      { icon: Truck, value: "48' or 53' deck", label: 'Open deck' },
      { icon: Ruler, value: "8.5' wide", label: 'Legal width' },
      { icon: Weight, value: 'About 48,000 lbs', label: 'Typical max weight' },
      { icon: Maximize2, value: "8.5' legal height", label: "About 10' on a step deck" },
      { icon: ArrowDownToLine, value: 'Side or top load', label: 'Crane or forklift' },
      { icon: Link2, value: 'Straps and chains', label: 'Federal standards' },
      { icon: Umbrella, value: 'Tarps', label: 'On request' },
      { icon: FileCheck2, value: 'Oversize', label: 'With permits' },
    ],
    overview:
      'Flatbed is the answer when freight is too large, too heavy, or too awkward to load into an enclosed trailer. Steel, lumber, machinery, and building materials all move best on an open deck. We match each load with a vetted standard flatbed or step deck carrier and confirm the dimensions, weight, tarping, and securement requirements before the truck is dispatched.',
    movedIntro: "Freight that's too large, heavy, or awkward for an enclosed trailer.",
    moved: ['Steel & Metal', 'Lumber', 'Machinery & Equipment', 'Precast Concrete', 'Pipe', 'Roofing & Building Materials', 'Job Site Deliveries'],
    handling: [
      { title: 'Dimensions verified', text: "We confirm your freight's size and weight up front so the right equipment shows up the first time." },
      { title: 'Securement confirmed', text: 'Strap, chain, and edge protection requirements are agreed on before pickup, following federal cargo securement standards.' },
      { title: 'Tarping specified', text: 'If your freight needs to be covered, tarp requirements are written on the rate confirmation and included in your quote.' },
      { title: 'Job sites and oversize loads', text: 'We plan around site access limits, unloading equipment, and delivery windows. Oversized loads are coordinated with the right equipment and permits.' },
    ],
  },
};

const included: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: 'Screened carriers', text: 'Authority, insurance, and safety record reviewed before booking.' },
  { icon: FileText, title: 'Terms on the rate con', text: 'Your rate, appointments, and any accessorials, agreed before pickup.' },
  { icon: BellRing, title: 'Proactive updates', text: 'You hear from us at pickup, in transit, and at delivery.' },
  { icon: UserRound, title: 'Direct line to the owner', text: 'No call center. You reach the person handling your load.' },
];

const otherPages: Record<ServiceKey, { label: string; href: string }[]> = {
  refrigerated: [{ label: 'Dry Van', href: '/services/dry-van-freight' }, { label: 'Flatbed', href: '/services/flatbed-freight' }],
  'dry-van': [{ label: 'Reefer', href: '/services/refrigerated-freight' }, { label: 'Flatbed', href: '/services/flatbed-freight' }],
  flatbed: [{ label: 'Dry Van', href: '/services/dry-van-freight' }, { label: 'Reefer', href: '/services/refrigerated-freight' }],
};

const CAB_COLORS: Record<TruckKind, [string, string, string]> = {
  dry: ['#d9483f', '#a8352d', '#ea6157'],
  reefer: ['#3a8fd6', '#2a6fae', '#5aa8ea'],
  flatbed: ['#f2b632', '#cf9417', '#f7ca5c'],
};

// Small top-down cab used in the calculator diagram
function TopCab({ kind }: { kind: TruckKind }) {
  const [c, dk, lt] = CAB_COLORS[kind];
  return (
    <g>
      <rect x={330} y={38} width={8} height={6} fill="#5d6573" />
      <path d="M336 18 L360 18 Q372 18 376 28 L378 41 L376 54 Q372 64 360 64 L336 64 Z" fill={c} />
      <rect x={336} y={18} width={5} height={46} fill={dk} />
      <path d="M352 22 Q358 41 352 60 L346 60 Q350 41 346 22 Z" fill="#7cc6ec" />
      <path d="M362 26 L372 30 L374 41 L372 52 L362 56 Z" fill={lt} />
      <rect x={344} y={12} width={6} height={7} rx={2} fill="#5d6573" />
      <rect x={344} y={63} width={6} height={7} rx={2} fill="#5d6573" />
    </g>
  );
}

const num = (v: string) => (v.trim() === '' ? 0 : Number(v.replace(/,/g, '')) || 0);
const fmt = (n: number) => n.toLocaleString('en-US');

function Field({ label, value, onChange, unit, id }: { label: string; value: string; onChange: (v: string) => void; unit: string; id: string }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block font-sans text-[13px] font-semibold text-foreground">{label}</span>
      <span className="flex items-center rounded-lg border border-[#d5dbe2] bg-white px-3 focus-within:border-[#275d87] focus-within:ring-2 focus-within:ring-[#62c0de]/40">
        <input
          id={id}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent py-2.5 font-sans text-base font-semibold text-foreground outline-none"
        />
        <span className="shrink-0 font-sans text-xs text-[#8a93a0]">{unit}</span>
      </span>
    </label>
  );
}

function Toggle({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-sans text-[13px] font-semibold text-foreground">{label}</span>
      <div className="flex rounded-lg bg-[#eef1f4] p-[3px]" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={`rounded-md px-3 py-1.5 font-sans text-xs font-semibold transition-colors ${value === o ? 'bg-white text-foreground shadow-sm' : 'text-[#5b6573]'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bar({ label, value, text }: { label: string; value: number; text: string }) {
  const over = value > 100;
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between font-sans text-[12.5px]">
        <span className="text-[#5b6573]">{label}</span>
        <b className="text-foreground">{text}</b>
      </div>
      <div className="h-2 overflow-hidden rounded bg-[#eef1f4]">
        <i className="block h-full rounded transition-all duration-500" style={{ width: `${Math.min(value, 100)}%`, background: over ? '#d9483f' : '#3b82bb' }} />
      </div>
    </div>
  );
}

function Verdict({ ok, title, text }: { ok: boolean; title: string; text: string }) {
  return (
    <div className={`mt-4 rounded-lg px-4 py-3 ${ok ? 'bg-[#e8f6ee] text-[#1f6b40]' : 'bg-[#fdecea] text-[#9b2c25]'}`} aria-live="polite">
      <b className="block font-sans text-[14.5px]">{ok ? `✓ ${title}` : title}</b>
      <span className="font-sans text-[12.5px] leading-5">{text}</span>
    </div>
  );
}

function BoxCalculator({ kind, equipment, button }: { kind: 'dry' | 'reefer'; equipment: string; button: string }) {
  const reefer = kind === 'reefer';
  const trailer = reefer ? 'reefer' : 'dry van';
  const maxWeight = reefer ? 43000 : 45000;
  const [pallets, setPallets] = useState('18');
  const [weight, setWeight] = useState('32,000');
  const [stack, setStack] = useState('No');
  const [temp, setTemp] = useState('34');
  const [mode, setMode] = useState('Continuous');

  const p = num(pallets);
  const w = num(weight);
  const stacked = stack === 'Yes';
  const spots = stacked ? Math.ceil(p / 2) : p;
  const shown = Math.min(spots, 26);
  const doubles = stacked ? p - spots : 0;
  const floorPct = Math.round((spots / 26) * 100);

  let verdict = { ok: true, title: `Fits in one ${trailer}`, text: `${p} pallets uses about ${floorPct}% of the floor.${reefer ? ` Set to ${num(temp)}°F, ${mode.toLowerCase()}.` : ''}` };
  if (spots > 26) verdict = { ok: false, title: 'Over one trailer', text: `${p} pallets is more than one trailer holds${stacked ? '' : ' single-stacked'}. It may need two trucks, so let's talk it through.` };
  else if (w > maxWeight) verdict = { ok: false, title: 'Over the typical weight', text: `${fmt(w)} lbs is above what most ${trailer}s can legally carry. Let's talk through the best way to move it.` };

  const params = new URLSearchParams({ equipment, pallets: String(p), weight: String(w) });
  if (!reefer) params.set('stack', stacked ? 'yes' : 'no');
  if (reefer) {
    params.set('temp', String(num(temp)));
    params.set('mode', mode.toLowerCase());
  }

  return (
    <>
      <p className="mb-4 font-sans text-[13px] text-[#6a7482]">See how your freight fits in a 53' {trailer}.</p>
      <div className="grid grid-cols-2 gap-2.5">
        <Field id="calc-pallets" label="Pallets" value={pallets} onChange={setPallets} unit={'48" × 40"'} />
        <Field id="calc-weight" label="Total weight" value={weight} onChange={setWeight} unit="lbs" />
        {reefer && (
          <>
            <Field id="calc-temp" label="Temperature" value={temp} onChange={setTemp} unit="°F" />
            <label htmlFor="calc-mode" className="block">
              <span className="mb-1.5 block font-sans text-[13px] font-semibold text-foreground">Unit setting</span>
              <select
                id="calc-mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-lg border border-[#d5dbe2] bg-white px-3 py-[11px] font-sans text-sm font-semibold text-foreground outline-none focus:border-[#275d87]"
              >
                <option>Continuous</option>
                <option>Start-stop</option>
                <option>Not sure</option>
              </select>
            </label>
          </>
        )}
      </div>
      <div className="mt-4">
        <Toggle label="Can your pallets be stacked?" value={stack} onChange={setStack} options={['No', 'Yes']} />
      </div>
      <div className="mt-4 rounded-xl bg-[#f7f9fb] px-2.5 pb-1.5 pt-2.5">
        <div className="mb-1 flex justify-between font-sans text-[10px] font-bold tracking-[.1em] text-[#8a93a0]">
          <span>REAR DOORS</span>
          <span>CAB</span>
        </div>
        <svg viewBox="0 0 384 82" className="w-full" role="img" aria-label={`Trailer floor with ${shown} of 26 pallet spots filled`}>
          <rect x={8} y={6} width={322} height={70} rx={4} fill="#fff" stroke="#9aa3ae" strokeWidth={2} />
          {reefer && <rect x={318} y={20} width={12} height={42} rx={3} fill="#8f98a4" />}
          {Array.from({ length: 26 }, (_, i) => {
            const x = 14 + Math.floor(i / 2) * 24;
            const y = 12 + (i % 2) * 30;
            const filled = i < shown;
            return (
              <g key={i}>
                <rect x={x} y={y} width={21} height={27} rx={2} fill={filled ? '#d9b382' : '#eef1f4'} stroke={filled ? '#bf955f' : '#d5dbe2'} />
                {filled && i < doubles && <rect x={x + 3} y={y + 3} width={15} height={21} rx={1} fill="none" stroke="#a5784a" strokeWidth={1.5} />}
              </g>
            );
          })}
          <TopCab kind={kind} />
        </svg>
      </div>
      <Bar label="Floor space" value={floorPct} text={`${spots} of 26 spots`} />
      <Bar label="Weight" value={Math.round((w / maxWeight) * 100)} text={`${fmt(w)} of ~${fmt(maxWeight)} lbs`} />
      <Verdict {...verdict} />
      <QuoteButton href={`/quote?${params.toString()}`} label={button} />
    </>
  );
}

function FlatbedCalculator({ equipment, button }: { equipment: string; button: string }) {
  const [length, setLength] = useState('32');
  const [width, setWidth] = useState('8');
  const [height, setHeight] = useState('7');
  const [weight, setWeight] = useState('40,000');
  const [tarps, setTarps] = useState('Yes');

  const L = num(length);
  const W = num(width);
  const H = num(height);
  const wt = num(weight);
  const loadW = Math.min(L / 48, 1) * 304;

  let verdict = { ok: true, title: 'Fits on a standard flatbed', text: `Within legal width and height.${tarps === 'Yes' ? ' Tarps noted for your quote.' : ''}` };
  if (wt > 48000) verdict = { ok: false, title: 'Over the typical weight', text: `${fmt(wt)} lbs is above what most flatbeds can legally carry. Let's talk through the right equipment.` };
  else if (W > 8.5 || H > 10 || L > 53) verdict = { ok: false, title: 'Oversize load', text: 'This load is wider, taller, or longer than legal limits and will need special equipment and permits. We can coordinate that.' };
  else if (H > 8.5) verdict = { ok: true, title: 'Fits on a step deck', text: 'Too tall for a standard flatbed, but a step deck can carry it without being oversize.' };
  else if (L > 48) verdict = { ok: true, title: "Fits on a 53' flatbed", text: "Longer than a 48' deck, so we'll match you with a 53' flatbed." };

  const params = new URLSearchParams({ equipment, length: String(L), width: String(W), height: String(H), weight: String(wt), tarps: tarps.toLowerCase() });

  return (
    <>
      <p className="mb-4 font-sans text-[13px] text-[#6a7482]">See how your freight fits on a 48' flatbed.</p>
      <div className="grid grid-cols-2 gap-2.5">
        <Field id="calc-length" label="Length" value={length} onChange={setLength} unit="ft" />
        <Field id="calc-width" label="Width" value={width} onChange={setWidth} unit="ft" />
        <Field id="calc-height" label="Height" value={height} onChange={setHeight} unit="ft" />
        <Field id="calc-weight" label="Total weight" value={weight} onChange={setWeight} unit="lbs" />
      </div>
      <div className="mt-4">
        <Toggle label="Does your load need tarps?" value={tarps} onChange={setTarps} options={['No', 'Yes']} />
      </div>
      <div className="mt-4 rounded-xl bg-[#f7f9fb] px-2.5 pb-1.5 pt-2.5">
        <div className="mb-1 flex justify-between font-sans text-[10px] font-bold tracking-[.1em] text-[#8a93a0]">
          <span>REAR</span>
          <span>CAB</span>
        </div>
        <svg viewBox="0 0 384 82" className="w-full" role="img" aria-label="Flatbed deck with your load">
          <rect x={8} y={10} width={318} height={62} rx={3} fill="#c9ced4" stroke="#8d95a1" strokeWidth={2} />
          <rect x={318 - 4 - loadW} y={14} width={loadW} height={54} rx={2} fill={tarps === 'Yes' ? '#3d4a5c' : '#d9b382'} className="transition-all duration-500" />
          {[0.15, 0.4, 0.65, 0.9].map((f) => {
            const x = 318 - 4 - loadW + loadW * f;
            return loadW > 20 ? <line key={f} x1={x} y1={10} x2={x} y2={72} stroke="#f2c230" strokeWidth={3} /> : null;
          })}
          <rect x={318} y={14} width={8} height={54} fill="#7d8591" />
          <TopCab kind="flatbed" />
        </svg>
      </div>
      <Bar label="Deck length" value={Math.round((L / 48) * 100)} text={`${L} of 48 ft`} />
      <Bar label="Height" value={Math.round((H / (H > 8.5 ? 10 : 8.5)) * 100)} text={H > 8.5 ? `${H} of about 10 ft (step deck)` : `${H} of about 8.5 ft`} />
      <Bar label="Weight" value={Math.round((wt / 48000) * 100)} text={`${fmt(wt)} of ~48,000 lbs`} />
      <Verdict {...verdict} />
      <QuoteButton href={`/quote?${params.toString()}`} label={button} />
    </>
  );
}

function QuoteButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      data-testid="link-calculator-quote"
      className="group mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#3b82bb] px-4 py-3.5 text-center font-display text-sm font-bold uppercase tracking-[.06em] text-white transition-colors hover:bg-[#275d87] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62c0de] focus-visible:ring-offset-2"
    >
      {label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

type MetaUpdate = { element: HTMLMetaElement; previous: string | null; created: boolean };
type Tab = 'overview' | 'moved' | 'handling';

export default function ServiceDetail({ service }: { service: ServiceKey }) {
  const data = services[service];
  const pageTitle = `${data.name} | Blue Valor Logistics`;
  const metaDescription = data.description;
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    setSlide(0);
    setTab('overview');
  }, [service]);

  useEffect(() => {
    const metaValues: [string, string, string][] = [
      ['name', 'description', metaDescription],
      ['property', 'og:title', pageTitle],
      ['property', 'og:description', metaDescription],
      ['name', 'twitter:title', pageTitle],
      ['name', 'twitter:description', metaDescription],
    ];
    const updates: MetaUpdate[] = metaValues.map(([attribute, key, content]) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      const created = !element;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      const previous = element.content;
      element.content = content;
      return { element, previous, created };
    });
    return () => {
      updates.forEach(({ element, previous, created }) => {
        if (created) element.remove();
        else if (previous !== null) element.content = previous;
      });
    };
  }, [pageTitle, metaDescription]);

  // Slide 0 is the photo; slides 1 to 4 are the animated scenes
  const slides = [{ id: 'photo' as const, label: 'Photo' }, ...data.scenes];
  const safeSlide = Math.min(slide, slides.length - 1);
  const current = slides[safeSlide];
  const buttonLabel = `REQUEST A ${data.equipment === 'reefer' ? 'REEFER' : data.equipment === 'dryvan' ? 'DRY VAN' : 'FLATBED'} QUOTE`;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'moved', label: 'What We Move' },
    { id: 'handling', label: 'How We Handle It' },
  ];

  return (
    <div className="service-detail w-full bg-background">
      {/* Dark band behind the site header. Delete this line if your header is not see-through. */}
      <div className="h-[84px] bg-[#0A0E14] sm:h-[92px]" aria-hidden="true" />

      <div className="container mx-auto px-4 pb-16 pt-6 md:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 font-sans text-[13px] text-[#6a7482]">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/services" className="hover:text-foreground">Services</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{data.name}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <div className="min-w-0">
            {/* Stage */}
            <div className="sd-stage relative overflow-hidden rounded-2xl">
              {current.id === 'photo' ? (
                <HeroImage src={data.image} alt={data.imageAlt} className="sd-photo h-full w-full object-cover" style={{ objectPosition: data.imagePos }} />
              ) : (
                <div key={`${service}-${current.id}`} className="h-full w-full">
                  <TruckScene kind={data.kind} scene={current.id} />
                </div>
              )}
              <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between font-sans text-xs font-semibold tracking-[.06em] text-[#142331]">
                {safeSlide > 0 ? <span className="rounded-full bg-white/90 px-3 py-1.5 shadow-sm">{String(safeSlide).padStart(2, '0')} · {current.label.toUpperCase()}</span> : <span />}
                <span className="flex gap-1.5 rounded-full bg-white/90 px-2.5 py-2 shadow-sm">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlide(i)}
                      aria-label={`Show ${s.label}`}
                      className={`h-1 w-6 rounded-full transition-colors ${i === safeSlide ? 'bg-[#3b82bb]' : 'bg-[#cdd5de]'}`}
                    />
                  ))}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
              {slides.map((s, i) => (
                <button key={s.id} type="button" onClick={() => setSlide(i)} aria-pressed={i === safeSlide} className="group text-left" data-testid={`thumb-${s.id}`}>
                  <span className={`block h-14 overflow-hidden rounded-lg border-2 bg-[#eef3f8] transition-colors sm:h-24 ${i === safeSlide ? 'border-[#142331]' : 'border-transparent group-hover:border-[#cdd5de]'}`}>
                    {s.id === 'photo' ? (
                      <img src={data.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: data.imagePos }} />
                    ) : (
                      <TruckScene kind={data.kind} scene={s.id} still />
                    )}
                  </span>
                  <span className="mt-1.5 block font-sans text-xs font-semibold text-[#5b6573]">
                    {i > 0 ? `${String(i).padStart(2, '0')} · ${s.label}` : '\u00a0'}
                  </span>
                </button>
              ))}
            </div>

            {/* Title */}
            <p className="mb-1.5 mt-8 font-sans text-xs font-semibold uppercase tracking-[.12em] text-[#6a7482]">{data.kicker}</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{data.name}</h1>
            <p className="mb-6 mt-2 font-sans text-base text-[#3d4652] sm:text-[17px]">{data.description}</p>

            {/* Spec tiles */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#cfd6de] bg-[#cfd6de] md:grid-cols-4">
              {data.tiles.map(({ icon: Icon, value, label }) => (
                <div key={value} className="flex items-center gap-2.5 bg-white px-3.5 py-3.5">
                  <Icon className="h-5 w-5 shrink-0 text-[#3b82bb]" aria-hidden="true" />
                  <div>
                    <b className="block font-sans text-[14.5px] leading-5 text-foreground">{value}</b>
                    <span className="block font-sans text-[12px] leading-4 text-[#6a7482]">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-6 mt-8 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-[#e3e7ec] [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`-mb-px shrink-0 border-b-2 pb-3 font-sans text-[15px] transition-colors ${tab === t.id ? 'border-[#3b82bb] font-bold text-foreground' : 'border-transparent text-[#5b6573] hover:text-foreground'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div role="tabpanel" className="sd-panel">
              {tab === 'overview' && (
                <>
                  <h2 className="mb-2.5 font-sans text-lg font-bold text-foreground">Overview</h2>
                  <p className="max-w-3xl font-sans text-[15.5px] leading-7 text-[#3d4652]">{data.overview}</p>
                </>
              )}
              {tab === 'moved' && (
                <>
                  <h2 className="mb-2.5 font-sans text-lg font-bold text-foreground">What We Move</h2>
                  <p className="mb-4 max-w-3xl font-sans text-[15.5px] leading-7 text-[#3d4652]">{data.movedIntro}</p>
                  <div className="flex flex-wrap gap-2">
                    {data.moved.map((m) => (
                      <span key={m} className="rounded-full border border-[#d6e0e1] bg-[#f5f8fa] px-3.5 py-1.5 font-sans text-sm font-medium text-foreground">{m}</span>
                    ))}
                  </div>
                  <p className="mt-4 font-sans text-[15px] text-[#3d4652]">
                    Don't see your product?{' '}
                    <Link href="/contact" className="font-bold text-[#3b82bb] underline decoration-[#3b82bb]/40 underline-offset-4 hover:text-[#275d87]">
                      Reach out and let us know.
                    </Link>{' '}
                    We'd be glad to see how we can work with you.
                  </p>
                </>
              )}
              {tab === 'handling' && (
                <>
                  <h2 className="mb-1 font-sans text-lg font-bold text-foreground">How We Handle It</h2>
                  <div className="divide-y divide-[#e3e7ec]">
                    {data.handling.map((h) => (
                      <div key={h.title} className="py-4">
                        <b className="block font-sans text-[15px] text-foreground">{h.title}</b>
                        <p className="mt-1 max-w-3xl font-sans text-[15px] leading-6 text-[#3d4652]">{h.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Included with every load */}
            <h2 className="mb-1 mt-10 font-sans text-lg font-bold text-foreground">Included with every load</h2>
            <div className="grid gap-x-8 sm:grid-cols-2">
              {included.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3 border-t border-[#e3e7ec] py-4">
                  <Icon className="h-5 w-5 shrink-0 text-[#3b82bb]" aria-hidden="true" />
                  <div>
                    <b className="block font-sans text-[15px] text-foreground">{title}</b>
                    <span className="font-sans text-[13px] text-[#6a7482]">{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Will it fit? calculator */}
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-[0_8px_30px_rgba(13,27,42,.06)] sm:p-6">
              <span className="mb-2.5 inline-block rounded-full bg-[#e9f4fb] px-2.5 py-1 font-sans text-xs font-bold text-[#2b6a9c]">WILL IT FIT?</span>
              <h2 className="font-sans text-2xl font-bold text-foreground">Check your load</h2>
              {data.kind === 'flatbed' ? (
                <FlatbedCalculator equipment={data.equipment} button={buttonLabel} />
              ) : (
                <BoxCalculator kind={data.kind} equipment={data.equipment} button={buttonLabel} />
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-sans text-[12.5px] text-[#5b6573]">
                <span>Need something else?</span>
                {otherPages[service].map((o) => (
                  <Link key={o.href} href={o.href} className="font-bold text-[#3b82bb] hover:text-[#275d87]">{o.label} →</Link>
                ))}
              </div>
              <p className="mt-3 font-sans text-[11px] italic leading-4 text-[#8a93a0]">
                {data.kind === 'flatbed'
                  ? "Estimates based on typical 48' flatbeds. Taller loads may need a step deck, and wider loads need permits. Whatever your load requires, we'll find the right solution to move it."
                  : `Estimates based on typical 53' ${data.kind === 'reefer' ? 'reefers' : 'dry vans'}. Final fit depends on pallet size, packaging, and equipment. Whatever your load requires, we'll find the right solution to move it.`}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}