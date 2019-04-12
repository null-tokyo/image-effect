varying vec2 vUv;

uniform sampler2D uTex;
uniform float uTime;

void main () {
    vec4 color = texture2D(uTex, vUv);
    gl_FragColor = vec4(color.rgb, 1.0);
}