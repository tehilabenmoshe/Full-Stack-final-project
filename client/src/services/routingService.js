// src/services/routingService.js
export async function findNearestByDriveTime(from, candidates) {
  const coords = [
    `${from.lng},${from.lat}`,
    ...candidates.map((p) => `${p.lng},${p.lat}`)
  ].join(";");

  const url = `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.code !== "Ok") throw new Error("שגיאה ב-OSRM table");

  const durations = data.durations?.[0] || [];
  let bestIdx = -1;
  let bestVal = Infinity;
  for (let i = 1; i < durations.length; i++) {
    const t = durations[i];
    if (t != null && t < bestVal) {
      bestVal = t;
      bestIdx = i - 1;
    }
  }
  if (bestIdx < 0) throw new Error("לא נמצאה נקודה מתאימה");
  return { pickup: candidates[bestIdx], etaSec: Math.round(bestVal) };
}
