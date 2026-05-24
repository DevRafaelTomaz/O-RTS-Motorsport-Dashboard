import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  VehicleTelemetry, 
  EngineStatus, 
  TireState, 
  LapDetails, 
  VehicleSetup, 
  TrackSectorTimes 
} from '../types';
import { getTrackTelemetryAtProgress, TRACKS } from '../utils/trackData';
import { audioSystem } from '../utils/audioSystem';

// Baseline lap details matches GT3 RS top records (1:29.685 best lap)
const DEFAULT_LAPS: LapDetails[] = [
  { lapNumber: 1, lapTime: '1:29.685', lapTimeSec: 89.685, delta: '-0.247', deltaValue: -0.247, compound: 'SS', status: 'PURPLE', sectors: { s1: 31.684, s2: 41.867, s3: 16.134 } },
  { lapNumber: 2, lapTime: '1:29.932', lapTimeSec: 89.932, delta: '+0.000', deltaValue: 0.0, compound: 'SS', status: 'GREEN', sectors: { s1: 31.809, s2: 41.934, s3: 16.189 } },
  { lapNumber: 3, lapTime: '1:30.271', lapTimeSec: 90.271, delta: '+0.339', deltaValue: 0.339, compound: 'SS', status: 'GREEN', sectors: { s1: 31.950, s2: 42.120, s3: 16.201 } },
  { lapNumber: 4, lapTime: '1:30.521', lapTimeSec: 90.521, delta: '+0.589', deltaValue: 0.589, compound: 'SS', status: 'GREEN', sectors: { s1: 32.102, s2: 42.200, s3: 16.219 } },
  { lapNumber: 5, lapTime: '1:30.842', lapTimeSec: 90.842, delta: '+0.910', deltaValue: 0.910, compound: 'SS', status: 'GREEN', sectors: { s1: 32.221, s2: 42.311, s3: 16.310 } },
  { lapNumber: 6, lapTime: '1:31.228', lapTimeSec: 91.228, delta: '+1.296', deltaValue: 1.296, compound: 'S', status: 'YELLOW', sectors: { s1: 32.411, s2: 42.490, s3: 16.327 } },
  { lapNumber: 7, lapTime: '1:31.764', lapTimeSec: 91.764, delta: '+1.832', deltaValue: 1.832, compound: 'S', status: 'YELLOW', sectors: { s1: 32.610, s2: 42.714, s3: 16.440 } },
];

export function useTelemetry() {
  // Active track selection (adaptive telemetry)
  const [activeTrackId, setActiveTrackId] = useState<string>('redbullring');
  const activeTrackIdRef = useRef<string>('redbullring');

  // Current active viewport selection
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  // Simulation speed factor (1 = real-time, can speed up or down)
  const [simSpeed, setSimSpeed] = useState<number>(1.2); 
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Active setups
  const [setup, setSetup] = useState<VehicleSetup>({
    engineMap: 'Qualifying',
    aeroWingAngle: 8, // scale of 1-15 degrees
    suspensionStiffness: 'Medium',
    brakeBias: 54.5, // 54.5% Front
    diffLock: 65,    // 65% Lock
  });

  // Track session details
  const [currentLapNumber, setCurrentLapNumber] = useState<number>(8);
  const [bestLapTimeSec, setBestLapTimeSec] = useState<number>(89.685); // 1:29.685
  const [lapsList, setLapsList] = useState<LapDetails[]>(DEFAULT_LAPS);
  
  // Accumulated times for current lap
  const [currentLapTime, setCurrentLapTime] = useState<number>(0); // seconds
  const [lapElapsedSeconds, setLapElapsedSeconds] = useState<number>(0);
  const [sectorTimes, setSectorTimes] = useState<TrackSectorTimes>({
    bestS1: 31.684, bestS2: 41.867, bestS3: 16.134,
    currentS1: 0, currentS2: 0, currentS3: 0
  });

  // G-Force, position, and core physics state
  const [progress, setProgress] = useState<number>(0.12); // Start slightly into lap representation
  const [telemetry, setTelemetry] = useState<VehicleTelemetry>({
    speed: 243,
    rpm: 7854,
    gear: 6,
    throttle: 100,
    brake: 0,
    steering: 2,
    gForceLat: 0.1,
    gForceLong: 0.4,
    lapProgress: 0.12,
    currentSector: 1
  });

  // Engine, fuels, battery
  const [engine, setEngine] = useState<EngineStatus>({
    oilPressure: 5.2,
    oilTemp: 112,
    waterTemp: 95,
    fuelLevel: 32.4,
    fuelLimit: 80,
    batteryCharge: 72,
    ersDeploy: 3,
    engineMap: 'Qualy'
  });

  // 4 wheels state
  const [tires, setTires] = useState<TireState>({
    tempFL: { inner: 85, middle: 92, outer: 99 },
    tempFR: { inner: 87, middle: 94, outer: 101 },
    tempRL: { inner: 77, middle: 84, outer: 90 },
    tempRR: { inner: 79, middle: 86, outer: 93 },
    wearFL: 62.4,
    wearFR: 58.1,
    wearRL: 64.2,
    wearRR: 61.5,
    pressureFL: 2.12,
    pressureFR: 2.15,
    pressureRL: 2.05,
    pressureRR: 2.07,
  });

  // Real-time alarm buffer
  const [alarms, setAlarms] = useState<string[]>([
    'SYSTEM OK: Real-time telemetry broadcasting.',
    'TIRE TAMP STATUS: High dynamic load detected on front axles.',
  ]);

  // Track map evolution status
  const [trackGrip, setTrackGrip] = useState<number>(98.5); // % Track rubber wear
  const [trackTemp, setTrackTemp] = useState<number>(28.4); // °C

  // Maintain reference to timing so we get correct frame increments
  const lastTimeRef = useRef<number>(Date.now());
  const tickCounter = useRef<number>(0);

  // Maintain refs for fast parameters to prevent double-execution side effects in React StrictMode
  const progressRef = useRef<number>(0.12);
  const currentLapTimeRef = useRef<number>(0);
  const currentLapNumberRef = useRef<number>(8);
  const bestLapTimeSecRef = useRef<number>(89.685);
  const sectorTimesRef = useRef<TrackSectorTimes>({
    bestS1: 31.684, bestS2: 41.867, bestS3: 16.134,
    currentS1: 0, currentS2: 0, currentS3: 0
  });
  const lapsListRef = useRef<LapDetails[]>(DEFAULT_LAPS);
  const lowFuelTriggeredRef = useRef<boolean>(false);
  const prevGearRef = useRef<number>(6);

  // Buffer of live telemetry history for chart (e.g. last 45 ticks for real-time wave)
  const [chartHistory, setChartHistory] = useState<any[]>([]);

  // Function to inject or remove alarms
  const addAlarm = useCallback((text: string) => {
    setAlarms(prev => [text, ...prev.slice(0, 14)]);
  }, []);

  // Adaptable track switching telemetry logic
  const changeTrack = useCallback((trackId: string) => {
    const track = TRACKS[trackId];
    if (!track) return;

    setActiveTrackId(trackId);
    activeTrackIdRef.current = trackId;

    // Scale current laps to match new track's timings
    bestLapTimeSecRef.current = track.recordTimeSec;
    setBestLapTimeSec(track.recordTimeSec);

    const multiplier = track.recordTimeSec / 89.685;
    const formatLapTime = (sec: number) => {
      const minutes = Math.floor(sec / 60);
      const remainder = (sec % 60).toFixed(3);
      const paddedRemainder = Number(remainder) < 10 ? `0${remainder}` : remainder;
      return `${minutes}:${paddedRemainder}`;
    };

    const newDefaultLaps: LapDetails[] = DEFAULT_LAPS.map((lap, idx) => {
      const scaledSec = lap.lapTimeSec * multiplier;
      return {
        ...lap,
        lapTime: formatLapTime(scaledSec),
        lapTimeSec: scaledSec,
        delta: idx === 0 ? lap.delta : `+${(scaledSec - track.recordTimeSec).toFixed(3)}`,
        deltaValue: idx === 0 ? lap.deltaValue : scaledSec - track.recordTimeSec,
        sectors: {
          s1: lap.sectors.s1 * multiplier,
          s2: lap.sectors.s2 * multiplier,
          s3: lap.sectors.s3 * multiplier,
        }
      };
    });

    lapsListRef.current = newDefaultLaps;
    setLapsList(newDefaultLaps);

    const initialSectors = {
      bestS1: track.bestS1,
      bestS2: track.bestS2,
      bestS3: track.bestS3,
      currentS1: 0,
      currentS2: 0,
      currentS3: 0
    };

    setSectorTimes(initialSectors);
    sectorTimesRef.current = initialSectors;

    progressRef.current = 0.0;
    setProgress(0.0);
    currentLapTimeRef.current = 0.0;
    setCurrentLapTime(0.0);
    setCurrentLapNumber(8);
    currentLapNumberRef.current = 8;
    setChartHistory([]);

    addAlarm(`CIRCUITO SELECIONADO: Carregado telemetria para [ ${track.name} ] (${track.location})`);
  }, [addAlarm]);

  const triggerPitstop = () => {
    addAlarm('BOX BOX BOX: Entering Pit Lane. Changing to Soft Compound (S)');
    setTires({
      tempFL: { inner: 70, middle: 72, outer: 75 },
      tempFR: { inner: 70, middle: 72, outer: 75 },
      tempRL: { inner: 70, middle: 72, outer: 75 },
      tempRR: { inner: 70, middle: 72, outer: 75 },
      wearFL: 100,
      wearFR: 100,
      wearRL: 100,
      wearRR: 100,
      pressureFL: 2.0,
      pressureFR: 2.0,
      pressureRL: 1.9,
      pressureRR: 1.9,
    });
    setEngine(prev => {
      lowFuelTriggeredRef.current = false; // Reset fuel warning
      return { ...prev, fuelLevel: 75.0 };
    });
    addAlarm('PIT COMPLETES: Fuel refilled. S compound freshly fitted.');
  };

  // Main simulation heartbeat loop
  useEffect(() => {
    let animationFrameId: number;
    
    const tick = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPaused) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // Calculate state changes based on physics ticks
      const effectiveDt = dt * simSpeed;
      tickCounter.current += 1;

      // Find baseline GT3 telemetry mapped to current track position
      const targetPoint = getTrackTelemetryAtProgress(progressRef.current, activeTrackIdRef.current);
      
      // 1. Calculate active modifications based on Vehicle Setups
      let setupSpeedFactor = 1.0;
      let setupFuelFactor = 1.0;
      let setupWearFactor = 1.0;
      let batteryRate = -0.55; // depletion by default

      // Setup effects -> Engine Map
      if (setup.engineMap === 'Qualifying') {
        setupSpeedFactor *= 1.08;
        setupFuelFactor *= 1.45;
        setupWearFactor *= 1.30;
        batteryRate = -1.5; // intense deploy
      } else if (setup.engineMap === 'Eco') {
        setupSpeedFactor *= 0.90;
        setupFuelFactor *= 0.65;
        setupWearFactor *= 0.85;
        batteryRate = 1.2; // recuperate ERS
      } else if (setup.engineMap === 'Safe') {
        setupSpeedFactor *= 0.82;
        setupFuelFactor *= 0.50;
        setupWearFactor *= 0.60;
        batteryRate = 1.8; // max charging
      }

      // Setup effects -> Aero Wing Angle (1-15 degrees, baseline around 8)
      const aeroDegreesDelta = setup.aeroWingAngle - 8;
      if (aeroDegreesDelta > 0) {
        // More downforce: slower on straightaways but higher corner speed potential
        const isStraight = targetPoint.idealSteering < 15 && targetPoint.idealBrake === 0;
        if (isStraight) {
          setupSpeedFactor *= (1.0 - (aeroDegreesDelta * 0.006)); // speed drop due to drag
        } else {
          setupSpeedFactor *= (1.0 + (aeroDegreesDelta * 0.009)); // corner grip boost
        }
        setupWearFactor *= (1.0 + (aeroDegreesDelta * 0.02)); // slightly higher load wear
      } else if (aeroDegreesDelta < 0) {
        // Less downforce: faster on straightaways but slidey corners
        const isStraight = targetPoint.idealSteering < 15 && targetPoint.idealBrake === 0;
        if (isStraight) {
          setupSpeedFactor *= (1.0 + (Math.abs(aeroDegreesDelta) * 0.005));
        } else {
          setupSpeedFactor *= (1.0 - (Math.abs(aeroDegreesDelta) * 0.015)); // severe sliding loss
        }
        setupWearFactor *= (1.0 + (Math.abs(aeroDegreesDelta) * 0.01)); // slide causes tire scrub
      }

      // 2. Real-time dynamic speed and RPM math
      const currentRefSpeed = targetPoint.idealSpeed * setupSpeedFactor;
      
      // Add low-level noise representation to feel like high-frequency real sensor stream
      const noise = (Math.sin(tickCounter.current * 0.1) * 1.5) + (Math.cos(tickCounter.current * 0.35) * 0.8);
      const liveSpeed = Math.max(50, Math.round(currentRefSpeed + noise));

      // RPM is correlated with current speed and gear
      // Red Bull Ring Redline is ~9,000 RPM, shift points around 8,500
      let calculatedRpm = (liveSpeed / targetPoint.idealGear) * 220 + 2000;
      calculatedRpm = Math.min(9200, Math.max(3500, calculatedRpm)) + (Math.sin(tickCounter.current * 0.5) * 45);
      if (targetPoint.idealBrake > 80 && calculatedRpm > 6500) {
        calculatedRpm -= 2000; // downshift drop
      }

      // Sector breakdown timing
      const previousSector = targetPoint.sector;
      
      // Calculate new normalized track progress
      // Red Bull Ring track length: ~4.318 km
      // speed of 240km/h is 66.6 m/s. progressIncrement = (66.6 / 4318) * effectiveDt
      const speedInMs = (liveSpeed / 3.6);
      const nextProgress = (progressRef.current + (speedInMs / 4318) * effectiveDt) % 1.0;

      const currentTelemetryPoint = getTrackTelemetryAtProgress(nextProgress, activeTrackIdRef.current);
      const nextSector = currentTelemetryPoint.sector;

      // Sector timing transitions
      let currentSectors = { ...sectorTimesRef.current };
      if (previousSector === 1 && nextSector === 2) {
        // Sector 1 finished
        const elapsed = Math.round(currentLapTimeRef.current * 1000) / 1000;
        currentSectors.currentS1 = elapsed;
        if (elapsed < currentSectors.bestS1) {
          currentSectors.bestS1 = elapsed;
          addAlarm(`SECTOR 1 PB: Flipped to purple with -${Math.abs(elapsed - sectorTimesRef.current.bestS1).toFixed(3)}s`);
        }
      } else if (previousSector === 2 && nextSector === 3) {
        // Sector 2 finished
        const elapsed = Math.round((currentLapTimeRef.current - currentSectors.currentS1) * 1000) / 1000;
        currentSectors.currentS2 = elapsed;
        if (elapsed < currentSectors.bestS2) {
          currentSectors.bestS2 = elapsed;
          addAlarm(`SECTOR 2 PB: Perfect infield sector. -${Math.abs(elapsed - sectorTimesRef.current.bestS2).toFixed(3)}s`);
        }
      }

      // Lap completed reset event!
      const isLapCompleted = (nextProgress < progressRef.current);
      if (isLapCompleted) {
        // Track sector 3 completed
        const totalLapSec = Math.round(currentLapTimeRef.current * 1000) / 1000;
        const s3Time = Math.round((totalLapSec - currentSectors.currentS1 - currentSectors.currentS2) * 1000) / 1000;
        currentSectors.currentS3 = s3Time;
        
        // Generate realistic lap metrics
        const isBest = totalLapSec < bestLapTimeSecRef.current;
        const deltaVal = totalLapSec - bestLapTimeSecRef.current;
        const deltaSign = deltaVal < 0 ? '-' : '+';
        const deltaStr = `${deltaSign}${Math.abs(deltaVal).toFixed(3)}`;

        const formatLapTime = (sec: number) => {
          const minutes = Math.floor(sec / 60);
          const remainder = (sec % 60).toFixed(3);
          const paddedRemainder = Number(remainder) < 10 ? `0${remainder}` : remainder;
          return `${minutes}:${paddedRemainder}`;
        };

        const newLap: LapDetails = {
          lapNumber: currentLapNumberRef.current,
          lapTime: formatLapTime(totalLapSec),
          lapTimeSec: totalLapSec,
          delta: deltaStr,
          deltaValue: deltaVal,
          compound: 'SS',
          status: isBest ? 'PURPLE' : (deltaVal < 1.0 ? 'GREEN' : 'YELLOW'),
          sectors: {
            s1: currentSectors.currentS1 || 31.8,
            s2: currentSectors.currentS2 || 41.9,
            s3: s3Time > 0 ? s3Time : 16.1
          }
        };

        if (isBest) {
          bestLapTimeSecRef.current = totalLapSec;
          setBestLapTimeSec(totalLapSec);
          addAlarm(`🚨 NEW FASTEST LAP RECORDED inside qualifying specs! Time: ${newLap.lapTime}`);
        } else {
          addAlarm(`Lap ${currentLapNumberRef.current} complete: ${newLap.lapTime} (${deltaStr})`);
        }

        // Prepend new lap safely
        lapsListRef.current = [newLap, ...lapsListRef.current.slice(0, 10)];
        setLapsList(lapsListRef.current);

        currentLapNumberRef.current += 1;
        setCurrentLapNumber(currentLapNumberRef.current);
        currentLapTimeRef.current = 0;
        setCurrentLapTime(0);
        
        // Slight degradation to tires on lap boundaries
        setTires(prev => ({
          ...prev,
          wearFL: Math.max(5, prev.wearFL - (1.2 * setupWearFactor)),
          wearFR: Math.max(5, prev.wearFR - (1.1 * setupWearFactor)),
          wearRL: Math.max(5, prev.wearRL - (0.8 * setupWearFactor)),
          wearRR: Math.max(5, prev.wearRR - (0.8 * setupWearFactor)),
        }));
      } else {
        // Increment lap timer
        currentLapTimeRef.current += effectiveDt;
        setCurrentLapTime(currentLapTimeRef.current);
      }

      // Update refs
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      sectorTimesRef.current = currentSectors;
      setSectorTimes(currentSectors);

      // Live telemetry updates
      audioSystem.updateEngineRPM(calculatedRpm);
      if (prevGearRef.current !== targetPoint.idealGear) {
        prevGearRef.current = targetPoint.idealGear;
        audioSystem.triggerShiftPop();
      }
      
      setTelemetry({
        speed: liveSpeed,
        rpm: Math.round(calculatedRpm),
        gear: targetPoint.idealGear,
        throttle: targetPoint.idealThrottle,
        brake: targetPoint.idealBrake,
        steering: targetPoint.idealSteering,
        // G-forces calculated from brake spike & steering swing
        gForceLat: parseFloat(((targetPoint.idealSteering / 180) * 2.8 + (Math.sin(tickCounter.current * 0.1) * 0.12)).toFixed(2)),
        gForceLong: parseFloat((((targetPoint.idealThrottle - targetPoint.idealBrake * 1.5) / 100) * 1.4 + (Math.cos(tickCounter.current * 0.15) * 0.08)).toFixed(2)),
        lapProgress: nextProgress,
        currentSector: nextSector
      });

      // 3. Engine auxiliary statuses
      setEngine(prev => {
        const thermalStress = (calculatedRpm > 8000 ? 0.35 : -0.1) + (liveSpeed < 100 ? 0.4 : -0.15);
        const nextOilTemp = parseFloat(Math.min(138, Math.max(90, prev.oilTemp + (thermalStress * effectiveDt * 0.8) + (setup.engineMap === 'Qualifying' ? 0.03 : -0.01))).toFixed(1));
        const nextWaterTemp = parseFloat(Math.min(115, Math.max(82, prev.waterTemp + (thermalStress * effectiveDt * 0.5) + (setup.engineMap === 'Qualifying' ? 0.02 : -0.015))).toFixed(1));
        
        // Oil Pressure rises with RPM
        const nextOilPressure = parseFloat((2.5 + (calculatedRpm / 9000) * 3.8 + (Math.sin(tickCounter.current * 0.2) * 0.1)).toFixed(1));
        
        // Fuel burn
        const burnRate = 0.045 * setupFuelFactor * (calculatedRpm / 5000); 
        const nextFuel = parseFloat(Math.max(0.1, prev.fuelLevel - (burnRate * effectiveDt)).toFixed(2));
        
        return {
          ...prev,
          oilPressure: nextOilPressure,
          oilTemp: Number(nextOilTemp),
          waterTemp: Number(nextWaterTemp),
          fuelLevel: nextFuel,
          batteryCharge: Math.round(Math.min(100, Math.max(0, prev.batteryCharge + (batteryRate * effectiveDt * 0.4))))
        };
      });

      // Low fuel warning handling outside pure state updaters
      if (engine.fuelLevel < 5.0 && !lowFuelTriggeredRef.current) {
        lowFuelTriggeredRef.current = true;
        addAlarm('⚠️ WARNING: LOW FUEL STRAIN LIMIT (< 5.0 LITERS LEFT)');
      } else if (engine.fuelLevel >= 5.0 && lowFuelTriggeredRef.current) {
        lowFuelTriggeredRef.current = false;
      }

      // 4. Detailed Tire Thermography Calculation
      setTires(prev => {
        // Front outer parts heat up on corners, inner parts cool down. Under brake, both heat significantly.
        const steerIntensity = Math.abs(targetPoint.idealSteering);
        const brakeIntensity = targetPoint.idealBrake;
        
        const thermalDissipation = 1.6; // basic ambient air cooling
        
        const flHeatGrip = (steerIntensity > 15 ? (steerIntensity * 0.15) : 0.0) + (brakeIntensity * (setup.brakeBias / 100) * 0.28);
        const frHeatGrip = (steerIntensity > 15 ? (steerIntensity * 0.15) : 0.0) + (brakeIntensity * (setup.brakeBias / 100) * 0.28);
        // Rears heat from mechanical traction torque
        const rlHeatGrip = (targetPoint.idealThrottle * 0.075) + (brakeIntensity * ((100 - setup.brakeBias) / 100) * 0.2) + (steerIntensity * 0.08);
        const rrHeatGrip = (targetPoint.idealThrottle * 0.075) + (brakeIntensity * ((100 - setup.brakeBias) / 100) * 0.2) + (steerIntensity * 0.08);

        const calcCompState = (current: number, load: number) => {
          const heatUp = load * setupWearFactor * 0.85;
          const coolDown = (current - 80) * thermalDissipation * effectiveDt * 0.15;
          const updated = current + (heatUp * effectiveDt * 4) - coolDown;
          return Math.round(Math.min(145, Math.max(65, updated)));
        };

        // Map inner, middle, and outer. Outer edges experience high camber loads on outside tires during turns.
        const steerSign = targetPoint.idealSteering; // positive turns right, negative turns left
        
        return {
          ...prev,
          tempFL: {
            inner: calcCompState(prev.tempFL.inner, flHeatGrip * 0.9),
            middle: calcCompState(prev.tempFL.middle, flHeatGrip * 1.0),
            outer: calcCompState(prev.tempFL.outer, flHeatGrip * (steerSign > 10 ? 1.4 : 0.85))
          },
          tempFR: {
            inner: calcCompState(prev.tempFR.inner, frHeatGrip * 0.9),
            middle: calcCompState(prev.tempFR.middle, frHeatGrip * 1.0),
            outer: calcCompState(prev.tempFR.outer, frHeatGrip * (steerSign < -10 ? 1.4 : 0.85))
          },
          tempRL: {
            inner: calcCompState(prev.tempRL.inner, rlHeatGrip * 0.92),
            middle: calcCompState(prev.tempRL.middle, rlHeatGrip * 1.0),
            outer: calcCompState(prev.tempRL.outer, rlHeatGrip * (steerSign > 10 ? 1.3 : 0.85))
          },
          tempRR: {
            inner: calcCompState(prev.tempRR.inner, rrHeatGrip * 0.92),
            middle: calcCompState(prev.tempRR.middle, rrHeatGrip * 1.0),
            outer: calcCompState(prev.tempRR.outer, rrHeatGrip * (steerSign < -10 ? 1.3 : 0.85))
          },
          // Dynamic tire chamber pressures correlated with tire temperatures
          pressureFL: parseFloat((1.95 + (prev.tempFL.middle / 100) * 0.22 + (Math.sin(tickCounter.current * 0.1) * 0.01)).toFixed(2)),
          pressureFR: parseFloat((1.95 + (prev.tempFR.middle / 100) * 0.22 + (Math.sin(tickCounter.current * 0.15) * 0.01)).toFixed(2)),
          pressureRL: parseFloat((1.85 + (prev.tempRL.middle / 100) * 0.24 + (Math.sin(tickCounter.current * 0.08) * 0.01)).toFixed(2)),
          pressureRR: parseFloat((1.85 + (prev.tempRR.middle / 100) * 0.24 + (Math.sin(tickCounter.current * 0.12) * 0.01)).toFixed(2)),
        };
      });

      // 5. Build dynamic chart history data (every 3 standard frames for lighter rendering payload)
      if (tickCounter.current % 3 === 0) {
        setChartHistory(prev => {
          const telemetryPoint = {
            time: new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
            index: tickCounter.current,
            speed: liveSpeed,
            rpm: Math.round(calculatedRpm),
            throttle: targetPoint.idealThrottle,
            brake: targetPoint.idealBrake,
            steering: targetPoint.idealSteering,
            gear: targetPoint.idealGear,
            gForceLat: parseFloat(((targetPoint.idealSteering / 180) * 2.8).toFixed(2)),
            sector: targetPoint.sector,
          };
          const limitedHistory = [...prev, telemetryPoint];
          if (limitedHistory.length > 50) {
            limitedHistory.shift();
          }
          return limitedHistory;
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [simSpeed, isPaused, setup, addAlarm, engine.fuelLevel]);

  // Real-time track conditions and pitlane crew communications (Every 1 minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackTemp(prev => {
        const delta = (Math.random() * 0.8 - 0.4);
        const nextTemp = parseFloat(Math.min(42, Math.max(18, prev + delta)).toFixed(1));
        return nextTemp;
      });
      setTrackGrip(prev => {
        const delta = (Math.random() * 0.6 - 0.1); 
        const nextGrip = parseFloat(Math.min(100, Math.max(80, prev + delta)).toFixed(1));
        return nextGrip;
      });
      
      const radioMessages = [
        "Estabilidade traseira excelente no miolo técnico, continue forçando!",
        "Chefe de Equipe: Ritmo de corrida excelente, Rafael! Mantendo constância impecável.",
        "BOX: Combustível e pneus sob controle. Planejamento de box mantido para volta 12.",
        "Temperatura da pista oscilou ligeiramente... aderência da borracha continua evoluindo.",
        "Setor 2 roxo! Curva parabólica tomada com precisão perfeita.",
        "Fique atento à temperatura dos pneus traseiros na aceleração de reta principal."
      ];
      const selectedMsg = radioMessages[Math.floor(Math.random() * radioMessages.length)];
      addAlarm(`📻 RÁDIO PITLANE: "${selectedMsg}"`);
    }, 60000);
    return () => clearInterval(interval);
  }, [addAlarm]);

  const updateSetup = (param: keyof VehicleSetup, value: any) => {
    setSetup(prev => {
      const next = { ...prev, [param]: value };
      addAlarm(`SETUP CONFIGURE: Modified ${String(param)} to [ ${value} ]`);
      return next;
    });
  };

  const clearAlarms = () => {
    setAlarms(['SYSTEM FLUSHED: Alarms cleared at engineering console.']);
  };

  return {
    activeTrackId,
    changeTrack,
    activeTab,
    setActiveTab,
    simSpeed,
    setSimSpeed,
    isPaused,
    setIsPaused,
    setup,
    updateSetup,
    telemetry,
    engine,
    tires,
    lapsList,
    currentLapNumber,
    currentLapTime,
    bestLapTimeSec,
    sectorTimes,
    chartHistory,
    alarms,
    addAlarm,
    clearAlarms,
    triggerPitstop,
    trackGrip,
    setTrackGrip,
    trackTemp,
    setTrackTemp,
  };
}
export type TelemetryHookResult = ReturnType<typeof useTelemetry>;
