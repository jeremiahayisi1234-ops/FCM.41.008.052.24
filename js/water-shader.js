/**
 * Custom A-Frame shader for animated pool water — UV distortion, Fresnel tint, and vertex ripples.
 * Uses entity-component tick to advance time uniform for continuous motion.
 */
(function () {
  'use strict';

  if (typeof AFRAME === 'undefined') return;

  AFRAME.registerShader('pool-water', {
    schema: {
      time: { type: 'number', is: 'uniform', default: 0 },
      baseColor: { type: 'color', is: 'uniform', default: '#1a6b8a' },
      deepColor: { type: 'color', is: 'uniform', default: '#0d3d52' }
    },
    vertexShader: [
      'uniform float time;',
      'varying vec2 vUv;',
      'varying vec3 vPos;',
      'void main() {',
      '  vUv = uv;',
      '  vec3 pos = position;',
      '  float w1 = sin(pos.x * 3.2 + time * 1.4) * cos(pos.y * 2.8 + time * 1.1);',
      '  float w2 = cos(pos.x * 5.1 - time * 0.9) * sin(pos.y * 4.3 + time * 1.2);',
      '  pos.z += (w1 * 0.07 + w2 * 0.05);',
      '  vPos = pos;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform float time;',
      'uniform vec3 baseColor;',
      'uniform vec3 deepColor;',
      'varying vec2 vUv;',
      'varying vec3 vPos;',
      'void main() {',
      '  vec2 uv = vUv;',
      '  float d1 = sin(uv.x * 28.0 + time * 2.0) * 0.5 + 0.5;',
      '  float d2 = cos(uv.y * 32.0 - time * 1.7) * 0.5 + 0.5;',
      '  float d3 = sin((uv.x + uv.y) * 18.0 + time * 1.1);',
      '  float mixAmt = (d1 + d2 + d3) / 3.0;',
      '  vec3 col = mix(deepColor, baseColor, mixAmt * 0.65 + 0.2);',
      '  float spec = pow(max(0.0, sin(uv.x * 40.0 + time) * cos(uv.y * 38.0 - time)), 8.0) * 0.35;',
      '  col += vec3(spec * 0.9);',
      '  float alpha = 0.88 + mixAmt * 0.08;',
      '  gl_FragColor = vec4(col, alpha);',
      '}'
    ].join('\n')
  });

  AFRAME.registerComponent('pool-water-animate', {
    schema: {
      speed: { type: 'number', default: 1 }
    },
    init: function () {
      this.el.addEventListener('loaded', this.onLoaded.bind(this));
      this.onLoaded();
    },
    onLoaded: function () {
      var mesh = this.el.getObject3D('mesh');
      if (!mesh) return;
      var mat = mesh.material;
      this.material = Array.isArray(mat) ? mat[0] : mat;
    },
    tick: function (timeMs) {
      if (!this.material) this.onLoaded();
      if (!this.material || !this.material.uniforms || !this.material.uniforms.time) return;
      this.material.uniforms.time.value = timeMs * 0.001 * this.data.speed;
    }
  });
})();
