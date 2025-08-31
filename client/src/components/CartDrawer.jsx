import { useCart } from "./CartProvider";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ onClose }) {
  const { items, total, loading, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => {
    if (!items.length) return;
    onClose?.();
    navigate("/customer/checkout");
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="cart-header">
          <h3>My Cart</h3>
          <button className="x" onClick={onClose}>×</button>
        </header>

        <div className="cart-body">
          {loading ? <p>Loading…</p> :
            items.length === 0 ? <p>Your cart is empty</p> :
            items.map(it => (
              <div className="cart-row" key={it.id}>
                <div className="cart-name">{it.name || it.dish_name || `#${it.dish_id}`}</div>
                <div className="cart-qty">
                  <button onClick={() => updateQty(it.id, Math.max(0, it.quantity - 1))}>−</button>
                  <span>{it.quantity}</span>
                  <button onClick={() => updateQty(it.id, it.quantity + 1)}>+</button>
                </div>
                <div className="cart-price">₪{Number(it.unit_price).toFixed(2)}</div>
                <div className="cart-line">₪{Number(it.line_total).toFixed(2)}</div>
                <button className="cart-remove" onClick={() => removeItem(it.id)}>Remove</button>
              </div>
            ))
          }
        </div>

        <footer className="cart-footer">
          <div className="cart-total"><strong>Total: ₪{Number(total).toFixed(2)}</strong></div>
          <button className="checkout" disabled={!items.length} onClick={goCheckout}>Checkout</button>
        </footer>
      </aside>
    </div>
  );
}
