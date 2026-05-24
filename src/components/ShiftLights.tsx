import React, { useState, useEffect } from 'react';

interface ShiftLightGroupProps {
  rpm: number;
}

export function ShiftLightGroup({ rpm }: ShiftLightGroupProps) {
  const [pulse, setPulse] = useState(false);

  // High redline flashing effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rpm > 8250) {
      interval = setInterval(() => {
        setPulse(p => !p);
      }, 75); // fast strobe flash for shift warnings
    } else {
      setPulse(false);
    }
    return () => clearInterval(interval);
  }, [rpm]);

  // Total 10 indicators
  // Lights mapping: 3 Green | 3 Yellow | 3 Red | 1 Blue (Max Redline)
  const isShiftPulse = rpm > 8250;

  return (
    <div className="flex items-center gap-[4px] bg-black/50 border border-[#1a2d42] px-3 py-1.5 rounded-full shadow-inner select-none">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((itemIndex) => {
        let active = false;
        let colorClass = 'bg-[#121c26]'; // default off

        if (isShiftPulse) {
          // Flash ALL LEDs bright neon cyan/blue to alert shift immediately
          active = pulse;
          colorClass = active ? 'bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]' : 'bg-[#121c26]';
        } else {
          // Incremental light tracking
          if (itemIndex <= 2) {
            // Green LEDs (5000 - 6200 RPM)
            const cutoff = 5000 + itemIndex * 400;
            active = rpm > cutoff;
            colorClass = active ? 'bg-[#2ebd59] shadow-[0_0_10px_#2ebd59]' : 'bg-[#121c26]';
          } else if (itemIndex <= 5) {
            // Yellow LEDs (6200 - 7200 RPM)
            const cutoff = 6200 + (itemIndex - 3) * 333;
            active = rpm > cutoff;
            colorClass = active ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-[#121c26]';
          } else if (itemIndex <= 8) {
            // Red LEDs (7200 - 8000 RPM)
            const cutoff = 7200 + (itemIndex - 6) * 266;
            active = rpm > cutoff;
            colorClass = active ? 'bg-[#e01931] shadow-[0_0_12px_#e01931]' : 'bg-[#121c26]';
          } else {
            // Final Blue Shift threshold Light (8000 - 8250 RPM)
            active = rpm > 8000;
            colorClass = active ? 'bg-indigo-500 shadow-[0_0_14px_rgb(99,102,241)]' : 'bg-[#121c26]';
          }
        }

        return (
          <div 
            key={itemIndex}
            className={`w-[7px] h-[7px] rounded-full transition-all duration-75 ${colorClass}`}
          ></div>
        );
      })}
    </div>
  );
}
export default ShiftLightGroup;
