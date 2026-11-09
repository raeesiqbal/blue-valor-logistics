import {useEffect,useRef,useState} from 'react';
import {useI18n} from '../lib/i18n';
import {getMapFrame} from '../lib/map-preview-options';
import {ARTWORK_HEIGHT,ARTWORK_WIDTH,FREIGHT_ROADS,LANE_OFFSET,SPEED,sample,canDispatch,type Lane,type Trip} from './freightRoutes';
import './AnimatedBeam.css';

const COLORS=['#ef4444','#22c55e','#a855f7','#eab308','#3b82f6'];
const PASS_SPEED=24;
const PASS_BEGIN=125;
const PASS_FULL=42;
const PASSABLE_OFFSET=5;
const CURVE_MIN_SPEED=22;
const SMOOTHING_PASSES=6;

type MovingTrip=Trip&{distance:number;speed:number;offset:number};
type TruckState={trip:MovingTrip|null;visits:number[];retry:number;last:number};

const approach=(value:number,target:number,step:number)=>value<target?Math.min(target,value+step):Math.max(target,value-step);
const angleDelta=(a:number,b:number)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const passingWeight=(gap:number)=>{
 const t=Math.max(0,Math.min(1,(PASS_BEGIN-gap)/(PASS_BEGIN-PASS_FULL)));
 return t*t*(3-2*t);
};

export function AnimatedBeam({height,framing='cover',zoom=1}:{height?:number;framing?:'stretch'|'cover';zoom?:number}={}){
 const {t}=useI18n();
 const svgRef=useRef<SVGSVGElement>(null);
 const sectionRef=useRef<HTMLElement>(null);
 const [mapSize,setMapSize]=useState({width:ARTWORK_WIDTH,height:height??807});
 const debug=import.meta.env.DEV&&new URLSearchParams(window.location.search).has('freightDebug');

 useEffect(()=>{
  const section=sectionRef.current;if(!section)return;
  const observer=new ResizeObserver(([entry])=>setMapSize({width:entry.contentRect.width,height:entry.contentRect.height}));
  observer.observe(section);return()=>observer.disconnect();
 },[]);

 useEffect(()=>{
  const svg=svgRef.current!;
  const lanes:Lane[]=[];

  svg.querySelectorAll<SVGPathElement>('[data-road]').forEach((path,index)=>{
   const road=FREIGHT_ROADS[index],length=path.getTotalLength(),count=Math.ceil(length/1.5);
   for(const reverse of [false,true]){
    const directionalStartTerminal=reverse?!!road.terminalEnd:!!road.terminalStart;
    const directionalEndTerminal=reverse?!!road.terminalStart:!!road.terminalEnd;
    const raw=Array.from({length:count+1},(_,i)=>{
     const distance=(reverse?1-i/count:i/count)*length;
     const p=path.getPointAtLength(distance),a=path.getPointAtLength(Math.max(0,distance-3)),b=path.getPointAtLength(Math.min(length,distance+3));
     return {x:p.x,y:p.y,angle:Math.atan2(b.y-a.y,b.x-a.x)+(reverse?Math.PI:0)};
    });

    // Extend only genuine map exits. Road terminals fade on the painted road
    // instead of inventing a straight road through blank artwork.
    const extend=(point:typeof raw[number],direction:number)=>{
     if(point.x<=-30||point.x>=ARTWORK_WIDTH+30||point.y<=-30||point.y>=ARTWORK_HEIGHT+30)return point;
     const dx=Math.cos(point.angle)*direction,dy=Math.sin(point.angle)*direction;
     const distances=[dx>0?(ARTWORK_WIDTH+30-point.x)/dx:dx<0?(-30-point.x)/dx:Infinity,dy>0?(ARTWORK_HEIGHT+30-point.y)/dy:dy<0?(-30-point.y)/dy:Infinity];
     const d=Math.max(0,Math.min(...distances.filter(n=>n>=0)));
     return {...point,x:point.x+dx*d,y:point.y+dy*d};
    };
    if(!directionalStartTerminal)raw.unshift(extend(raw[0],-1));
    if(!directionalEndTerminal)raw.push(extend(raw[raw.length-1],1));

    const cumulative=[0];
    for(let i=1;i<raw.length;i++)cumulative.push(cumulative[i-1]+Math.hypot(raw[i].x-raw[i-1].x,raw[i].y-raw[i-1].y));
    const total=cumulative.at(-1)!,positionCount=Math.ceil(total/1.5)+1;let j=1;
    let positions=Array.from({length:positionCount},(_,i)=>{
     const d=i/(positionCount-1)*total;
     while(j<cumulative.length-1&&cumulative[j]<d)j++;
     const f=(d-cumulative[j-1])/(cumulative[j]-cumulative[j-1]||1);
     return {x:raw[j-1].x+(raw[j].x-raw[j-1].x)*f,y:raw[j-1].y+(raw[j].y-raw[j-1].y)*f};
    });
    // Repeated binomial filtering rounds polyline corners without materially
    // moving the centerline. A wider tangent window then gives continuous
    // truck rotation instead of snapping at individual trace vertices.
    for(let pass=0;pass<SMOOTHING_PASSES;pass++)positions=positions.map((p,i)=>{
     if(i===0||i===positions.length-1)return p;
     const a=positions[i-1],b=positions[i+1];
     return {x:(a.x+4*p.x+b.x)/6,y:(a.y+4*p.y+b.y)/6};
    });
    const headings=positions.map((_,i)=>{const a=positions[Math.max(0,i-8)],b=positions[Math.min(positions.length-1,i+8)];return Math.atan2(b.y-a.y,b.x-a.x);});
    const curvature=headings.map((_,i)=>{
     const lo=Math.max(0,i-12),hi=Math.min(headings.length-1,i+12);
     const span=Math.max(1,Math.hypot(positions[hi].x-positions[lo].x,positions[hi].y-positions[lo].y));
     return Math.abs(angleDelta(headings[lo],headings[hi]))/span;
    });
    const points=positions.map((p,i)=>{
     // Look ahead roughly 35 map units so braking starts before the bend.
     let upcoming=0;
     for(let k=Math.max(0,i-4);k<=Math.min(curvature.length-1,i+24);k++)upcoming=Math.max(upcoming,curvature[k]);
     return {...p,angle:headings[i],speedLimit:Math.max(CURVE_MIN_SPEED,SPEED/(1+22*upcoming))};
    });
    lanes.push({id:road.id+(reverse?'-reverse':'-forward'),road:road.id,sharedGroup:road.sharedGroup,direction:reverse?-1:1,rightOffset:road.laneOffset??LANE_OFFSET,points,length:total,fadeStart:directionalStartTerminal,fadeEnd:directionalEndTerminal});
   }
  });

  // Build the intersection graph from the traced geometry itself. If two
  // different routes touch or cross, only one may occupy that physical
  // corridor at a time. This keeps scheduling correct when a path is edited
  // without requiring another list of hand-maintained intersection names.
  const centerlines=lanes.filter(lane=>lane.direction===1);
  const conflicts=new Set<string>();
  const conflictKey=(a:string,b:string)=>a<b?`${a}|${b}`:`${b}|${a}`;
  for(let i=0;i<centerlines.length;i++)for(let j=i+1;j<centerlines.length;j++){
   const a=centerlines[i],b=centerlines[j];let touches=false;
   for(let ai=0;ai<a.points.length&&!touches;ai+=6)for(let bi=0;bi<b.points.length;bi+=6){
    const dx=a.points[ai].x-b.points[bi].x,dy=a.points[ai].y-b.points[bi].y;
    if(dx*dx+dy*dy<24*24){touches=true;break;}
   }
   if(touches)conflicts.add(conflictKey(a.road,b.road));
  }

  const debugLanes=svg.querySelector<SVGGElement>('[data-debug-lanes]');
  if(debugLanes){
   debugLanes.replaceChildren(...lanes.filter(lane=>lane.direction===1).map(lane=>{const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.dataset.debugLane=lane.id;line.setAttribute('points',lane.points.filter((_,i)=>i%5===0).map(point=>`${point.x},${point.y}`).join(' '));line.setAttribute('class','debug-lane center');return line;}));
  }

  const groups=[...svg.querySelectorAll<SVGGElement>('[data-truck]')];
  const trucks:TruckState[]=groups.map(()=>({trip:null,visits:lanes.map(()=>0),retry:0,last:-1}));
  let time=0,previous=0,raf=0,visible=true;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');

  const canUseRoad=(lane:Lane)=>{
   const active=trucks.flatMap(truck=>truck.trip?[truck.trip]:[]);
   if(active.some(trip=>trip.lane.road!==lane.road&&conflicts.has(conflictKey(lane.road,trip.lane.road))))return false;
   const occupants=active.filter(trip=>trip.lane.road===lane.road);
   if(occupants.length>=2)return false;
   if(!occupants.length)return true;
   // Narrow artwork roads remain single-file. Wider roads allow exactly one
   // opposing pair; a third truck and same-direction following are rejected.
   if(lane.rightOffset<PASSABLE_OFFSET||occupants[0].lane.direction===lane.direction)return false;
   const existing=occupants[0],existingCanonical=existing.lane.direction===1?existing.distance/existing.lane.length:1-existing.distance/existing.lane.length;
   const candidateStart=lane.direction===1?0:1;
   return Math.abs(existingCanonical-candidateStart)*Math.min(existing.lane.length,lane.length)>PASS_BEGIN+35;
  };

  function frame(now:number){
   const dt=previous?Math.min(.05,(now-previous)/1000):0;previous=now;
   if(!motion.matches)time+=dt;

   trucks.forEach(truck=>{
    if(truck.trip&&truck.trip.distance>=truck.trip.lane.length)truck.trip=null;
    if(!truck.trip&&time>=truck.retry){
     const active=trucks.flatMap(item=>item.trip?[item.trip]:[]);
     const candidates=lanes.map((_,k)=>k).filter(k=>k!==truck.last).sort((a,b)=>truck.visits[a]-truck.visits[b]||Math.random()-.5);
     const index=candidates.find(k=>{
      const lane=lanes[k];
      if(!canUseRoad(lane))return false;
      // An opposing truck on this same road is handled by the passing model.
      // Other roads retain the conservative intersection reservation test.
      return canDispatch(lane,time,active.filter(trip=>trip.lane.road!==lane.road));
     });
     if(index!==undefined){
      const lane=lanes[index];
      truck.trip={lane,start:time,end:time+lane.length/PASS_SPEED+2,distance:0,speed:SPEED,offset:0};
      truck.visits[index]++;truck.last=index;
     }
     truck.retry=time+.5;
    }
   });

   const passWeights=new Map<MovingTrip,number>();
   for(let i=0;i<trucks.length;i++)for(let j=i+1;j<trucks.length;j++){
    const a=trucks[i].trip,b=trucks[j].trip;
    if(!a||!b||a.lane.road!==b.lane.road||a.lane.direction===b.lane.direction)continue;
    const aCanonical=a.lane.direction===1?a.distance/a.lane.length:1-a.distance/a.lane.length;
    const bCanonical=b.lane.direction===1?b.distance/b.lane.length:1-b.distance/b.lane.length;
    const gap=Math.abs(aCanonical-bCanonical)*Math.min(a.lane.length,b.lane.length);
    const weight=passingWeight(gap);
    passWeights.set(a,Math.max(passWeights.get(a)??0,weight));
    passWeights.set(b,Math.max(passWeights.get(b)??0,weight));
   }

   trucks.forEach((truck,i)=>{
    const group=groups[i],trip=truck.trip;
    if(!trip){group.setAttribute('opacity','0');return;}
    const pass=passWeights.get(trip)??0;
    const speedPose=sample(trip.lane,trip.distance);
    const targetSpeed=Math.min(speedPose.speedLimit,SPEED-(SPEED-PASS_SPEED)*pass);
    const targetOffset=trip.lane.rightOffset*pass;
    trip.speed=approach(trip.speed,targetSpeed,(targetSpeed<trip.speed?24:10)*dt);
    trip.offset=approach(trip.offset,targetOffset,14*dt);
    trip.distance=Math.min(trip.lane.length,trip.distance+trip.speed*dt);

    const pose=sample(trip.lane,trip.distance);
    const x=pose.x-Math.sin(pose.angle)*trip.offset,y=pose.y+Math.cos(pose.angle)*trip.offset;
    let opacity=1;
    if(trip.lane.fadeStart)opacity=Math.min(1,trip.distance/55);
    if(trip.lane.fadeEnd)opacity=Math.min(1,Math.max(0,(trip.lane.length-trip.distance)/70));
    group.setAttribute('transform',`translate(${x} ${y}) rotate(${pose.angle*180/Math.PI})`);
    group.setAttribute('opacity',String(opacity));
    group.dataset.route=trip.lane.id;group.dataset.road=trip.lane.road;group.dataset.distance=String(trip.distance);group.dataset.speed=String(trip.speed);group.dataset.speedLimit=String(speedPose.speedLimit);group.dataset.offset=String(trip.offset);group.dataset.phase=pass>.05?'passing':opacity===0?'offscreen':'drive';
   });

   if(visible&&!document.hidden&&!motion.matches)raf=requestAnimationFrame(frame);
  }

  const restart=()=>{cancelAnimationFrame(raf);previous=0;if(visible&&!document.hidden)raf=requestAnimationFrame(frame);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;restart();});
  observer.observe(sectionRef.current!);
  document.addEventListener('visibilitychange',restart);motion.addEventListener('change',restart);restart();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',restart);motion.removeEventListener('change',restart);};
 },[]);

 return <section ref={sectionRef} id="freight-map" data-testid="freight-map" className="freight-scene" style={height===undefined?undefined:{height}}>
  <div className="freight-frame" style={getMapFrame(mapSize,framing,zoom)}>
   <svg ref={svgRef} data-testid="freight-map-svg" viewBox="0 0 1586 992" preserveAspectRatio="none" aria-hidden="true">
    <image href="/citymap.png" width="1586" height="992" style={{filter:'grayscale(1) invert(1) brightness(.86) contrast(1.14)'}}/>
    <rect width="1586" height="992" fill="#0b1929" opacity=".42"/>
    <defs>{FREIGHT_ROADS.map(road=><path key={road.id} data-road={road.id} d={road.d}/>)}</defs>
    {debug&&<g className="freight-debug" data-debug-lanes/>}
    {COLORS.map((color,i)=><g key={color} data-truck={i} opacity="0">{debug&&<rect className="debug-footprint" x="-11" y="-5" width="22" height="10"/>}<rect x="-9" y="-3" width="11" height="6" rx="1" fill={color}/><rect x="3" y="-3" width="6" height="6" rx="1" fill={color}/><path d="M7 -2v4" stroke="#dbeafe" strokeWidth="1.5"/><path d="M-7 -4h3M-7 4h3M5 -4h2M5 4h2" stroke="#17202b" strokeWidth="1.5"/></g>)}
   </svg>
  </div>
  <div className="freight-copy"><h2>{t('beamHeadline')}</h2><p>{t('beamBody')}</p></div>
 </section>;
}
