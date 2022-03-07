varying vec2 vUv;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
uniform sampler2D t1;
uniform sampler2D t2;
uniform sampler2D mask;

void main(){
    vUv = uv;
    vCoordinates = aCoordinates.xy;

    // Set Positions
    vec4 myPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 400. * (1./ -myPosition.z);
    gl_Position = projectionMatrix * myPosition;

    
} 