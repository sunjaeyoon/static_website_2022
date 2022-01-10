/* 
Based on this tutorial, glsl basics
https://www.youtube.com/watch?v=vM8M4QloVL0
*/

import './style.css';
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import glslify from 'glslify';
import gsap from 'gsap';
//import vertexShader from './shaders/vertexShader.glsl';
//console.log(vertexShader)

var vertexShader = glslify(`
varying vec2 vertexUV;
varying vec3 vertexNormal;
void main() {
    vertexUV = uv;
    vertexNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}`);

var fragmentShader = glslify(`
uniform sampler2D globeTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal;
void main() {
    
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz , 1);
    //gl_FragColor = vec4(0.4, 0.2, 0.5, 1);
}
`)

var atmosphereVertexShader = glslify(`
varying vec3 vertexNormal;
void main() {
    vertexNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`);

var atmosphereFragmentShader = glslify(`
varying vec3 vertexNormal;
void main() {
    float intensity = pow(0.8 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 0.9, 1.0) * intensity;
}
`);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, innerWidth/innerHeight, 0.1, 500);
camera.position.set(0, 0, 10);

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
