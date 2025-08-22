import { useState } from "react";
import { useCart } from "../CartProvider";
import CartDrawer from "./CartDrawer";

export default function CartButton({ className = "" }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={`cart-button ${className}`} onClick={() => setOpen(true)} aria-label="Open cart">
        {/* אייקון עגלה */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M7 4h-2l-1 2m0 0l2.2 9.9A2 2 0 0 0 8.1 18H18a2 2 0 0 0 1.9-1.5L22 8H6M6 6h16"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
          <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
        </svg>
        {count > 0 && <span className="badge">{count}</span>}
      </button>

      {open && <CartDrawer onClose={() => setOpen(false)} />}
    </>
  );
}
