const faceVertex = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform sampler2D uTexture;

  varying float vBrightness;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vUv = uv;

    float height = texture2D(uTexture, uv).r;
    float n = hash(uv * 80.0 + uTime * 0.5) * 0.08;
    float disp = (height + n) * uIntensity;

    vec3 newPosition = position + normal * disp;

    vBrightness = height;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export default faceVertex;
