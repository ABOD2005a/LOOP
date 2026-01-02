import { MapPin, Building, Home, Navigation, MapPinned } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface AddressData {
  street: string;
  buildingNumber: string;
  floor: string;
  apartment: string;
  area: string;
  landmark: string;
}

interface AddressSectionProps {
  address: AddressData;
  setAddress: (address: AddressData) => void;
}

const AddressSection = ({ address, setAddress }: AddressSectionProps) => {
  const updateField = (field: keyof AddressData, value: string) => {
    setAddress({ ...address, [field]: value });
  };

  return (
    <section className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <h2 className="flex items-center gap-3 text-lg font-bold mb-5 text-foreground">
        <MapPin className="w-5 h-5 text-primary drop-shadow-sm" />
        Pickup Address
      </h2>
      
      <div className="grid gap-4">
        {/* Street Address - Full Width */}
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
            className="h-12 px-4 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-muted-foreground"
            required
            maxLength={200}
          />
        </div>

        {/* Building & Floor Row */}
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
              className="h-12 px-4 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-muted-foreground"
              required
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor" className="font-semibold text-foreground flex items-center gap-2">
              Floor
            </Label>
            <Input
              id="floor"
              type="text"
              value={address.floor}
              onChange={(e) => updateField("floor", e.target.value)}
              placeholder="e.g., 3rd"
              className="h-12 px-4 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-muted-foreground"
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
              className="h-12 px-4 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-muted-foreground"
              maxLength={20}
            />
          </div>
        </div>

        {/* Area & Landmark Row */}
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
              className="h-12 px-4 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-muted-foreground"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark" className="font-semibold text-foreground flex items-center gap-2">
              Landmark (Optional)
            </Label>
            <Input
              id="landmark"
              type="text"
              value={address.landmark}
              onChange={(e) => updateField("landmark", e.target.value)}
              placeholder="Near the main mosque..."
              className="h-12 px-4 text-base border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-muted-foreground"
              maxLength={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddressSection;
