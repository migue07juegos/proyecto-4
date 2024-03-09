import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene(); /*escena*/
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .015, 1000);/*fov, aspect, near, far*/ /*Fov = Campo de visión, aspect = aspecto, near: cercania, far: lejania*/
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'), /* Selector de canvas para rederizado de GPU*/ 
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,1,3.5);

const controls = new OrbitControls( camera, renderer.domElement ); /*Controles para usar el maouse*/

const loader = new GLTFLoader()
loader.load(
    'proto1.glb',
    function (gltf) {
        scene.add(gltf.scene);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }

)

const pointLight = new THREE.PointLight(0xffffff,10); /*Punto de luz*/
pointLight.position.set(0,1,-2.5);

const pointLight2 = new THREE.PointLight(0xffffff,10); /*Punto de luz*/
pointLight2.position.set(0,1,2.5);

const pointLight3 = new THREE.PointLight(0xffffff,10); /*Punto de luz*/
pointLight3.position.set(2.5,1,0);

const pointLight4 = new THREE.PointLight(0xffffff,10); /*Punto de luz*/
pointLight4.position.set(-2.5,1,0);

const ambientLight = new THREE.AmbientLight(0xffffff); /*Luz ambiental*/
const lightHelper = new THREE.PointLightHelper(pointLight); /*Debug purpose*/
const lightHelper2 = new THREE.PointLightHelper(pointLight2); /*Debug purpose*/
const lightHelper3 = new THREE.PointLightHelper(pointLight3); /*Debug purpose*/
const lightHelper4 = new THREE.PointLightHelper(pointLight4); /*Debug purpose*/

const gridHelper = new THREE.GridHelper(200,50); /*Debug purpose*/

scene.add(pointLight,pointLight2,pointLight3,pointLight4, lightHelper,lightHelper2,lightHelper3,lightHelper4, ambientLight, gridHelper);


function gameLoop() { /*ciclo infinito para mostrar la escena y el renderizado*/
    requestAnimationFrame(gameLoop);
    controls.update(); /*actualizar la pocicion de los controles para que sean funcionales*/
    renderer.render(scene, camera);
}

gameLoop();

