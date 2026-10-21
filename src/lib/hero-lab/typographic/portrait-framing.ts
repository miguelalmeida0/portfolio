/** Fit every vertex through a complete yaw turn, without a breathing camera. */
export function portraitCameraDistance(points: Float32Array, aspect: number, fov = 28) {
  const tanV = Math.tan(fov * Math.PI / 360);
  const sinH = Math.sin(Math.atan(tanV * Math.max(.1, aspect)));
  let distance = 0;
  for (let i = 0; i < points.length; i += 3) {
    const radius = Math.hypot(points[i], points[i + 2]);
    distance = Math.max(distance, Math.abs(points[i + 1]) / tanV + radius, radius / sinH);
  }
  return Math.max(.1, distance * 1.025);
}
