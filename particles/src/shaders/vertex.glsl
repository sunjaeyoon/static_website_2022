//varying vec2 vUv;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;

uniform sampler2D t1;
uniform sampler2D t2;
uniform sampler2D mask;

uniform float move;
uniform float time;

void main(){
    //vUv = uv;
    
    // Move
    vec3 pos = position;
    pos.x = position.x + 5. * sin(move*aOffset*0.1);
    pos.y = position.y + 5. * cos(move*aOffset*0.1);
    pos.z = position.z + move * 1. * aSpeed + move * aOffset;
    

    // Set Positions
    vec4 myPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 500. * (1./ -myPosition.z);
    gl_Position = projectionMatrix * myPosition;

    // To Fragment  
    vCoordinates = aCoordinates.xy;
} 