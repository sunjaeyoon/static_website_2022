/*
Followed this guy's instructions: https://www.youtube.com/watch?v=8K5wJeVgjrM
*/ 

import * as THREE from 'three';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';


export default class Sketch{
    constructor(){
        // Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0,0,2);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.time = 0;
        this.createMesh();
        window.addEventListener('resize', this.onWindowResize, false);
    };
    
    render = () =>{
        this.time++;
        this.renderer.render( this.scene, this.camera );
    };

    animate = () =>{
        this.plane.rotation.x += 0.01;
        this.plane.rotation.y += 0.01;
        this.render();  
        requestAnimationFrame( this.animate );
    };

    createMesh = () =>{
        //Mesh
        //this.geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10)
        //this.material = new THREE.MeshNormalMaterial();
        let number = 512
        this.geometry = new THREE.BufferGeometry();
        this.positions = new THREE.BufferAttribute(new Float32Array(number*number*3),3)

        let index = 0;
        for (let i = 0; i < number; i++) {
            for (let j = 0; j < number; j++) {
                this.positions.setXYZ(index, i, j, 0);
                index++;
            }    
        }

        this.geometry.setAttribute('position', this.positions)

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment
        })
        this.plane = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.plane);
    }

    onWindowResize = () =>{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
   
}

var draw = new Sketch();
draw.animate();