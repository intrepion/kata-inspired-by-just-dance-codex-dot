import {makeHandTracker,openCamera,cameraError} from './camera.js';
const CDN='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21';
const MODEL='https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
export function setupCamera({button,stopButton,panel,video,dot,status,live,onMove}) {
  let stream=null, detector=null, frame=0, generation=0, lastFrame=-1, lastVideo=-1, lastSeen=0;
  const tracker=makeHandTracker();
  function stop(message='Camera off. Other controls are available.') {
    generation++; cancelAnimationFrame(frame); stream?.getTracks().forEach(t=>t.stop()); stream=null;
    detector?.close(); detector=null; video.srcObject=null; panel.hidden=true; dot.hidden=true; tracker.reset();
    button.disabled=false; button.textContent='Enable hand camera'; status.textContent=message;
  }
  async function start(){
    if(stream){stop();return}
    const token=++generation;button.disabled=true;status.textContent='Requesting camera access…';
    try {
      const acquired=await openCamera(navigator.mediaDevices);
      if(token!==generation){acquired.getTracks().forEach(t=>t.stop());return}
      stream=acquired;stream.getVideoTracks()[0].addEventListener('ended',()=>{if(token===generation)stop('Camera stopped. Use the other controls.')},{once:true});
      video.srcObject=stream; panel.hidden=false;live.textContent='Loading hand tracking…';
      await video.play();
      const {FilesetResolver,HandLandmarker}=await import(CDN+'/vision_bundle.mjs');
      const files=await FilesetResolver.forVisionTasks(CDN+'/wasm');
      const model=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:MODEL,delegate:'CPU'},runningMode:'VIDEO',numHands:1});
      if(token!==generation){model.close();return}
      detector=model;button.disabled=false;button.textContent='Disable hand camera';status.textContent='Camera on. Show one hand and move it in the mirrored preview direction on the beat.';
      lastFrame=-1;lastVideo=-1;lastSeen=0;frame=requestAnimationFrame(loop);
    }catch(error){if(token===generation)stop(cameraError(error))}
  }
  function loop(now){
    if(!detector||!stream)return;
    try{
      if(now-lastFrame>=80&&video.readyState>=2&&video.currentTime!==lastVideo){
        lastFrame=now;lastVideo=video.currentTime;
        const points=detector.detectForVideo(video,now).landmarks?.[0];
        const point=points?.[9] || null;
        if(point){
          lastSeen=now; live.textContent='Hand found · move on the beat';
          dot.hidden=false;dot.style.left=(7+(1-point.x)*(video.clientWidth))+'px';dot.style.top=(7+point.y*video.clientHeight)+'px';
          const move=tracker.update(point,now);if(move)onMove(move);
        }else if(now-lastSeen>300){tracker.reset();dot.hidden=true;live.textContent='Hand lost · show one hand';}
      }
      frame=requestAnimationFrame(loop);
    }catch(error){stop('Hand tracking stopped. Use the other controls.')}
  }
  button.addEventListener('click',start);stopButton.addEventListener('click',()=>stop());
  window.addEventListener('orientationchange',()=>{tracker.reset();live.textContent='Orientation changed · show your hand again';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&(stream||button.disabled))stop('Camera stopped when the page was hidden. Enable it again to use it.');});
  return {stop};
}
