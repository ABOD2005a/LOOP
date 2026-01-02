import { Check, Calendar, MapPin, Package, Clock, Leaf } from "lucide-react";
import { Button } from "../ui/button";
import ecoHero from "@/assets/eco-hero.jpg";
import { CartItemData } from "./CartItem";

interface BookingDetails {
  address: string;
  items: CartItemData[];
  date: string;
  time: string;
  totalEarnings: number;
  totalWeight: number;
  totalCo2: number;
}

interface SuccessScreenProps {
  details: BookingDetails;
  onViewBookings: () => void;
  onBackHome: () => void;
}

const SuccessScreen = ({ details, onViewBookings, onBackHome }: SuccessScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: `url(${ecoHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center shadow-primary animate-pulse-soft">
            <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gradient mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your pickup has been scheduled successfully.</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-muted rounded-xl">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <span className="block text-sm text-muted-foreground">Pickup Address</span>
                <span className="font-semibold text-foreground">{details.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-muted rounded-xl">
              <Package className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <span className="block text-sm text-muted-foreground">Materials</span>
                <div className="space-y-1">
                  {details.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="font-semibold text-foreground">
                        {item.subTypeName || item.materialName}
                      </span>
                      <span className="text-muted-foreground">{item.weight} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-muted rounded-xl">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <span className="block text-sm text-muted-foreground">Date & Time</span>
                <span className="font-semibold text-foreground">{details.date}</span>
                <span className="block text-sm text-muted-foreground">{details.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-primary-light rounded-xl">
              <Leaf className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <span className="block text-sm text-primary">Environmental Impact</span>
                <span className="font-semibold text-primary">
                  {details.totalCo2.toFixed(1)} kg CO₂ saved
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 gradient-primary rounded-xl text-primary-foreground">
              <div>
                <span className="block font-semibold">Estimated Earnings</span>
                <span className="text-sm opacity-80">{details.totalWeight} kg total</span>
              </div>
              <span className="text-2xl font-extrabold">{details.totalEarnings} EGP</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onViewBookings} 
            className="flex-1 h-12 gradient-primary text-primary-foreground font-semibold rounded-xl shadow-primary hover:opacity-90 transition-opacity"
          >
            View My Bookings
          </Button>
          <Button 
            onClick={onBackHome}
            className="flex-1 h-12 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
          >
            New Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
