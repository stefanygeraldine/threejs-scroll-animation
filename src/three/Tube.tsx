import { useEffect } from "react";
import * as THREE from "three";
import { type IInitialParameters, ISize } from "./Scene.tsx";
import CustomSinCurve from "./CustomCurve.ts";

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
  path: CustomSinCurve;
}

function TorusKnot(props: IProps) {
  const { scene, initialParameters } = props;
  const { texture, objectDistance, materialColor } = initialParameters;

  const parameters: IParameters = {
    radius: 0.8,
    tube: 0.35,
    tubularSegments: 100,
    radialSegments: 16,
    path: new CustomSinCurve(10),
  };

  let mesh: THREE.Mesh;
  const generateGeometry = (): void => {
    const { radius, tube, radialSegments, tubularSegments } = parameters;
    const geometry = new THREE.TorusKnotGeometry(
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
    mesh.position.y = -objectDistance * 2;
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);

    const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);
  };

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
