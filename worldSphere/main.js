/* 
Based on this tutorial, glsl basics
https://www.youtube.com/watch?v=vM8M4QloVL0
*/

import './style.css';
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertexShader.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragmentShader.glsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, innerWidth/innerHeight, 0.1, 500);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#bg')
});
renderer.setSize(innerWidth, innerHeight);

document.body.append(renderer.domElement)

  
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader, 
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('./images/globe.jpg')
            }
        }
    })
);
sphere.rotation.set(0.6, 0, 0);
scene.add(sphere);

function datGUI() {
    const gui = new GUI();
    gui.add(sphere.rotation, 'x', -3, 3).onChange()
    gui.add(sphere.rotation, 'y', -3, 3).onChange()
    gui.add(sphere.rotation, 'z', -3, 3).onChange()
}

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    })
);
atmosphere.scale.set(1.2, 1.2, 1.2);

scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry();
const vertices = [];
const dv = [];

for ( let i = 0; i < 10000; i ++ ) {

    const x = 2000 * Math.random() - 1000;
    const y = 2000 * Math.random() - 1000;
    const z = 10*Math.random() - 100;

    const dx = Math.random();
    const dy = Math.random();
    const dz = 0;

    vertices.push( x, y, z );
    dv.push( dx, dy , dz);
}

starGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
starGeometry.setAttribute( 'dposition', new THREE.Float32BufferAttribute( dv, 3 ));

const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
        size: 0.5
    })
)

console.log(starGeometry)
scene.add(stars)

const mouse = {
    x: 0,
    y: 0,
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere.rotation.y += 0.002;

    gsap.to(group.rotation, {
        y: -mouse.y * 0.2,
        x: mouse.x * 0.2
    })

}
addEventListener('mousemove', (e)=>{
    mouse.x = (e.clientX/innerWidth) * 2 - 1;
    mouse.y = (e.clientY/innerHeight) * 2 + 1;
})
addEventListener('resize', onWindowResize)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }


animate();
datGUI();
