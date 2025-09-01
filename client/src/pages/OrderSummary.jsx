// src/pages/OrderSummaryPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartProvider";
import { useAuth } from "../AuthProvider";
import "../styles/orderSummery.css"; // יש כאן כבר את הסגנונות; אפשר להוסיף למטה הרחבות

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { items, total } = useCart();
  const { user } = useAuth();

  // נתונים שמגיעים מהניווט (עם נפילות חכמות לערכי ברירת מחדל)
  const fullName    = state?.fullName ?? user?.name ?? "";
  const phone       = state?.phone ?? user?.phone ?? "";
  const addressText = state?.addressText ?? state?.city ?? "";
  const pickupName  = state?.pickup?.name ?? state?.pickupName ?? "—";
  const paymentLabel= state?.paymentLabel ?? "Self-pickup - payment on site";

  return (
    <div className="summary-page-wrap">
      <div className="summary-card">
        <h2 className="summary-title">Order Summery </h2>

        <div className="summary-rows">
          <div className="row"><span>name</span><span>{fullName || "—"}</span></div>
          <div className="row"><span>mobile</span><span>{phone || "—"}</span></div>
          <div className="row"><span>address</span><span>{addressText || "—"}</span></div>
          <div className="row"><span>pickup point </span><span>{pickupName}</span></div>
          <div className="row"><span>payment method </span><span>{paymentLabel}</span></div>
        </div>

        <div className="summary-items">
          <h4> order items</h4>
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
            <p>no items in cart  </p>
          )}
          <div className="total">total: ₪{Number(total || 0).toFixed(2)}</div>
        </div>

        <p className="summary-thanks">
          Thank you very much! We will update when the order is ready for pickup!😊
        </p>

        <div className="summary-actions">
          <button className="btn" onClick={() => navigate(-1)}>חזרה</button>
          <button className="btn primary" onClick={() => navigate("/customer")}>
            Back To Shopping!
          </button>
        </div>
      </div>
    </div>
  );
}
