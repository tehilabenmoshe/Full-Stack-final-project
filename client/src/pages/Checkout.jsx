import { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useCart } from "../components/CartProvider";
import "../styles/checkout.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export default function Checkout() {
  const { user, token } = useAuth();
  const { orderId, items, total, reload } = useCart();
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

  // 'card' | 'bit' | 'pickup_cash'
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });

  // כתובת נדרשת: לאיסוף מספיק שם+טלפון; למשלוח צריך גם עיר+רחוב
  const addressValid = useMemo(() => {
    if (method === "pickup_cash") {
      return Boolean(address.fullName && address.phone);
    }
    return Boolean(address.fullName && address.phone && address.city && address.street);
  }, [method, address]);

  const disabled = !items?.length || !addressValid;

  const buildAddressString = () => {
    const parts = [address.street, address.house, address.city].filter(Boolean);
    return parts.join(" ");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    // ✅ אם המשתמש בחר איסוף עצמי → עוברים לעמוד ה־Pickup
    if (method === "pickup_cash") {
      const addrStr = buildAddressString();
      navigate("/customer/pickup", {
        state: {
          // נשלח מה שצריך לחישוב המסלול
          address: addrStr || address.city || "",
          fullName: address.fullName,
          phone: address.phone,
          orderId,             // אם תרצי להשתמש בו שם
        },
        replace: false,
      });
      return;
    }

    try {
      const payload = {
        orderId,
        // שומרים סוג כתובת כדי לדעת שזה איסוף/משלוח
        address: { ...address, type: method === "pickup_cash" ? "pickup" : "delivery" },
        // ממפים איסוף ל-cash, אחרים נשארים כפי שהם
        paymentMethod: method === "pickup_cash" ? "cash" : method, // 'cash' | 'card' | 'bit'
        card: method === "card" ? card : undefined,
      };

      const { data } = await axios.post(`${API}/checkout`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      await reload();
      navigate(`/customer/thank-you/${data.orderId || orderId}`);
    } catch (err) {
      console.error("Checkout error", err);
      alert(err.response?.data?.message || "Checkout failed");
    }
  };

  if (!items?.length) {
    return <div style={{ padding: 16 }}>Your cart is empty</div>;
  }

  return (
    <div className="checkout-wrap">
      <h2>payment and order</h2>

      <form onSubmit={submit} className="checkout-grid">
        {/* כתובת ומשלוח */}
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

        {/* אמצעי תשלום */}
        <section className="payment">
          <h3>payment method</h3>

          {/* כרטיס אשראי */}
          <label>
            <input
              type="radio"
              name="method"
              value="card"
              checked={method === "card"}
              onChange={(e) => setMethod(e.target.value)}
            />
            credit card
          </label>

          {/* card-form תמיד בדום – שומר מקום. כשלא נבחר: ghost */}
          <div className="card-form">   {/* תמיד גלוי */}

            <input
              className="cc-number"
              placeholder="card number"
              value={card.number}
              onChange={e => setCard(c => ({ ...c, number: e.target.value }))}
            />
            <input
              className="cc-exp"
              placeholder="MM/YY"
              value={card.exp}
              onChange={e => setCard(c => ({ ...c, exp: e.target.value }))}
            />
            <input
              className="cc-cvc"
              placeholder="CVC"
              value={card.cvc}
              onChange={e => setCard(c => ({ ...c, cvc: e.target.value }))}
            />
          </div>

          {/* Bit */}
          <label style={{ marginTop: 8 }}>
            <input
              type="radio"
              name="method"
              value="bit"
              checked={method === "bit"}
              onChange={(e) => setMethod(e.target.value)}
            />
            Bit
          </label>
          <p className={`pay-note ${method === "bit" ? "show" : "hidden"}`}>
            After confirmation, you will be directed to the Bit payment screen / you will receive a link/QR for payment.
          </p>

          {/* איסוף עצמי + תשלום במקום */}
          <label style={{ marginTop: 8 }}>
            <input
              type="radio"
              name="method"
              value="pickup_cash"
              checked={method === "pickup_cash"}
              onChange={(e) => setMethod(e.target.value)}
            />
            Self-pickup - payment on site
          </label>
          <p className={`pay-note ${method === "pickup_cash" ? "show" : "hidden"}`}>
            There is no need to fill out card details. Payment will be made at the cash register upon collection.
          </p>
        </section>

        {/* סיכום */}
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
          Cheackout Now
        </button>
      </form>
    </div>
  );
}
