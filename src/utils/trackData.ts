// Racetracks waypoint data and telemetry generator for global circuits

export interface TrackPoint {
  x: number;
  y: number;
  sector: number;
  idealThrottle: number;  // 0 - 100%
  idealBrake: number;     // 0 - 100%
  idealGear: number;      // 1 - 7
  idealSpeed: number;     // km/h
  idealSteering: number;  // -180 to 180 degrees
}

export interface Track {
  id: string;
  name: string;
  location: string;
  recordTime: string;
  recordTimeSec: number;
  bestS1: number;
  bestS2: number;
  bestS3: number;
  themeColor: string;
  controlPoints: {
    x: number;
    y: number;
    sector: number;
    speed: number;
    gear: number;
    throttle: number;
    brake: number;
    steering: number;
  }[];
}

// 4 iconic tracks modeled in a normalized 400x240 box
export const TRACKS: Record<string, Track> = {
  redbullring: {
    id: 'redbullring',
    name: 'Red Bull Ring',
    location: 'Spielberg, Áustria',
    recordTime: '1:29.685',
    recordTimeSec: 89.685,
    bestS1: 31.684,
    bestS2: 41.867,
    bestS3: 16.134,
    themeColor: '#e01931',
    controlPoints: [
      { x: 140, y: 220, sector: 3, speed: 250, gear: 6, throttle: 100, brake: 0, steering: 0 },
      { x: 220, y: 220, sector: 1, speed: 275, gear: 6, throttle: 100, brake: 0, steering: 2 },
      { x: 290, y: 215, sector: 1, speed: 140, gear: 3, throttle: 15, brake: 80, steering: 65 },
      { x: 305, y: 200, sector: 1, speed: 110, gear: 2, throttle: 40, brake: 20, steering: 90 },
      { x: 280, y: 140, sector: 1, speed: 220, gear: 5, throttle: 100, brake: 0, steering: -5 },
      { x: 250, y: 80, sector: 1, speed: 260, gear: 6, throttle: 100, brake: 0, steering: 0 },
      { x: 230, y: 40, sector: 1, speed: 285, gear: 7, throttle: 100, brake: 0, steering: 0 },
      { x: 220, y: 22, sector: 1, speed: 120, gear: 2, throttle: 0, brake: 95, steering: 45 },
      { x: 226, y: 15, sector: 1, speed: 75, gear: 1, throttle: 10, brake: 60, steering: 120 },
      { x: 240, y: 18, sector: 2, speed: 95, gear: 2, throttle: 60, brake: 0, steering: 85 },
      { x: 290, y: 45, sector: 2, speed: 210, gear: 4, throttle: 100, brake: 0, steering: -10 },
      { x: 340, y: 80, sector: 2, speed: 245, gear: 5, throttle: 100, brake: 0, steering: -5 },
      { x: 360, y: 102, sector: 2, speed: 155, gear: 3, throttle: 0, brake: 85, steering: 45 },
      { x: 345, y: 125, sector: 2, speed: 115, gear: 2, throttle: 35, brake: 10, steering: 80 },
      { x: 280, y: 140, sector: 2, speed: 175, gear: 4, throttle: 80, brake: 0, steering: -40 },
      { x: 240, y: 155, sector: 2, speed: 185, gear: 4, throttle: 90, brake: 0, steering: -55 },
      { x: 205, y: 175, sector: 2, speed: 145, gear: 3, throttle: 40, brake: 30, steering: -80 },
      { x: 155, y: 185, sector: 2, speed: 160, gear: 4, throttle: 85, brake: 0, steering: 35 },
      { x: 110, y: 180, sector: 3, speed: 180, gear: 4, throttle: 90, brake: 0, steering: 45 },
      { x: 75, y: 170, sector: 3, speed: 145, gear: 3, throttle: 50, brake: 25, steering: 75 },
      { x: 50, y: 195, sector: 3, speed: 150, gear: 3, throttle: 70, brake: 5, steering: 50 },
      { x: 70, y: 220, sector: 3, speed: 190, gear: 4, throttle: 95, brake: 0, steering: 30 },
      { x: 105, y: 221, sector: 3, speed: 225, gear: 5, throttle: 100, brake: 0, steering: 5 },
    ]
  },
  interlagos: {
    id: 'interlagos',
    name: 'Autódromo de Interlagos',
    location: 'São Paulo, Brasil',
    recordTime: '1:07.281',
    recordTimeSec: 67.281,
    bestS1: 18.320,
    bestS2: 34.110,
    bestS3: 14.851,
    themeColor: '#2ebc59',
    controlPoints: [
      { x: 100, y: 220, sector: 3, speed: 285, gear: 6, throttle: 100, brake: 0, steering: 0 },
      { x: 50, y: 160, sector: 1, speed: 120, gear: 2, throttle: 10, brake: 85, steering: 85 },
      { x: 65, y: 110, sector: 1, speed: 140, gear: 3, throttle: 40, brake: 20, steering: -75 },
      { x: 110, y: 90, sector: 1, speed: 215, gear: 4, throttle: 100, brake: 0, steering: -45 },
      { x: 170, y: 120, sector: 1, speed: 270, gear: 6, throttle: 100, brake: 0, steering: 0 },
      { x: 215, y: 80, sector: 2, speed: 130, gear: 3, throttle: 20, brake: 90, steering: -70 },
      { x: 250, y: 130, sector: 2, speed: 180, gear: 4, throttle: 80, brake: 0, steering: 40 },
      { x: 340, y: 160, sector: 2, speed: 110, gear: 2, throttle: 15, brake: 70, steering: -80 },
      { x: 310, y: 200, sector: 2, speed: 95, gear: 2, throttle: 30, brake: 40, steering: 95 },
      { x: 210, y: 220, sector: 3, speed: 140, gear: 3, throttle: 60, brake: 15, steering: -50 },
      { x: 140, y: 220, sector: 3, speed: 225, gear: 5, throttle: 100, brake: 0, steering: -20 },
    ]
  },
  monaco: {
    id: 'monaco',
    name: 'Circuit de Monaco',
    location: 'Monte Carlo, Mônaco',
    recordTime: '1:10.166',
    recordTimeSec: 70.166,
    bestS1: 19.450,
    bestS2: 32.220,
    bestS3: 18.496,
    themeColor: '#fbbf24',
    controlPoints: [
      { x: 100, y: 210, sector: 3, speed: 220, gear: 5, throttle: 100, brake: 0, steering: 0 },
      { x: 40, y: 190, sector: 1, speed: 90, gear: 2, throttle: 15, brake: 90, steering: 80 },
      { x: 120, y: 140, sector: 1, speed: 180, gear: 4, throttle: 100, brake: 0, steering: -25 },
      { x: 200, y: 90, sector: 1, speed: 160, gear: 3, throttle: 80, brake: 10, steering: 45 },
      { x: 170, y: 65, sector: 1, speed: 110, gear: 2, throttle: 30, brake: 60, steering: -35 },
      { x: 110, y: 70, sector: 2, speed: 95, gear: 2, throttle: 20, brake: 50, steering: -70 },
      { x: 80, y: 95, sector: 2, speed: 42, gear: 1, throttle: 10, brake: 95, steering: 150 }, // Hairpin
      { x: 130, y: 130, sector: 2, speed: 100, gear: 2, throttle: 55, brake: 15, steering: 90 },
      { x: 230, y: 160, sector: 2, speed: 260, gear: 6, throttle: 100, brake: 0, steering: 15 },
      { x: 310, y: 185, sector: 2, speed: 85, gear: 2, throttle: 10, brake: 95, steering: -85 },
      { x: 370, y: 210, sector: 3, speed: 140, gear: 3, throttle: 65, brake: 25, steering: 75 },
      { x: 310, y: 225, sector: 3, speed: 130, gear: 3, throttle: 50, brake: 30, steering: -65 },
      { x: 180, y: 215, sector: 3, speed: 90, gear: 2, throttle: 20, brake: 70, steering: 95 },
    ]
  },
  spa: {
    id: 'spa',
    name: 'Spa-Francorchamps',
    location: 'Stavelot, Bélgica',
    recordTime: '1:41.252',
    recordTimeSec: 101.252,
    bestS1: 38.250,
    bestS2: 45.102,
    bestS3: 17.900,
    themeColor: '#38bdf8',
    controlPoints: [
      { x: 40, y: 200, sector: 3, speed: 240, gear: 5, throttle: 100, brake: 0, steering: 0 },
      { x: 70, y: 205, sector: 1, speed: 75, gear: 1, throttle: 10, brake: 95, steering: 110 },
      { x: 120, y: 150, sector: 1, speed: 290, gear: 7, throttle: 100, brake: 0, steering: -25 },
      { x: 160, y: 100, sector: 1, speed: 295, gear: 7, throttle: 100, brake: 0, steering: 30 },
      { x: 260, y: 70, sector: 1, speed: 305, gear: 7, throttle: 100, brake: 0, steering: 0 },
      { x: 340, y: 80, sector: 2, speed: 135, gear: 3, throttle: 20, brake: 85, steering: 65 },
      { x: 360, y: 120, sector: 2, speed: 105, gear: 2, throttle: 40, brake: 40, steering: 85 },
      { x: 300, y: 160, sector: 2, speed: 210, gear: 4, throttle: 90, brake: 0, steering: -60 },
      { x: 240, y: 190, sector: 2, speed: 230, gear: 5, throttle: 95, brake: 0, steering: 45 },
      { x: 140, y: 210, sector: 3, speed: 295, gear: 7, throttle: 100, brake: 0, steering: -20 },
      { x: 75, y: 202, sector: 3, speed: 90, gear: 2, throttle: 15, brake: 95, steering: 95 },
    ]
  }
};

// Generates high-density interpolated points (e.g. 240 points for ultra-smooth layout rendering)
export function generateTrackPoints(trackId: string, count = 240): TrackPoint[] {
  const track = TRACKS[trackId] || TRACKS.redbullring;
  const controlPoints = track.controlPoints;
  const pts: TrackPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    const virtualIndex = (i / count) * controlPoints.length;
    const index1 = Math.floor(virtualIndex) % controlPoints.length;
    const index2 = (index1 + 1) % controlPoints.length;
    const t = virtualIndex - Math.floor(virtualIndex);
    
    const p1 = controlPoints[index1];
    const p2 = controlPoints[index2];
    
    // Smooth parametric interpolations
    const x = p1.x * (1 - t) + p2.x * t;
    const y = p1.y * (1 - t) + p2.y * t;
    
    // Sector separation has discrete boundary
    const sector = t < 0.5 ? p1.sector : p2.sector;
    
    // Interpole motorsport parameters
    const idealSpeed = Math.round(p1.speed * (1 - t) + p2.speed * t);
    const idealGear = Math.round(p1.gear * (1 - t) + p2.gear * t);
    const idealThrottle = Math.round(p1.throttle * (1 - t) + p2.throttle * t);
    const idealBrake = Math.round(p1.brake * (1 - t) + p2.brake * t);
    const idealSteering = Math.round(p1.steering * (1 - t) + p2.steering * t);
    
    pts.push({
      x,
      y,
      sector,
      idealSpeed,
      idealThrottle,
      idealBrake,
      idealGear,
      idealSteering,
    });
  }
  
  return pts;
}

// Generate pre-loaded points maps for efficiency
const trackPointsCache: Record<string, TrackPoint[]> = {
  redbullring: generateTrackPoints('redbullring'),
  interlagos: generateTrackPoints('interlagos'),
  monaco: generateTrackPoints('monaco'),
  spa: generateTrackPoints('spa'),
};

// Backwards-compatible export representing Red Bull Ring explicitly
export const redBullRingPoints = trackPointsCache.redbullring;

// Retrieve track telemetry values based on raw progress (0.0 to 1.0) and track ID
export function getTrackTelemetryAtProgress(progress: number, trackId = 'redbullring'): TrackPoint {
  const targetCache = trackPointsCache[trackId] || trackPointsCache.redbullring;
  // Clamp progress securely to [0, 1) bounds
  const clampedProgress = ((progress % 1) + 1) % 1;
  const index = Math.floor(clampedProgress * targetCache.length);
  return targetCache[index];
}

// Convert track coordinates to a clean CSS/SVG path string for layout drawing
export const getTrackSvgPath = (trackId = 'redbullring'): string => {
  const targetCache = trackPointsCache[trackId] || trackPointsCache.redbullring;
  if (targetCache.length === 0) return '';
  const first = targetCache[0];
  let path = `M ${first.x} ${first.y}`;
  for (let i = 1; i < targetCache.length; i++) {
    path += ` L ${targetCache[i].x} ${targetCache[i].y}`;
  }
  return path + ' Z'; // Close track circuit
};

// Sector color-coded path generator
export const getSectorSvgPaths = (trackId = 'redbullring'): { sector: number; d: string }[] => {
  const targetCache = trackPointsCache[trackId] || trackPointsCache.redbullring;
  const s1Points: string[] = [];
  const s2Points: string[] = [];
  const s3Points: string[] = [];
  
  for (let i = 0; i < targetCache.length; i++) {
    const pt = targetCache[i];
    const prevPt = targetCache[i === 0 ? targetCache.length - 1 : i - 1];
    
    if (pt.sector === 1) {
      if (s1Points.length === 0) s1Points.push(`M ${prevPt.x} ${prevPt.y}`);
      s1Points.push(`L ${pt.x} ${pt.y}`);
    } else if (pt.sector === 2) {
      if (s2Points.length === 0) s2Points.push(`M ${prevPt.x} ${prevPt.y}`);
      s2Points.push(`L ${pt.x} ${pt.y}`);
    } else {
      if (s3Points.length === 0) s3Points.push(`M ${prevPt.x} ${prevPt.y}`);
      s3Points.push(`L ${pt.x} ${pt.y}`);
    }
  }
  
  return [
    { sector: 1, d: s1Points.join(' ') },
    { sector: 2, d: s2Points.join(' ') },
    { sector: 3, d: s3Points.join(' ') },
  ];
};
