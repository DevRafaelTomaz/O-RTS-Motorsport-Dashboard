import React from 'react';
import { Map, Trophy, CircleDot, ChevronRight, Activity, Zap } from 'lucide-react';
import { LapDetails, TrackSectorTimes } from '../types';
import { getTrackTelemetryAtProgress, getTrackSvgPath, getSectorSvgPaths } from '../utils/trackData';
import { motion, AnimatePresence } from 'motion/react';

interface TrackLapsProps {
  lapProgress: number;
  currentSector: number;
  lapsList: LapDetails[];
  sectorTimes: TrackSectorTimes;
  bestLap: string;
  trackId?: string;
  onChangeTrack?: (trackId: string) => void;
}

export default function TrackLaps({ 
  lapProgress, 
  currentSector, 
  lapsList, 
  sectorTimes,
  bestLap,
  trackId = 'redbullring',
  onChangeTrack
}: TrackLapsProps) {
  
  // Calculate raw live coordinates of the car around the dynamically selected circuit
  const activePosition = getTrackTelemetryAtProgress(lapProgress, trackId);

  const getSectorColor = (num: number) => {
    if (num === 1) return 'stroke-indigo-400 text-indigo-400';
    if (num === 2) return 'stroke-emerald-400 text-emerald-400';
    return 'stroke-red-500 text-red-500';
  };

  const getStatusColor = (status: LapDetails['status']) => {
    switch (status) {
      case 'PURPLE': return 'text-[#9d4edd] font-extrabold drop-shadow-[0_0_6px_#9d4edd]';
      case 'GREEN': return 'text-[#2ebd59] font-bold';
      case 'YELLOW': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const getCompoundBadge = (cmp: LapDetails['compound']) => {
    switch (cmp) {
      case 'SS': return 'bg-purple-950/50 border border-purple-500 text-purple-300';
      case 'S': return 'bg-red-950/40 border border-red-500 text-red-400';
      case 'M': return 'bg-yellow-950/40 border border-yellow-500 text-yellow-300';
      default: return 'bg-slate-900 border border-slate-700 text-slate-300';
    }
  };

  // Sector lines generator
  const sectorPaths = getSectorSvgPaths(trackId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="track-analysis-layout">
      
      {/* 1. SECTOR COMPARISON GRAPH & LIVE MAP (COL SPAN 7) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-[410px] backdrop-blur-md shadow-lg lg:col-span-7 relative overflow-hidden" id="live-map-card">
        
        {/* Header telemetry details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1a2d42]/60 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-[#e01931]" id="live-map-icon" />
            <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase">POSIÇÃO EM TEMPO REAL & EVOLUÇÃO DE PISTA</h2>
          </div>
          <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded border border-[#1a2d42] shadow-inner">
            <span className="text-[8px] font-mono font-bold text-slate-400">CIRCUITO:</span>
            <select
              value={trackId}
              onChange={(e) => onChangeTrack?.(e.target.value)}
              className="bg-transparent outline-none text-[#00f0ff] font-mono text-[10px] font-black uppercase cursor-pointer"
            >
              <option value="redbullring">RED BULL RING (AT)</option>
              <option value="interlagos">INTERLAGOS (BR)</option>
              <option value="monaco">MONACO (MC)</option>
              <option value="spa">SPA-FRANCORCHAMPS (BE)</option>
            </select>
          </div>
        </div>

        {/* Map Grid Content Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 py-4 min-h-0">
          
          {/* Left panel of grid: The SVG circuit outline with tracking marker (Col span 5) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative bg-black/25 rounded border border-[#1a2d42]/30 p-2 overflow-hidden">
            
            <svg viewBox="10 0 380 240" className="w-full h-full transform translate-y-2 select-none pointer-events-none">
              
              {/* Thick dark underlying track shadow */}
              <path 
                d={getTrackSvgPath(trackId)} 
                fill="none" 
                stroke="#12181f" 
                strokeWidth="11" 
                strokeLinecap="round" 
              />
              
              {/* Circuit segments divided by sectors (color tracks) */}
              {sectorPaths.map((sec) => {
                let color = '#334155'; // default grey
                if (sec.sector === 1) color = '#312e8160'; 
                else if (sec.sector === 2) color = '#064e3b50';
                else color = '#7f1d1d50';
                return (
                   <path 
                    key={sec.sector}
                    d={sec.d} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                  />
                );
              })}

              {/* Glowing thin active circuit centerlines */}
              <path 
                d={getTrackSvgPath(trackId)} 
                fill="none" 
                stroke="#1e3247" 
                strokeWidth="2" 
                strokeLinejoin="round"
                strokeLinecap="round" 
              />
              
              {/* Section indicators text */}
              <text x="240" y="70" fill="#4f46e5" className="text-[10px] font-mono font-black" opacity="0.8">S1</text>
              <text x="320" y="140" fill="#10b981" className="text-[10px] font-mono font-black" opacity="0.8">S2</text>
              <text x="80" y="140" fill="#ef4444" className="text-[10px] font-mono font-black" opacity="0.8">S3</text>

              {/* Start-Finish gate checkered flag line */}
              <g className="text-white opacity-40">
                <line x1="140" y1="210" x2="140" y2="230" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" />
              </g>

              {/* LIVE VEHICLE BLINKING RADAR DOT MAP LOCATOR */}
              <g>
                {/* Secondary larger pulsing radar wave halo */}
                <circle 
                  cx={activePosition.x} 
                  cy={activePosition.y} 
                  r="8" 
                  fill="#e01931" 
                  className="animate-ping opacity-40" 
                />
                
                {/* Core blinking point */}
                <circle 
                  cx={activePosition.x} 
                  cy={activePosition.y} 
                  r="4.5" 
                  fill="#e01931" 
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  className="shadow-2xl" 
                />
              </g>

            </svg>
            
            {/* Ambient telemetry indicators overlayed */}
            <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-center text-[8px] font-mono text-slate-500">
              <span className="truncate">LOCALIZADOR: X={Math.round(activePosition.x)} Y={Math.round(activePosition.y)}</span>
              <span>PROGRESSO: {Math.round(lapProgress * 100)}% DETECTADO</span>
            </div>
          </div>

          {/* Right panel of grid: Sector Timings comparative diagnostics (Col span 7) */}
          <div className="md:col-span-7 flex flex-col justify-between bg-black/45 border border-[#1a2d42]/40 rounded p-4.5 space-y-3 font-mono text-xs">
            
            {/* Headers row */}
            <div className="grid grid-cols-5 text-[10px] font-bold text-slate-400 border-b border-[#1a2d42]/60 pb-2 uppercase tracking-wide">
              <span className="col-span-2">PARCIAIS DO CIRCUITO</span>
              <span className="text-right">S1</span>
              <span className="text-right">S2</span>
              <span className="text-right">S3</span>
            </div>

            {/* Timings row 1: Personal Bests matching user requirements */}
            <div className="grid grid-cols-5 text-slate-300 border-b border-[#1a2d42]/30 py-1.5 hover:bg-white/5 p-1 rounded transition-colors duration-200">
              <span className="col-span-2 font-bold flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-yellow-500" /> RECORDE ATUAL</span>
              <span className="text-right font-black text-indigo-400">23.976s</span>
              <span className="text-right font-black text-emerald-400">36.124s</span>
              <span className="text-right font-black text-red-500">16.134s</span>
            </div>

            {/* Timings row 2: Optimal theoretical lap summing the best sectors together */}
            <div className="grid grid-cols-5 text-slate-300 border-b border-[#1a2d42]/30 py-1.5 bg-[#121c26]/20 p-1 rounded hover:bg-[#121c26]/40 transition-colors duration-200">
              <span className="col-span-2 font-black flex items-center gap-1.5 text-cyan-400"><Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> VOLTA TEÓRICA</span>
              <span className="text-right text-[#00f0ff] font-bold animate-[pulse_1.5s_infinite]">31.559s</span>
              <span className="text-right text-[#00f0ff] font-bold animate-[pulse_1.5s_infinite]">41.711s</span>
              <span className="text-right text-[#00f0ff] font-bold animate-[pulse_1.5s_infinite]">16.103s</span>
            </div>

            {/* Timings row 3: Active current run */}
            <div className="grid grid-cols-5 text-slate-300 py-1.5 bg-[#e01931]/5 p-1 rounded border border-[#e01931]/10 hover:bg-[#e01931]/10 transition-colors duration-200">
              <span className="col-span-2 font-bold flex items-center gap-1.5"><ChevronRight className="w-3.5 h-3.5 text-[#e01931] animate-[bounce_1s_infinite]" /> VOLTA ATUAL</span>
              <span className={`text-right font-black ${currentSector === 1 ? 'text-[#00f0ff] animate-pulse' : 'text-slate-400'}`}>
                {currentSector === 1 ? (sectorTimes.currentS1 > 0 ? `${sectorTimes.currentS1.toFixed(3)}s` : '33.091s') : (lapsList[0]?.sectors.s1 ? `${lapsList[0]?.sectors.s1.toFixed(3)}s` : '33.091s')}
              </span>
              <span className={`text-right font-black ${currentSector === 2 ? 'text-[#00f0ff] animate-pulse' : 'text-slate-400'}`}>
                {currentSector === 2 ? (sectorTimes.currentS2 > 0 ? `${sectorTimes.currentS2.toFixed(3)}s` : '36.160s') : (lapsList[0]?.sectors.s2 ? `${lapsList[0]?.sectors.s2.toFixed(3)}s` : '36.160s')}
              </span>
              <span className="text-right text-[#00f0ff] font-black">
                {currentSector === 3 ? (sectorTimes.currentS3 > 0 ? `${sectorTimes.currentS3.toFixed(3)}s` : '16.103s') : (lapsList[0]?.sectors.s3 ? `${lapsList[0]?.sectors.s3.toFixed(3)}s` : '---')}
              </span>
            </div>

            {/* Theoretical summation of optimal calculations */}
            <div className="mt-2 bg-black/60 p-2.5 rounded border border-indigo-500/30 flex justify-between items-center text-[11px] hover:border-indigo-500/60 transition-colors">
              <span className="font-bold text-slate-400 uppercase tracking-wide">TEMPO DE VOLTA TEÓRICA ESPERADA (SUM):</span>
              <span className="font-extrabold text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">1:29.373s</span>
            </div>

          </div>

        </div>

        {/* Live track grip evolution */}
        <div className="bg-black/50 border border-dashed border-[#1a2d42] rounded p-2.5 flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>ADERÊNCIA DO CIRCUITO: <span className="text-emerald-400 font-bold">EVOLUINDO COM BORRACHA DE PISTA</span></span>
          <span>RECORD VOLTA COMPARATIVO: <span className="text-white font-extrabold">{bestLap}</span></span>
        </div>

      </div>

      {/* 2. LAP HISTORY DATABASE GRID TABLE (COL SPAN 5) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-[410px] backdrop-blur-md shadow-lg lg:col-span-5" id="laps-table-card">
        
        {/* Header detailed */}
        <div className="flex justify-between items-center border-b border-[#1a2d42]/60 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#e01931]" id="laps-table-icon" />
            <h2 className="text-xs font-black tracking-[0.25em] text-white uppercase">HISTÓRICO COMPLETO DE VOLTAS</h2>
          </div>
          <span className="text-[10px] font-mono text-[#2ebd59] font-bold uppercase">{lapsList.length} VOLTAS GRAVADAS</span>
        </div>

        {/* Database List scroll section */}
        <div className="flex-grow my-4 overflow-y-auto custom-scrollbar border border-[#1a2d42]/50 rounded bg-black/20" id="laps-table-scroll-container">
          <table className="w-full text-left font-mono text-xs select-none border-collapse">
            <thead>
              <tr className="bg-[#121c26] text-slate-400 border-b border-[#1a2d42] text-[9px] uppercase tracking-wider font-extrabold">
                <th className="p-3">VOLTA</th>
                <th className="p-3 text-right font-mono">TEMPO</th>
                <th className="p-3 text-right">DIFERENÇA</th>
                <th className="p-3 text-center">PNEU</th>
                <th className="p-3 text-right">PART SECTORS (S1/S2/S3)</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#1a2d42]/40 text-slate-300">
              <AnimatePresence initial={false}>
                {lapsList.map((lap) => {
                  const isQuickest = lap.lapTime === bestLap;
                  const customRowId = `lap-animated-row-${lap.lapNumber}`;
                  return (
                    <motion.tr 
                      key={lap.lapNumber} 
                      id={customRowId}
                      initial={{ opacity: 0, x: -15, scaleY: 0.8 }}
                      animate={{ opacity: 1, x: 0, scaleY: 1 }}
                      exit={{ opacity: 0, x: 20, scaleY: 0.8 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className={`hover:bg-[#1a2d42]/20 transition-all ${isQuickest ? 'bg-[#9d4edd]/5 border-l-2 border-[#9d4edd] shadow-[0_0_8px_rgba(157,78,221,0.1)]' : ''}`}
                    >
                      <td className="p-3 font-bold">{lap.lapNumber}</td>
                      <td className={`p-3 text-right font-black ${isQuickest ? 'text-[#9d4edd]' : 'text-slate-100'}`}>
                        {lap.lapTime}
                      </td>
                      <td className={`p-3 text-right font-bold ${getStatusColor(lap.status)}`}>
                        {lap.delta}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${getCompoundBadge(lap.compound)}`}>
                          {lap.compound}
                        </span>
                      </td>
                      <td className="p-3 text-right text-[10px] text-slate-500 font-medium whitespace-nowrap">
                        {lap.sectors.s1.toFixed(2)}s / {lap.sectors.s2.toFixed(2)}s / {lap.sectors.s3.toFixed(2)}s
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Legend metrics */}
        <div className="bg-black/50 border border-dashed border-[#1a2d42]/60 rounded p-2 flex justify-between items-center text-[9px] font-mono text-slate-400 leading-none">
          <div className="flex gap-2">
            <span className="text-[#9d4edd] font-bold">■ Roxo (Recorde Geral)</span>
            <span className="text-[#2ebd59] font-bold">■ Verde (Melhor Volta)</span>
          </div>
          <span className="text-slate-500 font-bold uppercase text-[8px]">Ref. recorde: 1:29.685</span>
        </div>

      </div>

    </div>
  );
}
