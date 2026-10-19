const TAU = Math.PI * 2;
const speed = TAU / 28;

/** Frame-rate-independent angular motion; drag momentum gently rejoins idle. */
export function createTurntable(initialYaw = 0) {
  let yaw = initialYaw, velocity = speed, dragging = false;
  return {
    get yaw() { return yaw; },
    begin() { dragging = true; },
    drag(radians: number, seconds: number) {
      if (!dragging) return;
      yaw += radians;
      velocity = Math.max(-2, Math.min(2, radians / Math.max(seconds, .016)));
    },
    end() { dragging = false; },
    nudge(radians: number) { yaw += radians; velocity = speed; },
    reset() { yaw = initialYaw; velocity = speed; dragging = false; },
    step(seconds: number) {
      if (dragging) return yaw;
      const dt = Math.max(0, Math.min(seconds, .05));
      const decay = Math.exp(-1.8 * dt);
      yaw += speed * dt + (velocity - speed) * (1 - decay) / 1.8;
      velocity = speed + (velocity - speed) * decay;
      return yaw;
    }
  };
}
