// Rodrigo: the Tripo model, rigged and posed sitting on a low seat by scripts/avatar_rig.py.
// The bones already hold the sitting pose; this module only adds small motions on top
// (typing, head turns, breathing), and adds the seat (an equipment case) and a laptop.
// API used by the scene: { group, laptop, update(t, state) }.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const HEIGHT = 1.75;                       // the model is 1 unit tall standing
const SEAT = 0.193 * HEIGHT;               // underside of the sitting model, printed by avatar_rig.py
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);

function makeLaptop() {
  const laptop = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.35, metalness: 0.6 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.016, 0.23), body);
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.1), new THREE.MeshStandardMaterial({ color: 0x1d1f24, roughness: 0.6 }));
  keys.rotation.x = -Math.PI / 2;
  keys.position.set(0, 0.0085, -0.02);
  // Lid hinged at the far edge, screen facing Rodrigo, so the visitor sees its back.
  const lid = new THREE.Group();
  lid.position.set(0, 0.008, 0.115);
  lid.rotation.x = -0.32;
  const lidBox = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.012), body);
  lidBox.position.y = 0.11;
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.022, 20), new THREE.MeshBasicMaterial({ color: 0xb4a5ff }));
  logo.position.set(0, 0.115, 0.0065);
  const screenLight = new THREE.PointLight(0x9d8cff, 0.35, 0.8);
  screenLight.position.set(0, 0.12, -0.08);
  lid.add(lidBox, logo, screenLight);
  laptop.add(base, keys, lid);
  laptop.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return laptop;
}

// The seat: a dark equipment case with metal edges, the kind robots travel in.
function makeCase() {
  const g = new THREE.Group();
  const w = 0.56, h = SEAT + 0.012, d = 0.4;
  const shell = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: 0x2a2c33, roughness: 0.7 }));
  shell.position.y = h / 2;
  const metal = new THREE.MeshStandardMaterial({ color: 0xaeb2bd, roughness: 0.35, metalness: 0.8 });
  const bar = (x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), metal); m.position.set(x, y, z); g.add(m); };
  const t = 0.018;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) bar(sx * (w / 2), h / 2, sz * (d / 2), t, h + 0.004, t);          // vertical edges
  for (const sz of [-1, 1]) { bar(0, h, sz * (d / 2), w, t, t); bar(0, 0.009, sz * (d / 2), w, t, t); }                   // long edges
  for (const sx of [-1, 1]) { bar(sx * (w / 2), h, 0, t, t, d); bar(sx * (w / 2), 0.009, 0, t, t, d); }                   // short edges
  bar(0, h * 0.62, d / 2 + 0.004, w, 0.012, 0.006);                                                                         // lid seam
  const latch = new THREE.MeshStandardMaterial({ color: 0x6d55d8, roughness: 0.4, metalness: 0.3 });
  for (const x of [-0.15, 0.15]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.012), latch); m.position.set(x, h * 0.62, d / 2 + 0.008); g.add(m); }
  g.add(shell);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

export async function createAvatar(url, loader = new GLTFLoader(), onProgress) {
  const gltf = await loader.loadAsync(url, onProgress);
  const group = new THREE.Group();
  const model = gltf.scene;
  model.scale.setScalar(HEIGHT);
  group.add(model);
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.frustumCulled = false;               // skinned bounds are those of the standing mesh
    o.material.metalness = 0;
    o.material.roughness = 0.75;
  });
  group.updateMatrixWorld(true);

  // Each animated bone remembers its posed rotation; motion is added as a rotation
  // about an axis given in the avatar's own frame (x: his left, y: up, z: forward).
  const inv = new THREE.Quaternion(), wq = new THREE.Quaternion(), d = new THREE.Quaternion();
  const groupQ = group.getWorldQuaternion(new THREE.Quaternion()).invert();
  function bone(name) {
    const b = model.getObjectByName(name);
    if (!b) return null;
    const world = b.getWorldQuaternion(new THREE.Quaternion()).premultiply(groupQ);   // posed orientation in the avatar frame
    return { b, init: b.quaternion.clone(), world, worldInv: world.clone().invert() };
  }
  // local = init * (world^-1 * delta * world)
  function turn(j, delta) {
    if (!j) return;
    inv.copy(j.worldInv).multiply(delta).multiply(j.world);
    j.b.quaternion.copy(j.init).multiply(inv);
  }
  const J = Object.fromEntries(['head', 'neck', 'chest', 'forearm_L', 'forearm_R', 'hand_L', 'hand_R'].map((n) => [n, bone(n)]));

  const seat = makeCase();
  seat.position.set(0, 0, -0.1);
  group.add(seat);

  // Laptop on the lap, placed so the keyboard sits right under the fingertips.
  // A fingertip is the wrist plus the hand bone's length along the bone (its local +Y).
  const tip = (j) => j.b.getWorldPosition(new THREE.Vector3())
    .add(new THREE.Vector3(0, 1, 0).applyQuaternion(j.b.getWorldQuaternion(new THREE.Quaternion())).multiplyScalar(0.075 * HEIGHT));
  const tips = group.worldToLocal(tip(J.hand_L).add(tip(J.hand_R)).multiplyScalar(0.5));
  const laptop = makeLaptop();
  laptop.scale.setScalar(1.15);
  laptop.position.set(tips.x, tips.y - 0.03, tips.z + 0.045);
  laptop.rotation.x = 0.03;
  group.add(laptop);

  const look = { yaw: 0, pitch: 0 };
  const qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
  function update(t, state) {
    // Typing: forearms and hands tap on their own rhythms; nearly still while he looks up.
    const k = state.typing ? 1 : 0.12;
    const tapL = Math.max(0, Math.sin(t * 17.0)) * k, tapR = Math.max(0, Math.sin(t * 15.0 + 1.7)) * k;
    turn(J.forearm_L, qa.setFromAxisAngle(X, -0.03 * tapL).multiply(qb.setFromAxisAngle(Y, Math.sin(t * 2.1) * 0.04 * k)));
    turn(J.forearm_R, qa.setFromAxisAngle(X, -0.03 * tapR).multiply(qb.setFromAxisAngle(Y, Math.sin(t * 1.7) * 0.04 * k)));
    turn(J.hand_L, qa.setFromAxisAngle(X, -0.16 * tapL));
    turn(J.hand_R, qa.setFromAxisAngle(X, -0.16 * tapR));
    // Head: eased toward where the script says he is looking, shared with the neck.
    look.yaw += (state.look.yaw - look.yaw) * 0.08;
    look.pitch += (state.look.pitch - look.pitch) * 0.08;
    d.setFromAxisAngle(Y, look.yaw * 0.6).multiply(qb.setFromAxisAngle(X, look.pitch * 0.6));
    turn(J.head, d);
    turn(J.neck, qa.setFromAxisAngle(Y, look.yaw * 0.4).multiply(qb.setFromAxisAngle(X, look.pitch * 0.4)));
    turn(J.chest, qa.setFromAxisAngle(X, Math.sin(t * 1.3) * 0.012));   // breathing
  }

  return { group, laptop, update };
}
