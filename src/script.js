import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three';
import dat from 'dat.gui';

const COLOR_1 = '#cc9600';
const COLOR_2 = '#fff';

function addDebug(camera) {
  const gui = new dat.GUI({ width: 400 })
  gui.add(camera.position, 'x').min(10).max(40).step(0.01).name('Camera X')
  gui.add(camera.position, 'y').min(10).max(40).step(0.01).name('Camera Y')
  gui.add(camera.position, 'z').min(10).max(40).step(0.01).name('Camera Z')
}

function createSizes(window) {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

function createRenderer(window, sizes, canvas) {
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  return renderer;
}

function createOrbitControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true
  controls.enabled = false;
  return controls;
}

function createCamera(window) {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 10
  camera.position.y = 40
  camera.position.z = 40

  return camera;
}

function createMeshBox(textureLoader, size, x, y, z) {
  const geometry = new THREE.IcosahedronGeometry(size);
  const matcapTexture = textureLoader.load('/textures/matcaps/3.png') // This one looks great!
  const material = new THREE.MeshMatcapMaterial({ color: Math.random() < 0.5 ? COLOR_1 : COLOR_2 })
  material.matcap = matcapTexture

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = x;
  mesh.position.y = y;
  mesh.position.z = z;
  return mesh;
}

function loadEvents(sizes, camera, renderer) {
  window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight  
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()  

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');
const sizes = createSizes(window);
const camera = createCamera(window);
const renderer = createRenderer(window, sizes, canvas);
const controls = createOrbitControls(camera, canvas);
const textureLoader = new THREE.TextureLoader()
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

loadEvents(sizes, camera, renderer);

scene.add(camera);
scene.add(ambientLight)

// addDebug(camera);

let control = 0;
let progress = 0;
let set3 = true;
let set2 = true;
let rate = 0.1;

/* Animate */
const tick = () => {
  const mesh2 = createMeshBox(textureLoader, Math.random(0.1), Math.random(0.5) * 5, Math.random(0.5) * 5, Math.random(0.5) * 5);
  mesh2.position.x += Math.pow(mesh2.position.x, 2);
  mesh2.position.y += Math.pow(mesh2.position.y, 2);
  mesh2.position.z += Math.pow(mesh2.position.z, 2);
  scene.add(mesh2);
  
  // Control
  if (progress >= 3 && progress < 6) {
    control = 1;
  }

  if (progress >= 6 && progress < 9) {
    control = 2

    if (set2) {
      camera.position.y = 40;
      set2 = false;
    }
  }

  if (progress >= 9) {
    control = 3;

    if (set3) {
      camera.position.x = 25;
      set3 = false;
    }
  }

  if (progress >= 12) {
    control = 4;
  }

  // Cameras
  if (control === 0) {
    camera.position.x += 0.05;
    camera.position.y = 19
    camera.position.z = 19
  }

  if (control === 1) {
    camera.position.x -= 0.05;
    camera.position.y = 10
    camera.position.z = 26
  }

  if (control === 2) {
    camera.position.x = 10;
    camera.position.y -= 0.1;
    camera.position.z = 10;
  }

  if (control === 3) {
    camera.position.x += rate;
    camera.position.y = 40
    camera.position.z = 40

    if (rate > 0) {
      rate -= 0.0004;
    } else {
      rate = 0;
    }
  }

  if (control === 4) {
    camera.position.x -= 0.005;
    camera.position.y -= 0.005;
    camera.position.z -= 0.005;
  }

  progress += 0.01;
  // console.log(progress);
  
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();