// "varying" connects vertex shader to fragment shader
//varying vec2 vUv;
varying vec3 vPos;
varying vec2 vCoordinates;

// attributes are passed in by threejs 
// (set in geometry)
attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;
attribute float aDirection;
attribute float aPress;

// Uniform are passed in by threejs and change manually in three
// (set in material)
uniform sampler2D t1;
uniform sampler2D t2;
uniform sampler2D mask;

uniform float move;
uniform float time;
uniform vec2 mouse;
uniform float mousePressed;
uniform float transition;

void main(){
    //vUv = uv;
    vec3 pos = position;
    
    // Unstable
    pos.x += 3. * sin(move*aSpeed);
    pos.y += 3. * cos(move*aSpeed* 2.);
    pos.z = mod(pos.z + move * 1. * aSpeed + aOffset, 1000.) - 500.;
    
    vec3 stable = position;
    float dist = distance(stable.xy, mouse);
    float area = 1. - smoothstep(0.,200.,dist);

    stable.x += 50. * sin(0.1*time*aPress) * aDirection * area * mousePressed;
    stable.y += 50. * sin(0.1*time*aPress) * aDirection * area * mousePressed;
    stable.z += 100.* sin(0.1*time*aPress) * aDirection * area * mousePressed;

    pos = mix(stable, pos, transition);

    // Set Positions
    vec4 myPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2000. * (1./ - myPosition.z);
    gl_Position = projectionMatrix * myPosition;

    // To Fragment  
    vCoordinates = aCoordinates.xy;
    vPos = pos;
} 