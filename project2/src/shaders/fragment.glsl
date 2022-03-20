varying vec2 vUv;
varying vec3 vCoordinates;

void main(){
    gl_FragColor = vec4(vUv, 1., 1.);
    //gl_FragColor = vec4(vCoordinates, 1.);
}