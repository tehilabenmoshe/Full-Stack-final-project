import { useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// תיקון איקונים בליף־ליט כשבונים עם Vite/Webpack
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export default function RouteMap({ from, to, onETA }) {
  const mapRef = useRef(null);
  const routingRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // אם יש מסלול קודם – הסרה
    if (routingRef.current) {
      map.removeControl(routingRef.current);
      routingRef.current = null;
    }
    if (!from || !to) return;

    // בקר המסלול
    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      lineOptions: { addWaypoints: false },
      routeWhileDragging: false,
      show: false,
      collapsible: true,
      // שימוש בשרת OSRM ציבורי (חינמי)
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving",
      }),
      createMarker: function(i, wp) {
        const label = i === 0 ? "את/ה כאן" : to.name || "נק׳ איסוף";
        return L.marker(wp.latLng).bindPopup(label);
      }
    })
      .on("routesfound", (e) => {
        const route = e.routes?.[0];
        if (route && onETA) {
          const secs = route.summary?.totalTime ?? 0;
          onETA(Math.round(secs)); // בשניות
        }
      })
      .addTo(map);

    routingRef.current = control;

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
    };
  }, [from, to, onETA]);

  const center = from ? [from.lat, from.lng] : [32.0853, 34.7818]; // תל־אביב כברירת מחדל

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: "520px", width: "100%" }}
      whenCreated={(m) => (mapRef.current = m)}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
