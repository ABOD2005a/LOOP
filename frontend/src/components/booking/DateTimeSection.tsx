import { useState } from "react";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

// Utility function to format dates
const formatDate = (date: Date, formatStr: string): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (formatStr === "EEEE, MMMM d, yyyy") {
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } else if (formatStr === "yyyy-MM-dd") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } else if (formatStr === "MMM d") {
    return `${monthsShort[date.getMonth()]} ${date.getDate()}`;
  } else if (formatStr === "EEE, MMM d") {
    return `${daysShort[date.getDay()]}, ${monthsShort[date.getMonth()]} ${date.getDate()}`;
  }
  return date.toDateString();
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const cn = (...classes: (string | boolean | undefined)[]): string => 
  classes.filter(Boolean).join(' ');

const timeSlots: string[] = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

interface DateTimeSectionProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  date,
  setDate,
  selectedTime,
  setSelectedTime,
}) => {
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  
  // Minimum date is tomorrow
  const tomorrow: Date = addDays(new Date(), 1);
  // Maximum date is 30 days from now
  const maxDate: Date = addDays(new Date(), 30);

  return (
    <section className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <h2 className="flex items-center gap-3 text-lg font-bold mb-5 text-slate-900">
        <Clock className="w-5 h-5 text-blue-600 drop-shadow-sm" />
        Select Date & Time <span className="text-blue-600">*</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="block font-semibold text-slate-900">
            Pickup Date
          </label>
          <button
            type="button"
            onClick={() => setCalendarOpen(!calendarOpen)}
            className={cn(
              "w-full h-12 flex items-center justify-start text-left font-normal border-2 rounded-xl px-3 transition-all duration-200",
              !date ? "text-slate-500 border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-500" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-500"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
            {date ? (
              <span className="font-semibold text-slate-900">
                {formatDate(date, "EEEE, MMMM d, yyyy")}
              </span>
            ) : (
              <span>Select a pickup date</span>
            )}
          </button>
          
          {calendarOpen && (
            <div className="mt-2 p-4 border-2 border-slate-200 rounded-xl bg-white shadow-lg">
              <p className="text-sm text-slate-600 mb-2">
                Available: Tomorrow to {formatDate(maxDate, "MMM d")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDate(tomorrow);
                  setCalendarOpen(false);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select Tomorrow
              </button>
            </div>
          )}
          
          {/* Quick date buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={() => setDate(tomorrow)}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-lg border transition-all duration-200",
                date && formatDate(date, "yyyy-MM-dd") === formatDate(tomorrow, "yyyy-MM-dd")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500"
                  : "bg-slate-100 border-slate-200 text-slate-900 hover:border-blue-500 hover:bg-blue-50"
              )}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setDate(addDays(new Date(), 2))}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-lg border transition-all duration-200",
                date && formatDate(date, "yyyy-MM-dd") === formatDate(addDays(new Date(), 2), "yyyy-MM-dd")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500"
                  : "bg-slate-100 border-slate-200 text-slate-900 hover:border-blue-500 hover:bg-blue-50"
              )}
            >
              {formatDate(addDays(new Date(), 2), "EEE, MMM d")}
            </button>
            <button
              type="button"
              onClick={() => setDate(addDays(new Date(), 3))}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-lg border transition-all duration-200",
                date && formatDate(date, "yyyy-MM-dd") === formatDate(addDays(new Date(), 3), "yyyy-MM-dd")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500"
                  : "bg-slate-100 border-slate-200 text-slate-900 hover:border-blue-500 hover:bg-blue-50"
              )}
            >
              {formatDate(addDays(new Date(), 3), "EEE, MMM d")}
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          <label className="block font-semibold text-slate-900">Preferred Time</label>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(selectedTime === slot ? null : slot)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 border-2 rounded-xl font-medium text-sm transition-all duration-200",
                  selectedTime === slot
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg scale-[1.02]"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-blue-500 hover:translate-x-1"
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

export default DateTimeSection;