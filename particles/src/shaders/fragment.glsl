varying vec2 vCoordinates;
uniform sampler2D t1;
uniform sampler2D t2;
uniform sampler2D mask;

void main(){
    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    vec2 myUV = vec2(vCoordinates.x/512., vCoordinates.y/512.);
    vec4 image = texture2D(t2, myUV);
    
    // Set Fragment Shader
    //gl_FragColor = vec4(gl_PointCoord, 1., 1.); //Each block has its own uv
    gl_FragColor = image;
    gl_FragColor.a *= maskTexture.r;
}