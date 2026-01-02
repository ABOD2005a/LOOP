import { Truck, Shield, Clock, Banknote } from "lucide-react";
import pickupTruck from "@/assets/pickup-truck.png";

const features = [
  {
    icon: Truck,
    title: "Free Pickup",
    description: "We collect from your doorstep",
  },
  {
    icon: Shield,
    title: "Trusted Service",
    description: "Professional & reliable team",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Same day weighing & payment",
  },
  {
    icon: Banknote,
    title: "Best Prices",
    description: "Competitive market rates",
  },
];

const PickupInfo = () => {
  return (
    <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl p-6 mb-6 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 opacity-20">
        <img src={pickupTruck} alt="" className="w-full h-full object-contain" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-primary" />
        Why Choose Loop?
      </h3>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {features.map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-primary">
                <FeatureIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PickupInfo;
