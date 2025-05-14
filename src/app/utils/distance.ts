export const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  if (distanceKm < 1) {
    const distanceMeters = Math.round(distanceKm * 1000);
    return `${distanceMeters} m away`;
  } else {
    // Format with up to 2 decimals, but remove trailing zeros
    const formattedKm = parseFloat(distanceKm.toFixed(2)).toString();
    return `${formattedKm} km away`;
  }
}

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
}
