import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Loader2, 
  MapPin, 
  Clock, 
  Package, 
  Check, 
  Building, 
  Home, 
  Navigation, 
  MapPinned,
  FileText,
  Wrench,
  Newspaper,
  Droplets,
  Plus,
  Trash2,
  Leaf,
  TreePine,
  ArrowLeft,
  Recycle,
  TrendingUp,
  Sparkles,
  Truck,
  Shield,
  Banknote,
  ChevronRight,
  CalendarIcon
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import recyclingHero from "../../assets/recycling-hero.jpg";
import ecoHero from "../../assets/eco-hero.jpg";
import pickupTruck from "../../assets/pickup-truck.png";
import ecoPattern from "../../assets/eco-pattern.png";
import "./Choose.css";

// ============= DATA =============

const metalSubTypes = [
  { id: "iron", name: "Iron / Steel", price: 12, co2PerKg: 2.0, waterPerKg: 12 },
  { id: "aluminum", name: "Aluminum", price: 25, co2PerKg: 4.5, waterPerKg: 20 },
  { id: "copper", name: "Copper", price: 85, co2PerKg: 3.5, waterPerKg: 25 },
  { id: "brass", name: "Brass", price: 45, co2PerKg: 3.0, waterPerKg: 18 },
  { id: "steel", name: "Stainless Steel", price: 18, co2PerKg: 2.5, waterPerKg: 15 },
];

const materials = [
  {
    id: "metal",
    name: "Metal",
    price: 15,
    tags: ["High Value", "Premium"],
    gradient: "gradient-metal",
    icon: Wrench,
    co2PerKg: 2.5,
    waterPerKg: 15,
    subTypes: metalSubTypes,
  },
  {
    id: "paper",
    name: "Paper",
    price: 3,
    tags: ["Eco-Friendly", "Common"],
    gradient: "gradient-paper",
    icon: Newspaper,
    co2PerKg: 1.5,
    waterPerKg: 10,
  },
  {
    id: "plastic",
    name: "Plastic",
    price: 8,
    tags: ["Popular", "Easy"],
    gradient: "gradient-plastic",
    icon: Droplets,
    co2PerKg: 2.0,
    waterPerKg: 12,
  },
];

const metalIcons = {
  iron: "🔩",
  aluminum: "🥫",
  copper: "🔶",
  steel: "⚙️",
  brass: "🔔",
};

// ============= SUB-COMPONENTS =============

const BookingHeader = ({ onBack }) => {
  return (
    <header className="booking-header">
      <div className="container">
        <div className="flex items-center gap-4 py-4">
          <button
            onClick={onBack}
            className="booking-header__back-button"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gradient">Schedule a Pickup</h1>
            <p className="text-sm text-muted-foreground">Book an appointment with our collector</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-section__image-wrapper">
        <img
          src={recyclingHero}
          alt="Eco-friendly recycling"
          className="hero-section__image"
        />
        <div className="hero-section__overlay" />
      </div>

      <div className="hero-section__content">
        <div className="max-w-xl">
          <div className="hero-section__badge animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Earn money by recycling</span>
          </div>

          <h2 className="hero-section__title animate-slide-up">
            Turn Your Recyclables
            <br />
            <span>Into Cash</span>
          </h2>

          <p className="hero-section__description animate-slide-up" style={{ animationDelay: "100ms" }}>
            Schedule a free pickup and get paid instantly. Help save the planet while earning money.
          </p>

          <div className="hero-section__stats animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="hero-section__stat-card">
              <div className="flex items-center justify-center mb-2">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <div className="hero-section__stat-value">500+</div>
              <div className="hero-section__stat-label">Tons Recycled</div>
            </div>
            <div className="hero-section__stat-card">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="hero-section__stat-value">2K+</div>
              <div className="hero-section__stat-label">Trees Saved</div>
            </div>
            <div className="hero-section__stat-card">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="hero-section__stat-value">50K+</div>
              <div className="hero-section__stat-label">EGP Paid</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse-soft" />
      <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: "500ms" }} />
    </section>
  );
};

const StepsIndicator = ({ currentStep }) => {
  const steps = [
    { icon: MapPin, label: "Address" },
    { icon: Package, label: "Materials" },
    { icon: CalendarIcon, label: "Schedule" },
    { icon: Check, label: "Confirm" },
  ];

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
                  isCurrent && "gradient-primary text-white shadow-primary scale-110",
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

const PickupInfo = () => {
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

  return (
    <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl p-6 mb-6 overflow-hidden relative">
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
                <FeatureIcon className="w-5 h-5 text-white" />
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

const AddressSection = ({ address, setAddress }) => {
  const updateField = (field, value) => {
    setAddress({ ...address, [field]: value });
  };

  return (
    <section className="section-card group">
      <div className="section-card__accent-bar" />
      
      <h2 className="section-card__title">
        <MapPin className="w-5 h-5 text-primary drop-shadow-sm" />
        Pickup Address
      </h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="street" className="font-semibold text-foreground flex items-center gap-2">
            <Navigation className="w-4 h-4 text-muted-foreground" />
            Street Name <span className="text-primary">*</span>
          </Label>
          <Input
            id="street"
            type="text"
            value={address.street}
            onChange={(e) => updateField("street", e.target.value)}
            placeholder="Enter your street name"
            className="h-12 px-4 text-base border-2"
            required
            maxLength={200}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buildingNumber" className="font-semibold text-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              Building No. <span className="text-primary">*</span>
            </Label>
            <Input
              id="buildingNumber"
              type="text"
              value={address.buildingNumber}
              onChange={(e) => updateField("buildingNumber", e.target.value)}
              placeholder="e.g., 15"
              className="h-12 px-4 text-base border-2"
              required
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor" className="font-semibold text-foreground">
              Floor
            </Label>
            <Input
              id="floor"
              type="text"
              value={address.floor}
              onChange={(e) => updateField("floor", e.target.value)}
              placeholder="e.g., 3rd"
              className="h-12 px-4 text-base border-2"
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartment" className="font-semibold text-foreground flex items-center gap-2">
              <Home className="w-4 h-4 text-muted-foreground" />
              Apartment
            </Label>
            <Input
              id="apartment"
              type="text"
              value={address.apartment}
              onChange={(e) => updateField("apartment", e.target.value)}
              placeholder="e.g., 5A"
              className="h-12 px-4 text-base border-2"
              maxLength={20}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area" className="font-semibold text-foreground flex items-center gap-2">
              <MapPinned className="w-4 h-4 text-muted-foreground" />
              Area / District <span className="text-primary">*</span>
            </Label>
            <Input
              id="area"
              type="text"
              value={address.area}
              onChange={(e) => updateField("area", e.target.value)}
              placeholder="e.g., Maadi, Cairo"
              className="h-12 px-4 text-base border-2"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark" className="font-semibold text-foreground">
              Landmark (Optional)
            </Label>
            <Input
              id="landmark"
              type="text"
              value={address.landmark}
              onChange={(e) => updateField("landmark", e.target.value)}
              placeholder="Near the main mosque..."
              className="h-12 px-4 text-base border-2"
              maxLength={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const DateTimeSection = ({ date, setDate, selectedTime, setSelectedTime }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const tomorrow = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 30);

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  return (
    <section className="section-card group">
      <div className="section-card__accent-bar" />

      <h2 className="section-card__title">
        <Clock className="w-5 h-5 text-primary drop-shadow-sm" />
        Select Date & Time <span className="text-primary">*</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block font-semibold text-foreground">
            Pickup Date
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-2",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                {date ? (
                  <span className="font-semibold text-foreground">
                    {format(date, "EEEE, MMMM d, yyyy")}
                  </span>
                ) : (
                  <span>Select a pickup date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setCalendarOpen(false);
                }}
                disabled={(date) => date < tomorrow || date > maxDate}
                initialFocus
              />
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground text-center">
                  Available: Tomorrow to {format(maxDate, "MMM d")}
                </p>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={() => setDate(tomorrow)}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-lg border transition-all",
                date && format(date, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")
                  ? "gradient-primary text-white border-primary"
                  : "bg-muted border-border text-foreground hover:border-primary"
              )}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setDate(addDays(new Date(), 2))}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-lg border transition-all",
                date && format(date, "yyyy-MM-dd") === format(addDays(new Date(), 2), "yyyy-MM-dd")
                  ? "gradient-primary text-white border-primary"
                  : "bg-muted border-border text-foreground hover:border-primary"
              )}
            >
              {format(addDays(new Date(), 2), "EEE, MMM d")}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-foreground">Preferred Time</label>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(selectedTime === slot ? null : slot)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 border-2 rounded-xl font-medium text-sm transition-all",
                  selectedTime === slot
                    ? "gradient-primary text-white border-primary shadow-primary scale-[1.02]"
                    : "border-border bg-background text-foreground hover:bg-muted hover:border-primary"
                )}
              >
                <Clock className="w-4 h-4" />
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const NotesSection = ({ notes, setNotes }) => {
  return (
    <section className="section-card group">
      <div className="section-card__accent-bar" />

      <h2 className="section-card__title">
        <FileText className="w-5 h-5 text-primary drop-shadow-sm" />
        Additional Notes
        <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
      </h2>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any special instructions for the collector..."
        className="min-h-[120px] px-4 py-3 text-base border-2"
      />
    </section>
  );
};

const SuccessScreen = ({ details, onViewBookings, onBackHome }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: `url(${ecoHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center shadow-primary animate-pulse-soft">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gradient mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your pickup has been scheduled successfully.</p>
        </div>

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
              <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <span className="block text-sm text-muted-foreground">Date & Time</span>
                <span className="font-semibold text-foreground">{details.date}</span>
                <span className="block text-sm text-muted-foreground">{details.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-green-50 rounded-xl">
              <Leaf className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <span className="block text-sm text-primary">Environmental Impact</span>
                <span className="font-semibold text-primary">
                  {details.totalCo2.toFixed(1)} kg CO₂ saved
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 gradient-primary rounded-xl text-white">
              <div>
                <span className="block font-semibold">Estimated Earnings</span>
                <span className="text-sm opacity-80">{details.totalWeight} kg total</span>
              </div>
              <span className="text-2xl font-extrabold">{details.totalEarnings} EGP</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onViewBookings} 
            className="flex-1 h-12 gradient-primary text-white font-semibold rounded-xl shadow-primary hover:opacity-90"
          >
            View My Bookings
          </Button>
          <Button 
            onClick={onBackHome}
            variant="outline"
            className="flex-1 h-12 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white"
          >
            New Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

const MetalSubTypes = ({ subTypes, selectedSubType, onSelectSubType }) => {
  return (
    <div className="mt-4 ml-4 pl-4 border-l-2 border-primary/30 space-y-2 animate-fade-in">
      <p className="text-sm font-semibold text-muted-foreground mb-3">Select metal type:</p>
      {subTypes.map((subType) => (
        <div
          key={subType.id}
          onClick={() => onSelectSubType(subType.id)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
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
            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
            selectedSubType === subType.id
              ? "gradient-primary text-white scale-100"
              : "bg-muted scale-75 opacity-50"
          )}>
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        </div>
      ))}
    </div>
  );
};

const MaterialCard = ({ material, isSelected, onSelect, hasSubTypes }) => {
  const IconComponent = material.icon;
  
  return (
    <div onClick={onSelect} className={cn("material-card", isSelected && "material-card--selected")}>
      <div className={cn("absolute inset-0 opacity-0 transition-opacity", material.gradient, isSelected && "opacity-5")} />
      
      <div className={cn("material-card__icon", material.gradient)}>
        <IconComponent className="w-7 h-7" />
      </div>
      
      <div className="material-card__content">
        <h4 className="material-card__name">{material.name}</h4>
        {!hasSubTypes && (
          <div className="flex items-baseline gap-1 mb-2">
            <span className="material-card__price">{material.price}</span>
            <span className="text-sm font-semibold text-muted-foreground">EGP/kg</span>
          </div>
        )}
        {hasSubTypes && (
          <p className="text-sm text-muted-foreground mb-2">Multiple types available</p>
        )}
        <div className="material-card__tags">
          {material.tags.map((tag) => (
            <span key={tag} className="material-card__tag">{tag}</span>
          ))}
        </div>
      </div>
      
      {hasSubTypes ? (
        <ChevronRight className={cn("w-6 h-6 text-muted-foreground transition-all relative z-10", isSelected && "text-primary rotate-90")} />
      ) : (
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all relative z-10", isSelected ? "gradient-primary text-white scale-100 opacity-100" : "scale-0 opacity-0")}>
          <Check className="w-5 h-5" strokeWidth={3} />
        </div>
      )}
    </div>
  );
};

const WeightInput = ({ weight, setWeight }) => {
  const quickWeights = [5, 10, 25, 50, 100];

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
          className="w-full px-4 pr-12 py-3.5 text-lg font-semibold border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
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
              "py-2.5 px-2 rounded-lg font-semibold text-sm border transition-all",
              weight === qw
                ? "gradient-primary text-white border-primary shadow-primary"
                : "bg-muted border-border text-foreground hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5"
            )}
          >
            {qw} kg
          </button>
        ))}
      </div>
    </div>
  );
};

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item animate-scale-in">
      <div className={cn("cart-item__icon", item.gradient)}>
        <span>{item.weight}</span>
      </div>
      
      <div className="cart-item__content">
        <div className="flex items-center gap-2">
          <span className="cart-item__name">
            {item.subTypeName || item.materialName}
          </span>
          {item.subTypeName && (
            <span className="text-xs text-muted-foreground">({item.materialName})</span>
          )}
        </div>
        <div className="cart-item__details">
          <span>{item.weight} kg × {item.pricePerKg} EGP</span>
        </div>
      </div>
      
      <div className="cart-item__price">
        <span className="cart-item__total">{item.total}</span>
        <span className="text-sm text-muted-foreground ml-1">EGP</span>
      </div>
      
      <button onClick={onRemove} className="cart-item__remove" aria-label="Remove item">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

const Cart = ({ items, onRemoveItem, onClearAll }) => {
  const totalEarnings = items.reduce((sum, item) => sum + item.total, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const totalCo2 = items.reduce((sum, item) => sum + item.co2Saved, 0);
  const totalWater = items.reduce((sum, item) => sum + item.waterSaved, 0);
  const treesSaved = Math.floor(totalWeight * 0.02);

  if (items.length === 0) return null;

  return (
    <div className="cart animate-fade-in">
      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Your Cart</h3>
            <span className="text-sm text-muted-foreground">{items.length} item(s)</span>
          </div>
        </div>
        <button onClick={onClearAll} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <CartItem key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 gradient-primary rounded-xl text-white">
          <div>
            <span className="block text-sm opacity-90">Total Earnings</span>
            <span className="block text-sm opacity-75">{totalWeight} kg total</span>
          </div>
          <span className="text-3xl font-extrabold">{totalEarnings} EGP</span>
        </div>

        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${ecoHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Your Environmental Impact</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-card/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-primary">
                  <Leaf className="w-4 h-4" />
                  <span className="font-extrabold">{totalCo2.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">kg CO₂ saved</span>
              </div>
              <div className="text-center p-2 bg-card/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-primary">
                  <TreePine className="w-4 h-4" />
                  <span className="font-extrabold">{treesSaved}</span>
                </div>
                <span className="text-xs text-muted-foreground">trees saved</span>
              </div>
              <div className="text-center p-2 bg-card/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-primary">
                  <Droplets className="w-4 h-4" />
                  <span className="font-extrabold">{totalWater}</span>
                </div>
                <span className="text-xs text-muted-foreground">liters saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialCalculator = ({ cartItems, setCartItems }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSubType, setSelectedSubType] = useState(null);
  const [weight, setWeight] = useState(0);

  const currentMaterial = materials.find((m) => m.id === selectedMaterial);
  const currentSubType = currentMaterial?.subTypes?.find((s) => s.id === selectedSubType);

  const handleMaterialSelect = (id) => {
    if (selectedMaterial === id) {
      setSelectedMaterial(null);
      setSelectedSubType(null);
    } else {
      setSelectedMaterial(id);
      setSelectedSubType(null);
    }
  };

  const handleAddToCart = () => {
    if (!currentMaterial) {
      toast.error("Please select a material");
      return;
    }

    if (currentMaterial.subTypes && !currentSubType) {
      toast.error("Please select a metal type");
      return;
    }

    if (weight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    const pricePerKg = currentSubType?.price || currentMaterial.price;
    const co2PerKg = currentSubType?.co2PerKg || currentMaterial.co2PerKg;
    const waterPerKg = currentSubType?.waterPerKg || currentMaterial.waterPerKg;

    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      materialId: currentMaterial.id,
      materialName: currentMaterial.name,
      subTypeId: currentSubType?.id,
      subTypeName: currentSubType?.name,
      weight,
      pricePerKg,
      total: Math.round(pricePerKg * weight),
      co2Saved: co2PerKg * weight,
      waterSaved: Math.round(waterPerKg * weight),
      gradient: currentMaterial.gradient,
    };

    setCartItems([...cartItems, newItem]);
    toast.success(`Added ${weight}kg of ${currentSubType?.name || currentMaterial.name} to cart`);
    setWeight(0);
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const canAddToCart = currentMaterial && weight > 0 && (!currentMaterial.subTypes || currentSubType);

  return (
    <section className="bg-muted rounded-3xl p-6 md:p-8">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Add Materials</h3>
            <span className="px-3 py-1.5 bg-muted rounded-full text-sm font-semibold text-muted-foreground">
              {selectedMaterial ? "1 selected" : "Choose one"}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {materials.map((material) => (
              <div key={material.id}>
                <MaterialCard
                  material={material}
                  isSelected={selectedMaterial === material.id}
                  onSelect={() => handleMaterialSelect(material.id)}
                  hasSubTypes={!!material.subTypes}
                />
                
                {selectedMaterial === material.id && material.subTypes && (
                  <MetalSubTypes
                    subTypes={material.subTypes}
                    selectedSubType={selectedSubType}
                    onSelectSubType={setSelectedSubType}
                  />
                )}
              </div>
            ))}
          </div>

          <WeightInput weight={weight} setWeight={setWeight} />

          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="w-full mt-6 h-14 gradient-primary text-white text-lg font-semibold rounded-xl shadow-primary hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>

        <div>
          {cartItems.length > 0 ? (
            <Cart items={cartItems} onRemoveItem={handleRemoveItem} onClearAll={handleClearCart} />
          ) : (
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Wrench className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Your Cart is Empty</h3>
              <p className="text-muted-foreground">
                Select materials and add them to your cart to schedule a pickup.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Main Component
const Choose = () => {
  const navigate = useNavigate();
  
  const [address, setAddress] = useState({
    street: "",
    buildingNumber: "",
    floor: "",
    apartment: "",
    area: "",
    landmark: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [date, setDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const formatAddress = () => {
    const parts = [
      address.buildingNumber && `Building ${address.buildingNumber}`,
      address.street,
      address.floor && `Floor ${address.floor}`,
      address.apartment && `Apt ${address.apartment}`,
      address.area,
      address.landmark && `(${address.landmark})`,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const validateAddress = () => {
    if (!address.street.trim()) {
      toast.error("Please enter your street name");
      return false;
    }
    if (!address.buildingNumber.trim()) {
      toast.error("Please enter your building number");
      return false;
    }
    if (!address.area.trim()) {
      toast.error("Please enter your area/district");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddress()) return;

    if (cartItems.length === 0) {
      toast.error("Please add at least one material to your cart");
      return;
    }

    if (!date) {
      toast.error("Please select a pickup date");
      return;
    }

    if (!selectedTime) {
      toast.error("Please select a preferred time slot");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const totalEarnings = cartItems.reduce((sum, item) => sum + item.total, 0);
    const totalWeight = cartItems.reduce((sum, item) => sum + item.weight, 0);
    const totalCo2 = cartItems.reduce((sum, item) => sum + item.co2Saved, 0);
    
    setBookingDetails({
      address: formatAddress(),
      items: cartItems,
      date: format(date, "EEEE, MMMM d, yyyy"),
      time: selectedTime,
      totalEarnings,
      totalWeight,
      totalCo2,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    toast.success("Booking confirmed successfully!");
  };

  const handleBack = () => {
    if (showSuccess) {
      setShowSuccess(false);
      setAddress({ street: "", buildingNumber: "", floor: "", apartment: "", area: "", landmark: "" });
      setCartItems([]);
      setDate(undefined);
      setSelectedTime(null);
      setNotes("");
    } else {
      navigate(-1);
    }
  };

  if (showSuccess && bookingDetails) {
    return (
      <SuccessScreen
        details={bookingDetails}
        onViewBookings={() => toast.info("My Bookings page coming soon!")}
        onBackHome={handleBack}
      />
    );
  }

  const totalEarnings = cartItems.reduce((sum, item) => sum + item.total, 0);

  const currentStep = useMemo(() => {
    if (!address.street || !address.buildingNumber || !address.area) return 0;
    if (cartItems.length === 0) return 1;
    if (!date || !selectedTime) return 2;
    return 3;
  }, [address, cartItems, date, selectedTime]);

  return (
    <div className="choose-page">
      <div className="choose-page__background-gradient" />
      
      <div 
        className="choose-page__pattern"
        style={{ backgroundImage: `url(${ecoPattern})` }}
      />

      <div className="choose-page__blur-effect choose-page__blur-effect--top-left" />
      <div className="choose-page__blur-effect choose-page__blur-effect--middle-right" />
      <div className="choose-page__blur-effect choose-page__blur-effect--bottom-left" />

      <BookingHeader onBack={handleBack} />

      <main className="container py-8 max-w-7xl relative z-10">
        <HeroSection />
        <StepsIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <AddressSection address={address} setAddress={setAddress} />
              <MaterialCalculator cartItems={cartItems} setCartItems={setCartItems} />
              <DateTimeSection
                date={date}
                setDate={setDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />
              <NotesSection notes={notes} setNotes={setNotes} />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <PickupInfo />

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm sticky top-24">
                <h3 className="font-bold text-lg text-foreground mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items in cart</span>
                    <span className="font-semibold text-foreground">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total weight</span>
                    <span className="font-semibold text-foreground">
                      {cartItems.reduce((sum, item) => sum + item.weight, 0)} kg
                    </span>
                  </div>
                  {date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pickup date</span>
                      <span className="font-semibold text-foreground">{format(date, "MMM d")}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time slot</span>
                      <span className="font-semibold text-foreground">{selectedTime.split(" - ")[0]}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated Earnings</span>
                    <span className="text-3xl font-extrabold text-primary">{totalEarnings} <span className="text-lg">EGP</span></span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full h-14 gradient-primary text-white text-lg font-semibold rounded-xl shadow-primary hover:opacity-90 transition-all disabled:opacity-50 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free pickup • No hidden fees
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <footer className="page-footer">
        <div className="container page-footer__text">
          <p>© 2024 Loop. Helping Egypt recycle, one pickup at a time. 🌱</p>
        </div>
      </footer>
    </div>
  );
};

export default Choose