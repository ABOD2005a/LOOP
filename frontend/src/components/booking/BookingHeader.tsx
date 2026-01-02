import { ArrowLeft } from "lucide-react";

interface BookingHeaderProps {
  onBack: () => void;
}

const BookingHeader = ({ onBack }: BookingHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center gap-4 py-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-transparent hover:bg-muted text-foreground hover:text-primary transition-all duration-200 hover:-translate-x-0.5"
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

export default BookingHeader;
