import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Radio, Signal, Thermometer, Volume2, VolumeX, Music, Zap } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface HeaderProps {
  trackTemp: number;
  trackName?: string;
}

export default function Header({ trackTemp, trackName = "RED BULL RING" }: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [ping, setPing] = useState<number>(12);
  
  // Real-time audio active states
  const [isMusicActive, setIsMusicActive] = useState<boolean>(audioSystem.getIsMusicActive());
  const [musicStyle, setMusicStyle] = useState<'synthwave' | 'techno' | 'cyberpunk' | 'brazilian-bass'>(audioSystem.getMusicStyle() as any);

  // Fluctuations on ping
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.min(20, Math.max(8, next));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Live Clock (Local Time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour12: false }));
      setDateStr(now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMusic = () => {
    if (isMusicActive) {
      audioSystem.stopMusic();
      setIsMusicActive(false);
    } else {
      audioSystem.playMusic();
      setIsMusicActive(true);
    }
  };

  const handleCycleMusicStyle = () => {
    const styles: ('synthwave' | 'techno' | 'cyberpunk' | 'brazilian-bass')[] = ['synthwave', 'techno', 'cyberpunk', 'brazilian-bass'];
    const nextIdx = (styles.indexOf(musicStyle) + 1) % styles.length;
    const nextStyle = styles[nextIdx];
    audioSystem.setMusicStyle(nextStyle);
    setMusicStyle(nextStyle);
    
    // Auto-restart if music is playing to cycle nodes instantly
    if (isMusicActive) {
      audioSystem.stopMusic();
      audioSystem.playMusic();
    }
  };

  return (
    <header 
      className="bg-black/95 border-b border-[#1a2d42] px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-white font-mono shrink-0 select-none backdrop-blur-md" 
      id="telemetry-header"
      role="banner"
    >
      {/* Session Title & Circuit Info */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 tracking-wider uppercase">SESSÃO</span>
            <span className="text-xs font-black text-white tracking-widest font-sans uppercase">CLASSIFICATÓRIA</span>
          </div>
          
          <div className="h-6 w-[1px] bg-[#1a2d42]"></div>
          
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 tracking-wider uppercase">CIRCUITO</span>
            <span className="text-xs font-black text-[#f3b313] tracking-widest font-sans uppercase">{trackName}</span>
          </div>
        </div>

        {/* Stream Live status badge on mobile */}
        <div className="flex md:hidden items-center gap-2 bg-red-950/40 border border-red-500/30 px-2.5 py-0.5 rounded">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e01931]"></span>
          </span>
          <span className="text-[9px] font-black text-red-400 tracking-widest">AO VIVO</span>
        </div>
      </div>

      {/* MULTIMEDIA CONTROLS - Web Audio Synth Cockpit player */}
      <div 
        className="flex items-center gap-3 bg-[#0d151f] border border-[#233a52] px-4 py-1.5 rounded-lg shadow-[0_0_12px_rgba(35,58,82,0.4)]"
        id="cockpit-multimedia-hub"
        aria-label="Controle de Áudio da Cabine"
      >
        <span className="text-[9px] text-[#00f0ff] font-bold tracking-widest uppercase mr-1 animate-pulse hidden xl:inline-block">MÚSICA DIGITAL</span>
        
        {/* Toggle Music Playlist Synthesizer */}
        <button
          onClick={handleToggleMusic}
          id="btn-music-toggle"
          aria-label={isMusicActive ? "Mutar rádio do cockpit" : "Tocar rádio do cockpit"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black transition-all ${
            isMusicActive 
              ? 'bg-emerald-600 text-[#03070a] hover:bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
              : 'bg-[#1a2d42]/60 text-slate-400 hover:text-white border border-slate-700/50'
          }`}
        >
          <Volume2 className="w-3 h-3 text-emerald-400 group-hover:text-white" />
          <span>PLAYLIST DIGITAL</span>
        </button>

        {/* Cycle synthesized styles loops */}
        <button
          onClick={handleCycleMusicStyle}
          disabled={!isMusicActive}
          id="btn-track-style-cycle"
          aria-label="Mudar gênero da música sintetizada"
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black border uppercase transition-all ${
            isMusicActive 
              ? 'border-indigo-500/60 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-950/20 active:scale-95' 
              : 'border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Music className="w-3 h-3 text-indigo-400" />
          <span>ESTILO: {musicStyle.replace('-', ' ')}</span>
        </button>
      </div>

      {/* Atmospheric Context */}
      <div className="hidden lg:flex flex-wrap items-center gap-4 text-slate-300 text-[11px]">
        <div className="flex items-center gap-1.5 bg-[#121c26]/60 border border-[#2a435c]/30 rounded px-2.5 py-1">
          <Thermometer className="w-3 h-3 text-blue-400" />
          <span className="text-[9px] text-slate-400">AR:</span>
          <span className="font-bold">18.7 °C</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#121c26]/60 border border-[#2a435c]/30 rounded px-2.5 py-1">
          <Thermometer className="w-3 h-3 text-[#e01931]" />
          <span className="text-[9px] text-slate-400">PISTA:</span>
          <span className="font-bold text-slate-200">{trackTemp.toFixed(1)} °C</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#121c26]/60 border border-[#2a435c]/30 rounded px-2.5 py-1">
          <Wind className="w-3 h-3 text-sky-400" />
          <span className="text-[9px] text-slate-400">VENTO:</span>
          <span className="font-bold text-slate-200">7.2 km/h <span className="text-[9px] text-[#2ebd59] font-black">SE</span></span>
        </div>
      </div>

      {/* Connection & Clock Stats */}
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full md:w-auto">
        {/* Stream Live pulse badge */}
        <div className="hidden md:flex items-center gap-2 bg-red-950/40 border border-red-500/30 px-3 py-1 rounded">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e01931]"></span>
          </span>
          <span className="text-[10px] font-black text-red-400 tracking-widest">ONLINE</span>
        </div>

        {/* Network status */}
        <div className="flex items-center gap-2 text-[10px] text-[#2ebd59] font-bold">
          <Signal className="w-4 h-4" />
          <div className="flex flex-col leading-none">
            <span className="tracking-wider text-slate-300 text-[9px] uppercase">CONECTADO</span>
            <span className="text-[9px] text-slate-400 mt-0.5">{ping} ms</span>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-[1px] bg-[#1a2d42] hidden sm:block"></div>

        {/* Live system clock */}
        <div className="flex flex-col text-right">
          <span className="text-xs font-black text-white tracking-widest leading-none font-sans">{timeStr}</span>
          <span className="text-[9px] text-slate-400 tracking-wider mt-1">{dateStr}</span>
        </div>
      </div>
    </header>
  );
}
