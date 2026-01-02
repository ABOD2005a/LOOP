import { cn } from "../lib/utils";

interface WeightInputProps {
  weight: number;
  setWeight: (weight: number) => void;
}

const quickWeights = [5, 10, 25, 50, 100];

const WeightInput = ({ weight, setWeight }: WeightInputProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-base font-bold text-foreground">
        Enter Weight (kg)
      </label>
      
      <div className="relative">
        <input
          type="number"
          value={weight || ""}
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          placeholder="0.0"
          min="0"
          step="0.1"
          className="w-full px-4 pr-12 py-3.5 text-lg font-semibold border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
          kg
        </span>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {quickWeights.map((qw) => (
          <button
            key={qw}
            type="button"
            onClick={() => setWeight(qw)}
            className={cn(
              "py-2.5 px-2 rounded-lg font-semibold text-sm border transition-all duration-200",
              weight === qw
                ? "gradient-primary text-primary-foreground border-primary shadow-primary"
                : "bg-muted border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5"
            )}
          >
            {qw} kg
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeightInput;
