// src/pages/PickupPage.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RouteMap from "../components/RouteMap";
import { geocodeAddress } from "../services/geocodingService";
import { findNearestByDriveTime } from "../services/routingService";
import { useCart } from "../components/CartProvider";
import OrderSummary from "./OrderSummary";
import "../styles/pickup.css";

// נקודות איסוף לדוגמה
const PICKUP_POINTS = [
  { id: "tlv",  name: "Tel Aviv - Dizengoff",         lat: 32.076, lng: 34.774 },
  { id: "jeru", name: "Jerusalem - Malha",            lat: 31.751, lng: 35.188 },
  { id: "pt",   name: "Petah Tikva - Em HaMoshavot",  lat: 32.101, lng: 34.877 },
  { id: "lod",  name: "Lod - Train Station",          lat: 31.952, lng: 34.896 },
];

export default function PickupPage() {
  const navigate = useNavigate();
  const { state } = useLocation(); // מגיע מ-Checkout: { fullName, phone, city/address }
  const { items, total } = useCart();

  // פרטי משתמש/כתובת שמועברים מה-Checkout (עם נפילות לערך ריק)
  const fullName = state?.fullName || "";
  const phone    = state?.phone || "";

  // שדה החיפוש יתחיל מהעיר/כתובת שהועברה (אם הועברה)
  const [userQuery, setUserQuery] = useState(state?.city || state?.address || "");
  const [userLoc, setUserLoc] = useState(null);
  const [bestPickup, setBestPickup] = useState(null);
  const [etaSec, setEtaSec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const onCalc = async () => {
    setLoading(true);
    setErr("");
    try {
      const loc = await geocodeAddress(userQuery.trim());
      setUserLoc(loc);
      const { pickup, etaSec } = await findNearestByDriveTime(loc, PICKUP_POINTS);
      setBestPickup(pickup);
      setEtaSec(etaSec);
    } catch (e) {
      setErr(e.message || "Failed to calculate route");
    } finally {
      setLoading(false);
    }
  };

  // טקסט זמן משוער
  const etaText = useMemo(() => {
    if (etaSec == null) return "";
    const mins = Math.round(etaSec / 60);
    return mins < 1 ? "less than a minute" : `${mins} min`;
  }, [etaSec]);

  return (
    <div className="pickup-wrap">
      <h2 className="pickup-title">Pickup Point Selection</h2>
      <p className="pickup-sub">
        Enter a city or address so we can find the closest pickup point by driving time and show the route.
      </p>

      <div className="pickup-row">
        <input
          className="pickup-input"
          placeholder="e.g. Jaffa St 97, Jerusalem"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <button className="pickup-btn" onClick={onCalc} disabled={loading}>
          {loading ? "Calculating…" : "Calculate Route"}
        </button>
      </div>

      {err && <div className="pickup-alert">{err}</div>}

      {bestPickup && (
        <div className="pickup-card">
          <div><b>Recommended pickup point:</b> {bestPickup.name}</div>
          {etaText && <div className="pickup-dot">·</div>}
          {etaText && <div><b>Estimated time:</b> {etaText}</div>}
        </div>
      )}

      {userLoc && bestPickup && (
        <>
          <div className="pickup-map">
            <RouteMap
              from={userLoc}
              to={bestPickup}
              onETA={(secs) => setEtaSec(secs)}
              height={320}
            />
          </div>

          <div className="pickup-actions">
            <button
                className="pickup-summary-btn"
                onClick={() => navigate("/customer/order-summary", {
                state: {
                    fullName,                 // אם יש אצלך ב-PickupPage (או תביאי מ-state שהגיע מה-Checkout)
                    phone,
                    addressText: userQuery,   // העיר/כתובת שהוזנה
                    pickup: bestPickup,       // { id, name, lat, lng }
                    pickupName: bestPickup?.name,
                    paymentLabel: "Self-pickup - payment on site",
                }
                })}
                disabled={!items?.length}
                >
                Order Summery
            </button>
          </div>

        </>
      )}

      
     
    </div>
  );
}
