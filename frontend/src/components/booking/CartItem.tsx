import { Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

export interface CartItemData {
  id: string;
  materialId: string;
  materialName: string;
  subTypeId?: string;
  subTypeName?: string;
  weight: number;
  pricePerKg: number;
  total: number;
  co2Saved: number;
  waterSaved: number;
  gradient: string;
}

interface CartItemProps {
  item: CartItemData;
  onRemove: () => void;
}

const CartItem = ({ item, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-xl border border-border/50 animate-scale-in">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-primary-foreground", item.gradient)}>
        <span className="text-lg font-bold">{item.weight}</span>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">
            {item.subTypeName || item.materialName}
          </span>
          {item.subTypeName && (
            <span className="text-xs text-muted-foreground">({item.materialName})</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{item.weight} kg × {item.pricePerKg} EGP</span>
        </div>
      </div>
      
      <div className="text-right">
        <span className="text-xl font-extrabold text-primary">{item.total}</span>
        <span className="text-sm text-muted-foreground ml-1">EGP</span>
      </div>
      
      <button
        onClick={onRemove}
        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;
