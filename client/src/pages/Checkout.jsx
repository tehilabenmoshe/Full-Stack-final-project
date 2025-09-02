import { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useCart } from "../components/CartProvider";
import "../styles/checkout.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export default function Checkout() {
  const { user, token } = useAuth();
  const { orderId, items, total, load } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    city: "",
    street: "",
    house: "",
    apt: "",
    notes: "",
  });

  const [method, setMethod] = useState("card"); // 'card' | 'bit' | 'pickup_cash'
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });

  const addressValid = useMemo(() => {
    if (method === "pickup_cash") return Boolean(address.fullName && address.phone);
    return Boolean(address.fullName && address.phone && address.city && address.street);
  }, [method, address]);

  const disabled = !items?.length || !addressValid;

  const buildAddressString = () => {
    const parts = [address.street, address.house, address.city].filter(Boolean);
    return parts.join(" ");
  };

  const clearCart = async () => {
    try {
      await axios.post(`${API}/cart/clear`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
      console.warn("clearCart:", e?.response?.data || e.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    // 1) מצלמים את מצב הסל לפני שמנקים
    const cartSnapshot = items?.map(i => ({ ...i })) || [];
    const totalSnapshot = total;
    const addrStr = buildAddressString();
    const paymentLabelMap = {
      card: "Credit card",
      bit: "Bit",
      pickup_cash: "Self-pickup - payment on site",
    };

    // 2) מנקים סל בשרת ומרעננים קונטקסט
    await clearCart();
    await load();

    // 3) מנווטים למסך סיכום עם ה-snapshot (לא תלוי ב-useCart)
    navigate("/customer/order-summary", {
      state: {
        fullName: address.fullName,
        phone: address.phone,
        addressText: addrStr || address.city || "",
        paymentLabel: paymentLabelMap[method],
        orderId,
        cartItems: cartSnapshot,
        cartTotal: totalSnapshot,
        // אם תרצי, אפשר להעביר גם פרטי הכרטיס/bit לטיפול בהמשך
      },
    });
  };

  if (!items?.length) return <div style={{ padding: 16 }}>Your cart is empty</div>;

  return (
    <div className="checkout-wrap">
      <h2>payment and order</h2>

      <form onSubmit={submit} className="checkout-grid">
        {/* Delivery address */}
        <section className="address">
          <h3>Delivery address</h3>
          <div className="grid-details">
            <input placeholder="full name" value={address.fullName}
              onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} />
            <input placeholder="mobile" value={address.phone}
              onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} />
            <input placeholder="city" value={address.city}
              onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
            <input placeholder="street" value={address.street}
              onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
            <input placeholder="house number" value={address.house}
              onChange={e => setAddress(a => ({ ...a, house: e.target.value }))} />
            <input placeholder="apartment" value={address.apt}
              onChange={e => setAddress(a => ({ ...a, apt: e.target.value }))} />
          </div>
          <textarea placeholder="notes (optional)" value={address.notes}
            onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))} />
        </section>

        {/* payment method */}
        <section className="payment">
          <h3>payment method</h3>

          <label>
            <input type="radio" name="method" value="card"
              checked={method === "card"} onChange={(e) => setMethod(e.target.value)} />
            credit card
          </label>

          {/* טופס כרטיס תמיד גלוי (אפשר להשאיר כך גם אם לא בוחרים כרטיס) */}
          <div className="card-form">
            <input className="cc-number" placeholder="card number"
              value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} />
            <input className="cc-exp" placeholder="MM/YY"
              value={card.exp} onChange={e => setCard(c => ({ ...c, exp: e.target.value }))} />
            <input className="cc-cvc" placeholder="CVC"
              value={card.cvc} onChange={e => setCard(c => ({ ...c, cvc: e.target.value }))} />
          </div>

          <label style={{ marginTop: 8 }}>
            <input type="radio" name="method" value="bit"
              checked={method === "bit"} onChange={(e) => setMethod(e.target.value)} />
            Bit
          </label>
          <p className={`pay-note ${method === "bit" ? "show" : "hidden"}`}>
            After confirmation, you’ll be redirected to Bit / receive a link/QR.
          </p>

          <label style={{ marginTop: 8 }}>
            <input type="radio" name="method" value="pickup_cash"
              checked={method === "pickup_cash"} onChange={(e) => setMethod(e.target.value)} />
            Self-pickup - payment on site
          </label>
          <p className={`pay-note ${method === "pickup_cash" ? "show" : "hidden"}`}>
            No need to fill card details. You’ll pay at pickup.
          </p>
        </section>

        {/* summary */}
        <section className="summary">
          <h3>summary</h3>
          <ul>
            {items.map(it => (
              <li key={it.id}>
                {it.name || it.dish_name} × {it.quantity} — ₪{Number(it.line_total).toFixed(2)}
              </li>
            ))}
          </ul>
          <h4>total: ₪{Number(total).toFixed(2)}</h4>
        </section>

        <button type="submit" disabled={disabled} className="checkout-submit">
          Checkout Now
        </button>
      </form>
    </div>
  );
}

