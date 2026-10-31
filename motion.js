// Phone held upright in portrait: x points right, y points toward the top.
// Linear acceleration is a rough gesture proxy, not pose recognition.
export function motionDirection(acceleration) {
  if (!acceleration) return null;
  const {x, y} = acceleration;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const ax = Math.abs(x), ay = Math.abs(y);
  if (Math.max(ax, ay) < 4) return null;
  return ax > ay ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'up' : 'down');
}
export async function requestMotionAccess(host) {
  const Motion = host.DeviceMotionEvent;
  if (!Motion || !host.isSecureContext) return 'unavailable';
  try {
    return typeof Motion.requestPermission === 'function'
      ? (await Motion.requestPermission()) === 'granted' ? 'granted' : 'denied'
      : 'granted';
  } catch { return 'denied'; }
}
