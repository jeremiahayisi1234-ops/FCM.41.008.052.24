/**
 * Reliable desktop locomotion: WASD + arrow keys, movement relative to camera look direction on XZ plane.
 */
(function () {
  'use strict';

  if (typeof AFRAME === 'undefined') return;

  var up = new THREE.Vector3(0, 1, 0);
  var forward = new THREE.Vector3();
  var right = new THREE.Vector3();
  var move = new THREE.Vector3();

  AFRAME.registerComponent('walk-controls', {
    schema: {
      speed: { type: 'number', default: 5 },
      enabled: { type: 'boolean', default: true }
    },
    init: function () {
      this.keys = {};
      this._onKeyDown = this.onKeyDown.bind(this);
      this._onKeyUp = this.onKeyUp.bind(this);
      window.addEventListener('keydown', this._onKeyDown, false);
      window.addEventListener('keyup', this._onKeyUp, false);
      this.el.sceneEl.addEventListener('loaded', this.onSceneLoaded.bind(this));
      if (this.el.sceneEl.hasLoaded) this.onSceneLoaded();
    },
    onSceneLoaded: function () {
      var canvas = this.el.sceneEl.canvas;
      if (canvas) {
        canvas.setAttribute('tabindex', '0');
        canvas.style.outline = 'none';
      }
    },
    remove: function () {
      window.removeEventListener('keydown', this._onKeyDown, false);
      window.removeEventListener('keyup', this._onKeyUp, false);
    },
    onKeyDown: function (e) {
      if (e.repeat) return;
      this.keys[e.code] = true;
    },
    onKeyUp: function (e) {
      this.keys[e.code] = false;
    },
    tick: function (time, deltaTime) {
      if (!this.data.enabled) return;
      var cam = this.el.querySelector('a-camera');
      if (!cam) return;
      var k = this.keys;
      var fwd = 0;
      var side = 0;
      if (k['KeyW'] || k['ArrowUp']) fwd += 1;
      if (k['KeyS'] || k['ArrowDown']) fwd -= 1;
      if (k['KeyA'] || k['ArrowLeft']) side -= 1;
      if (k['KeyD'] || k['ArrowRight']) side += 1;
      if (fwd === 0 && side === 0) return;

      var sec = deltaTime / 1000;
      if (sec <= 0 || sec > 0.2) sec = 1 / 60;
      var step = this.data.speed * sec;

      cam.object3D.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() < 1e-8) {
        forward.set(0, 0, -1);
      } else {
        forward.normalize();
      }
      right.crossVectors(forward, up).normalize();

      move.set(0, 0, 0);
      move.addScaledVector(forward, fwd * step);
      move.addScaledVector(right, side * step);

      this.el.object3D.position.add(move);
    }
  });
})();
