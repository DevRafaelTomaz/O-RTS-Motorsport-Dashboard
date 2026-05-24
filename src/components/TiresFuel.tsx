import React from 'react';
import { 
  Flame, 
  Battery, 
  TrendingDown, 
  Disc, 
  Activity, 
  Fuel, 
  Zap 
} from 'lucide-react';
import { TireState, EngineStatus } from '../types';

interface TiresFuelProps {
  tires: TireState;
  engine: EngineStatus;
}

export default function TiresFuel({ tires, engine }: TiresFuelProps) {
  
  // Local high-precision AJUSTE FR (Front Axle Adjustments)
  const [frontCamber, setFrontCamber] = React.useState<number>(-3.0); // degrees (camber range -4.5 to -1.5)
  const [frontTargetPress, setFrontTargetPress] = React.useState<number>(2.10); // bar target

  // Local high-precision AJUSTE RR (Rear Axle Adjustments)
  const [rearCamber, setRearCamber] = React.useState<number>(-2.2); // degrees (camber range -3.5 to -1.0)
  const [rearTargetPress, setRearTargetPress] = React.useState<number>(2.00); // bar target

  // Custom helper function to calculate color gradient class based on tire temp
  const getTempColorClass = (temp: number) => {
    if (temp < 80) return 'from-blue-600 via-blue-500 to-indigo-500 text-blue-200'; // Cold
    if (temp <= 105) return 'from-emerald-600 via-emerald-500 to-teal-400 text-emerald-100'; // Ideal
    return 'from-red-600 via-orange-500 to-yellow-500 text-red-100 animate-pulse'; // Hot
  };

  // Convert pressure level bar colors
  const getPressureColor = (press: number) => {
    if (press < 1.9) return 'text-sky-400';
    if (press > 2.3) return 'text-red-500';
    return 'text-[#2ebd59]';
  };

  const renderTireCard = (
    label: string, 
    tempData: { inner: number; middle: number; outer: number }, 
    wear: number, 
    pressure: number,
    positionClass: string
  ) => {
    const innerColor = getTempColorClass(tempData.inner);
    const middleColor = getTempColorClass(tempData.middle);
    const outerColor = getTempColorClass(tempData.outer);

    const wearProgressClass = wear < 40 ? 'bg-[#e01931]' : wear < 60 ? 'bg-yellow-400' : 'bg-[#2ebd59]';

    return (
      <div className={`bg-[#0d1620]/80 border border-[#1a2d42]/80 rounded p-3 space-y-2 select-none relative ${positionClass} max-w-[150px] md:max-w-[130px] shadow-lg`}>
        {/* Header with Title and Pressure */}
        <div className="flex justify-between items-center border-b border-[#1a2d42]/40 pb-1.5">
          <span className="text-[10px] font-black text-white font-mono tracking-wider">{label}</span>
          <span className={`text-[10px] font-mono font-bold ${getPressureColor(pressure)}`}>
            {pressure.toFixed(2)} <span className="text-[7px] text-slate-500 font-bold">bar</span>
          </span>
        </div>

        {/* Heatmap vertical blocks depicting Contact Patch (Inner, Middle, Outer) */}
        <div className="flex h-16 gap-[3px] bg-black/40 p-1.5 rounded relative border border-[#1a2d42]/30 overflow-hidden">
          {/* Outer Segment */}
          <div className="flex-1 flex flex-col justify-between py-1 relative">
            <div className={`absolute inset-0 bg-gradient-to-b ${outerColor} rounded-sm opacity-80`} />
            <div className="z-10 text-[8px] font-mono font-black text-center w-full leading-none text-white drop-shadow">E</div>
            <div className="z-10 text-[9px] font-mono font-bold text-center w-full leading-none text-white drop-shadow mt-auto">{tempData.outer}°</div>
          </div>
          {/* Middle Segment */}
          <div className="flex-1 flex flex-col justify-between py-1 relative">
            <div className={`absolute inset-0 bg-gradient-to-b ${middleColor} rounded-sm opacity-85`} />
            <div className="z-10 text-[8px] font-mono font-black text-center w-full leading-none text-white drop-shadow">M</div>
            <div className="z-10 text-[10px] font-mono font-black text-center w-full leading-none text-white drop-shadow mt-auto">{tempData.middle}°</div>
          </div>
          {/* Inner Segment */}
          <div className="flex-1 flex flex-col justify-between py-1 relative">
            <div className={`absolute inset-0 bg-gradient-to-b ${innerColor} rounded-sm opacity-80`} />
            <div className="z-10 text-[8px] font-mono font-black text-center w-full leading-none text-white drop-shadow">I</div>
            <div className="z-10 text-[9px] font-mono font-bold text-center w-full leading-none text-white drop-shadow mt-auto">{tempData.inner}°</div>
          </div>
        </div>

        {/* Wear progress indicator block (DYNAMIC CORRECTION) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 text-right">
            <span>DESGASTE:</span>
            <span className="font-extrabold text-slate-300">{wear.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${wearProgressClass}`} 
              style={{ width: `${wear}%` }} 
            />
          </div>
        </div>
      </div>
    );
  };

  // Live Formula-1 Level Camber Heat & Pressures Drift Synthesis
  const camberDiffF = frontCamber - (-3.0);
  const adjustedTemps = {
    tempFL: {
      inner: Math.min(145, Math.max(60, tires.tempFL.inner + Math.round(-camberDiffF * 14))),
      middle: Math.min(145, Math.max(60, tires.tempFL.middle + Math.round(Math.abs(camberDiffF) * 4))),
      outer: Math.min(145, Math.max(60, tires.tempFL.outer + Math.round(camberDiffF * 14))),
    },
    tempFR: {
      inner: Math.min(145, Math.max(60, tires.tempFR.inner + Math.round(-camberDiffF * 14))),
      middle: Math.min(145, Math.max(60, tires.tempFR.middle + Math.round(Math.abs(camberDiffF) * 4))),
      outer: Math.min(145, Math.max(60, tires.tempFR.outer + Math.round(camberDiffF * 14))),
    },
    tempRL: {
      inner: Math.min(145, Math.max(60, tires.tempRL.inner + Math.round(-(rearCamber - (-2.2)) * 12))),
      middle: Math.min(145, Math.max(60, tires.tempRL.middle + Math.round(Math.abs(rearCamber - (-2.2)) * 3))),
      outer: Math.min(145, Math.max(60, tires.tempRL.outer + Math.round((rearCamber - (-2.2)) * 12))),
    },
    tempRR: {
      inner: Math.min(145, Math.max(60, tires.tempRR.inner + Math.round(-(rearCamber - (-2.2)) * 12))),
      middle: Math.min(145, Math.max(60, tires.tempRR.middle + Math.round(Math.abs(rearCamber - (-2.2)) * 3))),
      outer: Math.min(145, Math.max(60, tires.tempRR.outer + Math.round((rearCamber - (-2.2)) * 12))),
    }
  };

  // Scaled live tire pressures based on interactive targets set by setup pilot
  const adjustedPressures = {
    FL: Number((tires.pressureFL + (frontTargetPress - 2.10)).toFixed(2)),
    FR: Number((tires.pressureFR + (frontTargetPress - 2.10)).toFixed(2)),
    RL: Number((tires.pressureRL + (rearTargetPress - 2.00)).toFixed(2)),
    RR: Number((tires.pressureRR + (rearTargetPress - 2.00)).toFixed(2)),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="tire-diagnostics-layout">
      
      {/* 1. TIRE HEATMAP CHASSIS SCHEMATIC (COL SPAN 8) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between min-h-[480px] lg:min-h-[420px] h-auto backdrop-blur-md shadow-lg lg:col-span-8 relative overflow-hidden" id="tire-schematic-card">
        
        {/* Header detailed */}
        <div className="flex justify-between items-center border-b border-[#1a2d42]/60 pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#e01931]" id="tire-panel-icon" />
            <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase font-sans">MAPA TÉRMICO E CONTATO DOS PNEUS</h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-[#121c26] border border-[#1a2d42] px-2.5 py-1 rounded text-[9px] font-mono font-extrabold text-[#2ebd59] uppercase tracking-widest">
            <Activity className="w-3 h-3 text-[#2ebd59]" />
            AJUSTE DE ALINHAMENTO ATIVO
          </div>
        </div>

        {/* Birdseye Chassis Illustration Frame & Abs positions */}
        <div className="flex-grow w-full flex items-center justify-center relative my-1 select-none">
          
          {/* Beautiful SVG Birdseye Schematic of the sports GT3 RS layout */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none opacity-20 select-none max-w-sm mx-auto">
            <svg viewBox="0 0 160 300" className="w-[170px] h-full stroke-indigo-500/40 stroke-1 fill-none filter drop-shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <path d="M 10 260 L 150 260 M 20 260 L 20 282 M 140 260 L 140 282 M 15 280 L 145 280" />
              <rect x="25" y="40" width="110" height="200" rx="36" />
              <line x1="80" y1="20" x2="80" y2="280" strokeDasharray="3 3" />
              <path d="M 40 30 L 120 30 M 35 34 C 45 10, 115 10, 125 34 Z" />
              <circle cx="80" cy="140" r="28" />
              <line x1="20" y1="65" x2="140" y2="65" />
              <line x1="15" y1="220" x2="145" y2="220" />
              <rect x="52" y="210" width="56" height="36" rx="4" className="stroke-red-500/30" />
            </svg>
          </div>

          {/* Fully Responsive structural layout: 2x2 grid on mobile/tablet, accurate absolute layout on md/desktop */}
          <div className="grid grid-cols-2 gap-3 w-full md:block md:relative min-h-[170px] h-full items-center justify-items-center">
            {/* FL Tire */}
            {renderTireCard('FR ESQ (FL)', adjustedTemps.tempFL, tires.wearFL, adjustedPressures.FL, 'md:absolute md:top-2 md:left-[10%] w-full')}
            
            {/* FR Tire */}
            {renderTireCard('FR DIR (FR)', adjustedTemps.tempFR, tires.wearFR, adjustedPressures.FR, 'md:absolute md:top-2 md:right-[10%] w-full')}

            {/* RL Tire */}
            {renderTireCard('RR ESQ (RL)', adjustedTemps.tempRL, tires.wearRL, adjustedPressures.RL, 'md:absolute md:bottom-2 md:left-[10%] w-full')}
            
            {/* RR Tire */}
            {renderTireCard('RR DIR (RR)', adjustedTemps.tempRR, tires.wearRR, adjustedPressures.RR, 'md:absolute md:bottom-2 md:right-[10%] w-full')}
          </div>

        </div>

        {/* SEÇÃO INTEGRADA DE AJUSTE DOS EIXOS: FR (FRENTE) & RR (TRASEIRA) */}
        <div className="mt-3 pt-3 border-t border-[#1a2d42]/60 grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/40 p-3 rounded-lg border border-[#1a2d42]/30">
          
          {/* Eixo Dianteiro Settings Control (FR) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center border-b border-[#1a2d42]/30 pb-1">
              <span className="text-[9px] font-black text-[#00f0ff] font-mono tracking-wider">▲ CONTROLE EIXO DIANTEIRO (FR)</span>
              <span className="text-[8px] text-slate-500 font-mono">Setup Divergente</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[8px] font-mono">
              <div className="bg-black/30 border border-[#1a2d42]/30 p-1.5 rounded flex flex-col justify-between">
                <span className="text-slate-400">CAMBER DIANTEIRO:</span>
                <div className="flex items-center justify-between mt-1">
                  <button 
                    onClick={() => setFrontCamber(prev => Math.max(-4.5, Number((prev - 0.1).toFixed(1))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-[#e01931] hover:border-transparent text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-[#00f0ff] text-[9px]">{frontCamber.toFixed(1)}°</span>
                  <button 
                    onClick={() => setFrontCamber(prev => Math.min(-1.5, Number((prev + 0.1).toFixed(1))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-[#2ebd59] hover:border-transparent text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-black/30 border border-[#1a2d42]/30 p-1.5 rounded flex flex-col justify-between">
                <span className="text-slate-400">ALVO DE PRESSÃO:</span>
                <div className="flex items-center justify-between mt-1">
                  <button 
                    onClick={() => setFrontTargetPress(prev => Math.max(1.80, Number((prev - 0.05).toFixed(2))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-slate-700 text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-white text-[9px]">{frontTargetPress.toFixed(2)}b</span>
                  <button 
                    onClick={() => setFrontTargetPress(prev => Math.min(2.50, Number((prev + 0.05).toFixed(2))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-slate-700 text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Eixo Traseiro Settings Control (RR) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center border-b border-[#1a2d42]/30 pb-1">
              <span className="text-[9px] font-black text-amber-500 font-mono tracking-wider">▼ CONTROLE EIXO TRASEIRO (RR)</span>
              <span className="text-[8px] text-slate-500 font-mono">Diferencial Travado</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[8px] font-mono">
              <div className="bg-black/30 border border-[#1a2d42]/30 p-1.5 rounded flex flex-col justify-between">
                <span className="text-slate-400">CAMBER TRASEIRO:</span>
                <div className="flex items-center justify-between mt-1">
                  <button 
                    onClick={() => setRearCamber(prev => Math.max(-3.5, Number((prev - 0.1).toFixed(1))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-[#e01931] hover:border-transparent text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-amber-400 text-[9px]">{rearCamber.toFixed(1)}°</span>
                  <button 
                    onClick={() => setRearCamber(prev => Math.min(-1.0, Number((prev + 0.1).toFixed(1))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-[#2ebd59] hover:border-transparent text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-black/30 border border-[#1a2d42]/30 p-1.5 rounded flex flex-col justify-between">
                <span className="text-slate-400">ALVO DE PRESSÃO:</span>
                <div className="flex items-center justify-between mt-1">
                  <button 
                    onClick={() => setRearTargetPress(prev => Math.max(1.80, Number((prev - 0.05).toFixed(2))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-slate-700 text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-white text-[9px]">{rearTargetPress.toFixed(2)}b</span>
                  <button 
                    onClick={() => setRearTargetPress(prev => Math.min(2.50, Number((prev + 0.05).toFixed(2))))}
                    className="w-4 h-4 bg-[#1a2d42]/60 border border-slate-700 hover:bg-slate-700 text-white rounded font-bold flex items-center justify-center transition-colors select-none text-[8px]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer color key */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[8px] sm:text-[9px] font-mono text-slate-500 border-t border-[#1a2d42]/40 pt-2 gap-1 mt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center gap-1"><span className="w-2 h-1 rounded-sm bg-blue-600"></span> FRIO (&lt;80 °C)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-1 rounded-sm bg-emerald-500"></span> IDEAL (80-105 °C)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-1 rounded-sm bg-red-600"></span> QUENTE (&gt;105 °C)</span>
          </div>
          <span>COEFICIENTE DE ATRITO: <span className="text-white font-bold">1.25 FX</span></span>
        </div>

      </div>

      {/* 2. FUEL & ENERGY STORAGE TELEMETRY (COL SPAN 4) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-[380px] backdrop-blur-md shadow-lg lg:col-span-4" id="energy-management-card">
        
        {/* Header detailed */}
        <div className="flex justify-between items-center border-b border-[#1a2d42]/60 pb-3">
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-[#e01931]" id="energy-panel-icon" />
            <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase">COMBUSTÍVEL E GERENCIAMENTO DE ENERGIA</h2>
          </div>
          <span className="text-[10px] font-mono text-[#00f0ff] font-bold">911_KERS</span>
        </div>

        {/* Battery & Fuel core progress columns */}
        <div className="flex-grow my-4 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* 1. Fuel Tank progress */}
          <div className="space-y-2 bg-black/40 border border-[#1a2d42]/30 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                QUANTIDADE DE GASOLINA (LITROS)
              </span>
              <span className={`text-xs font-mono font-black ${engine.fuelLevel < 8.0 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
                {engine.fuelLevel.toFixed(2)}L
              </span>
            </div>
            
            <div className="w-full bg-[#121c26] h-2.5 rounded-full overflow-hidden border border-slate-950/40 relative">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${engine.fuelLevel < 8.0 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
                style={{ width: `${(engine.fuelLevel / engine.fuelLimit) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
              <span>0.0 L (RESERVA EXTREMA)</span>
              <span>80.0 L (TANQUE CHEIO)</span>
            </div>
          </div>

          {/* 2. Hybrid battery cell quantity */}
          <div className="space-y-2 bg-black/40 border border-[#1a2d42]/30 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
                CARGA DA BATERIA HÍBRIDA (ERS)
              </span>
              <span className="text-xs font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                {engine.batteryCharge}%
              </span>
            </div>
            
            <div className="w-full bg-[#121c26] h-2.5 rounded-full overflow-hidden border border-slate-950/40 relative">
              <div 
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#10b981]"
                style={{ width: `${engine.batteryCharge}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
              <span>0% ESGOTADO</span>
              <span>100% RECARREGADA</span>
            </div>
          </div>

          {/* 3. ERS Deploy Level & mode selectors */}
          <div className="space-y-2.5 bg-black/40 border border-[#1a2d42]/30 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                SISTEMA DE RECUPERAÇÃO DE ENERGIA (KERS)
              </span>
              <span className="text-[9px] font-mono bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 px-2 rounded font-black uppercase">
                Estágio Ch3
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-slate-500">NÍVEL:</span>
              <div className="flex gap-[4px] flex-grow h-3">
                {[1, 2, 3, 4, 5].map((i) => {
                  const isActive = i <= engine.ersDeploy;
                  let colorClass = 'bg-[#121c26]';
                  if (isActive) {
                    if (engine.ersDeploy <= 2) colorClass = 'bg-blue-600 shadow-[0_0_4px_#3b82f6]';
                    else if (engine.ersDeploy <= 4) colorClass = 'bg-indigo-500 shadow-[0_0_6px_#6366f1]';
                    else colorClass = 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]';
                  }
                  return <div key={i} className={`flex-1 rounded-sm ${colorClass} transition-all duration-200`}></div>;
                })}
              </div>
              <span className="text-[10px] font-mono font-black text-indigo-400">FASE {engine.ersDeploy}</span>
            </div>
          </div>

        </div>

        {/* ERS live usage spec diagnostic */}
        <div className="bg-black/50 border border-dashed border-[#1a2d42] rounded p-2 flex justify-between items-center text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-sky-400" />
            <span>CONSUMO MÉDIO: 2.45 L/volta</span>
          </div>
          <span>AUTONOMIA ESTIMADA: <span className="text-white font-bold">{(engine.fuelLevel / 2.45).toFixed(1)} VOLTAS</span></span>
        </div>

      </div>

    </div>
  );
}
