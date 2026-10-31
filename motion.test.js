import test from 'node:test';
import assert from 'node:assert/strict';
import {motionDirection,requestMotionAccess} from './motion.js';
test('direction follows the strongest linear acceleration and ignores quiet or incomplete sensor data',()=>{
  assert.equal(motionDirection({x:-6,y:1}), 'left');
  assert.equal(motionDirection({x:6,y:1}), 'right');
  assert.equal(motionDirection({x:1,y:7}), 'up');
  assert.equal(motionDirection({x:1,y:-7}), 'down');
  assert.equal(motionDirection({x:1,y:2}), null);
  assert.equal(motionDirection(null), null);
  assert.equal(motionDirection({x:null,y:8}), null);
});
test('sensor access handles explicit grants, denials, exceptions and unsupported contexts',async()=>{
  const host = result => ({isSecureContext:true,DeviceMotionEvent:{requestPermission:async()=>result}});
  assert.equal(await requestMotionAccess(host('granted')),'granted');
  assert.equal(await requestMotionAccess(host('denied')),'denied');
  assert.equal(await requestMotionAccess({isSecureContext:true,DeviceMotionEvent:{requestPermission:async()=>{throw Error()}}}),'denied');
  assert.equal(await requestMotionAccess({isSecureContext:true,DeviceMotionEvent:{}}),'granted');
  assert.equal(await requestMotionAccess({isSecureContext:false,DeviceMotionEvent:{}}),'unavailable');
  assert.equal(await requestMotionAccess({isSecureContext:true}),'unavailable');
});
