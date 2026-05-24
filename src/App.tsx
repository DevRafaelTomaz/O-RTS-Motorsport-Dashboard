import React, { useState, useCallback } from 'react';
import { useTelemetry } from './hooks/useTelemetry';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Gauges from './components/Gauges';
import TelemetryCharts from './components/TelemetryCharts';
import VehicleControls from './components/VehicleControls';
import TiresFuel from './components/TiresFuel';
import TrackLaps from './components/TrackLaps';
import { TRACKS } from './utils/trackData';

// Lucide icon assets for specialized workspace screens
import { 
  BellRing, 
  Trash2, 
  Radio, 
  Flame, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Download, 
  LineChart, 
  Zap, 
  Torus, 
  Disc, 
  Trophy, 
  User, 
  Activity, 
  Thermometer, 
  X,
  Gauge as GaugeIcon 
} from 'lucide-react';

export default function App() {
  const t = useTelemetry();

  // Dynamic driver profile configuration states
  const [driverName, setDriverName] = useState("Rafael Santos (AM)");
  const [driverBox, setDriverBox] = useState("BOX #23");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Dynamic export database simulation state
  const [exportingStatus, setExportingStatus] = useState<"idle" | "running" | "done">("idle");
  const [exportProgress, setExportProgress] = useState(0);

  const startTelemetryExport = () => {
    if (exportingStatus !== "idle") return;
    setExportingStatus("running");
    setExportProgress(0);
    t.addAlarm("SISTEMA DE EXPORTAÇÃO: Empacotando pacotes binários G-Force e RPM (.rts-data)...");

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExportingStatus("done");
          t.addAlarm(`SISTEMA DE EXPORTAÇÃO: Relatório Motorsport gerado com sucesso para ${driverName}.`);
          // Reset container progress after a few seconds
          setTimeout(() => {
            setExportingStatus("idle");
          }, 4000);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Selected Tyre Compound state for specific setup panels
  const [selectedCompound, setSelectedCompound] = useState<'SS' | 'S' | 'M' | 'H'>('SS');

  // Trigger safety toggles inside Alarms screen
  const [safetySystems, setSafetySystems] = useState({
    abs: true,
    tc: true,
    pitLimiter: false,
    fireSup: true,
    radioComm: true
  });

  const toggleSafety = (sys: keyof typeof safetySystems) => {
    setSafetySystems(prev => {
      const next = { ...prev, [sys]: !prev[sys] };
      t.addAlarm(`SISTEMA DE SEGURANÇA: Alteração do backup de ${String(sys).toUpperCase()} para [ ${next[sys] ? 'ATIVO' : 'BYPASSED'} ]`);
      return next;
    });
  };

  const handleTelemetryTabChange = useCallback((tabId: string) => {
    // Highly isolated tab switching telemetry logging
    t.addAlarm(`TRANSMISSÃO TELEMETRIA: Mudança de gráfico analítico para [ ${tabId.toUpperCase()} ]`);
  }, [t.addAlarm]);

  return (
    <div className="flex h-screen bg-[#03070a] text-slate-100 overflow-hidden font-sans relative scanner-overlay" id="porsche-telemetry-root">
      
      {/* 1. Left Vertical Sidebar Navigation */}
      <Sidebar 
        activeTab={t.activeTab} 
        setActiveTab={t.setActiveTab} 
        isLive={!t.isPaused} 
        alarmsCount={t.alarms.length} 
        driverName={driverName}
        driverBox={driverBox}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* 2. Main Center-Right Column Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Superior Compact Status Header */}
        <Header trackTemp={t.trackTemp} trackName={TRACKS[t.activeTrackId]?.name} />

        {/* 3. Main Workspace scrolling viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-radial from-[#081524] via-[#03070a] to-[#020406] space-y-6 custom-scrollbar">
          
          {/* ======================= TAB: DASHBOARD ======================= */}
          {t.activeTab === 'Dashboard' && (
            <div className="space-y-6 animate-fade-in duration-300">
              
              {/* Massive telemetry readouts & RPM dials */}
              <Gauges 
                speed={t.telemetry.speed}
                rpm={t.telemetry.rpm}
                gear={t.telemetry.gear}
                delta={t.lapsList[0]?.delta || '0.000'}
                deltaValue={t.lapsList[0]?.deltaValue || 0}
                bestLap={t.lapsList.find(x => x.status === 'PURPLE')?.lapTime || '1:29.685'}
                oilPressure={t.engine.oilPressure}
                oilTemp={t.engine.oilTemp}
                waterTemp={t.engine.waterTemp}
                fuelLevel={t.engine.fuelLevel}
                fuelLimit={t.engine.fuelLimit}
              />

              {/* Vehicle Subassembly Cad & Tuner Panel */}
              <VehicleControls 
                setup={t.setup}
                updateSetup={t.updateSetup}
                triggerPitstop={t.triggerPitstop}
                speed={t.telemetry.speed}
                gear={t.telemetry.gear}
                sector={t.telemetry.currentSector}
                batteryCharge={t.engine.batteryCharge}
              />

              {/* Synchronized Live telemetry line charts */}
              <TelemetryCharts 
                chartHistory={t.chartHistory}
                currentSector={t.telemetry.currentSector}
                currentDelta={t.lapsList[0]?.delta || '0.000'}
                onActiveTabChange={handleTelemetryTabChange}
              />

              {/* Spielberg (Red Bull Ring) map locator & live lap times */}
              <TrackLaps 
                lapProgress={t.telemetry.lapProgress}
                currentSector={t.telemetry.currentSector}
                lapsList={t.lapsList}
                sectorTimes={t.sectorTimes}
                bestLap={t.lapsList.find(x => x.status === 'PURPLE')?.lapTime || '1:29.685'}
                trackId={t.activeTrackId}
                onChangeTrack={t.changeTrack}
              />

              {/* Tyre Thermography, camber heat & fuels energy columns */}
              <TiresFuel 
                tires={t.tires}
                engine={t.engine}
              />

            </div>
          )}

          {/* ======================= TAB: TELEMETRY ======================= */}
          {t.activeTab === 'Telemetry' && (
            <div className="space-y-6 animate-fade-in duration-300">
              {/* Maximized Recharts canvas */}
              <TelemetryCharts 
                chartHistory={t.chartHistory}
                currentSector={t.telemetry.currentSector}
                currentDelta={t.lapsList[0]?.delta || '0.000'}
              />

              {/* Giant Mission-Control real-time stream log table (Rolling Sensor logs) */}
              <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5">
                <div className="flex justify-between items-center border-b border-[#1a2d42]/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-[#e01931] animate-pulse" />
                    <h2 className="text-xs font-black tracking-[0.25em] text-white uppercase">TERMINAL DE TELEMETRIA BRUTA DO CHASSIS</h2>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">CANAL DE TRANSMISSÃO SEGURO // RBR_GT3</span>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar border border-slate-900 bg-black/40 rounded">
                  <table className="w-full text-left font-mono text-[10px] border-collapse relative">
                    <thead className="bg-[#121c26] text-slate-400 sticky top-0 border-b border-[#1a2d42] z-10">
                      <tr>
                        <th className="p-2.5">REGISTRO</th>
                        <th className="p-2.5 text-right">VELOCIDADE (KM/H)</th>
                        <th className="p-2.5 text-right">RPM (ROTAÇÕES)</th>
                        <th className="p-2.5 text-right">MARCHA</th>
                        <th className="p-2.5 text-right">ACELERADOR (%)</th>
                        <th className="p-2.5 text-right">FREIO (%)</th>
                        <th className="p-2.5 text-right">VOLANTE (GRAUS)</th>
                        <th className="p-2.5 text-right">G-LATERAL</th>
                        <th className="p-2.5 text-center">SETOR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#132333]/50 text-slate-300">
                      {t.chartHistory.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-6 text-center text-slate-500 font-mono">Aguardando handshake de transmissão do veículo...</td>
                        </tr>
                      ) : (
                        [...t.chartHistory].reverse().map((ch, idx) => {
                          const customKey = `telemetry-row-${ch.index}-${idx}`;
                          return (
                            <tr key={customKey} className="hover:bg-[#1a2d42]/20 odd:bg-black/10">
                              <td className="p-2 font-bold text-[#f5be1c]">{ch.time}</td>
                              <td className="p-2 text-right text-white font-extrabold">{ch.speed}</td>
                              <td className="p-2 text-right">{ch.rpm}</td>
                              <td className="p-2 text-right text-[#00f0ff] font-bold">{ch.gear}</td>
                              <td className="p-2 text-right text-[#2ebd59] font-bold">{ch.throttle}%</td>
                              <td className="p-2 text-right text-[#e01931] font-bold">{ch.brake}%</td>
                              <td className="p-2 text-right">{ch.steering}°</td>
                              <td className="p-2 text-right text-[#3a80df]">{ch.gForceLat} G</td>
                              <td className="p-2 text-center text-slate-200">S{ch.sector}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: ENGINE ======================= */}
          {t.activeTab === 'Engine' && (
            <div className="space-y-6">
              
              {/* Engine detailed gauges */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* 1. Oil Temperaturs */}
                <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-40">
                  <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase">LUBRIFICANTES // TEMPERATURA DO ÓLEO</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{t.engine.oilTemp}</span>
                    <span className="text-slate-500 text-xs font-bold">°C</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-red-500" style={{ width: `${(t.engine.oilTemp / 150) * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-2">FAIXA NOMINAL: 95°C A 115°C</span>
                </div>

                {/* 2. Water Temp */}
                <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-40">
                  <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase">ARREFECIMENTO // TEMP. DA ÁGUA</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{t.engine.waterTemp}</span>
                    <span className="text-slate-500 text-xs font-bold">°C</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-blue-500" style={{ width: `${(t.engine.waterTemp / 120) * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-2">FAIXA NOMINAL: 85°C A 102°C</span>
                </div>

                {/* 3. Fuel Pressure */}
                <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-40">
                  <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase">INJEÇÃO // PRESSÃO DO COMBUSTÍVEL</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{t.engine.oilPressure.toFixed(1)}</span>
                    <span className="text-slate-500 text-xs font-bold">bar</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#2ebd59]" style={{ width: `${(t.engine.oilPressure / 7) * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-2">PRESSÃO NOMINAL: 4.8 A 6.2 BAR</span>
                </div>

                {/* 4. Active Ignition Spark advance */}
                <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5 flex flex-col justify-between h-40">
                  <span className="text-[10px] font-mono tracking-widest text-[#7f9ebb] uppercase">AVANÇO DO PONTO DE IGNIÇÃO</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold font-mono text-white">28.5</span>
                    <span className="text-slate-500 text-xs font-bold">GRAUS</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-indigo-500" style={{ width: '65%' }} />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-2">AVANÇO CONSTANTE EM {t.telemetry.rpm} RPM</span>
                </div>

              </div>

              {/* Flat-Six Boxer Cylinder thermography monitor (Cylinders 1-6) */}
              <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5">
                <div className="border-b border-[#1a2d42]/60 pb-3 mb-5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                    <h3 className="text-xs font-black tracking-[0.25em] text-white uppercase">IGINÇÃO BIOTÉRMICA DOS CILINDROS FLAT-6</h3>
                  </div>
                  <span className="text-[9px] font-mono bg-red-950/40 border border-red-500/30 px-3.5 py-1 rounded text-red-400 font-extrabold uppercase tracking-widest leading-none">LIMITADOR FLAT-6 4.0L NA 9000RPM</span>
                </div>

                {/* Cylinder block rendering with mechanical pistons and fire chambers */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((cylNum) => {
                    // Precise target user standards: 175, 173, 171, 169, 170, 173
                    const targetTemps: Record<number, number> = {
                      1: 175,
                      2: 173,
                      3: 171,
                      4: 169,
                      5: 170,
                      6: 173
                    };
                    const baseTarget = targetTemps[cylNum] || 170;
                    
                    // RPM factor generates realistic thermal heating
                    const rpmRatio = t.telemetry.rpm / 9000;
                    const liveThermalOffset = (Math.sin(Date.now() / 250 + cylNum) * 0.8) + (rpmRatio * 16 - 8);
                    const thermalGrip = Math.round(baseTarget + liveThermalOffset);
                    const isHot = thermalGrip > 170;

                    // Calculate simulated piston height offset based on high-frequency live RPM oscillations
                    const pistonOscillation = Math.sin((Date.now() / 40) * (t.telemetry.rpm / 1000) + cylNum) * 14 + 16; 
                    const isSparking = (Date.now() % 5 < 2) && (t.telemetry.rpm > 3000);

                    const customCylKey = `cylinder-block-${cylNum}`;
                    return (
                      <div key={customCylKey} className="bg-black/50 border border-[#1a2d42] p-4 rounded-lg flex flex-col items-center space-y-3 relative overflow-hidden group hover:border-[#00f0ff]/40 transition-all duration-300">
                        {/* Core glow background represent high thermal combustion */}
                        <div 
                          className="absolute inset-0 bg-radial from-red-600/10 via-transparent to-transparent pointer-events-none transition-opacity duration-300"
                          style={{ opacity: isHot ? 0.8 : 0.2 }}
                        />

                        {/* Spark Plug Neon Indicator */}
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[9px] font-mono font-black text-slate-400">CIL_0{cylNum}</span>
                          <span 
                            className={`w-2 h-2 rounded-full transition-all duration-75 ${
                              isSparking 
                                ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff] opacity-100 scale-110' 
                                : 'bg-indigo-900/40 opacity-40 scale-100'
                            }`}
                            title="Centelha ativa (Spark)"
                          />
                        </div>

                        {/* Thermocouple Chamber Layout */}
                        <div className="w-full h-24 bg-[#0a1219] rounded border border-slate-900 flex flex-col justify-between items-center p-2 relative overflow-hidden">
                          {/* Combustion flame ring chamber background */}
                          <div 
                            className="absolute inset-x-0 top-0 bg-gradient-to-b from-amber-600/20 via-transparent to-transparent pointer-events-none transition-all duration-150"
                            style={{ height: `${Math.min(100, Math.max(10, ((thermalGrip - 100) / 100) * 100))}%` }}
                          />

                          {/* Target Temperature display */}
                          <div className="text-center z-10 w-full mt-1">
                            <span className={`text-xl font-mono font-black tracking-tighter ${isHot ? 'text-red-500 filter drop-shadow-[0_0_3px_rgba(239,68,68,0.4)]' : 'text-emerald-400'} transition-colors`}>
                              {thermalGrip}°
                            </span>
                            <span className="text-[8px] text-slate-500 font-bold ml-0.5">C</span>
                          </div>

                          {/* Animated Metal Piston rod inside chamber */}
                          <div className="w-10 h-10 border-t-2 border-slate-700 bg-slate-800/80 rounded-t-sm z-10 relative shadow-inner shadow-black/80 transition-transform dur-75 flex flex-col justify-start items-center p-1"
                            style={{ transform: `translateY(${pistonOscillation}px)` }}
                          >
                            {/* Piston pin core */}
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-slate-600"></div>
                            {/* Connecting rod pin */}
                            <div className="w-1 h-6 bg-slate-600/80 mt-1 origin-top rotate-1 inline-block"></div>
                          </div>

                          {/* Limit indicator line */}
                          <div className="absolute top-[20%] left-0 right-0 border-t border-red-500/20 border-dashed pointer-events-none"></div>
                        </div>

                        {/* Interactive status labels */}
                        <div className="w-full flex items-center justify-between text-[8px] font-mono select-none border-t border-[#1a2d42]/40 pt-2">
                          <span className="text-slate-500 uppercase">INJE_OK</span>
                          <span className="text-[#00f0ff] font-extrabold font-mono uppercase text-right">
                            {Math.round(135 + (t.telemetry.rpm / 200))} bar
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ======================= TAB: TIRES ======================= */}
          {t.activeTab === 'Tires' && (
            <div className="space-y-6">
              
              {/* Detailed tire layouts */}
              <TiresFuel tires={t.tires} engine={t.engine} />

              {/* Tire compounds select and Pit controllers */}
              <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5">
                <div className="border-b border-[#1a2d42]/60 pb-3 mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Disc className="w-5 h-5 text-[#e01931]" />
                    <h3 className="text-xs font-black tracking-[0.25em] text-white uppercase">COMPILADOR E CALIBRAÇÃO DOS PNEUS</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">PREPARATIVO DO PRÓXIMO SET DE PNEUS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  
                  {/* Selectors */}
                  <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'SS', name: 'SUPER MACIO (SS)', desc: 'Grip incrível para classificação rápida' },
                      { id: 'S', name: 'MACIO (S)', desc: 'Pneu padrão de tração ideal para pistas curtas' },
                      { id: 'M', name: 'MÉDIO (M)', desc: 'Resistência ideal para endurance balanceado' },
                      { id: 'H', name: 'DURO (H)', desc: 'Excelente suporte estrutural para longas sessões' },
                    ].map((cmp) => {
                      const customCmpKey = `compound-btn-${cmp.id}`;
                      return (
                        <button
                          key={customCmpKey}
                          onClick={() => {
                            setSelectedCompound(cmp.id as any);
                            t.addAlarm(`PRELOAD PNEUS: Configurado composto de pneu para [ ${cmp.id} ]`);
                          }}
                          className={`border p-3 rounded text-left font-mono space-y-1 transition-all ${
                            selectedCompound === cmp.id 
                              ? 'bg-[#1a2d42] border-[#e01931] text-white shadow-[0_0_8px_rgba(224,25,49,0.25)]'
                              : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-[11px] font-black">{cmp.name}</div>
                          <div className="text-[8px] text-slate-500 leading-normal">{cmp.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Pit lane button caller */}
                  <div className="md:col-span-4 bg-black/40 border border-[#1a2d42] p-4 rounded flex flex-col justify-between h-full space-y-4">
                    <div className="text-[10px] font-mono text-slate-400 uppercase leading-relaxed text-center">
                      Confirme as especificações do composto para ordenar a equipe técnica a realizar a troca imediata no box:
                    </div>
                    <button
                      onClick={() => {
                        t.triggerPitstop();
                        t.addAlarm(`OPERAÇÃO BOX: Substituição com sucesso para pneus de tipo ${selectedCompound}`);
                      }}
                      className="w-full bg-[#e01931] hover:bg-[#c01426] text-white uppercase text-xs font-mono font-black py-2.5 rounded tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_12px_#e01931] transition-all"
                    >
                      <Torus className="w-4 h-4 animate-spin" />
                      SINALIZAR ENTRADA NO BOX
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ======================= TAB: LAPS ======================= */}
          {t.activeTab === 'Laps' && (
            <div className="space-y-6">
              
              {/* Core Spielberg map and comparative track data */}
              <TrackLaps 
                lapProgress={t.telemetry.lapProgress}
                currentSector={t.telemetry.currentSector}
                lapsList={t.lapsList}
                sectorTimes={t.sectorTimes}
                bestLap={t.lapsList.find(x => x.status === 'PURPLE')?.lapTime || '1:29.685'}
                trackId={t.activeTrackId}
                onChangeTrack={t.changeTrack}
              />

              {/* Extra telemetry metrics comparing historical averages */}
              <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5">
                <div className="border-b border-[#1a2d42]/60 pb-3 mb-4">
                  <h3 className="text-xs font-black tracking-[0.25em] text-white uppercase">ANÁLISE DE DIFERENÇA DE TEMPO DE PARCIAIS</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-4 bg-black/40 border border-slate-900 rounded space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">DIFERENÇA SETOR 1 PARA O LÍDER</span>
                    <div className="text-xl font-bold font-mono text-[#2ebd59]">-0.125s <span className="text-xs text-slate-400 font-normal">S1 RECORD DELTA</span></div>
                  </div>
                  <div className="p-4 bg-black/40 border border-slate-900 rounded space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">DIFERENÇA SETOR 2 PARA O LÍDER</span>
                    <div className="text-xl font-bold font-mono text-[#2ebd59]">-0.156s <span className="text-xs text-slate-400 font-normal">S2 RECORD DELTA</span></div>
                  </div>
                  <div className="p-4 bg-[#ef4444]/5 border border-red-500/20 rounded space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">DIFERENÇA SETOR 3 PARA O LÍDER</span>
                    <div className="text-xl font-bold font-mono text-red-400">+0.034s <span className="text-xs text-slate-400 font-normal">S3 PERDA EM RETAS</span></div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================= TAB: SETUPS ======================= */}
          {t.activeTab === 'Setups' && (
            <div className="space-y-6">
              
              {/* Main controls component */}
              <VehicleControls 
                setup={t.setup}
                updateSetup={t.updateSetup}
                triggerPitstop={t.triggerPitstop}
                speed={t.telemetry.speed}
                gear={t.telemetry.gear}
                sector={t.telemetry.currentSector}
                batteryCharge={t.engine.batteryCharge}
              />

              {/* Detailed expected dynamics indices under this active configurations */}
              <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-5">
                <div className="border-b border-[#1a2d42]/60 pb-3 mb-4">
                  <h3 className="text-xs font-black tracking-[0.25em] text-white uppercase">DESEMPENHO ESTIMADO DO CARRO NAS CONFIGURAÇÕES ATUAIS</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  
                  <div className="p-3 bg-black/40 border border-[#1a2d42]/40 rounded-md">
                    <div className="text-[9px] text-slate-500 uppercase mb-1">Velocidade Máxima de Reta</div>
                    <div className="text-lg font-black text-white">{t.setup.engineMap === 'Qualifying' ? '302 km/h' : t.setup.engineMap === 'Eco' ? '264 km/h' : '285 km/h'}</div>
                  </div>

                  <div className="p-3 bg-black/40 border border-[#1a2d42]/40 rounded-md">
                    <div className="text-[9px] text-slate-500 uppercase mb-1">Carga Lateral Máxima Relevada</div>
                    <div className="text-lg font-black text-white">{t.setup.aeroWingAngle > 10 ? '3.4 G load' : '2.8 G load'}</div>
                  </div>

                  <div className="p-3 bg-black/40 border border-[#1a2d42]/40 rounded-md">
                    <div className="text-[9px] text-slate-500 uppercase mb-1">Distância de Frenagem (200 a 0 km/h)</div>
                    <div className="text-lg font-black text-white">{t.setup.brakeBias > 54 ? '112 metros' : '119 meters'}</div>
                  </div>

                  <div className="p-3 bg-black/40 border border-[#1a2d42]/40 rounded-md">
                    <div className="text-[9px] text-slate-500 uppercase mb-1">Coeficiente Máximo de Tração</div>
                    <div className="text-lg font-black text-white">{t.setup.diffLock > 70 ? '0.94 P-INDEX' : '0.81 P-INDEX'}</div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ======================= TAB: ALARMS ======================= */}
          {t.activeTab === 'Alarms' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left col: System toggles (ABS, Traction, pit lanes) */}
                <div className="lg:col-span-5 bg-[#0b1015]/90 border border-[#1a2d42] p-5 rounded-lg flex flex-col justify-between h-[420px]">
                  <div>
                    <div className="border-b border-[#1a2d42]/60 pb-3 mb-4">
                      <h3 className="text-xs font-black tracking-[0.25em] text-white uppercase">BACKUPS ELETRÔNICOS E SALVAGUARDAS</h3>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'abs' as const, name: 'Sistemas Antibloqueio (ABS)', desc: 'Evita planos escuros de desgaste prematuro de pneus sob frenagem violenta.' },
                        { id: 'tc' as const, name: 'Controle de Tração do Motor (TC)', desc: 'Garante eficiência de torque sem destracionar rodas traseiras em curvas largas.' },
                        { id: 'pitLimiter' as const, name: 'Limitador de Velocidade de Box (60 km/h)', desc: 'Trava eletrônica na ECU para respeitar a velocidade regulamentar no pit lane.' },
                        { id: 'fireSup' as const, name: 'Dispersão de Supressão Automática de Incêndio', desc: 'Sistemas de resposta termoestática ativa nas bancadas do motor.' },
                      ].map((sys) => {
                        const isActive = safetySystems[sys.id];
                        const customSysKey = `safety-toggle-${sys.id}`;
                        return (
                          <div 
                            key={customSysKey} 
                            onClick={() => toggleSafety(sys.id)}
                            className={`p-3 border rounded-md cursor-pointer flex justify-between items-center select-none hover:bg-white/5 transition-all ${
                              isActive ? 'border-[#2ebd59]/40 bg-[#162719]/10' : 'border-red-500/30'
                            }`}
                          >
                            <div className="space-y-0.5 max-w-[240px]">
                              <div className={`text-[11px] font-mono font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{sys.name}</div>
                              <div className="text-[8px] text-slate-500 leading-dense">{sys.desc}</div>
                            </div>
                            
                            {/* Toggle Pill status */}
                            <div className={`w-9 h-5 rounded-full p-[2px] transition-all flex ${isActive ? 'bg-[#2ebd59] justify-end' : 'bg-slate-700 justify-start'}`}>
                              <span className="w-3.5 h-3.5 bg-white rounded-full block shadow" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#121c26] border border-[#1a2d42] p-2.5 rounded text-[9px] font-mono text-slate-400 leading-loose flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2ebd59] shrink-0" />
                    <span>ENCRIPTAÇÃO DE BACKUP ECU CONECTADA // PERMISSÕES GRANTED</span>
                  </div>
                </div>

                {/* Right col: Complete Warning logs in live stream */}
                <div className="lg:col-span-7 bg-[#0b1015]/90 border border-[#1a2d42] p-5 rounded-lg flex flex-col justify-between h-[420px]">
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="border-b border-[#1a2d42]/60 pb-3 mb-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-[18px] h-[18px] text-[#e01931]" />
                        <h3 className="text-xs font-black tracking-[0.25em] text-white uppercase">ALERTAS E ERROS DO SISTEMA OPERACIONAL</h3>
                      </div>
                      
                      <button 
                        onClick={t.clearAlarms}
                        className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-mono border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded shadow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        LIMPAR ALERTAS
                      </button>
                    </div>

                    {/* Scrollable diagnostic warning events */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-900 bg-black/50 rounded p-3 space-y-2">
                      {t.alarms.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                          <CheckCircle2 className="w-5 h-5 text-[#2ebd59] mr-2" />
                          Todos os buffers limpos. Histórico operacional operacionalmente estável.
                        </div>
                      ) : (
                        t.alarms.map((alarmText, idx) => {
                          const isError = alarmText.includes('🚨') || alarmText.includes('⚠️') || alarmText.includes('WARNING') || alarmText.includes('WARNING:');
                          const customAlarmKey = `alarm-log-item-${idx}`;
                          return (
                            <div 
                              key={customAlarmKey} 
                              id={`alarm-log-item-${idx}`}
                              className={`p-2.5 rounded border text-[10px] font-mono leading-relaxed transition-all duration-300 ${
                                isError 
                                  ? 'bg-red-950/20 border-red-500/40 text-red-300' 
                                  : 'bg-indigo-950/20 border-indigo-500/20 text-[#00f0ff]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[9px] text-slate-500 shrink-0">[{idx + 1}]</span>
                                <span>{alarmText}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================= TAB: REPORTS ======================= */}
          {t.activeTab === 'Reports' && (
            <div className="space-y-6 animate-fade-in duration-300">
              
              <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-6 max-w-4xl mx-auto space-y-6">
                
                {/* PDF Header detail style */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1a2d42]/60 pb-5 gap-3">
                  <div className="space-y-1">
                    <h2 className="text-base font-black tracking-widest text-white leading-none">RELATÓRIO OFICIAL DE ENGENHARIA DE CORRIDA RTS MOTORSPORT</h2>
                    <p className="text-[10px] font-mono text-[#e01931] uppercase tracking-[0.2em]">ARQUIVO CONSOLIDADO DE ESTATÍSTICA E DESEMPENHO</p>
                  </div>
                  
                  {/* Exporting button and interactive simulation triggers */}
                  <div>
                    {exportingStatus === "idle" && (
                      <button 
                        onClick={startTelemetryExport}
                        className="bg-[#1a2d42] hover:bg-[#2c4054] text-white hover:text-[#00f0ff] border border-indigo-500/30 font-mono text-[10px] py-2 px-4 rounded tracking-wider flex items-center gap-1.5 font-bold transition-all hover:shadow-[0_0_8px_rgba(0,240,255,0.25)]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        EXPORTAR DADOS DE TELEMETRIA COMPLETA
                      </button>
                    )}

                    {exportingStatus === "running" && (
                      <div className="bg-black/55 border border-amber-500/30 p-2 rounded-md flex flex-col w-56 space-y-1.5 font-mono text-[9px]">
                        <div className="flex justify-between text-amber-400 font-extrabold tracking-wider animate-pulse">
                          <span>EMPACOTANDO TELEMETRIA...</span>
                          <span>{exportProgress}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 transition-all duration-150" style={{ width: `${exportProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {exportingStatus === "done" && (
                      <div className="bg-[#162719] border border-[#2ebd59]/40 text-[#2ebd59] px-3.5 py-1.5 rounded-md font-mono text-[9.5px] font-black flex items-center gap-2 animate-bounce">
                        <CheckCircle2 className="w-4 h-4 animate-spin" />
                        ARQUIVO ZIP GERADO COM SUCESSO!
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid analytics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-black/40 border border-[#1a2d42]/40 p-4 rounded text-xs font-mono space-y-1 flex flex-col justify-between hover:border-cyan-500/30 transition-all cursor-pointer" onClick={() => setIsLoginOpen(true)}>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase">DADOS DO PILOTO</span>
                      <div className="font-bold text-white uppercase text-sm mt-0.5">{driverName}</div>
                    </div>
                    <div className="text-[10px] text-[#2ebd59] font-black uppercase flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Sessão Ativa ({driverBox})</span>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-[#1a2d42]/40 p-4 rounded text-xs font-mono space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">VOLTAS COMPLETADAS</span>
                    <div className="font-bold text-white text-sm">{t.currentLapNumber} Voltas de Telemetria</div>
                    <div className="text-[10px] text-slate-400">Distância percorrida na sessão: ~{(t.currentLapNumber * 4.31).toFixed(1)} km</div>
                  </div>
                  <div className="bg-black/40 border border-[#1a2d42]/40 p-4 rounded text-xs font-mono space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">VELOCIDADE MÁXIMA ALCANÇADA</span>
                    <div className="font-bold text-white text-sm">288 km/h</div>
                    <div className="text-[10px] text-slate-400 font-bold text-slate-300">Registrada na Reta Principal Castrol</div>
                  </div>
                  <div className="bg-black/40 border border-[#1a2d42]/40 p-4 rounded text-xs font-mono space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">CONSUMO DE COMBUSTÍVEL</span>
                    <div className="font-bold text-white text-sm">2.42 Litros por volta</div>
                    <div className="text-[10px] text-[#f5be1c] uppercase font-bold">Estratégia: Meta de 2 paradas de box</div>
                  </div>
                  <div className="bg-black/40 border border-[#1a2d42]/40 p-4 rounded text-xs font-mono space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">CONSISTÊNCIA DE PILOTAGEM</span>
                    <div className="font-bold text-[#00f0ff] text-sm">98.41%</div>
                    <div className="text-[10px] text-slate-400">Elevada precisão mecânica</div>
                  </div>
                  <div className="bg-black/40 border border-[#1a2d42]/40 p-4 rounded text-xs font-mono space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase">POSIÇÃO GERAL DA SESSÃO</span>
                    <div className="font-bold text-white text-sm flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      POSIÇÃO P1
                    </div>
                    <div className="text-[10px] text-[#2ebd59] font-bold">Setores s1/s2 roxos</div>
                  </div>
                </div>

                <div className="bg-red-950/20 border border-[#e01931]/30 p-4 rounded-md text-[11px] font-mono text-slate-300 leading-relaxed space-y-1 hover:border-red-500/50 transition-colors">
                  <span className="font-black text-[#e01931] uppercase">ANÁLISE DO ENGENHEIRO CHEFE:</span>
                  <p>
                    A telemetria do veículo demonstra uma excelente curva de eficiência nos setores técnicos. O mapa térmico dos pneus dianteiros é excepcionalmente compatível com a configuração atual do aerofólio traseiro (DRS de {t.setup.aeroWingAngle}°). O alto dowforce permite frenagens agressivas sem perdas na tangência. Sugerimos a transição para pneus Super Macios (SS) no final da próxima parada programada de box para reduzir o tempo da volta ideal oficial abaixo da meta de 1:29.300 segundos.
                  </p>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* Dynamic Pilot credentials validation popup/modal wrapper */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all" id="driver-login-dialog">
          <div className="bg-[#0b1015] border border-cyan-500/40 rounded-xl p-6 w-full max-w-sm space-y-5 shadow-[0_0_25px_rgba(0,240,255,0.15)] relative">
            {/* Close Button */}
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex p-2 bg-cyan-950/40 border border-cyan-500/30 rounded-full mb-1">
                <User className="w-6 h-6 text-[#00f0ff] animate-pulse" />
              </div>
              <h3 className="text-sm font-black tracking-widest text-white uppercase">AUTENTICAÇÃO DE PILOTO</h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Acesso à Telemetria RTS Motorsport</p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              setIsLoginOpen(false);
              t.addAlarm(`PILOTO AUTENTICADO: Conexão criptografada estabelecida para [ ${driverName} ] no terminal [ ${driverBox} ]`);
            }} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">NOME COMPLETO DO PILOTO</label>
                <input 
                  type="text" 
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Nome do piloto"
                  required
                  className="w-full bg-black/60 border border-slate-850 focus:border-[#00f0ff] rounded px-3 py-2 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all focus:shadow-[0_0_8px_rgba(0,240,255,0.15)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">BOX DA SQUADRA / CREW TERMINAL</label>
                <input 
                  type="text" 
                  value={driverBox}
                  onChange={(e) => setDriverBox(e.target.value)}
                  placeholder="BOX #23"
                  required
                  className="w-full bg-black/60 border border-slate-850 focus:border-[#00f0ff] rounded px-3 py-2 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all focus:shadow-[0_0_8px_rgba(0,240,120,0.15)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">MÉTODO DE AUTENTICAÇÃO (ECU KEY)</label>
                <input 
                  type="password" 
                  defaultValue="123456"
                  className="w-full bg-black/40 border border-slate-900 rounded px-3 py-2 text-xs font-mono text-slate-500 outline-none cursor-not-allowed"
                  disabled
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#00f0ff] hover:bg-cyan-400 text-black font-mono font-black text-xs py-2.5 rounded tracking-widest uppercase transition-all duration-300 shadow-[0_0_12px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2 mt-2"
              >
                AUTENTICAR PILOTO
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
