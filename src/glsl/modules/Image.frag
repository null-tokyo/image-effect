varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uDenoise;
uniform float uBlur;
uniform float uZoomBlur;

@import ../util/random;

vec4 blur(vec2 uv, vec2 delta) {
    vec4 color = vec4(0.0);
    float total = 0.0;
    
    float offset = random(uv * 10.0);
    
    for (float t = -3.0; t <= 3.0; t++) {
        float percent = (t + offset - 0.5) / 5.0;
        float weight = 1.0 - abs(percent);
        vec4 sample = texture2D(uTex, uv + delta * percent);
        
        sample.rgb *= sample.a;
        
        color += sample * weight;
        total += weight;
    }
    
    color = color / total;
    color.rgb /= color.a + 0.00001;

    return color;
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

/**
* Denoise
* @param uv {vec2} UV
* @param r {vec2} resolution
* @param e {float} exponent - usually use 10 - 20
*/
vec4 denoise(vec2 uv, vec2 r, float e) {
    vec4 center = texture2D(uTex, uv);

    vec4 color = vec4(0.0);
    float total = 0.0;
    for (float x = -4.0; x <= 4.0; x += 1.0) {
        for (float y = -4.0; y <= 4.0; y += 1.0) {
            vec4 sample = texture2D(uTex, uv + vec2(x, y) / r);
            float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));
            weight = pow(weight, e);
            color += sample * weight;
            total += weight;
        }
    }
    return color / total;
}


/**
* Zoom Blur
* @param uv {vec2} UV
* @param r {vec2} resolution
* @param s {float} strangth - 0.0 ~ 1.0
*/
vec4 zoomBlur(vec2 uv, vec2 r, float s) {
    vec4 color = vec4(0.0);
    float total = 0.0;
    float offset = random(uv);
    vec2 center = r * 0.5 - uv * r;

    for(float i = 0.0; i < 30.0; i++) {
        float percent = (i + offset) / 30.0;
        float weight = 3.0 * (percent - percent * percent);
        vec4 sample = texture2D(uTex, uv + center * percent * s / r);
        color += sample * weight;
        total += weight;
    }

    color = color / total;
    return color;
}

void main () {
    vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 color = texture2D( uTex, uv );

    vec4 color1 = blur(uv, vec2(uBlur / uResolution.x, 0));
    vec4 color2 = blur(uv, vec2(0, uBlur / uResolution.y));
    color = mix(color1, color2, 0.5);

    color = zoomBlur(uv, uResolution, uZoomBlur);

    //denoise
    //color = denoise(uv, uResolution, uDenoise);

    //brightness
    color.rgb += uBrightness;

    //contrust
    color = contrust(color, uContrast);

    //saturation
    color = saturation(color, uSaturation);

    gl_FragColor = color;
}