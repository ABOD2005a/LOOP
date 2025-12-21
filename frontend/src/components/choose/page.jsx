/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
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
// import { cn } from "../lib/utils";
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
// import recyclingHero from "../../assets/recycling-hero.jpg";
import ecoHero from "../../assets/Mnemonic-Device.png";
import pickupTruck from "../../assets/pickup-truck.png";
import NavbarAfter from "../Header_Footer/NavbarAfter/page"
import "./Choose.css";
// import ecoPattern from "../../assets/eco-pattern.png";

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

// ============= COMPONENTS =============

const HeroSection = () => (
  <section className="hero-section">
    <div className="hero-section__image-wrapper">
      <img src={ecoHero} alt="Eco-friendly recycling" className="hero-section__image" />
      <div className="hero-section__overlay" />
    </div>
    <div className="hero-section__content">
      <div style={{ maxWidth: '36rem',marginBottom:'85px'}}>
        {/* <div className="hero-section__badge animate-fade-in">
          <Sparkles style={{ width: '1rem', height: '1rem' }} />
          <span>Earn money by recycling</span>
        </div> */}
        <h2 className="hero-section__title animate-slide-up">
          Turn Your Recyclables<br /><span>Into Cash</span>
        </h2>
        <p className="hero-section__description animate-slide-up" style={{ animationDelay: "100ms" }}>
          Schedule a free pickup and get paid instantly. Help save the planet while earning money.
        </p>
        <div className="hero-section__stats animate-slide-up" style={{ animationDelay: "200ms" }}>
          {[
            { icon: Recycle, value: "500+", label: "Tons Recycled" },
            { icon: Leaf, value: "2K+", label: "Trees Saved" },
            { icon: TrendingUp, value: "50K+", label: "EGP Paid" }
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="hero-section__stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div className="hero-section__stat-value">{value}</div>
              <div className="hero-section__stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const StepsIndicator = ({ currentStep }) => {
  const steps = [
    { icon: MapPin, label: "Address" },
    { icon: Package, label: "Materials" },
    { icon: CalendarIcon, label: "Schedule" },
    { icon: Check, label: "Confirm" },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 1rem' }}>
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index <= currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: index < steps.length - 1 ? '1' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div
                className={isCurrent ? "gradient-primary shadow-primary" : ""}
                style={{
                  width: '3rem', height: '3rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 300ms', transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                  background: isActive && !isCurrent ? 'rgba(34, 197, 94, 0.2)' : !isActive ? 'var(--muted)' : undefined,
                  color: isCurrent ? 'white' : isActive ? 'var(--primary)' : 'var(--muted-foreground)'
                }}
              >
                <StepIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div style={{ flex: '1', margin: '0 0.75rem', height: '0.25rem', borderRadius: '9999px', background: 'var(--muted)' }}>
                <div className="gradient-primary" style={{ height: '100%', transition: 'width 500ms', width: index < currentStep ? '100%' : '0' }} />
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
    { icon: Truck, title: "Free Pickup", description: "We collect from your doorstep" },
    { icon: Shield, title: "Trusted Service", description: "Professional & reliable team" },
    { icon: Clock, title: "Fast Processing", description: "Same day weighing & payment" },
    { icon: Banknote, title: "Best Prices", description: "Competitive market rates" },
  ];

  return (
    <div style={{ borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-2.5rem', bottom: '-2.5rem', width: '10rem', height: '10rem', opacity: '0.2' }}>
        <img src={pickupTruck} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Truck style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary)' }} />
        Why Choose Loop?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', position: 'relative', zIndex: '10' }}>
        {features.map(({ icon: Icon, title, description }, index) => (
          <div key={title} className="animate-fade-in" style={{ display: 'flex', gap: '0.75rem', animationDelay: `${index * 100}ms` }}>
            <div className="gradient-primary shadow-primary" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
              <Icon style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
            </div>
            <div>
              <h4 style={{ fontWeight: '600', fontSize: '0.875rem' }}>{title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddressSection = ({ address, setAddress }) => {
  const updateField = (field, value) => setAddress({ ...address, [field]: value });

  return (
    <section className="section-card">
      <h2 className="section-card__title">
        <MapPin style={{ width: '1.25rem', height: '1.25rem' }} />
        Pickup Address
      </h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Label htmlFor="street" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation style={{ width: '1rem', height: '1rem', color: 'var(--muted-foreground)' }} />
            Street Name <span style={{ color: 'var(--primary)' }}>*</span>
          </Label>
          <Input id="street" value={address.street} onChange={(e) => updateField("street", e.target.value)} 
            placeholder="Enter your street name" required maxLength={200} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="buildingNumber" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building style={{ width: '1rem', height: '1rem', color: 'var(--muted-foreground)' }} />
              Building No. <span style={{ color: 'var(--primary)' }}>*</span>
            </Label>
            <Input id="buildingNumber" value={address.buildingNumber} onChange={(e) => updateField("buildingNumber", e.target.value)} 
              placeholder="e.g., 15" required maxLength={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="floor">Floor</Label>
            <Input id="floor" value={address.floor} onChange={(e) => updateField("floor", e.target.value)} 
              placeholder="e.g., 3rd" maxLength={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="apartment" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home style={{ width: '1rem', height: '1rem', color: 'var(--muted-foreground)' }} />
              Apartment
            </Label>
            <Input id="apartment" value={address.apartment} onChange={(e) => updateField("apartment", e.target.value)} 
              placeholder="e.g., 5A" maxLength={20} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="area" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPinned style={{ width: '1rem', height: '1rem', color: 'var(--muted-foreground)' }} />
              Area / District <span style={{ color: 'var(--primary)' }}>*</span>
            </Label>
            <Input id="area" value={address.area} onChange={(e) => updateField("area", e.target.value)} 
              placeholder="e.g., Maadi, Cairo" required maxLength={100} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input id="landmark" value={address.landmark} onChange={(e) => updateField("landmark", e.target.value)} 
              placeholder="Near the main mosque..." maxLength={200} />
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
  const timeSlots = ["8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 2:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"];

  return (
    <section className="section-card">
      <h2 className="section-card__title">
        <Clock style={{ width: '1.25rem', height: '1.25rem' }} />
        Select Date & Time <span style={{ color: 'var(--primary)' }}>*</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Pickup Date</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="date-picker-button"
                style={{ 
                  width: '100%', 
                  height: '3rem', 
                  justifyContent: 'flex-start', 
                  textAlign: 'left',
                  background: 'white',
                  color: 'var(--foreground)',
                  border: '2px solid var(--border)'
                }}
              >
                <CalendarIcon style={{ marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: 'var(--primary)' }} />
                {date ? <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>{format(date, "EEEE, MMMM d, yyyy")}</span> : <span style={{ color: 'var(--muted-foreground)' }}>Select a pickup date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              style={{ 
                width: 'auto', 
                padding: '0', 
                zIndex: 9999,
                background: 'white !important',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
              }} 
              align="start" 
              className="calendar-popover"
            >
              <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem' }}>
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={(d) => { setDate(d); setCalendarOpen(false); }} 
                  disabled={(d) => d < tomorrow || d > maxDate} 
                  initialFocus
                  styles={{
                    root: { background: 'white' },
                    months: { background: 'white' },
                    month: { background: 'white' },
                    table: { background: 'white' },
                    head: { background: 'white' },
                    tbody: { background: 'white' }
                  }}
                />
              </div>
              <div style={{ padding: '0 1rem 1rem', background: 'white', borderRadius: '0 0 1rem 1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                  Available: Tomorrow to {format(maxDate, "MMM d")}
                </p>
              </div>
            </PopoverContent>
          </Popover>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            {[tomorrow, addDays(new Date(), 2)].map((d, i) => (
              <button key={i} type="button" onClick={() => setDate(d)}
                className={date && format(date, "yyyy-MM-dd") === format(d, "yyyy-MM-dd") ? "gradient-primary" : ""}
                style={{
                  padding: '0.375rem 0.75rem', fontSize: '0.875rem', fontWeight: '600', borderRadius: '0.5rem',
                  border: '1px solid', transition: 'all 0.2s', cursor: 'pointer',
                  borderColor: date && format(date, "yyyy-MM-dd") === format(d, "yyyy-MM-dd") ? 'var(--primary)' : 'var(--border)',
                  background: date && format(date, "yyyy-MM-dd") === format(d, "yyyy-MM-dd") ? undefined : 'var(--muted)',
                  color: date && format(date, "yyyy-MM-dd") === format(d, "yyyy-MM-dd") ? 'white' : 'var(--foreground)'
                }}
              >
                {i === 0 ? "Tomorrow" : format(d, "EEE, MMM d")}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Preferred Time</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {timeSlots.map((slot) => (
              <button key={slot} type="button" onClick={() => setSelectedTime(selectedTime === slot ? null : slot)}
                className={selectedTime === slot ? "gradient-primary shadow-primary" : ""}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                  border: '2px solid', borderRadius: '0.75rem', fontWeight: '500', fontSize: '0.875rem',
                  transition: 'all 0.2s', cursor: 'pointer',
                  borderColor: selectedTime === slot ? 'var(--primary)' : 'var(--border)',
                  background: selectedTime === slot ? undefined : 'var(--background)',
                  color: selectedTime === slot ? 'white' : 'var(--foreground)',
                  transform: selectedTime === slot ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <Clock style={{ width: '1rem', height: '1rem' }} />
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const NotesSection = ({ notes, setNotes }) => (
  <section className="section-card">
    <h2 className="section-card__title">
      <FileText style={{ width: '1.25rem', height: '1.25rem' }} />
      Additional Notes
      <span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'var(--muted-foreground)', marginLeft: '0.5rem' }}>(Optional)</span>
    </h2>
    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} 
      placeholder="Any special instructions for the collector..." 
      style={{ minHeight: '120px', padding: '0.75rem 1rem' }} />
  </section>
);

const SuccessScreen = ({ details, onViewBookings, onBackHome }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
    <div style={{ position: 'absolute', inset: '0', opacity: '0.05', backgroundImage: `url(${ecoHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <div style={{ position: 'relative', zIndex: '10', width: '100%', maxWidth: '28rem' }} className="animate-scale-in">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div className="gradient-primary shadow-primary animate-pulse-soft" style={{ width: '5rem', height: '5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check style={{ width: '2.5rem', height: '2.5rem', color: 'white', strokeWidth: '3' }} />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Your pickup has been scheduled successfully.</p>
      </div>
      <div style={{ background: 'var(--card)', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: MapPin, label: "Pickup Address", value: details.address },
            { icon: CalendarIcon, label: "Date & Time", value: details.date, extra: details.time }
          ].map(({ icon: Icon, label, value, extra }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', background: 'var(--muted)', borderRadius: '0.75rem' }}>
              <Icon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary)', marginTop: '0.125rem' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{label}</span>
                <span style={{ fontWeight: '600' }}>{value}</span>
                {extra && <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{extra}</span>}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', background: 'var(--muted)', borderRadius: '0.75rem' }}>
            <Package style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary)', marginTop: '0.125rem' }} />
            <div style={{ flex: '1' }}>
              <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Materials</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {details.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600' }}>{item.subTypeName || item.materialName}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{item.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.75rem' }}>
            <Leaf style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary)', marginTop: '0.125rem' }} />
            <div>
              <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--primary)' }}>Environmental Impact</span>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{details.totalCo2.toFixed(1)} kg CO₂ saved</span>
            </div>
          </div>
          <div className="gradient-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', color: 'white' }}>
            <div>
              <span style={{ display: 'block', fontWeight: '600' }}>Estimated Earnings</span>
              <span style={{ fontSize: '0.875rem', opacity: '0.8' }}>{details.totalWeight} kg total</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{details.totalEarnings} EGP</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Button onClick={onViewBookings} className="gradient-primary shadow-primary" 
          style={{ flex: '1', height: '3rem', fontWeight: '600', borderRadius: '0.75rem' }}>
          View My Bookings
        </Button>
        <Button onClick={onBackHome} variant="outline"
          style={{ flex: '1', height: '3rem', border: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: '600', borderRadius: '0.75rem' }}>
          New Booking
        </Button>
      </div>
    </div>
  </div>
);

const MetalSubTypes = ({ subTypes, selectedSubType, onSelectSubType }) => (
  <div className="animate-fade-in" style={{ marginTop: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(34, 197, 94, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>Select metal type:</p>
    {subTypes.map((subType) => (
      <div key={subType.id} onClick={() => onSelectSubType(subType.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem',
          cursor: 'pointer', transition: 'all 0.2s',
          background: selectedSubType === subType.id ? 'rgba(34, 197, 94, 0.1)' : 'var(--card)',
          border: '2px solid',
          borderColor: selectedSubType === subType.id ? 'var(--primary)' : 'transparent',
          boxShadow: selectedSubType === subType.id ? 'var(--shadow-sm)' : 'none'
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>{metalIcons[subType.id] || "🔧"}</span>
        <div style={{ flex: '1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '700' }}>{subType.name}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>{subType.price}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>EGP/kg</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
            <span>CO₂: {subType.co2PerKg}kg/kg</span>
            <span>Water: {subType.waterPerKg}L/kg</span>
          </div>
        </div>
        <div style={{
          width: '1.5rem', height: '1.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
          background: selectedSubType === subType.id ? 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 70%, 45%) 100%)' : 'var(--muted)',
          color: selectedSubType === subType.id ? 'white' : 'transparent',
          transform: selectedSubType === subType.id ? 'scale(1)' : 'scale(0.75)',
          opacity: selectedSubType === subType.id ? '1' : '0.5'
        }}>
          <Check style={{ width: '1rem', height: '1rem', strokeWidth: '3' }} />
        </div>
      </div>
    ))}
  </div>
);

const MaterialCard = ({ material, isSelected, onSelect, hasSubTypes }) => {
  const IconComponent = material.icon;
  
  return (
    <div onClick={onSelect} className={`material-card ${isSelected ? 'material-card--selected' : ''}`}>
      <div className={material.gradient} style={{ position: 'absolute', inset: '0', opacity: isSelected ? '0.05' : '0', transition: 'opacity 0.3s' }} />
      <div className={`material-card__icon ${material.gradient}`}>
        <IconComponent style={{ width: '1.75rem', height: '1.75rem' }} />
      </div>
      <div className="material-card__content">
        <h4 className="material-card__name">{material.name}</h4>
        {!hasSubTypes && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <span className="material-card__price">{material.price}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>EGP/kg</span>
          </div>
        )}
        {hasSubTypes && <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Multiple types available</p>}
        <div className="material-card__tags">
          {material.tags.map((tag) => <span key={tag} className="material-card__tag">{tag}</span>)}
        </div>
      </div>
      {hasSubTypes ? (
        <ChevronRight style={{ width: '1.5rem', height: '1.5rem', color: isSelected ? 'var(--primary)' : 'var(--muted-foreground)', transition: 'all 0.3s', transform: isSelected ? 'rotate(90deg)' : 'rotate(0)', position: 'relative', zIndex: '10' }} />
      ) : (
        <div style={{
          width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s', position: 'relative', zIndex: '10',
          background: isSelected ? 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 70%, 45%) 100%)' : 'transparent',
          color: isSelected ? 'white' : 'transparent',
          transform: isSelected ? 'scale(1)' : 'scale(0)',
          opacity: isSelected ? '1' : '0'
        }}>
          <Check style={{ width: '1.25rem', height: '1.25rem', strokeWidth: '3' }} />
        </div>
      )}
    </div>
  );
};

const WeightInput = ({ weight, setWeight }) => {
  const quickWeights = [5, 10, 25, 50, 100];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700' }}>Enter Weight (kg)</label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          value={weight || ""}
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          placeholder="0.0"
          min="0"
          step="0.1"
          style={{
            width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', fontSize: '1.125rem', fontWeight: '600',
            border: '2px solid var(--border)', borderRadius: '0.75rem', background: 'var(--background)',
            outline: 'none', transition: 'all 0.2s'
          }}
        />
        <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', fontWeight: '700' }}>kg</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
        {quickWeights.map((qw) => (
          <button
            key={qw}
            type="button"
            onClick={() => setWeight(qw)}
            className={weight === qw ? "gradient-primary shadow-primary" : ""}
            style={{
              padding: '0.625rem 0.5rem', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.875rem',
              border: '1px solid', transition: 'all 0.2s', cursor: 'pointer',
              borderColor: weight === qw ? 'var(--primary)' : 'var(--border)',
              background: weight === qw ? undefined : 'var(--muted)',
              color: weight === qw ? 'white' : 'var(--foreground)'
            }}
          >
            {qw} kg
          </button>
        ))}
      </div>
    </div>
  );
};

const CartItem = ({ item, onRemove }) => (
  <div className="cart-item animate-scale-in">
    <div className={`cart-item__icon ${item.gradient}`}>
      <span>{item.weight}</span>
    </div>
    <div className="cart-item__content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="cart-item__name">{item.subTypeName || item.materialName}</span>
        {item.subTypeName && <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>({item.materialName})</span>}
      </div>
      <div className="cart-item__details">
        <span>{item.weight} kg × {item.pricePerKg} EGP</span>
      </div>
    </div>
    <div className="cart-item__price">
      <span className="cart-item__total">{item.total}</span>
      <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginLeft: '0.25rem' }}>EGP</span>
    </div>
    <button onClick={onRemove} className="cart-item__remove" aria-label="Remove item">
      <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
    </button>
  </div>
);

const Cart = ({ items, onRemoveItem, onClearAll }) => {
  const totalEarnings = items.reduce((sum, item) => sum + item.total, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const totalCo2 = items.reduce((sum, item) => sum + item.co2Saved, 0);
  const totalWater = items.reduce((sum, item) => sum + item.waterSaved, 0);
  const treesSaved = Math.floor(totalWeight * 0.02);

  if (items.length === 0) return null;

  return (
    <div className="cart animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="gradient-primary" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Your Cart</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{items.length} item(s)</span>
          </div>
        </div>
        <button onClick={onClearAll} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--destructive)', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}>
          <Trash2 style={{ width: '1rem', height: '1rem' }} />
          Clear All
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {items.map((item) => <CartItem key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="gradient-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', color: 'white' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.875rem', opacity: '0.9' }}>Total Earnings</span>
            <span style={{ display: 'block', fontSize: '0.875rem', opacity: '0.75' }}>{totalWeight} kg total</span>
          </div>
          <span style={{ fontSize: '1.875rem', fontWeight: '800' }}>{totalEarnings} EGP</span>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem', padding: '1rem', background: 'linear-gradient(to bottom right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <div style={{ position: 'absolute', inset: '0', opacity: '0.05', backgroundImage: `url(${ecoHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{ position: 'relative', zIndex: '10' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Leaf style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary)' }} />
              <span style={{ fontWeight: '700' }}>Your Environmental Impact</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { icon: Leaf, value: totalCo2.toFixed(1), label: 'kg CO₂ saved' },
                { icon: TreePine, value: treesSaved, label: 'trees saved' },
                { icon: Droplets, value: totalWater, label: 'liters saved' }
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(var(--card-rgb, 255, 255, 255), 0.5)', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
                    <Icon style={{ width: '1rem', height: '1rem' }} />
                    <span style={{ fontWeight: '800' }}>{value}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{label}</span>
                </div>
              ))}
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

  const canAddToCart = currentMaterial && weight > 0 && (!currentMaterial.subTypes || currentSubType);

  return (
    <section style={{ background: 'var(--muted)', borderRadius: '1.5rem', padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ background: 'var(--card)', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(var(--border-rgb, 0, 0, 0), 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Add Materials</h3>
            <span style={{ padding: '0.375rem 0.75rem', background: 'var(--muted)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
              {selectedMaterial ? "1 selected" : "Choose one"}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
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
            className="gradient-primary shadow-primary"
            style={{ width: '100%', marginTop: '1.5rem', height: '3.5rem', fontSize: '1.125rem', fontWeight: '600', borderRadius: '0.75rem', transition: 'all 0.3s', opacity: !canAddToCart ? '0.5' : '1', cursor: !canAddToCart ? 'not-allowed' : 'pointer' }}
          >
            <Plus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Add to Cart
          </Button>
        </div>
        <div>
          {cartItems.length > 0 ? (
            <Cart items={cartItems} onRemoveItem={(id) => { setCartItems(cartItems.filter((item) => item.id !== id)); toast.info("Item removed from cart"); }} onClearAll={() => { setCartItems([]); toast.info("Cart cleared"); }} />
          ) : (
            <div style={{ background: 'var(--card)', borderRadius: '1.5rem', padding: '2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(var(--border-rgb, 0, 0, 0), 0.5)', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', background: 'var(--muted)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wrench style={{ width: '2rem', height: '2rem', color: 'var(--muted-foreground)' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your Cart is Empty</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>Select materials and add them to your cart to schedule a pickup.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Choose = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", buildingNumber: "", floor: "", apartment: "", area: "", landmark: "" });
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
    if (!address.street.trim()) { toast.error("Please enter your street name"); return false; }
    if (!address.buildingNumber.trim()) { toast.error("Please enter your building number"); return false; }
    if (!address.area.trim()) { toast.error("Please enter your area/district"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;
    if (cartItems.length === 0) { toast.error("Please add at least one material to your cart"); return; }
    if (!date) { toast.error("Please select a pickup date"); return; }
    if (!selectedTime) { toast.error("Please select a preferred time slot"); return; }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setBookingDetails({
      address: formatAddress(),
      items: cartItems,
      date: format(date, "EEEE, MMMM d, yyyy"),
      time: selectedTime,
      totalEarnings: cartItems.reduce((sum, item) => sum + item.total, 0),
      totalWeight: cartItems.reduce((sum, item) => sum + item.weight, 0),
      totalCo2: cartItems.reduce((sum, item) => sum + item.co2Saved, 0),
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
    return <SuccessScreen details={bookingDetails} onViewBookings={() => toast.info("My Bookings page coming soon!")} onBackHome={handleBack} />;
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
      <NavbarAfter/>
      <div className="choose-page__background-gradient" />
      {/* <div className="choose-page__pattern" style={{ backgroundImage: `url(${ecoPattern})` }} /> */}
      <div className="choose-page__blur-effect choose-page__blur-effect--top-left" />
      <div className="choose-page__blur-effect choose-page__blur-effect--middle-right" />
      <div className="choose-page__blur-effect choose-page__blur-effect--bottom-left" />
      <main className="container" style={{ paddingTop: '4rem', paddingBottom: '2rem', maxWidth: '80rem', position: 'relative', zIndex: '10' }}>
        <HeroSection />
        <StepsIndicator currentStep={currentStep} />
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            <div style={{ gridColumn: 'span 12 / span 12' }} className="lg:col-span-8">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AddressSection address={address} setAddress={setAddress} />
                <MaterialCalculator cartItems={cartItems} setCartItems={setCartItems} />
                <DateTimeSection date={date} setDate={setDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                <NotesSection notes={notes} setNotes={setNotes} />
              </div>
            </div>
            <div style={{ gridColumn: 'span 12 / span 12' }} className="lg:col-span-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <PickupInfo />
                <div style={{ background: 'var(--card)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '6rem' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '1rem' }}>Booking Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: 'Items in cart', value: cartItems.length },
                      { label: 'Total weight', value: `${cartItems.reduce((sum, item) => sum + item.weight, 0)} kg` },
                      date && { label: 'Pickup date', value: format(date, "MMM d") },
                      selectedTime && { label: 'Time slot', value: selectedTime.split(" - ")[0] }
                    ].filter(Boolean).map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>
                        <span style={{ fontWeight: '600' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--muted-foreground)' }}>Estimated Earnings</span>
                      <span style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--primary)' }}>{totalEarnings} <span style={{ fontSize: '1.125rem' }}>EGP</span></span>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting || cartItems.length === 0} className="gradient-primary shadow-primary"
                    style={{ width: '100%', height: '3.5rem', fontSize: '1.125rem', fontWeight: '600', borderRadius: '0.75rem', transition: 'all 0.3s', opacity: isSubmitting || cartItems.length === 0 ? '0.5' : '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {isSubmitting ? (
                      <>
                        <Loader2 style={{ width: '1.25rem', height: '1.25rem' }} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                      </>
                    )}
                  </Button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textAlign: 'center', marginTop: '0.75rem' }}>
                    Free pickup • No hidden fees
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Choose;