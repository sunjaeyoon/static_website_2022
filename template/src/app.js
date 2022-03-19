/*
Followed this guy's instructions: https://www.youtube.com/watch?v=8K5wJeVgjrM
*/ 

// LIBRARIES
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { GUI } from 'dat.gui';

// SHADERS
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';


export default class Sketch{
    constructor(){
        // Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0,0,500);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.time = 0;
        
        //Orbit Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        // Add Objects
        this.createMesh();

        window.addEventListener('resize', this.onWindowResize, false);
        this.animate();
    };

    onWindowResize = () =>{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    render = () =>{
        this.time++;
        this.renderer.render( this.scene, this.camera );
    };

    animate = () =>{
        //this.plane.rotation.x += 0.01;
        //this.plane.rotation.y += 0.01;
        this.render();  
        requestAnimationFrame( this.animate );
    };

    createMesh = () =>{
        //Mesh
        let number = 512;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new THREE.BufferAttribute(new Float32Array(number*number*3),3);
        this.coordinates = new THREE.BufferAttribute(new Float32Array(number*number*3),3);

        let index = 0;
        for (let i = 0; i < number; i++) {
            let posX = i - number/2;
            for (let j = 0; j < number; j++) {
                this.positions.setXYZ(index, posX, j-number/2, 0);
                this.coordinates.setXYZ(index, i, j, 0);
                index++;
            }    
        }

        this.geometry.setAttribute('position', this.positions);
        this.geometry.setAttribute('aCoordinates', this.coordinates);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment
        })
        this.plane = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.plane);
    }

    
   
}

var draw = new Sketch();