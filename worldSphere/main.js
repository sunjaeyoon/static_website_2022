/* 
Based on this tutorial, glsl basics
https://www.youtube.com/watch?v=vM8M4QloVL0
*/

import './style.css';
import * as THREE from 'three';
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
});
renderer.setSize(innerWidth, innerHeight);

document.body.append(renderer.domElement)

  
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    /*
    new THREE.MeshBasicMaterial({
        //color: 0xff0000,
        map: new THREE.TextureLoader().load('./images/globe.jpg')
    })*/
    
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

scene.add(sphere);

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

const mouse = {
    x: 0,
    y: 0,
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere.rotation.y += 0.002;
    group.rotation.y = mouse.x * 0.5;
    gsap.to(group.rotation, {
        y: -mouse.y * 0.5,
        x: mouse.x * 0.5
    })
}
addEventListener('mousemove', (e)=>{
    mouse.x = (e.clientX/innerWidth) * 2 - 1;
    mouse.y = (e.clientY/innerHeight) * 2 + 1;
})
animate();
