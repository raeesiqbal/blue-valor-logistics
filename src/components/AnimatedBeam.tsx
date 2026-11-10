import {useEffect,useId,useRef,useState} from 'react';
import {useI18n} from '../lib/i18n';
import {ARTWORK_WIDTH,ARTWORK_HEIGHT,CROP_Y,TRUCK_SCALE,buildLanes,sample,canDispatch,type Trip} from './freightRoutes';
import './AnimatedBeam.css';
const TRUCKS=[{fill:'#EF4444',dark:'#991B1B'},{fill:'#22C55E',dark:'#14532D'},{fill:'#A855F7',dark:'#581C87'},{fill:'#EAB308',dark:'#78350F'},{fill:'#3B82F6',dark:'#1E3A8A'}];
const TruckBody = ({ fill, dark, win }: { fill: string; dark: string; win: string }) => (
  <>
    {/* trailer */}
    <rect x="-18" y="-5.5" width="19" height="11" rx="1.5" fill={fill} />
    {/* cab */}
    <rect x="1" y="-5.5" width="13" height="11" rx="2" fill={fill} />
    {/* windshield */}
    <rect x="11" y="-4" width="3" height="8" rx="0.5" fill={win} />
    {/* cab shadow */}
    <rect x="1" y="-3.5" width="3" height="7" rx="0.5" fill="rgba(0,0,0,0.15)" />
    {/* trailer wheels */}
    <rect x="-16" y="5.5" width="5" height="2.5" rx="1" fill={dark} />
    <rect x="-9" y="5.5" width="5" height="2.5" rx="1" fill={dark} />
    {/* cab wheels */}
    <rect x="3" y="5.5" width="4" height="2.5" rx="1" fill={dark} />
    {/* mirrored top wheels */}
    <rect x="-16" y="-8" width="5" height="2.5" rx="1" fill={dark} />
    <rect x="-9" y="-8" width="5" height="2.5" rx="1" fill={dark} />
    <rect x="3" y="-8" width="4" height="2.5" rx="1" fill={dark} />
  </>
);


export function AnimatedBeam({height=900,framing='cover',zoom=1}:{height?:number;framing?:'stretch'|'cover';zoom?:number}={}){
 const {t}=useI18n(),uid=useId().replace(/:/g,'');
 const svgRef=useRef<SVGSVGElement>(null),sectionRef=useRef<HTMLElement>(null),copyRef=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState({width:ARTWORK_WIDTH,height});
 const debug=import.meta.env.DEV&&new URLSearchParams(window.location.search).has('freightDebug');
 const width=framing==='cover'?Math.max(size.width,size.height*ARTWORK_WIDTH/ARTWORK_HEIGHT)*zoom:size.width*zoom;
 const frameHeight=framing==='cover'?width*ARTWORK_HEIGHT/ARTWORK_WIDTH:size.height*zoom;
 useEffect(()=>{
  const update=()=>{const section=sectionRef.current!,svg=svgRef.current!,copy=copyRef.current!;setSize({width:section.clientWidth,height:section.clientHeight});
   const matrix=svg.getScreenCTM();if(!matrix)return;const box=copy.getBoundingClientRect(),inv=matrix.inverse();
   const a=new DOMPoint(box.left-16,box.top-16).matrixTransform(inv),b=new DOMPoint(box.right+16,box.bottom+16).matrixTransform(inv);
   const mask=svg.querySelector('[data-copy-mask]')!;mask.setAttribute('x',String(a.x));mask.setAttribute('y',String(a.y));mask.setAttribute('width',String(b.x-a.x));mask.setAttribute('height',String(b.y-a.y));
  };
  const observer=new ResizeObserver(update);observer.observe(sectionRef.current!);observer.observe(copyRef.current!);observer.observe(svgRef.current!);update();return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  const svg=svgRef.current!,lanes=buildLanes(),groups=[...svg.querySelectorAll<SVGGElement>('[data-truck]')];
  const visits=lanes.map(()=>0);
  const trucks:{trip:Trip|null;last:string;retry:number}[]=groups.map(()=>({trip:null,last:'',retry:0}));
  if(debug){const layer=svg.querySelector('[data-debug-lanes]')!;layer.replaceChildren(...lanes.map(lane=>{const p=document.createElementNS('http://www.w3.org/2000/svg','polyline');p.setAttribute('points',lane.points.map(p=>`${p.x},${p.y}`).join(' '));p.setAttribute('class','debug-lane'+(lane.id.endsWith('reverse')?' reverse':''));p.setAttribute('data-lane',lane.id);return p;}));}
  let time=0,previous:number|null=null,raf=0,visible=true,cursor=0;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  function frame(now:number){
   const dt=previous===null?0:Math.min(.05,(now-previous)/1000);previous=now;if(!motion.matches)time+=dt;
   trucks.forEach(truck=>{if(truck.trip&&time-truck.trip.start>=truck.trip.lane.duration){truck.last=truck.trip.lane.road;truck.trip=null;truck.retry=time+.4;}});
   // Rotate dispatch priority so a short route cannot monopolize a truck/color.
   for(let k=0;k<trucks.length;k++){
    const truck=trucks[(cursor+k)%trucks.length];if(truck.trip||time<truck.retry)continue;
    const active=trucks.flatMap(t=>t.trip?[t.trip]:[]);
    const choices=lanes.map((lane,i)=>({lane,i,tie:Math.random()})).filter(c=>c.lane.road!==truck.last).sort((a,b)=>visits[a.i]-visits[b.i]||a.tie-b.tie);
    const choice=choices.find(c=>canDispatch(c.lane,time,active));
    if(choice){truck.trip={lane:choice.lane,start:time};visits[choice.i]++;}truck.retry=time+.35;
   }cursor=(cursor+1)%trucks.length;
   trucks.forEach((truck,i)=>{
    const g=groups[i],trip=truck.trip;if(!trip){g.setAttribute('opacity','0');g.dataset.phase='waiting';return;}
    const pose=sample(trip.lane,time-trip.start);let opacity=1;
    if(trip.lane.fadeStart)opacity=Math.min(opacity,pose.distance/65);
    if(trip.lane.fadeEnd)opacity=Math.min(opacity,(trip.lane.length-pose.distance)/65);
    g.setAttribute('transform',`translate(${pose.x} ${pose.y}) rotate(${pose.angle*180/Math.PI})`);g.setAttribute('opacity',String(Math.max(0,opacity)));
    g.dataset.route=trip.lane.id;g.dataset.phase='drive';g.dataset.speed=String(pose.speed);
   });
   if(visible&&!document.hidden&&!motion.matches)raf=requestAnimationFrame(frame);
  }
  const restart=()=>{cancelAnimationFrame(raf);previous=null;if(visible&&!document.hidden)raf=requestAnimationFrame(frame);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;restart();});observer.observe(sectionRef.current!);
  document.addEventListener('visibilitychange',restart);motion.addEventListener('change',restart);restart();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',restart);motion.removeEventListener('change',restart);};
 },[debug]);
 return <section ref={sectionRef} id="freight-map" data-testid="freight-map" className="freight-scene" style={{height}}>
  <div className="freight-frame" style={{width,height:frameHeight}}>
   <svg ref={svgRef} data-testid="freight-map-svg" viewBox={`0 0 ${ARTWORK_WIDTH} ${ARTWORK_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
    <defs>
     <radialGradient id={`${uid}-mapGlow`} cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#219EBC" stopOpacity=".18"/><stop offset="70%" stopColor="#219EBC" stopOpacity=".06"/><stop offset="100%" stopColor="#219EBC" stopOpacity="0"/></radialGradient>
     <filter id={`${uid}-glow`} x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
     <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
     <mask id={`${uid}-copy`} maskUnits="userSpaceOnUse" x="-100" y="-100" width="1786" height="708"><rect x="-100" y="-100" width="1786" height="708" fill="white"/><rect data-copy-mask fill="black" rx="12" filter={`url(#${uid}-soft)`}/></mask>
    </defs>
    <image href="/citymap.png" y={-CROP_Y} width="1586" height="992" style={{filter:'grayscale(1) invert(1) brightness(.86) contrast(1.14)'}}/>
    <rect width="1586" height="508" fill="#0b1929" opacity=".42"/><rect width="1586" height="508" fill={`url(#${uid}-mapGlow)`}/>
    {debug&&<g className="freight-debug" data-debug-lanes/>}
    <g mask={`url(#${uid}-copy)`}>{TRUCKS.map((truck,i)=><g key={truck.fill} data-truck={i} opacity="0"><g transform={`scale(${TRUCK_SCALE})`} filter={`url(#${uid}-glow)`}><TruckBody fill={truck.fill} dark={truck.dark} win="rgba(255,255,255,.35)"/></g>{debug&&<rect className="debug-footprint" x={-18*TRUCK_SCALE} y={-8*TRUCK_SCALE} width={36*TRUCK_SCALE} height={16*TRUCK_SCALE}/>}</g>)}</g>
   </svg>
  </div>
  <div ref={copyRef} className="freight-copy"><h2>{t('beamHeadline')}</h2><p>{t('beamBody')}</p></div>
 </section>;
}
