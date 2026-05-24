export interface VehicleTelemetry {
  speed: number;       // km/h
  rpm: number;         // RPM
  gear: number;        // 1-7
  throttle: number;    // 0-100%
  brake: number;       // 0-100%
  steering: number;    // -180 to 180 degrees
  gForceLat: number;   // lateral Gs
  gForceLong: number;  // longitudinal Gs
  lapProgress: number; // 0 to 1 (normalized position on track)
  currentSector: number; // 1, 2, or 3
}

export interface EngineStatus {
  oilPressure: number; // bar
  oilTemp: number;     // °C
  waterTemp: number;   // °C
  fuelLevel: number;   // Liters
  fuelLimit: number;   // Fuel capacity (e.g., 80L)
  batteryCharge: number; // %
  ersDeploy: number;   // ERS deploy mode (1-5)
  engineMap: string;   // Qualy, Race, Safe, Eco
}

export interface TireState {
  tempFL: { inner: number; middle: number; outer: number }; // °C
  tempFR: { inner: number; middle: number; outer: number };
  tempRL: { inner: number; middle: number; outer: number };
  tempRR: { inner: number; middle: number; outer: number };
  wearFL: number; // %
  wearFR: number;
  wearRL: number;
  wearRR: number;
  pressureFL: number; // bar
  pressureFR: number;
  pressureRL: number;
  pressureRR: number;
}

export interface LapDetails {
  lapNumber: number;
  lapTime: string;      // "1:29.685"
  lapTimeSec: number;   // in seconds
  delta: string;        // "-0.247" of best lap
  deltaValue: number;   // delta in seconds
  compound: 'SS' | 'S' | 'M' | 'H'; // Super Soft, Soft, Medium, Hard
  status: 'PURPLE' | 'GREEN' | 'YELLOW' | 'INVALID';
  sectors: {
    s1: number;
    s2: number;
    s3: number;
  };
}

export interface TrackSectorTimes {
  bestS1: number;
  bestS2: number;
  bestS3: number;
  currentS1: number;
  currentS2: number;
  currentS3: number;
}

export interface VehicleSetup {
  engineMap: 'Qualifying' | 'Race' | 'Eco' | 'Safe';
  aeroWingAngle: number; // degrees (e.g. 1 to 15)
  suspensionStiffness: 'Soft' | 'Medium' | 'Hard' | 'Stiff';
  brakeBias: number;    // % front (e.g. 54.5)
  diffLock: number;     // % lock (e.g. 65)
}
