import { Check, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface Material {
  id: string;
  name: string;
  price: number;
  tags: string[];
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  co2PerKg: number;
  waterPerKg: number;
  subTypes?: SubMaterial[];
}

export interface SubMaterial {
  id: string;
  name: string;
  price: number;
  co2PerKg: number;
  waterPerKg: number;
}

interface MaterialCardProps {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
  hasSubTypes?: boolean;
}

const MaterialCard = ({ material, isSelected, onSelect, hasSubTypes }: MaterialCardProps) => {
  const IconComponent = material.icon;
  
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden",
        isSelected 
          ? "border-primary bg-primary-light shadow-lg shadow-primary/20 scale-[1.02]" 
          : "border-transparent bg-muted hover:border-primary hover:translate-x-1 hover:shadow-md"
      )}
    >
      {/* Background gradient overlay */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          material.gradient,
          isSelected && "opacity-5"
        )} 
      />
      
      {/* Icon */}
      <div className={cn(
        "relative z-10 w-14 h-14 rounded-xl flex items-center justify-center text-primary-foreground flex-shrink-0 shadow-md",
        material.gradient
      )}>
        <IconComponent className="w-7 h-7" />
      </div>
      
      {/* Content */}
      <div className="flex-1 relative z-10">
        <h4 className="text-lg font-bold text-foreground mb-1">{material.name}</h4>
        {!hasSubTypes && (
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-extrabold text-primary">{material.price}</span>
            <span className="text-sm font-semibold text-muted-foreground">EGP/kg</span>
          </div>
        )}
        {hasSubTypes && (
          <p className="text-sm text-muted-foreground mb-2">Multiple types available</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {material.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-0.5 bg-card border border-primary/30 rounded-full text-xs font-semibold text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Check mark or arrow */}
      {hasSubTypes ? (
        <ChevronRight className={cn(
          "w-6 h-6 text-muted-foreground transition-all duration-300 relative z-10",
          isSelected && "text-primary rotate-90"
        )} />
      ) : (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
          isSelected 
            ? "gradient-primary text-primary-foreground scale-100 opacity-100" 
            : "scale-0 opacity-0"
        )}>
          <Check className="w-5 h-5" strokeWidth={3} />
        </div>
      )}
    </div>
  );
};

export default MaterialCard;
