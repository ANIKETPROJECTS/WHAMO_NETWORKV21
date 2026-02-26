import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { useNetworkStore } from "@/lib/store";

interface TooltipWrapperProps {
  children: ReactNode;
  content: ReactNode;
  delayDuration?: number;
}

export function TooltipWrapper({ 
  children, 
  content, 
  delayDuration = 0 
}: TooltipWrapperProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="p-3 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl z-[9999]"
        >
          <div className="text-xs space-y-1 min-w-[150px]">
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function DataList({ data, title }: { data: any, title: string }) {
  if (!data) return null;
  
  const globalUnit = useNetworkStore(state => state.globalUnit);
  const unit = data.unit || globalUnit;
  const entries = Object.entries(data).filter(([key]) => {
    if (key === 'id' || key === 'label' || key === 'unit' || key === 'type') return false;
    if (data.type === 'surgeTank') {
      if (data.hasShape && key === 'diameter') return false;
      if (!data.hasShape && key === 'shape') return false;
      if (key === 'hasShape') return false;
    }
    return true;
  });
  
  const getUnit = (key: string) => {
    const units: Record<string, { SI: string, FPS: string }> = {
      elevation: { SI: 'm', FPS: 'ft' },
      tankTop: { SI: 'm', FPS: 'ft' },
      tankBottom: { SI: 'm', FPS: 'ft' },
      diameter: { SI: 'm', FPS: 'ft' },
      length: { SI: 'm', FPS: 'ft' },
      celerity: { SI: 'm/s', FPS: 'ft/s' },
      flow: { SI: 'm³/s', FPS: 'ft³/s' },
      distance: { SI: 'm', FPS: 'ft' },
      area: { SI: 'm²', FPS: 'ft²' },
      reservoirElevation: { SI: 'm', FPS: 'ft' },
      d: { SI: 'm', FPS: 'ft' },
      a: { SI: 'm²', FPS: 'ft²' },
    };
    return units[key]?.[unit as 'SI' | 'FPS'] || '';
  };
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center border-b pb-1 mb-1">
        <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
          {title}
        </div>
        <div className="text-[9px] font-medium px-1 bg-slate-100 rounded text-slate-500">
          {unit}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
        {entries.map(([key, value]) => {
          const unitStr = getUnit(key);
          return (
            <div key={key} className="contents">
              <span className="text-slate-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="text-slate-900 font-bold text-right">
                {typeof value === 'number' ? Number(value).toLocaleString() : String(value)}
                {unitStr && <span className="ml-0.5 text-[9px] font-normal text-slate-400">{unitStr}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
