varying vec2 vertexUV;
varying vec3 vertexNormal;
void main() {
    vertexUV = uv;
    vertexNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}