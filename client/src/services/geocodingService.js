// src/services/geocodingService.js
export async function geocodeAddress(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "il");

  const res = await fetch(url.toString(), {
    headers: { "Accept": "application/json" },
  });
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("כתובת לא נמצאה");
  }
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}
