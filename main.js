import './style.css';
import gsap from "https://cdn.skypack.dev/gsap";
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/*
//Animation Object
var pointLight, ambientLight;
var lightHelper, gridHelper;
var cube;
var plane;

// Make Object Function
function createCube() {
  const geometry = new THREE.BoxGeometry();
  //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material = new THREE.MeshPhongMaterial({
    color:0x00ff00,
    side: THREE.DoubleSide,  
    flatShading: THREE.FlatShading,
  });
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
}

function createAmbientLight() {
  // Lights
  pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(0, 0, 10);

  //ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight)//, ambientLight);

  lightHelper = new THREE.PointLightHelper(pointLight)
  gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper)
}

function createPlane() {
  const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  const planeMaterial = new THREE.MeshPhongMaterial({
      color:0xff0000,
      side: THREE.DoubleSide,  
      flatShading: THREE.FlatShading,
  });

  plane = new THREE.Mesh( planeGeometry, planeMaterial );
  console.log(plane.geometry.attributes.position.array)
  const array = plane.geometry.attributes.position.array;
  for(var i = 0; i < array.length; i+=3) {
    //array[i] += Math.random();
    array[i+1] += Math.random();
    array[i+2] += Math.random();
  }
  scene.add(plane);
}

// Initialize function
function init() {
  createCube();
  createAmbientLight();
  //createPlane();
  window.addEventListener('resize', onWindowResize, false);
}

// Event Listeners
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  
  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;
  //plane.rotation.x += 0.01;
  
};



// MAIN CODE
// Scene, Camera, Renderer (SCR)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,1,10);

//
//const renderer = new THREE.WebGLRenderer({
//  canvas: document.querySelector('#bg'),
//});
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement)



init();
animate();*/

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
//controls.addEventListener('change', render)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
cubeFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

function animate() {
    requestAnimationFrame(animate)

    //stats.begin()
    //cube.rotation.x += 0.01
    //cube.rotation.y += 0.01
    //stats.end()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
