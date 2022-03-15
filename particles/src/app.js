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

import mask from './../img/mask.jpg';
import t1 from './../img/t1.jpg';
import t2 from './../img/t2.jpg';

export default class Sketch{
    constructor(){
        // Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0,0,700);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            antialias: true,
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        // Orbit Controls
        //this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        
        //Raycasting
        this.raycaster = new THREE.Raycaster();
        
        // Class Variables
        this.time = 0;
        this.move = 0;
        this.mouse = new THREE.Vector2(0,0);
        this.point = new THREE.Vector2();

        // Textures
        this.textures = [
            new THREE.TextureLoader().load(t1),
            new THREE.TextureLoader().load(t2),
        ];
        this.mask = new THREE.TextureLoader().load(mask);

        
        // Add Objects
        this.createMesh();

        // Event Listeners
        this.eventEffects();

        // Animate Loop
        this.animate();

        //Dat
        this.makeGUI();
    };

    eventEffects = () => {
        // Resize
        window.addEventListener('resize', this.onWindowResize, false);
        
        // Mouse Effects
        window.addEventListener('mousewheel', (e)=>{
            //console.log(e.wheelDeltaY);
            this.move += e.wheelDeltaY/1000;
        })

        window.addEventListener('mousedown', (e)=>{
            gsap.to(this.material.uniforms.mousePressed, {
                duration: 0.5,
                ease: "elastic.out(1, 0.3)",
                value: 1
            });
        })

        window.addEventListener('mouseup', (e)=>{
            gsap.to(this.material.uniforms.mousePressed, {
                duration: 0.5,
                value: 0
            });
        })
        
        // Mouse Intersect
        this.test = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000,2000),
            new THREE.MeshBasicMaterial()
        );
        window.addEventListener('mousemove', (e)=>{
            this.mouse.x = (e.clientX/innerWidth) - 0.5;
            this.mouse.y = (e.clientY/innerHeight) - 0.5;
            this.raycaster.setFromCamera(this.mouse, this.camera);

            var intersects = this.raycaster.intersectObjects( [this.test] )
         
            this.point.x =  intersects[0].point.x;
            this.point.y = -intersects[0].point.y;
            
        })
    }
    onWindowResize = () =>{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    
    createMesh = () => {
        //Mesh
        let number = 512;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new THREE.BufferAttribute(new Float32Array(number*number*3),3);
        this.coordinates = new THREE.BufferAttribute(new Float32Array(number*number*3),3);
        this.offset = new THREE.BufferAttribute(new Float32Array(number*number*3),1);
        this.speeds = new THREE.BufferAttribute(new Float32Array(number*number*3),1);
        this.direction = new THREE.BufferAttribute(new Float32Array(number*number*3),1);
        this.press = new THREE.BufferAttribute(new Float32Array(number*number*3),1);

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
                this.speeds.setX(index, rand(100,300));
                this.direction.setX(index, Math.random()>0.5?1:-1);
                this.press.setX(index,rand(0.4,1));
                index++;
            }    
        }

        this.geometry.setAttribute('position', this.positions);
        this.geometry.setAttribute('aCoordinates', this.coordinates);
        this.geometry.setAttribute('aSpeed', this.speeds);
        this.geometry.setAttribute('aOffset', this.offset);
        this.geometry.setAttribute('aDirection', this.direction);
        this.geometry.setAttribute('aPress', this.press);

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms:{
                progress: {type: "f", value:0},
                t1: {type: "t", value: this.textures[0]},
                t2: {type: "t", value: this.textures[1]},
                mouse: {type: "v2", value: this.mouse},
                mask: {type: "t", value: this.mask},
                time: {type: "f", value:0},
                move: {type: "f", value:0},
                mousePressed: {type: "f", value:0},
                transition: {type:"f", value:0},
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false

        });
        this.plane = new THREE.Points(this.geometry, this.material);
        //Use THREE.Group() to add an additional animation or move multiple meshes
        //this.group = new THREE.Group();
        //this.group.add(this.plane);
        //this.scene.add(this.group);
        this.scene.add(this.plane);
    }  
    
    render = () =>{
        this.time++;
        console.log(this.move)

        // Update the uniforms 
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.move.value = this.move;
        this.material.uniforms.mouse.value = this.point;

        this.renderer.render( this.scene, this.camera );
    };

    animate = () =>{
        // Change rotation based on mouse
        this.render();  
        window.requestAnimationFrame( this.animate );
    };

    makeGUI = () => {
        this.gui = new GUI();
        this.gui.add(this.material.uniforms.transition, 'value', 0, 1).onChange()
    }
}

var draw = new Sketch();