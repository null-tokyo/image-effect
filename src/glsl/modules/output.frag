varying vec2 vUv;

uniform sampler2D uTex;
uniform float uTime;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uShiftR;
uniform float uShiftB;
uniform float uShiftG;

/**
* color shift
* 
*/

vec4 colorShift(vec2 uv, float r, float g, float b) {
    vec4 cr = texture2D(uTex, vec2(uv.x + r, uv.y));
    vec4 cg = texture2D(uTex, vec2(uv.x + g, uv.y));
    vec4 cb = texture2D(uTex, vec2(uv.x + b, uv.y));
    return vec4(cr.r, cg.g, cb.b, 1.0);
}

/**
* contrust
* @param color {vec4}
* @param c {float} -1.0 ~ 1.0;
*/
vec4 contrust(vec4 color, float c) {
    if (c > 0.0) {
        color.rgb = (color.rgb - 0.5) / (1.0 - c) + 0.5;
    } else {
        color.rgb = (color.rgb - 0.5) * (1.0 + c) + 0.5;
    }
    return color;
}

/**
* saturation
* @param color {vec4}
* @param s {float} -1.0 ~ 1.0;
*/
vec4 saturation(vec4 color, float s) {
    float avarage = (color.r + color.g + color.b) / 3.0;
    if(uSaturation > 0.0) {
        color.rgb += (avarage - color.rgb) * (1.0 - 1.0 / (1.001 - uSaturation));
    } else {
        color.rgb += (avarage - color.rgb) * (-uSaturation);
    }
    return color;
}


void main () {
    vec4 color = colorShift(vUv, uShiftR, uShiftG, uShiftB);

    //brightness
    color.rgb += uBrightness;

    //contrust
    color = contrust(color, uContrast);

    //saturation
    color = saturation(color, uSaturation);

    gl_FragColor = vec4(color.rgb, 1.0);
}