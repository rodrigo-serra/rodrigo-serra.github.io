// Hero scene: Rodrigo sits on the floor coding, and the code he types drives
// TIAGo Pro (standard configuration: two arms with PAL Pro grippers).
// The robot model comes from PAL Robotics' URDF (Apache 2.0), built by scripts/tiago-model.sh.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { createAvatar } from './avatar.js';

const BASE = import.meta.env.BASE_URL;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- the program on screen
// Each line is typed, then its action plays on the robot.
const PROGRAM = [
  [['kw', 'import '], ['id', 'rclpy']],
  [['kw', 'from '], ['id', 'socrob '], ['kw', 'import '], ['id', 'Pro']],
  [],
  [['id', 'pro '], ['op', '= '], ['fn', 'Pro'], ['op', '()']],
  [['id', 'pro.'], ['fn', 'look_at'], ['op', '('], ['str', '"rodrigo"'], ['op', ')']],
  [['id', 'pro.'], ['fn', 'wave'], ['op', '()']],
  [['id', 'pro.'], ['fn', 'look_at'], ['op', '('], ['str', '"visitor"'], ['op', ')']],
  [['id', 'pro.'], ['fn', 'say'], ['op', '('], ['str', '"Hi! Welcome."'], ['op', ')']],
  [['id', 'pro.'], ['fn', 'lift_torso'], ['op', '('], ['num', '0.25'], ['op', ')']],
  [['id', 'pro.'], ['fn', 'look_at'], ['op', '('], ['str', '"laptop"'], ['op', ')']],
  [['cm', '# tests passed ✓']],
];
const ACTION = { 4: 'lookRodrigo', 5: 'wave', 6: 'lookVisitor', 7: 'say', 8: 'lift', 9: 'lookLaptop' };
const COLORS = { kw: '#c5a8ff', id: '#e9e6f2', fn: '#8fd3ff', op: '#a7a2b8', str: '#ffd29a', num: '#ff9fb2', cm: '#7fd99a' };

function codePanel() {
  const W = 1024, H = 640;
  const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const font = '600 42px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  let lastKey = '';

  function draw(lineIdx, chars, caretOn) {
    const key = `${lineIdx}|${chars}|${caretOn}`;
    if (key === lastKey) return;
    lastKey = key;
    ctx.clearRect(0, 0, W, H);
    // window
    ctx.fillStyle = 'rgba(22, 19, 38, 0.92)';
    roundRect(ctx, 6, 6, W - 12, H - 12, 30); ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(155, 132, 255, 0.85)'; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(8, 8, W - 16, 58);
    ['#ff6b6b', '#ffd166', '#5fd38a'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(46 + i * 34, 37, 10, 0, 7); ctx.fill(); });
    ctx.font = '500 26px ui-monospace, Menlo, Consolas, monospace'; ctx.fillStyle = '#a7a2b8';
    ctx.fillText('hello_pro.py', 160, 46);
    // code
    ctx.font = font;
    const lineH = 60, top = 128, left = 100;
    const visible = 8, first = Math.max(0, lineIdx - visible + 1);
    for (let i = first; i <= Math.min(lineIdx, PROGRAM.length - 1); i++) {
      const y = top + (i - first) * lineH;
      ctx.fillStyle = '#5b5670'; ctx.textAlign = 'right'; ctx.fillText(String(i + 1), left - 26, y); ctx.textAlign = 'left';
      let x = left, budget = i < lineIdx ? Infinity : chars;
      for (const [k, text] of PROGRAM[i]) {
        if (budget <= 0) break;
        const s = text.slice(0, budget);
        budget -= s.length;
        ctx.fillStyle = COLORS[k]; ctx.fillText(s, x, y);
        x += ctx.measureText(s).width;
      }
      if (i === lineIdx && caretOn) { ctx.fillStyle = '#c5a8ff'; ctx.fillRect(x + 3, y - 36, 5, 46); }
    }
    tex.needsUpdate = true;
  }
  const geo = new THREE.PlaneGeometry(1, H / W);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  return { mesh, draw };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function speechBubble() {
  const W = 512, H = 200;
  const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f7f5ff';
  roundRect(ctx, 8, 8, W - 16, H - 60, 44); ctx.fill();
  ctx.beginPath(); ctx.moveTo(120, H - 54); ctx.lineTo(96, H - 8); ctx.lineTo(170, H - 54); ctx.fill();
  ctx.font = '700 58px system-ui, sans-serif'; ctx.fillStyle = '#2b2350'; ctx.textAlign = 'center';
  ctx.fillText('Hi! Welcome.', W / 2, 100);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5 * H / W), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }));
  return m;
}

function floorTexture() {
  const c = Object.assign(document.createElement('canvas'), { width: 512, height: 512 });
  const x = c.getContext('2d');
  const g = x.createRadialGradient(256, 256, 0, 256, 256, 256);
  g.addColorStop(0, 'rgba(109, 85, 216, 0.55)');
  g.addColorStop(0.55, 'rgba(109, 85, 216, 0.18)');
  g.addColorStop(1, 'rgba(109, 85, 216, 0)');
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------- robot joints
function robotRig(root) {
  const joints = {};
  root.traverse((o) => {
    const e = o.userData;
    if (e && e.urdf_type) joints[o.name] = { node: o, base: o.quaternion.clone(), basePos: o.position.clone(), axis: new THREE.Vector3(...e.axis).normalize(), type: e.urdf_type, lower: e.lower, upper: e.upper, value: 0, target: 0 };
  });
  const q = new THREE.Quaternion();
  return {
    joints,
    set(name, v) { const j = joints[name]; if (j) j.target = j.lower != null ? THREE.MathUtils.clamp(v, j.lower, j.upper) : v; },
    snap() { for (const j of Object.values(joints)) j.value = j.target; },
    update(k) {
      for (const j of Object.values(joints)) {
        j.value += (j.target - j.value) * k;
        if (j.type === 'prismatic') j.node.position.copy(j.basePos).addScaledVector(j.axis, j.value);
        else j.node.quaternion.copy(j.base).multiply(q.setFromAxisAngle(j.axis, j.value));
      }
    },
  };
}

// Arm poses, solved numerically for elbow and hand positions (joints 1 to 4 of each arm).
// Rest: elbows down, forearms forward. Wave: one hand raised beside the head.
const arm = (side, v) => Object.fromEntries([...v, 0, 0, 0].map((q, i) => [`arm_${side}_${i + 1}_joint`, q]));
const ARM_REST = { ...arm('left', [0.11, -1.37, 0.34, -1.84]), ...arm('right', [-0.32, -1.28, -0.4, -1.83]) };
const WAVE_SIDE = 'left';                       // the arm nearer the camera
const ARM_WAVE = { ...ARM_REST, ...(WAVE_SIDE === 'right' ? arm('right', [-1.5, -1.32, 1.71, -1.44]) : arm('left', [1.56, -1.09, -1.92, -1.43])) };

// ---------------------------------------------------------------- scene
// `hero` is the whole header section: the canvas covers it, so the scene has no frame.
// `stage` is the empty box in the layout where the figures should sit; the camera is
// set up for that box and its view is then extended to the full header.
// `onProgress(fraction)` reports how much of the two models has downloaded (0 to 1).
export async function mountHero(hero, stage, onProgress = () => {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'hero-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Animation of Rodrigo sitting on the floor with a laptop, programming the TIAGo Pro robot, which looks at him and waves.');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
  const lookAt = new THREE.Vector3(-0.02, 0.96, 0);
  const camBase = new THREE.Vector3(0.22, 1.3, 3.8);

  scene.add(new THREE.HemisphereLight(0xe9e4ff, 0x2a2240, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(1.6, 3.2, 2.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -1.4, right: 1.4, top: 2, bottom: -0.4, near: 0.5, far: 8 });
  key.shadow.bias = -0.0005;
  key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9b84ff, 2.2);
  rim.position.set(-2.5, 2.2, -2.2);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.7, 64), new THREE.MeshBasicMaterial({ map: floorTexture(), transparent: true, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(1.6, 48), new THREE.ShadowMaterial({ opacity: 0.32 }));
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0.001;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  // Rodrigo
  // Both models are Draco-compressed. Our own copy of the decoder (public/draco) is used:
  // the default URL three computes breaks under the Vite dev server.
  const draco = new DRACOLoader().setDecoderPath(`${BASE}draco/`);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  // Sizes in bytes, used when the server does not send a length; only the proportions matter.
  const got = { me: 0, robot: 0 }, size = { me: 534e3, robot: 1012e3 };
  const track = (k) => (e) => {
    if (e.lengthComputable) size[k] = e.total;
    got[k] = Math.min(e.loaded, size[k]);
    onProgress((got.me + got.robot) / (size.me + size.robot));
  };
  const [me, gltf] = await Promise.all([
    createAvatar(`${BASE}models/rodrigo.glb`, loader, track('me')),
    loader.loadAsync(`${BASE}models/tiago-pro.glb`, track('robot')),
  ]);
  onProgress(1);
  draco.dispose();
  me.group.position.set(-0.42, 0, 0.36);
  me.group.rotation.y = 0.55;
  scene.add(me.group);

  // Code panel floating above, between Rodrigo and the robot.
  const panel = codePanel();
  panel.mesh.scale.setScalar(1.12);
  panel.mesh.position.set(0.14, 1.8, -0.3);
  panel.mesh.rotation.y = 0.08;
  scene.add(panel.mesh);

  const bubble = speechBubble();
  scene.add(bubble);

  // Robot
  const robot = new THREE.Group();
  const model = gltf.scene;
  model.rotation.x = -Math.PI / 2;                // URDF is Z-up
  robot.add(model);
  model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.material.roughness = Math.max(o.material.roughness ?? 0.5, 0.35); } });
  robot.position.set(0.55, 0, -0.18);
  robot.rotation.y = 3.75;                        // facing Rodrigo, turned toward the visitor so both arms show
  scene.add(robot);
  const rig = robotRig(model);
  const head = model.getObjectByName('head_2_link') || model.getObjectByName('head_2_joint');

  Object.entries(ARM_REST).forEach(([k, v]) => rig.set(k, v));
  rig.set('torso_lift_joint', 0.05);
  rig.snap(); rig.update(1);

  // ------------------------------------------------------------ head aiming
  const tmpV = new THREE.Vector3(), tmpL = new THREE.Vector3();
  const aim = { yaw: 0, pitch: 0 };
  const panJoint = rig.joints.head_1_joint, tiltJoint = rig.joints.head_2_joint;
  function aimRobotAt(world) {
    if (!panJoint) return;
    // Express the target in the robot's base frame (URDF: x forward, y left, z up).
    model.updateMatrixWorld(true);
    tmpL.copy(world);
    panJoint.node.parent.worldToLocal(tmpL);
    const yaw = Math.atan2(tmpL.y, tmpL.x);
    const pitch = Math.atan2(-tmpL.z, Math.hypot(tmpL.x, tmpL.y)); // positive tilts down in PAL convention
    rig.set('head_1_joint', yaw * Math.sign(panJoint.axis.z || 1));
    rig.set('head_2_joint', pitch * Math.sign(tiltJoint.axis.y || 1));
  }
  const targets = {
    rodrigo: () => me.group.localToWorld(tmpV.set(0, 1.25, 0.05)),
    laptop: () => me.laptop.getWorldPosition(tmpV),
    visitor: () => tmpV.copy(camera.position),
  };

  // ------------------------------------------------------------ script
  const state = { typing: true, look: { yaw: 0.25, pitch: 0.45 }, robotLook: 'laptop', waveUntil: 0, sayUntil: 0, lift: 0.05 };
  let line = 0, chars = 0, nextAt = 0, holdUntil = 0;
  const lineLen = (i) => PROGRAM[i].reduce((n, [, s]) => n + s.length, 0);

  function act(name, t) {
    switch (name) {
      case 'lookRodrigo': state.robotLook = 'rodrigo'; state.look = { yaw: 0.8, pitch: -0.15 }; break;
      case 'wave': state.waveUntil = t + 2.6; break;
      case 'lookVisitor': state.robotLook = 'visitor'; state.look = { yaw: -0.25, pitch: -0.05 }; break;
      case 'say': state.sayUntil = t + 2.4; break;
      case 'lift': state.lift = 0.3; break;
      case 'lookLaptop': state.robotLook = 'laptop'; state.look = { yaw: 0.25, pitch: 0.45 }; break;
    }
  }
  function resetProgram() {
    line = 0; chars = 0; state.lift = 0.05; state.robotLook = 'laptop'; state.look = { yaw: 0.25, pitch: 0.45 };
  }

  function stepScript(t) {
    if (t < holdUntil) { state.typing = false; return; }
    state.typing = true;
    if (t < nextAt) return;
    if (line >= PROGRAM.length) { resetProgram(); nextAt = t + 0.6; return; }
    const len = lineLen(line);
    if (chars < len) { chars++; nextAt = t + 0.045 + Math.random() * 0.06; return; }
    // line finished: run its action, pause a little, move on
    const a = ACTION[line];
    if (a) { act(a, t); holdUntil = t + (a === 'wave' ? 2.8 : a === 'say' ? 2.5 : 1.4); }
    line++; chars = 0;
    nextAt = t + (line >= PROGRAM.length ? 3.2 : 0.35);
    if (line >= PROGRAM.length) holdUntil = t + 3.2;
  }

  // ------------------------------------------------------------ layout and input
  let running = false, raf = 0;
  function resize() {
    const full = hero.getBoundingClientRect(), box = stage.getBoundingClientRect();
    renderer.setSize(full.width, full.height, false);
    camera.aspect = box.width / box.height;
    camera.fov = 30;
    // The stage box is the "real" view; render the larger window around it.
    camera.setViewOffset(box.width, box.height, full.left - box.left, full.top - box.top, full.width, full.height);
    camera.updateProjectionMatrix();
    if (!running) renderer.render(scene, camera);   // resizing clears the canvas; redraw the still frame
  }
  const ro = new ResizeObserver(resize);
  ro.observe(hero); ro.observe(stage);
  resize();

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  // ------------------------------------------------------------ loop
  const timer = new THREE.Timer();
  let t = 0;                                  // scene time; does not advance while paused
  function frame(now) {
    raf = requestAnimationFrame(frame);
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 0.05);
    t += dt;
    stepScript(t);
    const lineIdx = Math.min(line, PROGRAM.length - 1);
    panel.draw(lineIdx, line >= PROGRAM.length ? Infinity : chars, Math.floor(t * 2) % 2 === 0);

    // robot behaviour
    aimRobotAt(targets[state.robotLook]());
    const waving = t < state.waveUntil;
    Object.entries(waving ? ARM_WAVE : ARM_REST).forEach(([k, v]) => rig.set(k, v));
    if (waving) rig.set(`arm_${WAVE_SIDE}_6_joint`, Math.sin(t * 8) * 0.45);
    rig.set('torso_lift_joint', state.lift);
    rig.update(1 - Math.pow(0.02, dt));

    // speech bubble near the robot head
    const showSay = t < state.sayUntil;
    if (head) {
      head.getWorldPosition(tmpV);
      bubble.position.set(tmpV.x + 0.18, tmpV.y + 0.32, tmpV.z + 0.1);
    }
    bubble.material.opacity += ((showSay ? 1 : 0) - bubble.material.opacity) * 0.15;
    bubble.visible = bubble.material.opacity > 0.01;
    bubble.quaternion.copy(camera.quaternion);

    me.update(t, state);
    panel.mesh.position.y = 1.8 + Math.sin(t * 1.1) * 0.02;

    // camera: gentle drift plus pointer parallax
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;
    camera.position.set(camBase.x + pointer.sx * 0.35 + Math.sin(t * 0.2) * 0.08, camBase.y - pointer.sy * 0.18, camBase.z);
    camera.lookAt(lookAt);
    renderer.render(scene, camera);
  }
  function start() { if (!running && !REDUCED) { running = true; timer.update(); raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // Reduced motion: one still frame of the finished program.
  if (REDUCED) {
    line = PROGRAM.length - 1; chars = Infinity; state.robotLook = 'rodrigo'; state.look = { yaw: 0.8, pitch: -0.15 };
    me.update(0, state); me.update(0, state);
    panel.draw(line, Infinity, false);
    aimRobotAt(targets.rodrigo()); rig.snap(); rig.update(1);
    camera.position.copy(camBase); camera.lookAt(lookAt);
    renderer.render(scene, camera);
  }

  new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  hero.prepend(canvas);
  if (import.meta.env.DEV) window.__hero = { rig, state, robot, model, me, camera, scene, panel, ARM_REST, ARM_WAVE, camBase, lookAt, t: () => t };
  return canvas;
}
