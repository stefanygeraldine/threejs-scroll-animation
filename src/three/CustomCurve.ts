// src/CustomSinCurve.ts
import * as THREE from "three";

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
  scale: number;

  constructor(scale: number = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t: number): THREE.Vector3 {
    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;
    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
  }
}

export default CustomSinCurve;
