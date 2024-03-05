import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene(); /*escena*/
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);/*fov, aspect, near, far*/ /*Fov = Campo de visión, aspect = aspecto, near: cercania, far: lejania*/
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'), /* Selector de canvas para rederizado de GPU*/ 
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const controls = new OrbitControls( camera, renderer.domElement ); /*Controles para usar el maouse*/

const geometry = new THREE.TorusGeometry(10, 3, 16, 100); /*geometria*/
const material = new THREE.MeshBasicMaterial({color: 0xFF6347/*, wireframe: true*/}); /*material*/ 
const torus = new THREE.Mesh(geometry, material); /*malla*/

const pointLight = new THREE.PointLight(0xffffff); /*Punto de luz*/
pointLight.position.set(5,5,5);
const ambientLight = new THREE.AmbientLight(0xffffff); /*Luz ambiental*/
const lightHelper = new THREE.PointLightHelper(pointLight); /*Debug purpose*/
const gridHelper = new THREE.GridHelper(200,50); /*Debug purpose*/
scene.add(pointLight, ambientLight, lightHelper, gridHelper);

scene.add(torus);

function gameLoop() { /*ciclo infinito para mostrar la escena y el renderizado*/
    requestAnimationFrame(gameLoop);
    controls.update(); /*actualizar la pocicion de los controles para que sean funcionales*/
    renderer.render(scene, camera);
}

gameLoop();

// const loader = new GLTFLoader();

