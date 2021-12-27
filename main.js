import './style.css';
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

//Animation Object
var pointLight, ambientLight;
var lightHelper, gridHelper;
var cube;
var plane;
const world = {
  plane: {
    width: 100,
    height: 100,
    widthSegments: 50,
    heightSegments: 50
  }
}

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

  ambientLight = new THREE.AmbientLight(0x543534);
  scene.add(  pointLight)//,ambientLight,

  lightHelper = new THREE.PointLightHelper(pointLight)
  gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper)
}

function createPlane() {
  const planeGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
  const planeMaterial = new THREE.MeshPhongMaterial({
      color:0xff0000,
      side: THREE.DoubleSide,  
      flatShading: THREE.FlatShading,
  });

  plane = new THREE.Mesh( planeGeometry, planeMaterial );
  //console.log(plane.geometry.attributes.position.array)
  const array = plane.geometry.attributes.position.array;
  for(var i = 0; i < array.length; i+=3) {
    //array[i] += Math.random();
    //array[i+1] += Math.random();
    array[i+2] += Math.sin(i)//Math.random();
  }
  scene.add(plane);
}

function generatePlane() {
  plane.geometry.dispose()
  plane.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  // vertice position randomization
  const { array } = plane.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      //array[i] = //x + (Math.random() - 0.5) 
      //array[i + 1] = //y + (Math.random() - 0.5) 
      array[i + 2] = Math.sin(i)//z + (Math.random() - 0.5)
    }

    randomValues.push(Math.random() * Math.PI * 2)
  }

  plane.geometry.attributes.position.randomValues = randomValues;
  plane.geometry.attributes.position.originalPosition = plane.geometry.attributes.position.array;

  const colors = []
  for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }

  plane.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}

function datGUI() {
  const gui = new GUI();
  gui.add(world.plane, 'width', 1, 200).onChange(generatePlane)
  gui.add(world.plane, 'height', 1, 200).onChange(generatePlane)
  gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
  gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane) 
  /*
  var cam = gui.addFolder('camera')
  cam.add(camera.position, 'z', 1, 500)  
  cam.open()*/
}


// Initialize function
function init() {
  //createCube();
  createAmbientLight();
  createPlane();
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
camera.position.set(0,1,50);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
//const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

init();
animate();
datGUI();


