// Movement is measured in mirrored preview coordinates, not anatomical left/right.
export function makeHandTracker({threshold=.09, windowMs=350, cooldownMs=400}={}) {
  let anchor=null, lastGesture=-Infinity;
  return {
    reset(){ anchor=null; },
    update(point, now){
      if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) { anchor=null; return null; }
      const p={x:1-point.x,y:point.y,t:now};
      if (!anchor || now-anchor.t>windowMs || now<anchor.t) { anchor=p; return null; }
      const dx=p.x-anchor.x, dy=p.y-anchor.y;
      if (Math.max(Math.abs(dx),Math.abs(dy))<threshold) return null;
      anchor=p;
      if (now-lastGesture<cooldownMs) return null;
      lastGesture=now;
      return Math.abs(dx)>Math.abs(dy) ? (dx>0?'right':'left') : (dy>0?'down':'up');
    }
  };
}
export async function openCamera(mediaDevices) {
  if (!mediaDevices?.getUserMedia) throw new Error('unavailable');
  const stream=await mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'user'},width:{ideal:640},height:{ideal:480}}});
  const track=stream.getVideoTracks()[0];
  if (!track || track.getSettings?.().facingMode==='environment') {
    stream.getTracks().forEach(t=>t.stop());
    throw new Error('front-camera-unavailable');
  }
  return stream;
}
export function cameraError(error) {
  if (error?.name==='NotAllowedError' || error?.name==='SecurityError') return 'Camera permission denied. Use keys, buttons or phone motion.';
  if (error?.name==='NotFoundError' || error?.message==='front-camera-unavailable') return 'No front camera found. Use keys, buttons or phone motion.';
  if (error?.message==='unavailable') return 'Camera requires a secure context and a supported browser. Use the other controls.';
  return 'Camera or hand model could not start. Check your connection and use the other controls.';
}
