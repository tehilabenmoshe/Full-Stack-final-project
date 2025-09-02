// src/pages/OrderSummaryPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartProvider";
import { useAuth } from "../AuthProvider";
import "../styles/orderSummery.css";

export default function OrderSummary() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { items: cartCtxItems, total: cartCtxTotal } = useCart();
  const { user } = useAuth();

  const fullName     = state?.fullName ?? user?.name ?? "";
  const phone        = state?.phone ?? user?.phone ?? "";
  const addressText  = state?.addressText ?? state?.city ?? "";
  const paymentLabel = state?.paymentLabel ?? "Self-pickup - payment on site";

  // נעדיף snapshot שהגיע מה־Checkout; אם אין – ניפול ל־context
  const items = state?.cartItems ?? cartCtxItems ?? [];
  const total = state?.cartTotal ?? cartCtxTotal ?? 0;

  return (
    <div className="summary-page-wrap">
      <div className="summary-card">
        <h2 className="summary-title">Order Summary</h2>

        <div className="summary-rows">
          <div className="row"><span>Name</span><span>{fullName || "—"}</span></div>
          <div className="row"><span>Mobile</span><span>{phone || "—"}</span></div>
          <div className="row"><span>Address</span><span>{addressText || "—"}</span></div>
          <div className="row"><span>Payment method</span><span>{paymentLabel}</span></div>
        </div>

        <div className="summary-items">
          <h4>Order items</h4>
          {items?.length ? (
            <ul>
              {items.map((it) => {
                const name = it.name || it.dish_name;
                const line = it.line_total ?? (Number(it.price) * Number(it.quantity));
                return (
                  <li key={it.id}>
                    {name} × {it.quantity} — ₪{Number(line || 0).toFixed(2)}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No items to show.</p>
          )}
          <div className="total">Total: ₪{Number(total || 0).toFixed(2)}</div>
        </div>

        <div className="summary-actions">
          {/* כפתור לעמוד המפה/מסלול */}
          <button
            className="btn"
            onClick={() =>
              navigate("/customer/pickup", {
                state: {
                  fullName,
                  phone,
                  address: addressText, // יופיע כשדה ברירת מחדל ב-PickupPage
                },
              })
            }
          >
            Choose Pickup point & Route
          </button>

          <button className="btn primary" onClick={() => navigate("/customer")}>
            Back To Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
