varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uBlur;

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

vec4 contrust(vec4 color, float c) {
    if (c > 0.0) {
        color.rgb = (color.rgb - 0.5) / (1.0 - c) + 0.5;
    } else {
        color.rgb = (color.rgb - 0.5) * (1.0 + c) + 0.5;
    }
    return color;
}

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
    // vec2 ratio = vec2(
    //     min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    //     min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    // );

    // vec2 uv = vec2(
    //     vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    //     vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    // );

    vec4 color = texture2D( uTex, vUv );

    vec4 color1 = blur(vUv, vec2(uBlur / uResolution.x, 0));
    vec4 color2 = blur(vUv, vec2(0, uBlur / uResolution.y));
    color = mix(color1, color2, 0.5);

    //brightness
    color.rgb += uBrightness;

    //contrust
    color = contrust(color, uContrast);

    //saturation
    color = saturation(color, uSaturation);

    gl_FragColor = color;
}