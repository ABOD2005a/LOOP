import { ShoppingCart, Trash2, Leaf, TreePine, Droplets } from "lucide-react";
import { cn } from "../lib/utils";
import CartItem, { CartItemData } from "./CartItem";
import ecoHero from "../../assets/eco-hero.png";

interface CartProps {
  items: CartItemData[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

const Cart = ({ items, onRemoveItem, onClearAll }: CartProps) => {
  const totalEarnings = items.reduce((sum, item) => sum + item.total, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const totalCo2 = items.reduce((sum, item) => sum + item.co2Saved, 0);
  const totalWater = items.reduce((sum, item) => sum + item.waterSaved, 0);
  const treesSaved = Math.floor(totalWeight * 0.02);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Your Cart</h3>
            <span className="text-sm text-muted-foreground">{items.length} item(s)</span>
          </div>
        </div>
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <CartItem 
            key={item.id} 
            item={item} 
            onRemove={() => onRemoveItem(item.id)} 
          />
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-4">
        {/* Total */}
        <div className="flex items-center justify-between p-4 gradient-primary rounded-xl text-primary-foreground">
          <div>
            <span className="block text-sm opacity-90">Total Earnings</span>
            <span className="block text-sm opacity-75">{totalWeight} kg total</span>
          </div>
          <span className="text-3xl font-extrabold">{totalEarnings} EGP</span>
        </div>

        {/* Environmental Impact */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ 
              backgroundImage: `url(${ecoHero})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
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

export default Cart;
