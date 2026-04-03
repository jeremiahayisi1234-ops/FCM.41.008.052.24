/**
 * Smooth poolside animations: two children and a dog on independent eased paths.
 * Uses parametric curves for natural-looking loops with phase offsets.
 */
(function () {
  'use strict';

  if (typeof AFRAME === 'undefined') return;

  function easeInOutSine(t) {
    return 0.5 - 0.5 * Math.cos(Math.PI * t);
  }

  /** Child 1: wide ellipse around east side of pool */
  AFRAME.registerComponent('animate-child-one', {
    schema: {
      center: { type: 'vec3', default: { x: 6, y: 0, z: 14 } },
      radiusX: { type: 'number', default: 3.2 },
      radiusZ: { type: 'number', default: 2.4 },
      duration: { type: 'number', default: 22000 },
      baseY: { type: 'number', default: 0 }
    },
    init: function () {
      this.start = performance.now() + Math.random() * 2000;
      this.el.setAttribute('position', {
        x: this.data.center.x + this.data.radiusX,
        y: this.data.baseY,
        z: this.data.center.z
      });
    },
    tick: function (time, timeDelta) {
      var d = this.data;
      var t = ((time - this.start) % d.duration) / d.duration;
      var e = easeInOutSine(t);
      var angle = e * Math.PI * 2;
      var x = d.center.x + Math.cos(angle) * d.radiusX;
      var z = d.center.z + Math.sin(angle) * d.radiusZ;
      var bounce = Math.abs(Math.sin(angle * 4)) * 0.12;
      this.el.setAttribute('position', { x: x, y: d.baseY + bounce, z: z });
      var nextAngle = (((time - this.start + 50) % d.duration) / d.duration) * Math.PI * 2;
      var nx = d.center.x + Math.cos(nextAngle) * d.radiusX;
      var nz = d.center.z + Math.sin(nextAngle) * d.radiusZ;
      this.el.object3D.lookAt(nx, d.baseY + bounce, nz);
    }
  });

  /** Child 2: smaller inner loop with phase offset */
  AFRAME.registerComponent('animate-child-two', {
    schema: {
      center: { type: 'vec3', default: { x: 5.2, y: 0, z: 13.2 } },
      radius: { type: 'number', default: 2.1 },
      duration: { type: 'number', default: 18000 },
      baseY: { type: 'number', default: 0 },
      phase: { type: 'number', default: 1.7 }
    },
    init: function () {
      this.start = performance.now() + 800;
    },
    tick: function (time) {
      var d = this.data;
      var t = (((time - this.start) % d.duration) / d.duration + d.phase / (Math.PI * 2)) % 1;
      var e = easeInOutSine(t);
      var angle = e * Math.PI * 2;
      var x = d.center.x + Math.cos(angle + 0.5) * d.radius;
      var z = d.center.z + Math.sin(angle + 0.5) * d.radius * 0.85;
      var hop = Math.max(0, Math.sin(angle * 6)) * 0.08;
      this.el.setAttribute('position', { x: x, y: d.baseY + hop, z: z });
      var na = angle + 0.15;
      this.el.object3D.lookAt(
        d.center.x + Math.cos(na + 0.5) * d.radius,
        d.baseY + hop,
        d.center.z + Math.sin(na + 0.5) * d.radius * 0.85
      );
    }
  });

  /** Dog: Gerono lemniscate–style figure-eight on the pool deck */
  AFRAME.registerComponent('animate-dog', {
    schema: {
      center: { type: 'vec3', default: { x: 7.4, y: 0, z: 14.5 } },
      radius: { type: 'number', default: 1.5 },
      duration: { type: 'number', default: 14000 },
      baseY: { type: 'number', default: 0 }
    },
    init: function () {
      this.start = performance.now() + 400;
    },
    tick: function (time) {
      var d = this.data;
      var t = ((time - this.start) % d.duration) / d.duration;
      var u = t * Math.PI * 2;
      var a = d.radius;
      var x = d.center.x + a * Math.sin(u);
      var z = d.center.z + a * Math.sin(u) * Math.cos(u);
      this.el.setAttribute('position', { x: x, y: d.baseY, z: z });
      var u2 = u + 0.1;
      var lx = d.center.x + a * Math.sin(u2);
      var lz = d.center.z + a * Math.sin(u2) * Math.cos(u2);
      this.el.object3D.lookAt(lx, d.baseY, lz);
    }
  });
})();
