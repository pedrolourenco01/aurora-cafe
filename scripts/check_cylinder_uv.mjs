import * as THREE from 'three';

const cupGeo = new THREE.CylinderGeometry(0.355, 0.245, 1.00, 128, 32, true);
const pos = cupGeo.attributes.position;
const uvs = cupGeo.attributes.uv;

// Find which vertex has UV.x close to 0.5 (center of texture where logo is)
let closestZ = -999;
let vertexAngle = 0;

for (let i = 0; i < uvs.count; i++) {
  const u = uvs.getX(i);
  if (Math.abs(u - 0.5) < 0.01) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const angle = Math.atan2(x, z);
    console.log(`Vertex with U=0.5: x=${x.toFixed(3)}, z=${z.toFixed(3)}, angle=${(angle * 180 / Math.PI).toFixed(1)}°`);
  }
}
