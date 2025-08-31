// src/pages/PickupPage.jsx
import { useMemo, useState } from "react";
import RouteMap from "../components/RouteMap";
import { geocodeAddress } from "../services/geocodingService";
import { findNearestByDriveTime } from "../services/routingService";
import { useLocation } from "react-router-dom";
import "../styles/pickup.css";  

// Example pickup points – replace with your own
const PICKUP_POINTS = [
  { id: "tlv", name: "Tel Aviv - Dizengoff", lat: 32.076, lng: 34.774 },
  { id: "jeru", name: "Jerusalem - Malha", lat: 31.751, lng: 35.188 },
  { id: "pt", name: "Petah Tikva - Em HaMoshavot", lat: 32.101, lng: 34.877 },
  { id: "lod", name: "Lod - Train Station", lat: 31.952, lng: 34.896 },
];

export default function PickupPage() {
  const [userQuery, setUserQuery] = useState("");     
  const [userLoc, setUserLoc]   = useState(null);     
  const [bestPickup, setBestPickup] = useState(null); 
  const [etaSec, setEtaSec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { state } = useLocation();
  const initialAddress = state?.address || "";

  const onCalc = async () => {
    setLoading(true);
    setErr("");              // ← לאפס הודעת שגיאה ישנה
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


  // Convert ETA seconds to readable text
  const etaText = useMemo(() => {
    if (etaSec == null) return "";
    const mins = Math.round(etaSec / 60);
    if (mins < 1) return "less than a minute";
    return `${mins} min`;
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
        <div className="pickup-map">
            <RouteMap
            from={userLoc}
            to={bestPickup}
            onETA={(secs) => setEtaSec(secs)}
            />
        </div>
        )}
    </div>
    );

}
