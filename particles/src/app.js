import * as THREE from 'three';

export default class Sketch{
    constructor(){
        // Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0,1,50);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        this.time = 0;

        this.addmesh();
    }
    addmesh(){
            this.geometry = new THREE.PlaneBufferGeometry(50,50,50,50)
            this.material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                wireframe: true,
            })

            this.plane = new THREE.Mesh(this.geometry, this.material)
            this.scene.add(this.plane)
    }

    render(){
        this.time++;
        this.renderer.render( this.scene, this.camera );
    }

    animate() {
        
        console.log(this)
        this.plane.rotation.x += 1;
        this.plane.rotation.y += 1;
        this.render();  
        requestAnimationFrame( this.animate );
      };

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    
}

var draw = new Sketch();
draw.animate();