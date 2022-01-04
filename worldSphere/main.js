/* 
Based on this tutorial, glsl basics
https://www.youtube.com/watch?v=vM8M4QloVL0
*/

import './style.css'
import * as THREE from 'three';
//import vertexShader from './shader/vertex.glsl';
//console.log(vertex_Shader)

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
    
    new THREE.MeshBasicMaterial({
        //color: 0xff0000,
        map: new THREE.TextureLoader().load('./images/globe.jpg')
    })
    /*new THREE.ShaderMaterial({

        map: new THREE.TextureLoader().load('./resource/globe.jpg'),
        //vertexShader,
        //fragmentShader:fragmentShader, 
    })*/
)

scene.add(sphere)

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera)
}

animate();
