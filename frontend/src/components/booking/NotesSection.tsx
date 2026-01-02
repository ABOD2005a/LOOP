import { FileText } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface NotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const NotesSection = ({ notes, setNotes }: NotesSectionProps) => {
  return (
    <section className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <h2 className="flex items-center gap-3 text-lg font-bold mb-5 text-foreground">
        <FileText className="w-5 h-5 text-primary drop-shadow-sm" />
        Additional Notes
        <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
      </h2>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any special instructions for the collector..."
        className="min-h-[120px] px-4 py-3 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-y"
      />
    </section>
  );
};

export default NotesSection;
