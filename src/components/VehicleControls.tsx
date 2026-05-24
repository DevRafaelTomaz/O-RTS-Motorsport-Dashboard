import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Cpu, 
  Settings, 
  Component, 
  Torus, 
  Zap, 
  HelpCircle,
  ShieldCheck,
  Car
} from 'lucide-react';
import { VehicleSetup } from '../types';

// Importing all 8 vehicles in the fleet
import porscheGt3Rs from '../assets/images/porsche_gt3_rs_1779648789201.png';
import porscheGt3R from '../assets/images/porsche_gt3_r_1779649866459.png';
import porsche963Lmdh from '../assets/images/porsche_963_hybrid_1779649884203.png';
import porscheGt4Eco from '../assets/images/porsche_gt4_eco_1779649903716.png';
import rts911Rsr from '../assets/images/porsche_911_rsr_gte_1779652788141.png';
import rts911TurboS from '../assets/images/porsche_911_turbo_s_1779652804800.png';
import rts918Spyder from '../assets/images/porsche_918_spyder_1779652819762.png';
import rtsTaycanGt from '../assets/images/porsche_taycan_turbo_gt_1779652841321.png';

interface VehicleControlsProps {
  setup: VehicleSetup;
  updateSetup: (param: keyof VehicleSetup, value: any) => void;
  triggerPitstop: () => void;
  speed: number;
  gear: number;
  sector: number;
  batteryCharge: number;
}

export default function VehicleControls({ 
  setup, 
  updateSetup, 
  triggerPitstop,
  speed,
  gear,
  sector,
  batteryCharge
}: VehicleControlsProps) {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  
  // Track manual override selection if the user wants to choose a car manually
  const [manualCarID, setManualCarID] = useState<string | null>(null);

  const carsData = [
    {
      id: 'gt3rs',
      shortName: 'GT3-RS',
      name: 'Porsche 911 GT3 RS (992)',
      image: porscheGt3Rs,
      desc: 'Motor Boxer Atmosférico de 4.0L capaz de gerar 525 cv. Ativo no Setor 1 devido ao seu avançado DRS e aerodinâmica ativa ideal para retas e curvas velozes.',
      acceleration: '3.2s (0-100)',
      power: '525 cv @ 8500rpm',
      weight: '1430 kg',
      drive: 'RWD (Traseira)',
      condition: 'Ativo no Setor 1 (Retas de Alta Velocidade)'
    },
    {
      id: 'gt3r',
      shortName: 'GT3-R',
      name: 'Porsche 911 GT3 R (GT3 Pro)',
      image: porscheGt3R,
      desc: 'Carro oficial de Endurance Racing voltado para máxima tração lateral em curvas exigentes. Selecionado automaticamente durante o técnico Setor 2 (Infield).',
      acceleration: '2.9s (0-100)',
      power: '565 cv @ 8250rpm',
      weight: '1250 kg',
      drive: 'RWD Motorsport',
      condition: 'Ativo no Setor 2 (Curvas Técnicas / Infield)'
    },
    {
      id: '963hybrid',
      shortName: 'LMDh',
      name: 'Porsche 963 Hybrid LMDh',
      image: porsche963Lmdh,
      desc: 'Protótipo Hypercar oficial das 24 Horas de Le Mans com propulsão híbrida V8 e sistema KERS. Entra em ação no Setor 3 para maximizar a regeneração de energia.',
      acceleration: '2.4s (0-100)',
      power: '680 cv (Combinação Híbrida)',
      weight: '1030 kg',
      drive: 'Hybrid AWD',
      condition: 'Ativo no Setor 3 (Regeneração de ERS / Alta Carga)'
    },
    {
      id: 'gt4eco',
      shortName: 'E-GT4',
      name: 'Porsche Cayman GT4 e-Performance',
      image: porscheGt4Eco,
      desc: 'Design conceitual 100% elétrico com bateria refrigerada diretamente a óleo. Selecionado quando o mapa de motor ECO ou SAFE é ativado ou na parada do Box.',
      acceleration: '2.1s (0-100)',
      power: '1088 cv (Modo Qualificação)',
      weight: '1500 kg',
      drive: 'Dual Motor AWD',
      condition: 'Ativado em Mapas ECO/SAFE ou Parada de Box'
    },
    {
      id: '911rsr',
      shortName: 'RSR',
      name: 'RTS 911 RSR Scuderia GTE',
      image: rts911Rsr,
      desc: 'Modelo icônico da categoria GTE Pro com motor central aspirado de ronco agressivo de 515 cv. Otimizado para longos trechos de resistência com distribuição de peso ideal.',
      acceleration: '3.1s (0-100)',
      power: '515 cv @ 8250rpm',
      weight: '1242 kg',
      drive: 'RWD GTE Box',
      condition: 'Otimizado para Alta Consistência de Corrida'
    },
    {
      id: 'turbos',
      shortName: 'TURBO',
      name: 'RTS 911 Turbo S Performance',
      image: rts911TurboS,
      desc: 'Superesportivo de tração integral com motor 3.7L bi-turbo gerando 650 cv. Entrega torque avassalador em qualquer condição climática com aerodinâmica progressiva.',
      acceleration: '2.7s (0-100)',
      power: '650 cv @ 6750rpm',
      weight: '1640 kg',
      drive: 'AWD Variable',
      condition: 'Excelente Desempenho em Condições Úmidas'
    },
    {
      id: '918spyder',
      shortName: 'SPYDER',
      name: 'RTS 918 Spyder Hybrid hypercar',
      image: rts918Spyder,
      desc: 'Supercarro de corrida híbrido combinando motor V8 de 10000 RPM de 4.6L com motores elétricos. Tecnologia KERS de alta vazão e torque imediato.',
      acceleration: '2.5s (0-100)',
      power: '887 cv (Sinergia Total)',
      weight: '1675 kg',
      drive: 'Hybrid AWD',
      condition: 'Supremacia Tecnológica'
    },
    {
      id: 'taycangt',
      shortName: 'TAYCAN',
      name: 'RTS Taycan Turbo GT Evolution',
      image: rtsTaycanGt,
      desc: 'Monstro elétrico de pista com mais de 1000 cv emparelhados em modo Overboost térmico. Desenvolvido para quebrar recordes de voltas elétricas em autódromos mundiais.',
      acceleration: '2.2s (0-100)',
      power: '1033 cv (Modo Attack)',
      weight: '2200 kg',
      drive: 'Dual-Motor Electric',
      condition: 'Desempenho Elétrico Sustentável'
    }
  ];

  // Determine car automatically based on Sector or active setups if no manual override is active
  let currentCar = carsData[0]; // fallback GT3 RS

  if (manualCarID) {
    currentCar = carsData.find(c => c.id === manualCarID) || carsData[0];
  } else {
    // Automated matching logic
    if (speed < 90 || setup.engineMap === 'Eco' || setup.engineMap === 'Safe') {
      currentCar = carsData[3]; // Eco system electric gt4
    } else if (sector === 3 || batteryCharge > 88) {
      currentCar = carsData[2]; // Hypercar LMDH Sector 3
    } else if (sector === 2) {
      currentCar = carsData[1]; // GT3 R curves
    } else {
      currentCar = carsData[0]; // standard GT3 RS
    }
  }

  // Engine Map selection labels
  const maps: { id: VehicleSetup['engineMap']; label: string; desc: string; style: string }[] = [
    { id: 'Qualifying', label: 'Q-STRAT', desc: 'Mapa de classificação: potência máxima, altas temperaturas', style: 'border-red-500 text-red-100 bg-red-950/30' },
    { id: 'Race', label: 'R-STRAT', desc: 'Mapa de corrida: equilíbrio térmico e ritmo ideal', style: 'border-green-500 text-green-100 bg-emerald-950/20' },
    { id: 'Eco', label: 'ECO-MAP', desc: 'Economia extrema: mistura pobre e máxima recarga do ERS', style: 'border-blue-400 text-blue-100 bg-indigo-950/20' },
    { id: 'Safe', label: 'SAFE-LIM', desc: 'Limitador de segurança: resfriamento forçado do boxer', style: 'border-yellow-500 text-yellow-100 bg-amber-950/20' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 select-none" id="vehicle-control-grid">
      
      {/* 1. VISUAL CAD VEHICLE PANEL (COL SPAN 7) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-[410px] backdrop-blur-md shadow-lg relative overflow-hidden xl:col-span-7" id="vehicle-mesh-card">
         
        {/* Header decoration */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1a2d42]/60 pb-3 z-10 gap-2">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#e01931]" id="vehicle-control-icon" />
            <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase">SALA DE CONTROLE DE DINÂMICA VEICULAR</h2>
          </div>
          
          {/* SEC CHANGER SELECTOR MANUAL OVERRIDE */}
          <div className="flex items-center gap-1 bg-black/50 border border-slate-800 p-1 rounded">
            <span className="text-[8px] text-slate-400 font-mono scale-90 mr-1">TIPO:</span>
            <button
              onClick={() => setManualCarID(null)}
              className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${!manualCarID ? 'bg-[#e01931] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              AUTO
            </button>
            {carsData.map(c => (
              <button
                key={c.id}
                onClick={() => setManualCarID(c.id)}
                className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded font-mono transition-all duration-200 border ${
                  manualCarID === c.id 
                    ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.4)]' 
                    : 'text-slate-400 hover:text-white border-transparent hover:bg-white/5'
                }`}
                title={c.name}
              >
                {c.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Info label pointing current model */}
        <div className="flex justify-between items-center bg-[#121c26]/80 p-2 rounded border border-[#1d2d3e] text-xs font-mono text-[#00f0ff] z-10 mt-2">
          <span>Modelo Ativo: <strong className="text-white uppercase font-black">{currentCar.name}</strong></span>
          <span className="text-[9px] bg-indigo-950/80 text-teal-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold uppercase">{manualCarID ? 'Manual' : currentCar.condition}</span>
        </div>

        {/* CAD Render Area with dynamic contextual telemetry nodes overlayed */}
        <div className="flex-1 relative flex items-center justify-center py-2 z-10 overflow-hidden min-h-0">
          
          {/* Main Studio Generated Porsche PNG image */}
          <div className="relative max-w-full max-h-52 select-none group border border-[#1a2d42]/10 p-2 rounded flex justify-center items-center">
            <img 
              src={currentCar.image} 
              alt={currentCar.name} 
              className="object-contain max-h-40 w-auto mix-blend-screen opacity-95 transition-all duration-700 scale-100 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
              id="porsche-lateral-image"
            />
            {/* Grid overlay lines representing laser scanning sensor suite */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#06a7ff]/5 to-transparent pointer-events-none rounded opacity-60"></div>
          </div>

          {/* DYNAMIC SENSORS OVERLAYS */}
          {/* Wing */}
          <div 
            onMouseEnter={() => setActiveOverlay('wing')}
            onMouseLeave={() => setActiveOverlay(null)}
            className="absolute top-[22%] right-[14%] flex flex-col items-end group cursor-help transition-all duration-300 z-20"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono text-[#00f0ff] uppercase bg-black/90 border border-[#00f0ff]/40 px-1.5 py-0.5 rounded leading-none scale-90 opacity-0 group-hover:opacity-100 transition-opacity">Ângulo Aero: {setup.aeroWingAngle}°</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f0ff]"></span>
              </span>
            </div>
            <div className="w-[1px] h-6 bg-[#00f0ff]/50 border-dashed mr-1.5 mt-0.5"></div>
          </div>

          {/* Diff Lock */}
          <div 
            onMouseEnter={() => setActiveOverlay('steering')}
            onMouseLeave={() => setActiveOverlay(null)}
            className="absolute bottom-[36%] left-[28%] flex flex-col items-start group cursor-help transition-all duration-300 z-20"
          >
            <div className="flex items-center gap-2 select-none">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2ebd59]"></span>
              </span>
              <span className="text-[8px] font-mono text-[#2ebd59] uppercase bg-black/90 border border-[#2ebd59]/40 px-1.5 py-0.5 rounded leading-none scale-90 opacity-0 group-hover:opacity-100 transition-opacity">DIFERENCIAL: {setup.diffLock}%</span>
            </div>
          </div>

          {/* Brake Brakes */}
          <div 
            onMouseEnter={() => setActiveOverlay('brakes')}
            onMouseLeave={() => setActiveOverlay(null)}
            className="absolute bottom-[24%] left-[21%] flex flex-col items-center group cursor-help transition-all duration-300 z-20"
          >
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
            </div>
          </div>

          {/* Engine */}
          <div 
            onMouseEnter={() => setActiveOverlay('engine')}
            onMouseLeave={() => setActiveOverlay(null)}
            className="absolute bottom-[44%] right-[25%] flex flex-col items-end group cursor-help transition-all duration-300 z-20"
          >
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-amber-400 uppercase bg-black/90 border border-amber-500/40 px-1.5 py-0.5 rounded leading-none scale-90 opacity-0 group-hover:opacity-100 transition-opacity">BOXER 6C: {setup.engineMap}</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Context Box dependent on hovered overlay */}
        <div className="bg-black/80 border border-[#1a2d42]/60 rounded p-2 text-[10px] font-mono flex items-center justify-between text-slate-300 z-10 w-full min-h-12 overflow-y-auto mt-2">
          {activeOverlay === 'wing' && (
            <p className="text-[#00f0ff] uppercase"><strong className="text-white">Aerofólio Traseiro Ativo (Aero DRS):</strong> Ajustável de 1° (velocidade pura em super retas) até 15° (vácuo e downforce extremo de apoio de curva). ModificaçõesLIVE influenciam aceleração.</p>
          )}
          {activeOverlay === 'steering' && (
            <p className="text-[#2ebd59] uppercase"><strong className="text-white">Bloqueio de Diferencial:</strong> Controla a diferença de rotação das rodas em curvas. Valores altos melhoram tração mas aumentam arrasto.</p>
          )}
          {activeOverlay === 'brakes' && (
            <p className="text-red-400 uppercase"><strong className="text-white">Pinças de Carbono-Cerâmica RTS:</strong> Configuração de ABS e Balanço Traseiro. Desloque para a Frente (FRONT) para estabilizar frenagens bruscas.</p>
          )}
          {activeOverlay === 'engine' && (
            <p className="text-amber-400 uppercase"><strong className="text-white">Potência RTS Boxer Flat-Six:</strong> Cilindros horizontais opostos de 4.0L com resposta instantânea até o limitador biotérmico.</p>
          )}
          {!activeOverlay && (
            <p className="text-slate-400 uppercase leading-snug"><strong className="text-white">Sobre o Veículo:</strong> {currentCar.desc}</p>
          )}
          
          {/* Quick Pit Lane Box Command */}
          <button 
            id="box-pitstop-button"
            onClick={triggerPitstop}
            className="bg-[#e01931] hover:bg-[#b01426] text-white text-[9px] font-mono font-black py-1 px-3 ml-4 rounded transition-all tracking-widest flex items-center gap-1 shrink-0 hover:shadow-[0_0_8px_#e01931]"
          >
            <Torus className="w-3.5 h-3.5 animate-spin" />
            CHAMAR BOX
          </button>
        </div>

      </div>

      {/* 2. ENGINEERING SETUP MODULES PANEL (COL SPAN 5) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-[410px] backdrop-blur-md shadow-lg xl:col-span-5" id="engineering-tuner-card">
        
        {/* Header detail */}
        <div className="flex justify-between items-center border-b border-[#1a2d42]/60 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#e01931]" />
            <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase">PAINEL DE AJUSTES DA ENGENHARIA</h2>
          </div>
          <HelpCircle className="w-4 h-4 text-slate-500 cursor-help hover:text-[#00f0ff]" />
        </div>

        {/* Setup sliders and controllers list */}
        <div className="flex-1 py-4 space-y-4 overflow-y-auto custom-scrollbar pr-1">
          
          {/* ENGINE FUEL MAP STRATEGY */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#7f9ebb] uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                ESTRATÉGIA DO MAPA DO MOTOR
              </span>
              <span className="text-[10px] font-mono font-black text-[#f5be1c]">{setup.engineMap.toUpperCase()}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-1.5">
              {maps.map((m) => (
                <button
                  key={m.id}
                  id={`eng-map-btn-${m.id.toLowerCase()}`}
                  onClick={() => updateSetup('engineMap', m.id)}
                  title={m.desc}
                  className={`text-[8.5px] font-mono font-black border py-1.5 rounded transition-all duration-300 ${
                    setup.engineMap === m.id
                      ? `bg-[#1a2d42] border-[#e01931] text-white shadow-[0_0_8px_rgba(224,25,49,0.3)]`
                      : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* AERODYNAMICS WING REAR ANGLE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="font-bold text-[#7f9ebb] uppercase tracking-widest flex items-center gap-1.5">
                <Component className="w-3.5 h-3.5 text-slate-400" />
                AEROFÓLIO TRASEIRO (AERO)
              </span>
              <span className="font-black text-indigo-400">{setup.aeroWingAngle}° / 15°</span>
            </div>
            <div className="flex items-center gap-4 bg-black/40 border border-slate-900 px-3 py-1.5 rounded">
              <span className="text-[9px] text-slate-500 font-mono">1°</span>
              <input 
                type="range"
                min="1"
                max="15"
                id="aero-wing-slider"
                value={setup.aeroWingAngle}
                onChange={(e) => updateSetup('aeroWingAngle', parseInt(e.target.value))}
                className="flex-1 accent-[#e01931] cursor-col-resize h-1 bg-[#121c26] rounded-lg"
              />
              <span className="text-[9px] text-slate-500 font-mono">15°</span>
            </div>
          </div>

          {/* ACTIVE SUSPENSION STIFFNESS STAGE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="font-bold text-[#7f9ebb] uppercase tracking-widest flex items-center gap-1.5">
                <Component className="w-3.5 h-3.5 text-slate-400" />
                RIGIDEZ DA SUSPENSÃO
              </span>
              <span className="font-black text-green-400">{setup.suspensionStiffness.toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-1 p-1 bg-black/40 border border-slate-900 rounded-md">
              {(['Soft', 'Medium', 'Hard', 'Stiff'] as const).map((mode) => (
                <button
                  key={mode}
                  id={`susp-btn-${mode.toLowerCase()}`}
                  onClick={() => updateSetup('suspensionStiffness', mode)}
                  className={`flex-1 text-[9px] font-mono py-1 rounded select-none uppercase font-black tracking-wider transition-all ${
                    setup.suspensionStiffness === mode
                      ? 'bg-[#1a2d42] text-[#2ebd59] border-b border-[#2ebd59]'
                      : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {mode === 'Soft' ? 'MACIA' : mode === 'Medium' ? 'MÉDIA' : mode === 'Hard' ? 'DURA' : 'RÍGIDA'}
                </button>
              ))}
            </div>
          </div>

          {/* DUAL STEPPERS: BRAKE BIAS & DIFFERENTIAL LOCK */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* BRAKE BIAS */}
            <div className="space-y-1.5 flex flex-col">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="font-bold text-[#7f9ebb] uppercase tracking-wider flex items-center gap-1">
                  DISTRIBUICÃO FREIO
                </span>
                <span className="font-black text-red-400">{setup.brakeBias}%</span>
              </div>
              <div className="flex items-center justify-between bg-black/40 border border-slate-900 p-1 rounded">
                <button 
                  id="bias-minus"
                  onClick={() => updateSetup('brakeBias', Math.max(50.0, parseFloat((setup.brakeBias - 0.5).toFixed(1))))}
                  className="w-7 h-7 bg-[#1a2d42] border border-slate-800 rounded font-black text-xs text-slate-200 hover:text-white"
                >
                  -
                </button>
                <div className="text-[10px] font-mono font-bold text-slate-300">Frontal</div>
                <button 
                  id="bias-plus"
                  onClick={() => updateSetup('brakeBias', Math.min(60.0, parseFloat((setup.brakeBias + 0.5).toFixed(1))))}
                  className="w-7 h-7 bg-[#1a2d42] border border-slate-800 rounded font-black text-xs text-slate-200 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* DIFFERENTIAL LOCK */}
            <div className="space-y-1.5 flex flex-col">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="font-bold text-[#7f9ebb] uppercase tracking-wider flex items-center gap-1">
                  DIFERENCIAL
                </span>
                <span className="font-black text-[#00f0ff]">{setup.diffLock}%</span>
              </div>
              <div className="flex items-center justify-between bg-black/40 border border-slate-900 p-1 rounded">
                <button 
                  id="diff-minus"
                  onClick={() => updateSetup('diffLock', Math.max(40, setup.diffLock - 5))}
                  className="w-7 h-7 bg-[#1a2d42] border border-slate-800 rounded font-black text-xs text-slate-200 hover:text-white"
                >
                  -
                </button>
                <div className="text-[10px] font-mono font-bold text-slate-300">Grau</div>
                <button 
                  id="diff-plus"
                  onClick={() => updateSetup('diffLock', Math.min(95, setup.diffLock + 5))}
                  className="w-7 h-7 bg-[#1a2d42] border border-slate-800 rounded font-black text-xs text-slate-200 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Live physical diagnostic telemetry */}
        <div className="bg-black/50 border border-dashed border-[#1a2d42] rounded p-2.5 flex justify-between items-center text-[9px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span>SISTEMA DRS: ATIVO & PRONTO</span>
          </div>
          <span>ACELERAÇÃO G-LOAD: <span className="text-white font-bold">120 fps low latency</span></span>
        </div>

      </div>

      {/* 3. SHOWCASE OF ALL MOTORSPORT CARS IN PLAIN SIGHT (COL SPAN 12) */}
      <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between backdrop-blur-md shadow-lg xl:col-span-12 mt-1" id="vehicle-fleet-gallery">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1a2d42]/60 pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#e01931]" />
            <h2 className="text-xs font-black tracking-[0.2em] text-white uppercase font-sans">INTEGRAÇÃO DE FROTA RTS MOTORSPORT (TOQUE PARA MANOBRAR SELEÇÃO)</h2>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-slate-800">CÉLULAS DIAGNÓSTICAS DE CHASSIS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {carsData.map((car) => {
            const isSelected = manualCarID === car.id || (!manualCarID && currentCar.id === car.id);
            return (
              <div
                key={car.id}
                onClick={() => setManualCarID(car.id)}
                className={`relative bg-black/60 border rounded-lg p-3 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between gap-2 overflow-hidden group ${
                  isSelected
                    ? 'border-[#00f0ff] bg-[#0d1f2d]/30 shadow-[0_0_12px_rgba(0,240,255,0.15)] ring-1 ring-[#00f0ff]/30'
                    : 'border-[#1a2d42]/60 text-slate-400 hover:text-white hover:border-[#2a445d] hover:bg-slate-900/60'
                }`}
              >
                {/* Accent glow on hover */}
                <div className={`absolute top-0 right-0 w-8 h-8 rounded-full bg-cyan-500/10 blur group-hover:bg-cyan-500/20 transition-all ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>
                
                {/* Header info */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      isSelected 
                        ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30' 
                        : 'bg-slate-900/80 text-slate-400'
                    }`}>
                      {car.shortName}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                    )}
                  </div>
                  <h3 className="text-[10px] font-black uppercase text-white truncate leading-tight group-hover:text-cyan-400 transition-colors" title={car.name}>
                    {car.name.replace('Porsche ', '').replace('RTS ', '')}
                  </h3>
                </div>

                {/* Interactive visual frame */}
                <div className="relative h-14 flex items-center justify-center py-1">
                  <img
                    src={car.image}
                    alt={car.name}
                    className={`object-contain max-h-12 w-auto transition-transform duration-300 filter mix-blend-screen ${
                      isSelected ? 'scale-[1.08] saturate-100 brightness-110 drop-shadow-[0_4px_6px_rgba(0,240,255,0.1)]' : 'scale-100 saturate-50 brightness-75 group-hover:scale-105 group-hover:brightness-95'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Specifications strip */}
                <div className="border-t border-[#1a2d42]/30 pt-1.5 space-y-1 text-[8px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">0-100:</span>
                    <span className="text-slate-300 font-extrabold">{car.acceleration.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PESO:</span>
                    <span className="text-slate-300 font-extrabold">{car.weight.split(' ')[0]}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-black text-cyan-500">FORÇA:</span>
                    <span className="text-amber-400 font-extrabold truncate max-w-[50px]">{car.power.split(' ')[0]}CV</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
