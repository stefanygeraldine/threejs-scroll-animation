import { useEffect } from "react";
import * as THREE from "three";
import type { IInitialParameters, ISize } from "./Scene.tsx";
import gsap from "gsap";

interface IProps {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: ISize;
  initialParameters: IInitialParameters;
}

interface IParameters {
  radius: number;
  tube: number;
  tubularSegments: number;
  radialSegments: number;
}

const parameters: IParameters = {
  radius: 0.8,
  tube: 0.35,
  tubularSegments: 100,
  radialSegments: 16,
};

function TorusKnot(props: IProps) {
  const { scene, initialParameters } = props;
  const { texture, objectDistance, materialColor, currentSection } =
    initialParameters;

  let mesh: THREE.Mesh;

  const generateGeometry = (): void => {
    const { radius, tube, radialSegments, tubularSegments } = parameters;
    const geometry = new THREE.ConeGeometry(
      radius,
      tube,
      tubularSegments,
      radialSegments,
    );
    const material = new THREE.MeshToonMaterial({
      color: materialColor,
      gradientMap: texture,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -objectDistance;
    mesh.scale.set(0.5, 0.5, 0.5);

    //gsap
    if (currentSection === 2) {
      gsap.to(mesh.rotation, {
        duration: 1.5,
        ease: "power2.inOut",
        x: "+=6",
        y: "+=3",
      });
    }
    scene.add(mesh);
  };

  const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
  directionalLight.position.set(1, 1, 0);
  scene.add(directionalLight);

  useEffect(() => {
    generateGeometry();
    const tick = () => {
      requestAnimationFrame(tick);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    };
    tick();
  }, []);

  return <></>;
}

export default TorusKnot;
