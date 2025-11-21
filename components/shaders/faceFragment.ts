const faceFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;

  varying float vBrightness;
  varying vec2 vUv;

  void main() {
    float b = vBrightness;

    // Vertikale Saeulen
    float cols = sin(vUv.x * 120.0);
    cols = step(0.0, cols);
    cols = 0.35 + cols * 0.65;

    // Horizontale Scanlines
    float rows = 0.78 + 0.22 * sin(vUv.y * 260.0 + uTime * 3.0);

    float brightness = b * cols * rows;
    float boost = 1.0 + uIntensity * 1.3;
    brightness = pow(brightness * boost, 1.05);

    // Basistint: kuehles Grau/Blau
    vec3 baseColor = vec3(0.8, 0.86, 0.95);
    vec3 color = baseColor * brightness;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default faceFragment;
