import { useState } from "react";
import { useCart } from "./CartProvider";
import CartDrawer from "./CartDrawer";
import { ShoppingCart } from "lucide-react";
import "../styles/MenuStyles.css";

export default function CartButton({ className = "" }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`cart-button ${className}`}
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <ShoppingCart className="cart-icon" />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>

      {open && <CartDrawer onClose={() => setOpen(false)} />}
    </>
  );
}
