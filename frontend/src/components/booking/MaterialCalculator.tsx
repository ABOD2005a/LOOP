import { useState } from "react";
import { Wrench, Newspaper, Droplets, Plus } from "lucide-react";
import { toast } from "sonner";
import MaterialCard, { Material, SubMaterial } from "./MaterialCard";
import MetalSubTypes from "./MetalSubTypes";
import WeightInput from "./WeightInput";
import Cart from "./Cart";
import { CartItemData } from "./CartItem";
import { Button } from "../ui/button";

const metalSubTypes: SubMaterial[] = [
  { id: "iron", name: "Iron / Steel", price: 12, co2PerKg: 2.0, waterPerKg: 12 },
  { id: "aluminum", name: "Aluminum", price: 25, co2PerKg: 4.5, waterPerKg: 20 },
  { id: "copper", name: "Copper", price: 85, co2PerKg: 3.5, waterPerKg: 25 },
  { id: "brass", name: "Brass", price: 45, co2PerKg: 3.0, waterPerKg: 18 },
  { id: "steel", name: "Stainless Steel", price: 18, co2PerKg: 2.5, waterPerKg: 15 },
];

const materials: Material[] = [
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

interface MaterialCalculatorProps {
  cartItems: CartItemData[];
  setCartItems: (items: CartItemData[]) => void;
}

const MaterialCalculator = ({ cartItems, setCartItems }: MaterialCalculatorProps) => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [weight, setWeight] = useState(0);

  const currentMaterial = materials.find((m) => m.id === selectedMaterial);
  const currentSubType = currentMaterial?.subTypes?.find((s) => s.id === selectedSubType);

  const handleMaterialSelect = (id: string) => {
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

    const newItem: CartItemData = {
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

    // Reset selections
    setWeight(0);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const canAddToCart = currentMaterial && weight > 0 && 
    (!currentMaterial.subTypes || currentSubType);

  return (
    <section className="bg-muted rounded-3xl p-6 md:p-8">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Materials Selection */}
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
                
                {/* Metal Sub Types */}
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

          {/* Add to Cart Button */}
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="w-full mt-6 h-14 gradient-primary text-primary-foreground text-lg font-semibold rounded-xl shadow-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>

        {/* Cart */}
        <div>
          {cartItems.length > 0 ? (
            <Cart
              items={cartItems}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearCart}
            />
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

export default MaterialCalculator;
