import { useEffect } from "react";
import * as THREE from "three";
import { type IInitialParameters, ISize } from "./Scene.tsx";

interface IProps {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: ISize;
  initialParameters: IInitialParameters;
}

function Particles(props: IProps) {
  const { initialParameters, scene } = props;
  const { objectDistance, materialColor } = initialParameters;

  useEffect(() => {
    // Particle
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = objectDistance * 0.4 - Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: materialColor,
      sizeAttenuation: true,
      size: 0.03,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
  }, []);

  return <div></div>;
}

export default Particles;
