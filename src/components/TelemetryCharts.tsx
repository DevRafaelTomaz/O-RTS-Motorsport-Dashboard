import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Activity, CircleDot, RefreshCw } from 'lucide-react';

const TABS = [
  { id: 'acceleration', label: 'ACELERAÇÃO (G)', color: '#2ebd59' },
  { id: 'speed', label: 'VELOCIDADE (KM/H)', color: '#ffffff' },
  { id: 'throttle', label: 'ACELERADOR (%)', color: '#2ebd59' },
  { id: 'brake', label: 'FREIO (%)', color: '#e01931' },
  { id: 'steering', label: 'VOLANTE (GRAUS)', color: '#00f0ff' },
  { id: 'gear', label: 'MARCHA', color: '#fbbf24' },
];

interface TelemetryChartsProps {
  chartHistory: any[];
  currentSector: number;
  currentDelta: string;
  onActiveTabChange?: (tabId: string) => void;
}

interface LiveChartCanvasProps {
  chartHistory: any[];
  activeTab: string;
  currentSector: number;
  isMobile: boolean;
}

// Sub-component optimized with React.memo to isolate Recharts render complexity
const LiveChartCanvas = React.memo(({ chartHistory, activeTab, currentSector, isMobile }: LiveChartCanvasProps) => {
  // Memoized transformation of chartHistory, only recalculated when size changes
  const memoizedData = React.useMemo(() => {
    return chartHistory.map(item => ({ ...item }));
  }, [chartHistory.length]);

  if (chartHistory.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        Aguardando transmissão de telemetria...
      </div>
    );
  }

  // Configuration for dynamic metric lines
  let dataKey1 = '';
  let dataKey2 = '';
  let stroke1 = '#2ebd59';
  let stroke2 = '#e01931';
  let name1 = '';
  let name2 = '';
  let yDomain: [any, any] = [0, 100];

  switch (activeTab) {
    case 'acceleration':
      dataKey1 = 'gForceLat';
      dataKey2 = 'gForceLat'; 
      stroke1 = '#00f0ff';
      stroke2 = '#fbbf24';
      name1 = 'Força G Lateral';
      name2 = 'Força G Longitudinal';
      yDomain = [-3, 3];
      break;
    case 'speed':
      dataKey1 = 'speed';
      stroke1 = '#ffffff';
      name1 = 'Velocidade do Veículo (km/h)';
      yDomain = [0, 310];
      break;
    case 'throttle':
      dataKey1 = 'throttle';
      stroke1 = '#2ebd59';
      name1 = 'Acelerador (%)';
      yDomain = [0, 100];
      break;
    case 'brake':
      dataKey1 = 'brake';
      stroke1 = '#e01931';
      name1 = 'Pressão do Freio (%)';
      yDomain = [0, 100];
      break;
    case 'steering':
      dataKey1 = 'steering';
      stroke1 = '#38bdf8';
      name1 = 'Ângulo do Volante (graus)';
      yDomain = [-150, 150];
      break;
    case 'gear':
      dataKey1 = 'gear';
      stroke1 = '#fbbf24';
      name1 = 'Marcha Sequencial';
      yDomain = [1, 7];
      break;
  }

  // Custom tooltips with motorsport theme aesthetics
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1015]/95 border border-[#1a2d42]/80 p-2.5 rounded shadow-xl font-mono text-[10px] sm:text-xs text-slate-200">
          <p className="text-[8px] sm:text-[10px] text-slate-400 mb-0.5">REGISTRO: {payload[0].payload.time}</p>
          <p className="font-bold border-b border-[#1a2d42]/40 pb-0.5 flex justify-between gap-3 sm:gap-4">
            <span>{name1}:</span>
            <span style={{ color: stroke1 }}>{payload[0].value}</span>
          </p>
          {activeTab === 'acceleration' && payload[1] && (
            <p className="font-bold pt-0.5 flex justify-between gap-3 sm:gap-4">
              <span>{name2}:</span>
              <span style={{ color: stroke2 }}>
                {payload[0].payload.gear > 3 
                  ? (payload[0].payload.gForceLat * 0.45).toFixed(2) 
                  : (payload[0].payload.gForceLat * 0.75).toFixed(2)} G
              </span>
            </p>
          )}
          <p className="text-[8px] sm:text-[9px] text-[#fbbf24] mt-1 uppercase tracking-wider">
            Setor {payload[0].payload.sector || currentSector}
          </p>
        </div>
      );
    }
    return null;
  };

  const fontSize = isMobile ? 8 : 10;
  
  // Custom, highly legible responsive margins preventing any digit clipping on narrow viewports
  const chartMargin = isMobile 
    ? { 
        top: 38, 
        right: 4, 
        left: activeTab === 'steering' 
          ? -12 
          : (activeTab === 'speed' || activeTab === 'acceleration') 
            ? -16 
            : -20, 
        bottom: 4 
      } 
    : { 
        top: 32, 
        right: 18, 
        left: (activeTab === 'speed' || activeTab === 'steering' || activeTab === 'acceleration') ? 2 : -8, 
        bottom: 10 
      };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={memoizedData} margin={chartMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="#0e1720" />
        <XAxis 
          dataKey="time" 
          stroke="#456a8e" 
          fontSize={fontSize} 
          tickLine={false} 
          tickMargin={isMobile ? 3 : 8}
          minTickGap={isMobile ? 12 : 20}
        />
        <YAxis 
          domain={yDomain} 
          stroke="#456a8e" 
          fontSize={fontSize} 
          tickLine={false} 
          tickMargin={isMobile ? 2 : 6}
          allowDecimals={true}
        />
        <Tooltip content={<CustomTooltip />} />
        
        <Line
          type="monotone"
          dataKey={dataKey1}
          stroke={stroke1}
          strokeWidth={2}
          dot={false}
          name={name1}
          activeDot={{ r: 4, stroke: stroke1, strokeWidth: 2, fill: '#0a0f14' }}
          style={{ 
            filter: `drop-shadow(0 0 4px ${stroke1}CC)`,
            transition: 'stroke 0.4s ease-in-out, filter 0.4s ease-in-out, stroke-width 0.3s ease-in-out'
          }}
          animationDuration={450}
          animationEasing="ease-in-out"
        />
        
        {activeTab === 'acceleration' && (
          <Line
            type="monotone"
            dataKey="gForceLat" 
            stroke={stroke2}
            strokeWidth={1.5}
            dot={false}
            name={name2}
            activeDot={{ r: 4, stroke: stroke2, fill: '#0a0f14' }}
            style={{ 
              filter: `drop-shadow(0 0 3px ${stroke2}aa)`,
              transition: 'stroke 0.4s ease-in-out, filter 0.4s ease-in-out, stroke-width 0.3s ease-in-out'
            }}
            animationDuration={450}
            animationEasing="ease-in-out"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}, (prevProps, nextProps) => {
  if (prevProps.isMobile !== nextProps.isMobile) return false;
  if (prevProps.activeTab !== nextProps.activeTab) return false;
  if (prevProps.currentSector !== nextProps.currentSector) return false;
  if (prevProps.chartHistory.length !== nextProps.chartHistory.length) return false;

  const len = prevProps.chartHistory.length;
  if (len > 0) {
    const prevLast = prevProps.chartHistory[len - 1];
    const nextLast = nextProps.chartHistory[len - 1];
    if (prevLast?.time !== nextLast?.time || prevLast?.speed !== nextLast?.speed) {
      return false;
    }
  }
  return true;
});

LiveChartCanvas.displayName = 'LiveChartCanvas';

function TelemetryCharts({ chartHistory, currentSector, currentDelta, onActiveTabChange }: TelemetryChartsProps) {
  const [activeTab, setActiveTab] = useState<string>('acceleration');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onActiveTabChange) {
      onActiveTabChange(tabId);
    }
  };

  const getMobileLabel = (id: string, defaultLabel: string) => {
    if (!isMobile) return defaultLabel;
    switch (id) {
      case 'acceleration': return 'G-FORCE';
      case 'speed': return 'VEL (KM/H)';
      case 'throttle': return 'ACEL %';
      case 'brake': return 'FREIO %';
      case 'steering': return 'DIR';
      case 'gear': return 'MARCHA';
      default: return defaultLabel;
    }
  };

  return (
    <div className="bg-[#0b1015]/90 border border-[#1a2d42] rounded-lg p-3 sm:p-5 flex flex-col justify-between h-[380px] sm:h-[360px] backdrop-blur-md shadow-lg select-none" id="telemetry-charts-panel">
      {/* Dynamic injection style block for smooth axis and path updates */}
      <style>{`
        #telemetry-charts-panel .recharts-line-path {
          transition: d 400ms cubic-bezier(0.25, 1, 0.5, 1), stroke 400ms ease-in-out, filter 400ms ease-in-out;
        }
        #telemetry-charts-panel .recharts-cartesian-axis-tick {
          transition: transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 300ms ease-in-out;
        }
        #telemetry-charts-panel .recharts-cartesian-axis-tick-value {
          transition: fill 300ms ease, font-size 300ms ease, transform 450ms cubic-bezier(0.25, 1, 0.5, 1);
        }
        #telemetry-charts-panel .recharts-text {
          transition: fill 300ms ease, font-size 300ms ease, transform 450ms cubic-bezier(0.25, 1, 0.5, 1);
        }
        #telemetry-charts-panel .recharts-cartesian-grid-line {
          transition: stroke 500ms ease, opacity 500ms ease;
        }
      `}</style>

      {/* Chart Headers and Navigation tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#1a2d42]/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#e01931]" id="telemetry-charts-icon" />
          <h2 className="text-[11px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.25em] text-white uppercase">ANÁLISE DE TELEMETRIA EM FLUXO</h2>
          <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd59] animate-pulse"></span>
            <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider hidden xs:inline">60Hz</span>
          </div>
        </div>
        
        {/* Dynamic selector tabs */}
        <div className="flex flex-wrap gap-1 bg-black/60 p-1 rounded-md border border-[#1a2d42]/50 w-full md:w-auto justify-start sm:justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`text-[8px] sm:text-[9px] font-mono font-bold px-1.5 sm:px-2 py-1 sm:py-1.5 rounded ${
                activeTab === tab.id
                  ? 'bg-[#1a2d42] text-white border-b border-[#e01931]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              } transition-all duration-200 tracking-wider uppercase flex-1 md:flex-initial text-center`}
            >
              {getMobileLabel(tab.id, tab.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="flex-1 min-h-0 bg-black/30 rounded p-1 sm:p-2 border border-slate-950/30 relative">
        
        {/* Sectors metadata visual boxes floating inside graph */}
        <div className="absolute top-1.5 left-2 sm:left-6 right-2 flex justify-between pointer-events-none select-none px-1.5 sm:px-4 text-[8px] sm:text-[9px] font-mono z-10 gap-1 sm:gap-2">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${currentSector === 1 ? 'bg-indigo-950/45 border-indigo-500/50 text-[#00f0ff]' : 'bg-black/60 border-[#1a2d42] text-slate-500'}`}>
            <CircleDot className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            <span>S1<span className="hidden sm:inline"> (ACELERAÇÃO)</span></span>
          </div>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${currentSector === 2 ? 'bg-[#121c14] border-emerald-500/50 text-[#2ebd59]' : 'bg-black/60 border-[#1a2d42] text-slate-500'}`}>
            <CircleDot className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            <span>S2<span className="hidden sm:inline"> (MIOLO TÉCNICO)</span></span>
          </div>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${currentSector === 3 ? 'bg-red-950/45 border-red-500/50 text-[#e01931]' : 'bg-black/60 border-[#1a2d42] text-slate-500'}`}>
            <CircleDot className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            <span>S3<span className="hidden sm:inline"> (REGENERATIVA)</span></span>
          </div>
        </div>

        <LiveChartCanvas 
          chartHistory={chartHistory}
          activeTab={activeTab}
          currentSector={currentSector}
          isMobile={isMobile}
        />
      </div>

      {/* Live Track delta statistics matching best track comparison */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-4 text-[8px] sm:text-[10px] font-mono text-slate-400 mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#1a2d42]/60 bg-[#070c10]/40 px-2 sm:px-3 py-1.5 rounded w-full">
        <div className="flex flex-wrap gap-x-2.5 gap-y-1">
          <span className="flex items-center gap-1 scale-[0.95] origin-left"><span className="w-1.5 h-1.5 bg-[#2ebd59] rounded-full"></span> VERDE = OK</span>
          <span className="flex items-center gap-1 scale-[0.95] origin-left"><span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full"></span> AMARELO = Subesterço</span>
          <span className="flex items-center gap-1 scale-[0.95] origin-left"><span className="w-1.5 h-1.5 bg-[#e01931] rounded-full"></span> VERMELHO = ABS</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
          <span className="text-slate-500">DIFERENÇA:</span>
          <span className={`font-bold text-[9px] sm:text-[10px] ${parseFloat(currentDelta) <= 0 ? 'text-[#2ebd59]' : 'text-[#e01931]'}`}>{currentDelta}s vs ideal</span>
        </div>
      </div>

    </div>
  );
}

const MemoizedTelemetryCharts = React.memo(TelemetryCharts, (prevProps, nextProps) => {
  // Only trigger re-render if essential props have changed
  if (prevProps.currentSector !== nextProps.currentSector) return false;
  if (prevProps.currentDelta !== nextProps.currentDelta) return false;
  if (prevProps.chartHistory.length !== nextProps.chartHistory.length) return false;

  const len = prevProps.chartHistory.length;
  if (len > 0) {
    const prevLast = prevProps.chartHistory[len - 1];
    const nextLast = nextProps.chartHistory[len - 1];
    if (prevLast?.time !== nextLast?.time || prevLast?.speed !== nextLast?.speed) {
      return false;
    }
  }
  return true;
});

MemoizedTelemetryCharts.displayName = 'TelemetryCharts';

export default MemoizedTelemetryCharts;
