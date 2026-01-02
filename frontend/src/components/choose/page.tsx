import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import BookingHeader from "../booking/BookingHeader";
import HeroSection from "../booking/HeroSection";
import StepsIndicator from "../booking/StepsIndicator";
import PickupInfo from "../booking/PickupInfo";
import AddressSection, { AddressData } from "../booking/AddressSection";
import MaterialCalculator from "../booking/MaterialCalculator";
import DateTimeSection from "../booking/DateTimeSection";
import NotesSection from "../booking/NotesSection";
import SuccessScreen from "../booking/SuccessScreen";
import { Button } from "../ui/button";
import { CartItemData } from "../booking/CartItem";
import ecoPattern from "../../assets/eco-pattern.png";

const Index = () => {
  const navigate = useNavigate();
  
  // Address state
  const [address, setAddress] = useState<AddressData>({
    street: "",
    buildingNumber: "",
    floor: "",
    apartment: "",
    area: "",
    landmark: "",
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  
  // Other form state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const totalEarnings = cartItems.reduce((sum, item) => sum + item.total, 0);
    const totalWeight = cartItems.reduce((sum, item) => sum + item.weight, 0);
    const totalCo2 = cartItems.reduce((sum, item) => sum + item.co2Saved, 0);
    
    setBookingDetails({
      address: formatAddress(),
      items: cartItems,
      date: format(date!, "EEEE, MMMM d, yyyy"),
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
      // Reset form
      setAddress({
        street: "",
        buildingNumber: "",
        floor: "",
        apartment: "",
        area: "",
        landmark: "",
      });
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

  // Calculate current step for progress indicator
  const currentStep = useMemo(() => {
    if (!address.street || !address.buildingNumber || !address.area) return 0;
    if (cartItems.length === 0) return 1;
    if (!date || !selectedTime) return 2;
    return 3;
  }, [address, cartItems, date, selectedTime]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      
      {/* Subtle Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{ 
          backgroundImage: `url(${ecoPattern})`,
          backgroundSize: "250px 250px",
          backgroundRepeat: "repeat"
        }}
      />

      {/* Decorative Blobs */}
      <div className="fixed top-20 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -right-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <BookingHeader onBack={handleBack} />

      <main className="container py-8 max-w-7xl relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Steps Indicator */}
        <StepsIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout for larger screens */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Form - 8 columns on large screens */}
            <div className="lg:col-span-8 space-y-6">
              <AddressSection address={address} setAddress={setAddress} />

              <MaterialCalculator
                cartItems={cartItems}
                setCartItems={setCartItems}
              />

              <DateTimeSection
                date={date}
                setDate={setDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />

              <NotesSection notes={notes} setNotes={setNotes} />
            </div>

            {/* Sidebar - 4 columns on large screens */}
            <div className="lg:col-span-4 space-y-6">
              <PickupInfo />

              {/* Booking Summary Card */}
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
                  className="w-full h-14 gradient-primary text-primary-foreground text-lg font-semibold rounded-xl shadow-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50 group"
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

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 bg-card/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Loop. Helping Egypt recycle, one pickup at a time. 🌱</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;