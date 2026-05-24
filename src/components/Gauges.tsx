import React from 'react';
import { ShiftLightGroup } from './ShiftLights';

interface GaugesProps {
  speed: number;
  rpm: number;
  gear: number;
  delta: string;
  deltaValue: number;
  bestLap: string;
  oilPressure: number;
  oilTemp: number;
  waterTemp: number;
  fuelLevel: number;
  fuelLimit: number;
}

export default function Gauges({
  speed,
  rpm,
  gear,
  delta,
  deltaValue,
  bestLap,
  oilPressure,
  oilTemp,
  waterTemp,
  fuelLevel,
  fuelLimit
}: GaugesProps) {
  
  // RPM needle degrees conversion:
  const maxSimRpm = 9500;
  const rpmRatio = Math.min(1.0, Math.max(0.0, rpm / maxSimRpm));
  const pointerRotation = rpmRatio * 270 - 225;

  // Color logic for delta vs best lap:
  const isNegativeDelta = deltaValue < 0;
  const deltaColor = deltaValue === 0 
    ? 'text-slate-400' 
    : (isNegativeDelta ? 'text-[#2ebd59] drop-shadow-[0_0_8px_rgba(46,189,89,0.3)]' : 'text-[#e01931]');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 select-none" id="telemetry-gauges-grid">
      
      {/* 1. VELOCIDADE (SPEED) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-4 flex flex-col justify-between relative overflow-hidden h-36 backdrop-blur-md shadow-lg lg:col-span-1">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">VELOCIDADE</span>
          <span className="text-[9px] font-mono font-bold text-slate-500">km/h</span>
        </div>
        <div className="flex items-baseline justify-between mt-1 z-10 animate-pulse duration-1000">
          <span className="text-4xl font-extrabold tracking-tighter text-white font-sans">{speed}</span>
          <span className="text-[10px] font-mono font-bold text-slate-400">288 <span className="text-[7px] text-slate-500 font-bold">MÁX</span></span>
        </div>
        
        {/* Progress bar representing speed */}
        <div className="w-full bg-[#121c26] h-1.5 rounded-full overflow-hidden mt-3 border border-slate-900/40">
          <div 
            className="bg-gradient-to-r from-red-500 via-[#e01931] to-yellow-400 h-full rounded-full transition-all duration-75"
            style={{ width: `${(speed / 310) * 100}%` }}
          ></div>
        </div>
        <div className="absolute right-[-10px] bottom-[-15px] opacity-5 text-[64px] font-black italic select-none font-sans text-slate-600">KM</div>
      </div>

      {/* 2. CONSOLE CIRCUITO E RPM INTERATIVO */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-4 flex flex-col items-center justify-between h-36 backdrop-blur-md shadow-lg lg:col-span-2 relative">
        <div className="w-full flex justify-between items-start z-10 mb-[-10px]">
          <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">RPM MOTOR</span>
          <span className="text-[9px] font-mono text-slate-500 font-bold">1/min</span>
        </div>

        {/* Custom RPM gauge & gear representation stacked */}
        <div className="flex items-center justify-center gap-6 w-full h-[88px] mt-1 relative z-10">
          {/* Shift Light indicators integrated directly above */}
          <div className="absolute top-1 left-0 right-0 flex justify-center scale-95">
            <ShiftLightGroup rpm={rpm} />
          </div>

          {/* SVG Dial */}
          <div className="relative w-20 h-20 flex-shrink-0 mt-3">
            <svg viewBox="0 0 100 100" className="w-full h-full transform overflow-visible">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#121d28" strokeWidth="3" />
              <path 
                d="M 18.8 81.2 A 44 44 0 0 1 81.2 81.2" 
                fill="none" 
                stroke="#1c2b3a" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
              <path 
                d="M 18.8 81.2 A 44 44 0 0 1 81.2 81.2" 
                fill="none" 
                stroke={rpm > 8000 ? '#e01931' : '#2ebd59'} 
                strokeWidth="4" 
                strokeLinecap="round" 
                className="opacity-10" 
              />
              {/* Hard Redline Highlight arc */}
              <path 
                d="M 70.3 33.7 A 44 44 0 0 1 81.2 81.2" 
                fill="none" 
                stroke="#e01931" 
                strokeWidth="5" 
                strokeLinecap="butt" 
              />
              {/* Ticks on Dial */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((tick) => {
                const tickRatio = tick / 9.5;
                const angle = (tickRatio * 270 - 225) * (Math.PI / 180);
                const x1 = 50 + 38 * Math.cos(angle);
                const y1 = 50 + 38 * Math.sin(angle);
                const x2 = 50 + 44 * Math.cos(angle);
                const y2 = 50 + 44 * Math.sin(angle);
                
                const isRed = tick >= 8;
                return (
                  <line 
                    key={tick} 
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    stroke={isRed ? '#e01931' : '#456a8e'} 
                    strokeWidth={isRed ? '2' : '1.2'} 
                  />
                );
              })}
              
              {/* Centered Metal Pivot */}
              <circle cx="50" cy="50" r="10" fill="#080c10" stroke="#1d2f44" strokeWidth="2" />
              
              {/* Pointer Needle */}
              <line 
                x1="50" y1="50" 
                x2="50" y2="12" 
                stroke={rpm > 8000 ? '#e01931' : '#f5be1c'} 
                strokeWidth="2.5" 
                strokeLinecap="round"
                style={{ 
                  transformOrigin: '50px 50px',
                  transform: `rotate(${pointerRotation}deg)`
                }}
                className="transition-transform duration-75"
              />
              <circle cx="50" cy="50" r="4.5" className={rpm > 8200 ? 'fill-red-600' : 'fill-amber-400'} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1.5 pointer-events-none">
              <span className="text-[9px] font-mono font-black text-white">{rpm}</span>
            </div>
          </div>
          
          {/* GEAR INDICATOR */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <span className="text-[9px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">MARCHA</span>
            <div className={`w-14 h-14 bg-gradient-to-b from-[#1b2f44] to-[#070c12] border-2 rounded-md flex items-center justify-center shadow-lg relative overflow-hidden group transition-colors ${
              rpm > 8000 ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.35)]' : 'border-[#3c6187]/80'
            }`}>
              <span className={`text-4xl font-extrabold text-white font-mono leading-none ${rpm > 8200 ? 'text-[#e01931] animate-pulse' : ''}`}>
                {gear}
              </span>
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-[#e01931] scale-x-75"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DIFERENÇA DE TEMPO (DELTA VS BEST) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-4 flex flex-col justify-between h-36 backdrop-blur-md shadow-lg lg:col-span-1 relative">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">DELTA <span className="text-[8px] text-slate-500 font-bold lowercase">vs recorde</span></span>
        </div>
        
        <div className="flex flex-col mt-0.5 z-10">
          <span className={`text-2xl font-extrabold tracking-tight font-mono ${deltaColor}`}>
            {delta}s
          </span>
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-2 border-t border-[#1a2d42]/60 pt-2">
            <span className="text-slate-500">RECORDE:</span>
            <span className="font-extrabold text-white uppercase">{bestLap}</span>
          </div>
        </div>
        
        {/* Dynamic Micro Delta Chart */}
        <div className="w-full flex items-end gap-[2px] h-3 mt-1.5 opacity-60">
          {[4, 5, 7, 3, -2, -5, -8, -12, -9, -14, -18, -15].map((val, i) => {
            const h = Math.abs(val) * 0.4 + 2; 
            const isRedColor = val > 0;
            return (
              <div 
                key={i} 
                className={`flex-1 rounded-sm ${isRedColor ? 'bg-[#e01931]/60' : 'bg-[#2ebd59]/60'}`}
                style={{ height: `${h}px` }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* 4. PRESSÃO DO ÓLEO */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-4 flex flex-col justify-between h-36 backdrop-blur-md shadow-lg lg:col-span-1 relative">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">PRESSÃO ÓLEO</span>
          <span className="text-[9px] font-mono text-slate-500 font-bold">bar</span>
        </div>
        <div className="flex items-baseline justify-between mt-1 z-10">
          <span className="text-3xl font-black font-mono text-slate-200">
            {oilPressure.toFixed(1)}
          </span>
          <span className="text-[9px] font-mono text-slate-400">5.5 <span className="text-slate-500 font-bold">NOM</span></span>
        </div>
        
        {/* Segmented segment LED Bar for GT racing styling */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-[8px] font-mono text-slate-500">
            <span>0</span>
            <span>10</span>
          </div>
          <div className="flex gap-[3px] h-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
              const activeCount = Math.floor((oilPressure / 10) * 12);
              const isActive = i <= activeCount;
              let barColor = 'bg-[#121c26]';
              if (isActive) {
                if (i <= 2) barColor = 'bg-[#e01931] shadow-[0_0_6px_#e01931]';
                else if (i <= 10) barColor = 'bg-[#2ebd59]';
                else barColor = 'bg-[#e01931]';
              }
              return <div key={i} className={`flex-1 rounded-sm ${barColor} transition-colors duration-100`}></div>;
            })}
          </div>
        </div>
      </div>

      {/* 5. TEMPERATURA DO ÓLEO */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-4 flex flex-col justify-between h-36 backdrop-blur-md shadow-lg lg:col-span-1 relative">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">TEMP. ÓLEO</span>
          <span className="text-[9px] font-mono text-slate-500 font-bold">°C</span>
        </div>
        <div className="flex items-baseline justify-between mt-1 z-10">
          <span className={`text-3xl font-black font-mono ${oilTemp > 125 ? 'text-[#e01931] underline animate-pulse' : 'text-slate-200'}`}>
            {oilTemp}
          </span>
          <span className="text-[9px] font-mono text-slate-400">110 <span className="text-slate-500 font-bold">ALVO</span></span>
        </div>

        {/* LED strip */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-[8px] font-mono text-slate-500">
            <span>50</span>
            <span>150</span>
          </div>
          <div className="flex gap-[3px] h-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
              const rangePct = (oilTemp - 50) / 100;
              const activeCount = Math.floor(rangePct * 12);
              const isActive = i <= activeCount;
              
              let barColor = 'bg-[#121c26]';
              if (isActive) {
                if (oilTemp > 125 && i > 9) barColor = 'bg-[#e01931] shadow-[0_0_6px_#e01931]';
                else if (oilTemp < 90 && i < 4) barColor = 'bg-blue-400';
                else barColor = 'bg-[#2ebd59]';
              }
              return <div key={i} className={`flex-1 rounded-sm ${barColor} transition-colors duration-100`}></div>;
            })}
          </div>
        </div>
      </div>

      {/* 6. TEMPERATURA DA ÁGUA */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-4 flex flex-col justify-between h-36 backdrop-blur-md shadow-lg lg:col-span-1 relative">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">TEMP. ÁGUA</span>
          <span className="text-[9px] font-mono text-slate-500 font-bold">°C</span>
        </div>
        <div className="flex items-baseline justify-between mt-1 z-10">
          <span className={`text-3xl font-black font-mono ${waterTemp > 105 ? 'text-[#e01931] animate-pulse' : 'text-slate-200'}`}>
            {waterTemp}
          </span>
          <span className="text-[9px] font-mono text-slate-400">95 <span className="text-slate-500 font-bold">ALVO</span></span>
        </div>

        {/* LED strip */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-[8px] font-mono text-slate-500">
            <span>40</span>
            <span>120</span>
          </div>
          <div className="flex gap-[3px] h-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
              const rangePct = (waterTemp - 40) / 80;
              const activeCount = Math.floor(rangePct * 12);
              const isActive = i <= activeCount;
              
              let barColor = 'bg-[#121c26]';
              if (isActive) {
                if (waterTemp > 102 && i > 9) barColor = 'bg-[#e01931] animate-pulse shadow-[0_0_6px_#e01931]';
                else if (waterTemp < 80 && i < 5) barColor = 'bg-blue-400';
                else barColor = 'bg-[#2ebd59]';
              }
              return <div key={i} className={`flex-1 rounded-sm ${barColor} transition-colors duration-100`}></div>;
            })}
          </div>
        </div>
      </div>

      {/* 7. NÍVEL DE COMBUSTÍVEL */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-4 flex flex-col justify-between h-36 backdrop-blur-md shadow-lg lg:col-span-1 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase font-bold">NÍVEL COMB.</span>
          <span className="text-[9px] font-mono text-slate-500 font-bold">L</span>
        </div>
        <div className="flex items-baseline justify-between mt-1 z-10">
          <span className={`text-3xl font-black font-mono ${fuelLevel < 8.0 ? 'text-[#e01931] animate-pulse drop-shadow-[0_0_6px_#e01931]' : 'text-slate-200'}`}>
            {fuelLevel.toFixed(1)}
          </span>
          <span className="text-[8px] font-mono text-slate-400">80 <span className="text-slate-500 font-bold">MÁX</span></span>
        </div>

        {/* LED strip */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-[8px] font-mono text-slate-500">
            <span>0</span>
            <span>80</span>
          </div>
          <div className="flex gap-[3px] h-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
              const activeCount = Math.floor((fuelLevel / fuelLimit) * 12);
              const isActive = i <= activeCount;
              
              let barColor = 'bg-[#121c26]';
              if (isActive) {
                if (fuelLevel < 8.0) barColor = 'bg-[#e01931] shadow-[0_0_5px_#e01931]';
                else if (fuelLevel < 18.0) barColor = 'bg-yellow-400';
                else barColor = 'bg-amber-500';
              }
              return <div key={i} className={`flex-1 rounded-sm ${barColor} transition-colors duration-100`}></div>;
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
