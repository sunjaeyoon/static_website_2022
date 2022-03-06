varying vec2 vUv;

void main(){
    vUv = uv;

    vec4 myPosition = modelViewMatrix * vec4(position, 1.0);
    
    gl_PointSize = 50. * (1./ -myPosition.z);
    gl_Position = projectionMatrix * myPosition;
} 