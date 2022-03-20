varying vec2 vUv;
varying vec3 vCoordinates;

void main(){
    vUv = uv;

    vec4 myPosition = modelViewMatrix * vec4(position, 1.0);
    
    gl_PointSize = 400. * (1./ -myPosition.z);
    gl_Position = projectionMatrix * myPosition;

    vCoordinates = myPosition.xyz;
} 