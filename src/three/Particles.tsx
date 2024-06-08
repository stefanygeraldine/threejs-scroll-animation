import { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { type IInitialParameters, ISize } from "./Scene.tsx";
import Particle from "../assets/materials/blackBackground/magic_01.png";

interface IProps {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: ISize;
  initialParameters: IInitialParameters;
}

function Particles(props: IProps) {
  //const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderer, scene, camera, size, initialParameters } = props;
  const { objectDistance } = initialParameters;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  useEffect(() => {
    // Particle
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
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

    const textureLoader = new THREE.TextureLoader();
    const particuleTexture = textureLoader.load(Particle);

    const particlesMaterial = new THREE.PointsMaterial();
    particlesMaterial.size = 0.1;
    particlesMaterial.sizeAttenuation = true;
    particlesMaterial.color = new THREE.Color("#ff88cc");
    particlesMaterial.transparent = true;
    particlesMaterial.alphaMap = particuleTexture;
    particlesMaterial.depthWrite = false;
    particlesMaterial.blending = THREE.AdditiveBlending;
    particlesMaterial.vertexColors = true;

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const tick = () => {
      requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };

    tick();
  }, []);

  return <div></div>;
}

export default Particles;
