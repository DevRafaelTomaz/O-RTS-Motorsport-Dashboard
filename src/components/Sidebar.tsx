import React, { useState } from 'react';
import { 
  Gauge, 
  Activity, 
  Cpu, 
  Disc, 
  ListOrdered, 
  Sliders, 
  BellRing, 
  FileSpreadsheet, 
  Users, 
  Headphones,
  Menu,
  X
} from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLive: boolean;
  alarmsCount: number;
  driverName?: string;
  driverBox?: string;
  onOpenLogin?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isLive, 
  alarmsCount,
  driverName = "Rafael Santos (AM)",
  driverBox = "BOX #23",
  onOpenLogin
}: SidebarProps) {
  // Mobile drawer states
  const [isOpen, setIsOpen] = useState(false);
  const [isRadioActive, setIsRadioActive] = useState(false);

  const handleRadioToggle = () => {
    audioSystem.playRadioStatic();
    setIsRadioActive(!isRadioActive);
  };

  const menuItems = [
    { id: 'Dashboard', name: 'Painel Principal', icon: Gauge },
    { id: 'Telemetry', name: 'Telemetria', icon: Activity },
    { id: 'Engine', name: 'Motor GT3', icon: Cpu },
    { id: 'Tires', name: 'Pneus e Combustível', icon: Disc },
    { id: 'Laps', name: 'Tempos de Voltas', icon: ListOrdered },
    { id: 'Setups', name: 'Ajustes de Corrida', icon: Sliders },
    { id: 'Alarms', name: 'Alarmes e ECU', icon: BellRing, badge: alarmsCount > 0 ? alarmsCount : undefined },
    { id: 'Reports', name: 'Relatórios Finais', icon: FileSpreadsheet },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-[#03070a]/95 border-r border-[#1a2d42] text-white backdrop-blur-md select-none w-full shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1a2d42]/80 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {/* Custom Styled Porsche-like Emblem */}
          <div className="w-11 h-13 bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-700 p-[1.5px] rounded-b-lg shadow-[0_0_15px_rgba(245,158,11,0.25)] flex flex-col items-center justify-between border border-yellow-400/50 relative overflow-hidden shrink-0 group cursor-pointer hover:border-yellow-300 transition-all duration-300">
            {/* Glossy overlay sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
            {/* Inner shield design */}
            <div className="w-full h-full bg-[#050b11] flex flex-col items-center justify-between p-[3px] rounded-b-[6px]">
              {/* Top crest header stripes */}
              <div className="w-full flex justify-between gap-[1.5px]">
                <div className="w-[3px] h-3 bg-red-600 rounded-sm"></div>
                <div className="w-[3px] h-3 bg-black rounded-sm"></div>
                <div className="w-[3px] h-3 bg-red-600 rounded-sm"></div>
              </div>
              <span className="text-[8px] font-sans font-black text-amber-400 -mt-1 tracking-wider leading-none uppercase">RTS</span>
              {/* Detailed golden horse/car shield element */}
              <div className="w-4 h-5 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-sm flex items-center justify-center shadow-inner relative">
                <span className="text-[6px] font-black text-black leading-none font-mono">911</span>
                {/* Micro accent */}
                <span className="absolute -top-[1px] text-[4px] scale-75 font-semibold text-black/60">🏁</span>
              </div>
              {/* Bottom stripes */}
              <div className="w-full flex justify-between gap-[1.5px]">
                <div className="w-[3px] h-2 bg-black rounded-sm"></div>
                <div className="w-[3px] h-2 bg-yellow-400 rounded-sm"></div>
                <div className="w-[3px] h-2 bg-red-600 rounded-sm"></div>
              </div>
            </div>
            {/* Red gold reflection bar */}
            <div className="absolute top-0 left-[-20%] w-[140%] h-[1.5px] bg-red-500 rotate-12 opacity-60"></div>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-[0.25em] uppercase text-white leading-tight font-sans">
              RTS
            </h1>
            <span className="text-[10px] font-bold tracking-[0.35em] text-[#e01931] uppercase font-sans">
              MOTORSPORT
            </span>
          </div>
        </div>
        
        {/* Model Specs Banner */}
        <div className="bg-[#121c26] border border-[#1a2d42] rounded px-3 py-1.5 flex justify-between items-center">
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300 font-sans">RTS telemetry</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'} `}></span>
            <span className="text-[8px] font-mono font-bold text-slate-400 tracking-widest">{isLive ? 'CONECTADO' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {/* Navigation menu items */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar" role="tablist">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id.toLowerCase()}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              role="tab"
              aria-selected={isActive}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all duration-300 group relative text-left border ${
                isActive 
                  ? 'bg-gradient-to-r from-[#e01931]/15 to-transparent border-[#e01931]/45 text-white font-bold shadow-[inset_4px_0_12px_rgba(224,25,49,0.08)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border-transparent hover:border-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-[17px] h-[17px] transition-all duration-300 ${
                  isActive ? 'text-[#e01931] filter drop-shadow-[0_0_5px_#e01931]' : 'text-slate-400 group-hover:text-white group-hover:translate-x-0.5'
                }`} />
                <span className={`text-[11px] tracking-wider uppercase transition-all duration-300 ${
                  isActive ? 'font-bold text-white' : 'font-medium text-slate-400 group-hover:text-white'
                }`}>{item.name}</span>
              </div>
              
              {/* Active navigation dot indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#e01931] shadow-[0_0_8px_#e01931]"></span>
              )}
              
              {/* Notification Alarm Badge */}
              {item.badge !== undefined && (
                <span className="bg-[#e01931] text-white text-[9px] px-2 py-0.5 rounded-full font-bold font-mono tracking-normal shrink-0 mr-4">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Command Footer */}
      <div className="p-4 border-t border-[#1a2d42]/80 space-y-3 bg-[#050b10]">
        <div 
          onClick={onOpenLogin}
          className="flex items-center justify-between text-[10px] text-[#7f9ebb] font-mono cursor-pointer hover:bg-slate-900/50 p-1.5 rounded transition-all border border-transparent hover:border-[#1a2d42]"
          title="Clique para Autenticação de Piloto (Login)"
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Users className="w-3.5 h-3.5 text-[#e01931]" />
            <span className="truncate max-w-[125px] font-bold text-white uppercase">{driverName}</span>
          </div>
          <span className="text-[8px] bg-[#1a2836] border border-[#2a435c] text-emerald-400 px-1.5 py-0.5 rounded font-black shrink-0 tracking-wider uppercase">{driverBox}</span>
        </div>
        
        <button 
          onClick={handleRadioToggle}
          id="btn-active-communication"
          aria-label={isRadioActive ? "Desativar rádio pitlane ativo" : "Ativar rádio pitlane ativo"}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md border text-left cursor-pointer transition-all duration-300 group ${
            isRadioActive
              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] animate-[pulse_3s_infinite]'
              : 'border-[#1a2d42] bg-black/40 text-slate-400 hover:text-slate-200 hover:border-slate-700/50'
          }`}
        >
          <Headphones className={`w-4 h-4 transition-transform duration-300 ${
            isRadioActive ? 'text-emerald-400 scale-110 active:scale-95' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
          }`} />
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-bold font-mono tracking-wider uppercase">COMM ATIVA</span>
            <span className="text-[7px] font-mono tracking-widest text-slate-500 mt-1 uppercase">
              {isRadioActive ? '● BOX TRANSMITINDO' : '○ CLIQUE TESTAR'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Drawer Header Trigger */}
      <div className="md:hidden fixed top-3 left-4 z-50 flex items-center justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir Menu de Navegação"
          className="bg-[#0b1015]/95 border border-[#1a2d42] text-white p-2.5 rounded-lg shadow-xl hover:bg-[#1a2d42]/80 transition-all active:scale-95"
        >
          {isOpen ? <X className="w-5 h-5 text-[#e01931]" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Primary Desktop static sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between h-full bg-black shrink-0 relative z-20" id="telemetry-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay panel */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-64 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
