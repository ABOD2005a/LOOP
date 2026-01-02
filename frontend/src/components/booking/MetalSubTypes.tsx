import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import { SubMaterial } from "./MaterialCard";

interface MetalSubTypesProps {
  subTypes: SubMaterial[];
  selectedSubType: string | null;
  onSelectSubType: (id: string) => void;
}

const metalIcons: Record<string, string> = {
  iron: "🔩",
  aluminum: "🥫",
  copper: "🔶",
  steel: "⚙️",
  brass: "🔔",
};

const MetalSubTypes = ({ subTypes, selectedSubType, onSelectSubType }: MetalSubTypesProps) => {
  return (
    <div className="mt-4 ml-4 pl-4 border-l-2 border-primary/30 space-y-2 animate-fade-in">
      <p className="text-sm font-semibold text-muted-foreground mb-3">Select metal type:</p>
      {subTypes.map((subType) => (
        <div
          key={subType.id}
          onClick={() => onSelectSubType(subType.id)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
            selectedSubType === subType.id
              ? "bg-primary/10 border-2 border-primary shadow-sm"
              : "bg-card border-2 border-transparent hover:bg-muted hover:border-primary/50"
          )}
        >
          <span className="text-2xl">{metalIcons[subType.id] || "🔧"}</span>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{subType.name}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-primary">{subType.price}</span>
                <span className="text-xs font-semibold text-muted-foreground">EGP/kg</span>
              </div>
            </div>
            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
              <span>CO₂: {subType.co2PerKg}kg/kg</span>
              <span>Water: {subType.waterPerKg}L/kg</span>
            </div>
          </div>

          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
            selectedSubType === subType.id
              ? "gradient-primary text-primary-foreground scale-100"
              : "bg-muted scale-75 opacity-50"
          )}>
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetalSubTypes;
