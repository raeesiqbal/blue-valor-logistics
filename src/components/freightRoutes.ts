// Centerlines traced in the artwork's native 1586 x 992 coordinate space.
// The marked 624 x 195 client reference is a centered cover crop of the same
// bitmap (scale 624 / 1586, visible artwork y = 248.19..743.81). Keeping the
// bitmap and geometry in this one coordinate system makes every responsive
// crop use exactly the same roads.
export type FreightRoad={id:string;d:string;terminalStart?:boolean;terminalEnd?:boolean;laneOffset?:number;sharedGroup?:string};
const traced=(points:readonly (readonly [number,number])[])=>`M ${points.map(([x,y])=>`${x} ${y}`).join(' L ')}`;
export const FREIGHT_ROADS:readonly FreightRoad[] = [
 {id:'lavender',d:'M 180 220 C 145 255 108 292 74 332 C 50 361 24 389 -35 420',laneOffset:3.5},
 {id:'red',d:'M 65 220 C 82 282 116 350 178 407 C 236 461 301 505 369 545 C 448 592 519 629 570 688 C 600 717 624 752 642 790 C 653 850 653 930 650 1022',terminalStart:true,laneOffset:5,sharedGroup:'left-shared'},
 {id:'blue',d:'M 208 220 C 196 288 198 356 219 408 C 248 474 312 520 399 564 C 484 607 536 648 570 688 C 600 717 624 752 642 790 C 653 850 653 930 650 1022',terminalStart:true,laneOffset:5,sharedGroup:'left-shared'},
 {id:'teal',d:traced([[0,770],[24,778],[43,784],[62,790],[82,797],[101,803],[119,809],[138,815],[156,821],[187,822],[203,816],[221,809],[239,802],[255,796],[273,789],[292,782],[312,774],[328,768],[349,760],[374,752],[388,745],[406,738],[424,731],[445,723],[463,716],[482,709],[500,702],[518,695],[539,687],[562,670],[569,640],[569,620],[569,599],[569,579],[569,559],[569,539],[569,519],[569,499],[569,479],[569,459],[569,439],[569,419],[569,399],[569,379],[570,357],[594,355],[614,355],[634,355],[654,355],[674,355],[697,355],[714,355],[734,355],[754,355],[774,355],[794,355],[814,355],[834,355],[854,355],[874,355],[894,355],[914,355],[934,355],[954,355],[974,355],[994,355],[1014,355],[1035,355],[1053,355],[1068,355],[1088,338],[1089,317],[1089,297],[1089,277],[1089,257],[1089,237],[1089,219]]),terminalEnd:true,laneOffset:4.5,sharedGroup:'left-shared'},
 {id:'light-orange',d:traced([[890,0],[888,20],[879,30],[872,39],[864,48],[857,56],[849,66],[841,75],[834,83],[825,94],[817,104],[810,111],[802,121],[794,130],[786,140],[779,148],[771,157],[763,167],[756,175],[747,185],[740,193],[733,203],[725,211],[717,221],[709,230],[701,239],[698,250],[698,263],[698,275],[698,287],[698,299],[698,311],[698,323],[698,335],[698,347],[697,356],[698,370],[698,382],[698,394],[698,406],[698,418],[698,430],[698,442],[698,454],[698,466],[698,478],[697,490],[698,502],[698,514],[698,526],[698,538],[698,550],[698,562],[697,574]]),terminalEnd:true,laneOffset:2.5},
 {id:'dark-orange',d:traced([[1174,223],[1179,238],[1181,243],[1177,280],[1179,298],[1181,316],[1183,334],[1184,354],[1185,374],[1184,400],[1183,423],[1182,437],[1180,457],[1177,480],[1174,498],[1169,522],[1169,540],[1162,557],[1153,577],[1145,594],[1136,611],[1127,628],[1117,647],[1107,665],[1098,682],[1093,701],[1079,718],[1070,735],[1060,753],[1051,770],[1042,787],[1032,806],[1023,823],[1014,840],[1003,860],[995,875],[986,892],[976,911],[967,928],[957,947],[947,965],[938,982],[934,991]]),terminalStart:true,sharedGroup:'bottom-shared'},
 {id:'yellow',d:traced([[1341,225],[1332,241],[1323,258],[1314,275],[1305,293],[1296,310],[1286,328],[1277,345],[1268,362],[1258,380],[1249,398],[1240,415],[1230,433],[1221,451],[1211,469],[1202,487],[1193,505],[1184,522],[1170,537],[1163,555],[1154,575],[1146,592],[1136,611],[1127,628],[1118,645],[1107,665],[1098,682],[1093,701],[1079,718],[1070,735],[1060,753],[1051,770],[1042,787],[1032,806],[1023,823],[1014,840],[1003,860],[995,875],[986,892],[976,911],[967,928],[957,947],[947,965],[938,982],[934,991]]),terminalStart:true,sharedGroup:'bottom-shared'},
 {id:'green',d:'M 1185 220 C 1209 315 1251 386 1322 428 C 1405 477 1511 507 1620 550',terminalStart:true,sharedGroup:'right-shared'},
 {id:'magenta',d:traced([[1350,218],[1352,238],[1349,260],[1348,280],[1349,301],[1350,320],[1352,337],[1357,362],[1363,382],[1371,401],[1381,418],[1393,451],[1402,456],[1424,468],[1443,477],[1461,485],[1479,493],[1497,501],[1515,509],[1534,518],[1550,525],[1570,534],[1580,539],[1585,541]]),terminalStart:true,laneOffset:4.5,sharedGroup:'right-shared'},
 {id:'purple',d:traced([[934,991],[939,980],[950,960],[959,943],[969,924],[978,907],[987,890],[997,872],[1007,853],[1016,836],[1025,819],[1034,802],[1044,783],[1053,766],[1062,749],[1071,733],[1080,716],[1093,701],[1113,694],[1131,685],[1150,677],[1170,671],[1190,667],[1209,665],[1228,665],[1255,669],[1279,681],[1294,689],[1309,703],[1323,721],[1332,737],[1341,757],[1348,777],[1353,796],[1359,817],[1363,836],[1367,853],[1371,871],[1376,893],[1380,911],[1386,930],[1393,950],[1401,968],[1410,985],[1413,991]]),sharedGroup:'bottom-shared'},
 {id:'light-blue',d:traced([[934,991],[939,980],[950,960],[959,943],[969,924],[978,907],[987,890],[997,872],[1007,853],[1016,836],[1025,819],[1034,802],[1044,783],[1053,766],[1062,749],[1071,733],[1080,716],[1093,701],[1113,694],[1131,685],[1150,677],[1170,671],[1190,667],[1209,665],[1228,665],[1255,669],[1270,697],[1262,713],[1253,731],[1244,749],[1239,759]]),terminalEnd:true,laneOffset:4.5,sharedGroup:'bottom-shared'},
];

export const ARTWORK_WIDTH=1586;
export const ARTWORK_HEIGHT=992;
export const LANE_OFFSET=5.5;
export const SPEED=40;

export type Pose={x:number;y:number;angle:number;speedLimit:number};
export type Lane={id:string;road:string;sharedGroup?:string;direction:1|-1;rightOffset:number;points:Pose[];length:number;fadeStart:boolean;fadeEnd:boolean};

export function sample(lane:Lane,distance:number):Pose {
 const t=Math.max(0,Math.min(lane.points.length-1,distance/lane.length*(lane.points.length-1)));
 const i=Math.min(Math.floor(t),lane.points.length-2),f=t-i,a=lane.points[i],b=lane.points[i+1];
 const turn=Math.atan2(Math.sin(b.angle-a.angle),Math.cos(b.angle-a.angle));
 return {x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,angle:a.angle+turn*f,speedLimit:a.speedLimit+(b.speedLimit-a.speedLimit)*f};
}

// Oriented truck footprints, padded for clearance and temporal sampling.
export function overlaps(a:Pose,b:Pose) {
 return [a.angle,a.angle+Math.PI/2,b.angle,b.angle+Math.PI/2].every(angle=>{
  const radius=(p:Pose)=>11*Math.abs(Math.cos(p.angle-angle))+5*Math.abs(Math.sin(p.angle-angle));
  return Math.abs((a.x-b.x)*Math.cos(angle)+(a.y-b.y)*Math.sin(angle))<radius(a)+radius(b);
 });
}

export type Trip={lane:Lane;start:number;end:number};

export function canDispatch(lane:Lane,now:number,active:Trip[]) {
 const end=now+lane.length/SPEED+1.2;
 return active.every(trip=>{
  for(let t=Math.max(now,trip.start);t<=Math.min(end,trip.end);t+=.08)
   if(overlaps(sample(lane,(t-now)*SPEED),sample(trip.lane,(t-trip.start)*SPEED)))return false;
  return true;
 });
}
