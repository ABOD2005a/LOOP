import { MapPin, Package, Calendar, Check } from "lucide-react";
import { cn } from "../lib/utils";

interface StepsIndicatorProps {
  currentStep: number;
}

const steps = [
  { icon: MapPin, label: "Address" },
  { icon: Package, label: "Materials" },
  { icon: Calendar, label: "Schedule" },
  { icon: Check, label: "Confirm" },
];

const StepsIndicator = ({ currentStep }: StepsIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8 px-4">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index <= currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  isCurrent && "gradient-primary text-primary-foreground shadow-primary scale-110",
                  isActive && !isCurrent && "bg-primary/20 text-primary",
                  !isActive && "bg-muted text-muted-foreground"
                )}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold transition-colors duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-3 h-1 rounded-full overflow-hidden bg-muted">
                <div
                  className={cn(
                    "h-full gradient-primary transition-all duration-500",
                    index < currentStep ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepsIndicator;
