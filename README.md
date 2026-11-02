# Neon Steps

An original browser dance game inspired by Just Dance. Follow an animated coach through “Electric Bloom,” an original synthesized track. Read the upcoming cue, then press the matching arrow key or tap the matching button on the beat to earn timing grades and up to five stars. Dance along in whatever way is comfortable; the score measures cue direction and timing, not dance form.

## Play locally

From this directory run `python3 -m http.server 8000 --bind 127.0.0.1` and visit <http://127.0.0.1:8000/>. The base game needs no build or account. Hand camera mode downloads a pinned MediaPipe runtime and model and needs a network connection. Click **Let’s dance** to start audio. Use arrows or the large on-screen buttons, Escape or Pause to pause, and the sound button to mute. The game pauses when the tab is hidden. A visible link returns to the [Kata Arcade](https://intrepion.github.io/).

## Hand camera (experimental)

Choose **Enable hand camera** before dancing and grant the browser's camera prompt. Keep a single hand visible and move it in the direction shown in the mirrored preview on the beat. A front-facing camera is requested; camera video and hand landmarks are processed locally and are not recorded or uploaded by the game. On first use the browser downloads MediaPipe Tasks Vision 0.10.21 from jsDelivr and Google's Hand Landmarker model from Google Storage; those hosts receive normal network request information such as your IP address. No microphone is requested. Stop the camera with its button; it also stops on track completion or when the tab is hidden. A loss of tracking resets the gesture baseline. Turning the device resets the baseline; return your hand to view. Movement directions refer to the mirrored preview, not anatomical handedness.

Camera mode compares movement of one detected hand in screen space with the cue and timing window. It does not recognize choreography, track the whole body, or guarantee movement quality. Lighting, occlusion, small or fast movements, camera placement, screen rotation, frame rate and device performance can affect recognition. Camera permission, front camera availability, HTTPS or loopback, and a successful model download are required. If access is denied or tracking is lost, use keyboard, touch buttons or phone motion. Camera tracking is experimental; a desktop webcam trial detected a hand and scored moves, but recognition varied and mobile cameras remain unverified.

## Input and limitations

Optional phone motion uses DeviceMotion linear acceleration from a phone held upright in the right hand. Tap **Enable phone motion** before starting; on browsers that require it, grant the motion permission. Move the phone in the indicated direction on the beat. It detects a threshold crossing in the dominant axis and compares it with the current cue and timing window; it is a rough proxy and may respond differently by device, arm rotation, or browser. It does not recognize full-body poses, and cannot distinguish intentional motion from other acceleration. Some browsers expose no usable linear acceleration even after permission; use the buttons or keys if that happens. Sensors require a secure context (HTTPS or loopback localhost); a phone on a LAN cannot use the desktop’s 127.0.0.1 address. The game runs on the phone itself, not as a companion controller. No sensor data leaves the device. Disable motion with the same button. There is no microphone, multiplayer, or full-body tracking. The game is a short single-player timing interpretation, not the original game's camera or phone scoring. Sound is generated in the browser and may depend on browser audio support. Reduced-motion preferences disable transitions; the coach still changes pose to communicate cues. The track and choreography, vector art, and code are original.

## Research

The [Just Dance Now FAQ](https://web.justdancenow.com/FAQ?lang=en) describes following a coach while holding a phone in the right hand. Ubisoft's [camera controller overview](https://www.ubisoft.com/en-gb/news/ignt.55757/rivoluzionare-il-motion-gaming-la-funzione-controller-fotocamera) describes its separate skeleton-based full-body scoring. The [original manual](https://dlassets-ssl.xboxlive.com/public/content/f9766e9d-1f3d-40e4-8a1b-ca6393b0a7e4/GameManual/6b56180f-6737-4846-8bc2-98156d46d89b/en-US/index.html) describes move grades and stars. Neon Steps borrows the coach, cues and feedback loop, but does not implement those tracking systems or use their assets. A 2D SVG coach keeps the choreography clear and avoids a 3D dependency for this front-facing game.

Independent fan-inspired learning project; not affiliated with or endorsed by Ubisoft. Just Dance is a trademark of its respective owner.

The motion implementation follows the [DeviceMotion acceleration](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/acceleration) and [permission](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/requestPermission_static) APIs. Browser coordinate conventions may differ, so directional reliability requires physical-device testing.

Hand tracking uses [MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js); camera permission behavior follows [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

## License

MIT; see [LICENSE](LICENSE).

## Verification (2026-10-31)

Served on `http://127.0.0.1:8765/`: launch, a timed left-arrow hit (60 points and GOOD feedback), pause/resume, and track completion with the score retained were observed in a browser. JavaScript syntax passed `node --check`. The prepared Arcade catalog passed its three integrity tests. The motion classifier and permission grant, denial, exception and unavailable paths pass automated tests using simulated data (`npm test`). The camera direction classifier, loss/reset, denied/unavailable access and rear-camera rejection are also covered with simulated data. The 390 × 844 browser layout was visually checked, and the updated track reached its results screen; the browser displayed a fallback when no usable sensor data arrived. Physical-device motion sensing, native permission prompts, touch input, and audio output remain unverified. A complete high-scoring run has not been independently verified.

On 2026-10-31, a local Chrome test with an authorized FaceTime HD webcam loaded the model, detected a real hand, scored 160 points without keyboard input, and displayed tracking-loss feedback. The Stop camera control ended the stream. This was a brief desktop trial; directional accuracy, repeated play, and mobile-device performance remain unverified.

## Arcade metadata

See [docs/arcade-metadata.md](docs/arcade-metadata.md) for the game-owned manifest and screenshot provenance.
