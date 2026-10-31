import test from 'node:test';
import assert from 'node:assert/strict';
import {makeHandTracker,openCamera,cameraError} from './camera.js';
test('mirrored coordinates produce screen directions and ignore small movement',()=>{
  for(const [next,expected] of [[{x:.65,y:.5},'left'],[{x:.35,y:.5},'right'],[{x:.5,y:.35},'up'],[{x:.5,y:.65},'down']]) {
    const tracker=makeHandTracker();assert.equal(tracker.update({x:.5,y:.5},0),null);assert.equal(tracker.update(next,100),expected);
  }
  const tracker=makeHandTracker();tracker.update({x:.5,y:.5},0);assert.equal(tracker.update({x:.52,y:.52},100),null);
});
test('lost tracking, stale samples, orientation reset, and cooldown do not create phantom gestures',()=>{
  const t=makeHandTracker();t.update({x:.5,y:.5},0);t.update(null,100);assert.equal(t.update({x:.1,y:.5},150),null);assert.equal(t.update({x:.2,y:.5},200),'left');assert.equal(t.update({x:.4,y:.5},250),null);t.reset();assert.equal(t.update({x:.9,y:.5},300),null);assert.equal(t.update({x:.5,y:.5},1000),null);
});
test('camera asks for front-facing video only, handles rejection and stops a rear camera',async()=>{
  let constraints,stopped=0;const track={getSettings:()=>({facingMode:'user'}),stop:()=>stopped++};const stream={getVideoTracks:()=>[track],getTracks:()=>[track]};
  assert.equal(await openCamera({getUserMedia:async c=>(constraints=c,stream)}),stream);
  assert.equal(constraints.audio,false);assert.equal(constraints.video.facingMode.ideal,'user');
  await assert.rejects(openCamera({getUserMedia:async()=>{throw Object.assign(new Error(),{name:'NotAllowedError'})}}),{name:'NotAllowedError'});
  track.getSettings=()=>({facingMode:'environment'});await assert.rejects(openCamera({getUserMedia:async()=>stream}),/front-camera-unavailable/);assert.equal(stopped,1);
  await assert.rejects(openCamera(null),/unavailable/);
  assert.match(cameraError({name:'NotAllowedError'}),/denied/);assert.match(cameraError({name:'NotFoundError'}),/No front camera/);assert.match(cameraError(new Error('unavailable')),/secure context/);assert.match(cameraError(new Error('network')),/model/);
});
