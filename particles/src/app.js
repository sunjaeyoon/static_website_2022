/*
Followed this guy's instructions: https://www.youtube.com/watch?v=8K5wJeVgjrM
*/ 

// LIBRARIES
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// SHADERS
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

import mask from './../img/mask.jpg';
import t1 from './../img/t1.jpg';
import t2 from './../img/t2.jpg';

export default class Sketch{
    constructor(){
        // Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0,0,500);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            antialias: true,
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        // Class Variables
        this.time = 0;
        this.move = 0;
        this.mouse = {x: 0, y: 0};
        //this.mouse = new THREE.Vector2();

        // Textures
        this.textures = [
            new THREE.TextureLoader().load(t1),
            new THREE.TextureLoader().load(t2),
        ];
        this.mask = new THREE.TextureLoader().load(mask);

        // Orbit Controls
        //this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        // Add Objects
        this.createMesh();

        // Resize
        window.addEventListener('resize', this.onWindowResize, false);
        this.mouseEffects();
        this.animate();
    };

    mouseEffects = () => {
        window.addEventListener('mousewheel', (e)=>{
            //console.log(e.wheelDeltaY);
            this.move += e.wheelDeltaY/1000;
        })
        window.addEventListener('mousemove', (e)=>{
            this.mouse.x = (e.clientX/innerWidth) - 0.5;
            this.mouse.y = (e.clientY/innerHeight) - 0.5;
            //console.log(this.mouse.x, this.mouse.y)
        })

    }
    onWindowResize = () =>{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    

    createMesh = () =>{
        //Mesh
        let number = 512;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new THREE.BufferAttribute(new Float32Array(number*number*3),3);
        this.coordinates = new THREE.BufferAttribute(new Float32Array(number*number*3),3);
        this.speeds = new THREE.BufferAttribute(new Float32Array(number*number*3),1);
        this.offset = new THREE.BufferAttribute(new Float32Array(number*number*3),1);

        function rand(a,b){
            return a + (b-a)*Math.random()
        }

        let index = 0;
        for (let i = 0; i < number; i++) {
            let posX = i - number/2;
            for (let j = 0; j < number; j++) {
                this.positions.setXYZ(index, posX, j-number/2, 0);
                this.coordinates.setXYZ(index, i, j, 0);
                this.offset.setX(index, rand(-1000,1000));
                this.speeds.setX(index, rand(0.4,1));
                index++;
            }    
        }

        this.geometry.setAttribute('position', this.positions);
        this.geometry.setAttribute('aCoordinates', this.coordinates);
        this.geometry.setAttribute('aSpeed', this.speeds);
        this.geometry.setAttribute('aOffset', this.offset);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms:{
                progress: {type: "f", value:0},
                t1: {type: "t", value: this.textures[0]},
                t2: {type: "t", value: this.textures[1]},
                mask: {type: "t", value: this.mask},
                time: {type: "f", value:0},
                move: {type: "f", value:0},
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false

        });
        this.plane = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.plane);
    }  
    
    render = () =>{
        this.time++;
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.move.value = this.move;

        gsap.to(this.plane.rotation, {
            y: this.mouse.x * 0.2,
            x: this.mouse.y * 0.2
        });

        this.renderer.render( this.scene, this.camera );
    };

    animate = () =>{
        //this.plane.rotation.x += 0.01;
        //this.plane.rotation.y += 0.001;
        this.render();  
        window.requestAnimationFrame( this.animate );
    };
}

var draw = new Sketch();