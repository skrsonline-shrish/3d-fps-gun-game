import './style.css';
import * as THREE from 'three';

const gameRoot = document.body;
const hud = document.getElementById('hud');
const healthText = document.getElementById('health');
const ammoText = document.getElementById('ammo');
const scoreText = document.getElementById('score');
const statusText = document.getElementById('statusText');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fc3ff);
scene.fog = new THREE.Fog(0x8fc3ff, 20, 60);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
gameRoot.appendChild(renderer.domElement);

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const worldUp = new THREE.Vector3(0, 1, 0);

const player = {
  position: new THREE.Vector3(0, 1.7, 10),
  velocity: new THREE.Vector3(),
  yaw: 0,
  pitch: 0,
  health: 100,
  ammo: 18,
  reserveAmmo: 90,
  fireCooldown: 0,
  canShoot: true,
  speed: 11,
  radius: 1.1,
};

const state = {
  score: 0,
  gameOver: false,
  enemies: [],
  spawnTimer: 0,
  wave: 1,
};

const keys = {};
const pointer = { locked: false };

function initLights() {
  const hemi = new THREE.HemisphereLight(0xdfeeff, 0x2a3d2a, 1.2);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(10, 20, 8);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.left = -30;
  dir.shadow.camera.right = 30;
  dir.shadow.camera.top = 30;
  dir.shadow.camera.bottom = -30;
  scene.add(dir);
}

function addArena() {
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(44, 1, 44),
    new THREE.MeshStandardMaterial({ color: 0x46a064, roughness: 0.95 })
  );
  ground.position.set(0, -0.5, 0);
  ground.receiveShadow = true;
  scene.add(ground);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(18, 0.5, 16, 64),
    new THREE.MeshStandardMaterial({ color: 0xbbd6ff, emissive: 0x1b95ff, emissiveIntensity: 0.2 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  scene.add(ring);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b4d59,
    metalness: 0.7,
    roughness: 0.5,
  });

  const wallData = [
    { size: [44, 6, 1], pos: [0, 2.5, -22] },
    { size: [44, 6, 1], pos: [0, 2.5, 22] },
    { size: [1, 6, 44], pos: [-22, 2.5, 0] },
    { size: [1, 6, 44], pos: [22, 2.5, 0] },
  ];

  for (const wall of wallData) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...wall.size), wallMaterial);
    mesh.position.set(...wall.pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  // Center platform
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(2.9, 3.2, 1.6, 24),
    new THREE.MeshStandardMaterial({ color: 0x3d5d7a, metalness: 0.65, roughness: 0.32 })
  );
  core.position.set(0, 0.9, 0);
  core.castShadow = true;
  core.receiveShadow = true;
  scene.add(core);
}

function createWeapon() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.18, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x1b1f22, metalness: 0.65, roughness: 0.45 })
  );
  body.castShadow = true;

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12),
    new THREE.MeshStandardMaterial({ color: 0x2d3034, metalness: 0.9, roughness: 0.25 })
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0.18, -0.03, -0.7);
  barrel.castShadow = true;

  const grip = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.35, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x111417, metalness: 0.7, roughness: 0.4 })
  );
  grip.position.set(0, -0.26, 0.18);
  grip.castShadow = true;

  const muzzleGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd166 })
  );
  muzzleGlow.position.set(0.18, -0.03, -1.18);
  muzzleGlow.visible = false;

  group.add(body, barrel, grip, muzzleGlow);
  group.position.set(0.35, -0.28, -0.45);
  group.name = 'weapon';
  group.userData.muzzleGlow = muzzleGlow;

  camera.add(group);
  scene.add(camera);
}

function updateHUD() {
  healthText.textContent = Math.max(0, Math.ceil(player.health));
  ammoText.textContent = `${player.ammo} / ${player.reserveAmmo}`;
  scoreText.textContent = state.score;
}

function applyDamage(amount) {
  player.health -= amount;
  if (player.health <= 0) {
    player.health = 0;
    endGame();
  }
  updateHUD();
}

function endGame() {
  state.gameOver = true;
  finalScore.textContent = `Score: ${state.score}`;
  gameOver.classList.remove('hidden');
  statusText.textContent = 'Game Over';
  document.exitPointerLock();
}

function resetGame() {
  state.score = 0;
  state.gameOver = false;
  state.wave = 1;
  state.spawnTimer = 0;
  state.enemies.forEach((enemy) => scene.remove(enemy.group));
  state.enemies = [];

  player.position.set(0, 1.7, 10);
  player.yaw = 0;
  player.pitch = 0;
  player.health = 100;
  player.ammo = 18;
  player.reserveAmmo = 90;
  player.fireCooldown = 0;
  camera.position.copy(player.position);
  camera.rotation.set(0, 0, 0);
  gameOver.classList.add('hidden');
  statusText.textContent = 'Click to lock cursor and start';
  updateHUD();
}

function spawnEnemy() {
  const x = (Math.random() - 0.5) * 28;
  const z = (Math.random() - 0.5) * 28;
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.5, 1.3),
    new THREE.MeshStandardMaterial({ color: 0xe66a5f, emissive: 0x441111, emissiveIntensity: 0.4 })
  );
  body.castShadow = true;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xf4d1b2 })
  );
  head.position.y = 1.1;
  head.castShadow = true;

  const gun = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x1a1c20 })
  );
  gun.position.set(0.6, 0.3, 0.3);
  gun.rotation.z = -Math.PI / 2;

  group.add(body, head, gun);
  group.position.set(x, 0.8, z);
  scene.add(group);

  const enemy = {
    group,
    health: 60 + state.wave * 6,
    speed: 2.5 + state.wave * 0.3,
    attackCooldown: 0,
    hitFlash: 0,
  };

  state.enemies.push(enemy);
}

function shoot() {
  if (state.gameOver || !pointer.locked || player.fireCooldown > 0) return;

  if (player.ammo <= 0) {
    statusText.textContent = 'Reloading...';
    player.fireCooldown = 0.35;
    return;
  }

  player.ammo -= 1;
  player.fireCooldown = 0.18;

  const muzzle = camera.children.find((child) => child.name === 'weapon');
  const glow = muzzle?.userData.muzzleGlow;
  if (glow) {
    glow.visible = true;
    setTimeout(() => {
      glow.visible = false;
    }, 45);
  }

  const origin = camera.position.clone();
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
  raycaster.set(origin, direction);

  const hits = raycaster.intersectObjects(
    state.enemies.map((enemy) => enemy.group),
    true
  );

  if (hits.length > 0) {
    const target = hits[0].object;
    const enemy = state.enemies.find((item) => item.group === target.parent || item.group === target);
    if (enemy) {
      enemy.health -= 25;
      enemy.hitFlash = 0.12;
      if (enemy.health <= 0) {
        state.score += 100;
        scene.remove(enemy.group);
        state.enemies = state.enemies.filter((item) => item !== enemy);
        statusText.textContent = 'Target down';
      }
    }
  }

  updateHUD();
}

function handleInput(delta) {
  const moveX = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);
  const moveZ = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);

  if (moveX || moveZ) {
    const forward = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const velocity = new THREE.Vector3();

    velocity.addScaledVector(forward, moveZ);
    velocity.addScaledVector(right, moveX);
    velocity.normalize().multiplyScalar(player.speed * delta);

    player.position.x += velocity.x;
    player.position.z += velocity.z;
    player.position.x = THREE.MathUtils.clamp(player.position.x, -18, 18);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -18, 18);
  }

  camera.position.set(player.position.x, 1.7, player.position.z);
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;

  if (player.fireCooldown > 0) {
    player.fireCooldown -= delta;
  }

  if (player.ammo === 0 && player.reserveAmmo > 0) {
    player.ammo = 18;
    player.reserveAmmo -= 18;
    statusText.textContent = 'Reloaded';
  }

  if (state.enemies.length === 0 && !state.gameOver) {
    state.wave += 1;
    for (let i = 0; i < Math.min(2 + state.wave, 10); i++) {
      spawnEnemy();
    }
  }

  state.spawnTimer -= delta;
}

function updateEnemies(delta) {
  for (const enemy of state.enemies) {
    const toPlayer = new THREE.Vector3().subVectors(player.position, enemy.group.position);
    const distance = toPlayer.length();

    if (distance > 0.001) {
      toPlayer.normalize();
      enemy.group.position.addScaledVector(toPlayer, enemy.speed * delta);
    }

    enemy.group.lookAt(player.position.x, enemy.group.position.y, player.position.z);

    if (enemy.hitFlash > 0) {
      enemy.hitFlash -= delta;
      const mesh = enemy.group.children[0];
      mesh.material.emissiveIntensity = 1.2;
    } else {
      const mesh = enemy.group.children[0];
      mesh.material.emissiveIntensity = 0.4;
    }

    enemy.attackCooldown -= delta;
    if (distance < 2.1 && enemy.attackCooldown <= 0) {
      applyDamage(10);
      enemy.attackCooldown = 1.2;
      statusText.textContent = 'You are under fire';
    }
  }
}

function onMouseMove(event) {
  if (!pointer.locked) return;
  player.yaw -= event.movementX * 0.0024;
  player.pitch -= event.movementY * 0.0018;
  player.pitch = THREE.MathUtils.clamp(player.pitch, -1.4, 1.4);
}

function onPointerLockChange() {
  pointer.locked = document.pointerLockElement === renderer.domElement;
  statusText.textContent = pointer.locked ? 'Arena live' : 'Click to lock cursor and start';
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.033);
  if (!state.gameOver) {
    handleInput(delta);
    updateEnemies(delta);
  }

  updateHUD();
  renderer.render(scene, camera);
}

window.addEventListener('keydown', (event) => {
  keys[event.code] = true;
  if (event.code === 'Space' && !state.gameOver && !pointer.locked) {
    renderer.domElement.requestPointerLock();
  }
});

window.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

window.addEventListener('mousemove', onMouseMove);
document.addEventListener('pointerlockchange', onPointerLockChange);
renderer.domElement.addEventListener('click', () => {
  if (!state.gameOver && !pointer.locked) {
    renderer.domElement.requestPointerLock();
  }
});
renderer.domElement.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    shoot();
  }
});

window.addEventListener('resize', onResize);

restartBtn.addEventListener('click', () => {
  resetGame();
  renderer.domElement.requestPointerLock();
});

function setup() {
  initLights();
  addArena();
  createWeapon();
  resetGame();
  for (let i = 0; i < 3; i++) {
    spawnEnemy();
  }
  statusText.textContent = 'Click to lock cursor and start';
  updateHUD();
  animate();
}

setup();
