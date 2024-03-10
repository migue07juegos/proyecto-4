import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene(); /*escena*/

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .015, 1000);/*fov, aspect, near, far*/ /*Fov = Campo de visión, aspect = aspecto, near: cercania, far: lejania*/
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'), /* Selector de canvas para rederizado de GPU*/ 
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//const transformControls = new TransformControls(camera, renderer.domElement)
//scene.add(transformControls)

const loader = new GLTFLoader() //importar el modelo 3d en formato gltf
loader.load(
    'aulaEscalada.glb',
    function (gltf) {
        scene.add(gltf.scene);
    },
    // (xhr) => {
    //     console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); /*debug */
    // },
    // (error) => {
    //     console.log(error);
    // }

);

const pointLight = new THREE.PointLight(0xffffff,80000); /*Punto de luz*/
pointLight.position.set(0,250,-400);

const pointLight2 = new THREE.PointLight(0xffffff,80000); /*Punto de luz*/
pointLight2.position.set(0,250,100);

const pointLight3 = new THREE.PointLight(0xffffff,80000); /*Punto de luz*/
pointLight3.position.set(200,250,0);

const pointLight4 = new THREE.PointLight(0xffffff,80000); /*Punto de luz*/
pointLight4.position.set(-350,250,0);

const ambientLight = new THREE.AmbientLight(0xffffff); /*Luz ambiental*/
const lightHelper = new THREE.PointLightHelper(pointLight); /*Debug purpose*/
const lightHelper2 = new THREE.PointLightHelper(pointLight2); /*Debug purpose*/
const lightHelper3 = new THREE.PointLightHelper(pointLight3); /*Debug purpose*/
const lightHelper4 = new THREE.PointLightHelper(pointLight4); /*Debug purpose*/

const gridHelper = new THREE.GridHelper(500,50); /*Debug purpose*/

/*scene.add(lightHelper,lightHelper2,lightHelper3,lightHelper4); //ayudadores */

scene.add(pointLight,pointLight2,pointLight3,pointLight4, ambientLight, gridHelper);

window.addEventListener('resize', ()=> { /* evento para que no se rompa el rederizador del canvas */
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

//valores para el joycon
let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
let tempVector = new THREE.Vector3();
let upVector = new THREE.Vector3(0, 1, 0);
let joyManager;

camera.position.set(0,1,1);
scene.add(camera);

let controls = new OrbitControls(camera, renderer.domElement); //controles de orbita
//configuracion de los delimitantes de los controles
controls.maxDistance = 100;
controls.minDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = 0;
controls.autoRotate = false;
controls.autoRotateSpeed = 0;
controls.rotateSpeed = 0.1;
controls.enableDamping = false;
controls.dampingFactor = 0.1;
controls.enableZoom = false;
controls.enablePan = false;
controls.minAzimuthAngle = -Math.PI / 2;
controls.maxAzimuthAngle = Math.PI / 4; 

let geometry = new THREE.SphereGeometry(5, 32, 32);
let cubeMaterial = new THREE.MeshNormalMaterial();

//let mesh = new THREE.Mesh(geometry, cubeMaterial);
let mesh = new THREE.AmbientLight(0xffffff,1);
let help = new THREE.PointLightHelper(mesh);//debug

scene.add(mesh);

resize();
animate();
window.addEventListener("resize", resize);

addJoystick();

function resize() {
  let w = window.innerWidth;
  let h = window.innerHeight;

  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate() {
  updatePlayer();
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}

function updatePlayer() {
  const angle = controls.getAzimuthalAngle();

  if (fwdValue > 0) {
    tempVector.set(0, 0, -fwdValue).applyAxisAngle(upVector, angle);
    mesh.position.addScaledVector(tempVector, 1);
  }

  if (bkdValue > 0) {
    tempVector.set(0, 0, bkdValue).applyAxisAngle(upVector, angle);
    mesh.position.addScaledVector(tempVector, .5);
  }

  if (lftValue > 0) {
    tempVector.set(-lftValue, 0, 0).applyAxisAngle(upVector, angle);
    mesh.position.addScaledVector(tempVector, .5);
  }

  if (rgtValue > 0) {
    tempVector.set(rgtValue, 0, 0).applyAxisAngle(upVector, angle);
    mesh.position.addScaledVector(tempVector, .5);
  }

  camera.position.sub(controls.target);
  controls.target.copy(mesh.position);
  camera.position.add(mesh.position.sub(new THREE.Vector3(0, 0, 0)));
}

function addJoystick() {
  const options = {
    zone: document.getElementById("joystickWrapper1"),
    size: 120,
    multitouch: true,
    maxNumberOfNipples: 2,
    mode: "static",
    restJoystick: true,
    shape: "circle",
    position: { top: "60px", left: "60px" },
    dynamicPage: true,
  };

  joyManager = nipplejs.create(options);

  joyManager["0"].on("move", function (evt, data) {
    const forward = data.vector.y;
    const turn = data.vector.x;

    if (forward > 0) {
      fwdValue = Math.abs(forward);
      bkdValue = 0;
    } else if (forward < 0) {
      fwdValue = 0;
      bkdValue = Math.abs(forward);
    }

    if (turn > 0) {
      lftValue = 0;
      rgtValue = Math.abs(turn);
    } else if (turn < 0) {
      lftValue = Math.abs(turn);
      rgtValue = 0;
    }
  });

  joyManager["0"].on("end", function (evt) {
    bkdValue = 0;
    fwdValue = 0;
    lftValue = 0;
    rgtValue = 0;
  });
}
//implementacion del joycon y el script --> nipplejs.min.js --> source : https://github.com/MULUALEM-TEKLE/joystick-case-study