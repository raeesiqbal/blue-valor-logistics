// Geometry supplied in animation/road-network.json and verified against its SVG.
// The source is the middle 508px strip of citymap.png, starting at y=246.
export const ARTWORK_WIDTH = 1586,
  ARTWORK_HEIGHT = 508,
  CROP_Y = 246;
export const TRUCK_SCALE = (1586 / 1200) * 0.6;
type Point = { x: number; y: number };
export type Pose = Point & {
  angle: number;
  time: number;
  distance: number;
  speed: number;
};
export type Lane = {
  id: string;
  road: string;
  segments: string[];
  points: Pose[];
  length: number;
  duration: number;
  fadeStart: boolean;
  fadeEnd: boolean;
};
export type Trip = { lane: Lane; start: number };
const SEGMENTS: Record<string, number[][]> = {
  "seg-01": [
    [101.8, 50.0],
    [77.2, 76.5],
    [19.1, 137.5],
    [0.3, 159.4],
  ],
  "seg-02": [
    [101.8, 50.0],
    [80.8, 18.8],
    [77.4, 14.4],
    [73.5, 10.5],
    [65.5, 0.2],
  ],
  "seg-03": [
    [101.8, 50.0],
    [137.0, 14.1],
    [153.3, 0.0],
  ],
  "seg-04": [
    [101.8, 50.0],
    [115.7, 71.4],
    [135.3, 99.4],
    [153.7, 123.8],
    [171.0, 144.6],
    [182.6, 157.8],
    [191.1, 165.8],
    [198.8, 171.4],
    [211.7, 177.3],
  ],
  "seg-05": [
    [211.7, 177.3],
    [212.9, 165.1],
    [212.2, 155.9],
    [210.7, 148.6],
    [203.7, 125.3],
    [200.3, 110.7],
    [197.4, 93.7],
    [196.2, 78.1],
    [196.2, 54.1],
    [197.7, 36.6],
    [200.3, 21.6],
    [206.1, 0.2],
  ],
  "seg-06": [
    [211.7, 177.3],
    [221.3, 190.3],
    [231.2, 202.2],
    [244.7, 216.7],
    [259.0, 230.5],
    [272.1, 242.2],
    [287.1, 254.4],
    [303.8, 267.1],
    [322.3, 280.3],
    [342.6, 294.1],
    [363.3, 306.9],
    [454.1, 358.2],
    [502.5, 386.2],
    [536.3, 406.2],
    [560.7, 422.5],
  ],
  "seg-07": [
    [560.7, 422.5],
    [553.9, 430.4],
    [549.9, 434.2],
    [540.5, 439.8],
    [530.3, 444.3],
    [387.8, 498.8],
    [377.1, 501.9],
    [347.6, 507.9],
  ],
  "seg-08": [
    [697.0, 109.0],
    [585.0, 109.3],
    [579.5, 109.9],
    [574.9, 111.5],
    [572.4, 113.2],
    [569.9, 117.0],
    [568.4, 123.8],
    [568.0, 135.5],
    [567.9, 389.9],
    [567.5, 397.8],
    [566.1, 407.4],
    [564.5, 412.8],
    [560.7, 422.5],
  ],
  "seg-09": [
    [560.7, 422.5],
    [580.1, 440.3],
    [593.5, 455.1],
    [603.8, 469.1],
    [615.7, 488.4],
    [628.6, 507.7],
  ],
  "seg-10": [
    [697.0, 109.0],
    [697.0, 303.2],
    [696.4, 337.3],
  ],
  "seg-11": [
    [697.0, 109.0],
    [1052.4, 109.0],
    [1066.3, 108.6],
    [1075.5, 107.2],
    [1078.7, 106.0],
    [1081.5, 104.3],
    [1084.8, 100.8],
    [1086.9, 96.2],
    [1088.4, 89.0],
    [1089.0, 75.2],
    [1089.0, 31.1],
    [1088.1, 0.1],
  ],
  "seg-12": [
    [697.0, 109.0],
    [697.1, 0.1],
  ],
  "seg-13": [
    [1095.2, 452.0],
    [1084.8, 464.4],
    [1079.3, 472.1],
    [1058.4, 508.0],
  ],
  "seg-14": [
    [1175.3, 274.3],
    [1162.5, 308.4],
    [1147.5, 342.3],
    [1138.3, 360.6],
    [1102.3, 428.0],
    [1098.2, 438.2],
    [1095.2, 452.0],
  ],
  "seg-15": [
    [1276.3, 435.7],
    [1272.0, 430.9],
    [1269.1, 428.5],
    [1257.3, 424.0],
    [1248.2, 421.7],
    [1236.8, 420.0],
    [1225.2, 419.1],
    [1213.6, 419.1],
    [1200.0, 419.8],
    [1180.9, 422.5],
    [1160.8, 427.7],
    [1139.7, 435.2],
    [1110.7, 448.1],
    [1095.2, 452.0],
  ],
  "seg-16": [
    [1183.3, 14.7],
    [1179.1, 28.3],
    [1178.5, 32.0],
    [1178.1, 41.5],
    [1182.2, 79.9],
    [1184.3, 105.2],
    [1185.0, 125.1],
    [1184.8, 153.2],
    [1183.6, 174.8],
    [1181.4, 198.1],
    [1173.4, 258.6],
    [1173.5, 264.2],
    [1175.3, 274.3],
  ],
  "seg-17": [
    [1261.5, 128.0],
    [1193.7, 255.8],
    [1186.6, 266.2],
    [1182.4, 269.7],
    [1175.3, 274.3],
  ],
  "seg-18": [
    [1183.3, 14.7],
    [1183.3, 0.0],
  ],
  "seg-19": [
    [1183.3, 14.7],
    [1194.7, 23.0],
    [1200.3, 30.1],
    [1204.9, 38.1],
    [1220.5, 70.1],
    [1231.8, 89.6],
    [1239.1, 100.8],
    [1245.9, 110.1],
    [1253.0, 118.9],
    [1261.5, 128.0],
  ],
  "seg-20": [
    [1276.3, 435.7],
    [1272.6, 445.3],
    [1253.6, 483.4],
    [1239.8, 508.0],
  ],
  "seg-21": [
    [1261.5, 128.0],
    [1318.0, 21.4],
    [1330.9, 0.1],
  ],
  "seg-22": [
    [1261.5, 128.0],
    [1273.0, 139.4],
    [1287.8, 152.0],
    [1303.3, 163.3],
    [1317.7, 172.4],
    [1337.6, 182.9],
    [1363.1, 194.7],
    [1375.7, 198.9],
    [1389.7, 201.7],
  ],
  "seg-23": [
    [1276.3, 435.7],
    [1284.5, 438.0],
    [1289.4, 440.2],
    [1300.0, 448.5],
    [1309.8, 458.3],
    [1316.0, 465.8],
    [1322.6, 475.2],
    [1341.4, 507.8],
  ],
  "seg-24": [
    [1389.7, 201.7],
    [1386.9, 187.7],
    [1384.4, 180.7],
    [1381.3, 173.8],
    [1369.8, 152.4],
    [1362.7, 135.2],
    [1357.2, 117.4],
    [1352.5, 97.2],
    [1349.5, 76.3],
    [1348.1, 50.8],
    [1348.5, 28.9],
    [1350.7, 0.1],
  ],
  "seg-25": [
    [1389.7, 201.7],
    [1404.8, 211.6],
    [1423.1, 221.5],
    [1557.0, 282.3],
    [1565.3, 286.4],
    [1571.4, 290.4],
    [1585.8, 298.3],
  ],
};
// Signed segment numbers give continuous, complete client routes, not random turns.
export const ROUTES = [
  { id: "lavender", segments: [-3, 1] },
  { id: "red", segments: [-2, 4, 6, 9] },
  { id: "blue", segments: [-5, 6, 9] },
  { id: "teal", segments: [-7, -8, 11] },
  { id: "light-orange", segments: [-12, 10], terminal: true },
  { id: "dark-orange", segments: [-18, 16, 14, 13] },
  { id: "yellow", segments: [-21, 17, 14, 13] },
  { id: "green", segments: [-18, 19, 22, 25] },
  { id: "magenta", segments: [-24, 25] },
  { id: "purple", segments: [-13, -15, 23] },
  { id: "light-blue", segments: [-13, -15, 20] },
];
const delta = (a: number, b: number) =>
  Math.atan2(Math.sin(b - a), Math.cos(b - a));
function resample(points: Point[], spacing = 1): Point[] {
  const ds = [0];
  for (let i = 1; i < points.length; i++)
    ds.push(
      ds[i - 1] +
        Math.hypot(
          points[i].x - points[i - 1].x,
          points[i].y - points[i - 1].y,
        ),
    );
  const count = Math.ceil(ds.at(-1)! / spacing),
    out: Point[] = [];
  let j = 1;
  for (let i = 0; i <= count; i++) {
    const d = (i / count) * ds.at(-1)!;
    while (j < ds.length - 1 && ds[j] < d) j++;
    const f = (d - ds[j - 1]) / (ds[j] - ds[j - 1] || 1);
    out.push({
      x: points[j - 1].x + (points[j].x - points[j - 1].x) * f,
      y: points[j - 1].y + (points[j].y - points[j - 1].y) * f,
    });
  }
  return out;
}

// Blend the approach and departure at junctions over a useful steering distance.
// A tangent-matched cubic removes the tight kink where independently traced
// segments meet. Apply to positions, so rotation and collision prediction follow
// the same curve rather than rotating the truck early on a still-straight path.
function roundJunctions(points: Point[]): Point[] {
  const junctions = [
    { x: 1183.3, y: 14.7 },
    { x: 1175.3, y: 274.3 },
    { x: 1389.7, y: 201.7 },
    { x: 1095.2, y: 452 },
  ];
  let result = points;
  for (const junction of junctions) {
    let nearest = 0;
    for (let i = 1; i < result.length; i++) {
      if (Math.hypot(result[i].x-junction.x,result[i].y-junction.y) <
          Math.hypot(result[nearest].x-junction.x,result[nearest].y-junction.y)) nearest = i;
    }
    if (Math.hypot(result[nearest].x-junction.x,result[nearest].y-junction.y)>2) continue;
    const start = Math.max(6, nearest-28), end = Math.min(result.length-7, nearest+28);
    if (end-start<30) continue;
    const a=result[start], b=result[end];
    const tangent=(lo:number,hi:number)=>{
      const dx=result[hi].x-result[lo].x,dy=result[hi].y-result[lo].y,length=Math.hypot(dx,dy);
      return {x:dx/length,y:dy/length};
    };
    const incoming=tangent(start-6,start),outgoing=tangent(end,end+6);
    const handle=Math.hypot(b.x-a.x,b.y-a.y)/3;
    const c={x:a.x+incoming.x*handle,y:a.y+incoming.y*handle};
    const d={x:b.x-outgoing.x*handle,y:b.y-outgoing.y*handle};
    const curve=Array.from({length:end-start+1},(_,i)=>{
      const t=i/(end-start),u=1-t;
      return {x:u*u*u*a.x+3*u*u*t*c.x+3*u*t*t*d.x+t*t*t*b.x,
              y:u*u*u*a.y+3*u*u*t*c.y+3*u*t*t*d.y+t*t*t*b.y};
    });
    result=resample([...result.slice(0,start),...curve,...result.slice(end+1)]);
  }
  return result;
}
export function buildLanes(): Lane[] {
  return ROUTES.flatMap((road) =>
    [false, true].map((reverse) => {
      let raw: Point[] = [];
      for (const signed of road.segments) {
        const key = "seg-" + String(Math.abs(signed)).padStart(2, "0");
        let pts = SEGMENTS[key].map(([x, y]) => ({ x, y }));
        if (signed < 0) pts.reverse();
        raw.push(...(raw.length ? pts.slice(1) : pts));
      }
      if (reverse) raw.reverse();
      const fadeStart = !!road.terminal && reverse,
        fadeEnd = !!road.terminal && !reverse;
      // Extend beyond the cropped artwork only. Never invent visible roads.
      const extend = (p: Point, q: Point) => {
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        return {
          x: p.x + ((p.x - q.x) / d) * 80,
          y: p.y + ((p.y - q.y) / d) * 80,
        };
      };
      if (!fadeStart) raw.unshift(extend(raw[0], raw[1]));
      if (!fadeEnd) raw.push(extend(raw.at(-1)!, raw.at(-2)!));
      let center = roundJunctions(resample(raw));
      // Local smoothing is bounded to the supplied trace, not a global curve fit.
      for (let k = 0; k < 32; k++)
        center = center.map((p, i) =>
          i === 0 || i === center.length - 1
            ? p
            : {
                x: (center[i - 1].x + 4 * p.x + center[i + 1].x) / 6,
                y: (center[i - 1].y + 4 * p.y + center[i + 1].y) / 6,
              },
        );
      const heading = (pts: Point[], i: number) => {
        const a = pts[Math.max(0, i - 8)],
          b = pts[Math.min(pts.length - 1, i + 8)];
        return Math.atan2(b.y - a.y, b.x - a.x);
      };
      // Fixed right-hand lane center, including on bends. No passing-sideways model.
      const lane = resample(
        center.map((p, i) => {
          const a = heading(center, i);
          return { x: p.x - Math.sin(a) * 3, y: p.y + Math.cos(a) * 3 };
        }),
      );
      const angles = lane.map((_, i) => heading(lane, i));
      const speeds = angles.map((a, i) => {
        const bend =
          Math.abs(
            delta(
              angles[Math.max(0, i - 8)],
              angles[Math.min(angles.length - 1, i + 8)],
            ),
          ) / 16;
        return Math.max(
          18,
          Math.min(40, Math.sqrt(24 / Math.max(0.001, bend))),
        );
      });
      // Acceleration-limited profile, shared exactly by animation and prediction.
      for (let i = speeds.length - 2; i >= 0; i--)
        speeds[i] = Math.min(speeds[i], Math.sqrt(speeds[i + 1] ** 2 + 24));
      for (let i = 1; i < speeds.length; i++)
        speeds[i] = Math.min(speeds[i], Math.sqrt(speeds[i - 1] ** 2 + 16));
      let distance = 0,
        time = 0;
      const points = lane.map((p, i) => {
        if (i) {
          const d = Math.hypot(p.x - lane[i - 1].x, p.y - lane[i - 1].y);
          distance += d;
          time += (2 * d) / (speeds[i] + speeds[i - 1]);
        }
        return { ...p, angle: angles[i], distance, time, speed: speeds[i] };
      });
      return {
        id: road.id + (reverse ? "-reverse" : "-forward"),
        road: road.id,
        segments: road.segments.map((s) => String(Math.abs(s))),
        points,
        length: distance,
        duration: time,
        fadeStart,
        fadeEnd,
      };
    }),
  );
}
export function sample(lane: Lane, time: number): Pose {
  const pts = lane.points;
  time = Math.max(0, Math.min(lane.duration, time));
  let lo = 0,
    hi = pts.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (pts[m].time <= time) lo = m;
    else hi = m;
  }
  const a = pts[lo],
    b = pts[hi],
    f = (time - a.time) / (b.time - a.time || 1);
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    angle: a.angle + delta(a.angle, b.angle) * f,
    time,
    distance: a.distance + (b.distance - a.distance) * f,
    speed: a.speed + (b.speed - a.speed) * f,
  };
}
export function overlaps(a: Pose, b: Pose, padding = 3): boolean {
  return [a.angle, a.angle + Math.PI / 2, b.angle, b.angle + Math.PI / 2].every(
    (angle) => {
      const radius = (p: Pose) =>
        (18 * TRUCK_SCALE + padding) * Math.abs(Math.cos(p.angle - angle)) +
        (8 * TRUCK_SCALE + padding) * Math.abs(Math.sin(p.angle - angle));
      return (
        Math.abs(
          (a.x - b.x) * Math.cos(angle) + (a.y - b.y) * Math.sin(angle),
        ) <
        radius(a) + radius(b)
      );
    },
  );
}
export function canDispatch(lane: Lane, now: number, active: Trip[]): boolean {
  return active.every((trip) => {
    // Original-size trucks do not fit abreast on these narrow painted roads.
    // Reserve shared physical segments for the trip instead of forcing a pass.
    if (lane.segments.some((s) => trip.lane.segments.includes(s))) return false;
    const end = Math.min(now + lane.duration, trip.start + trip.lane.duration);
    for (let t = now; t <= end + 0.1; t += 0.1)
      if (overlaps(sample(lane, t - now), sample(trip.lane, t - trip.start)))
        return false;
    return true;
  });
}
