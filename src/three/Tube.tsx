import { useEffect } from "react";
import * as THREE from "three";
import { type IInitialParameters, ISize } from "./Scene.tsx";
import * as dat from "dat.gui";
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
  const { renderer, scene, camera, size, initialParameters } = props;
  const { texture, objectDistance, materialColor } = initialParameters;

  const parameters: IParameters = {
    radius: 0.8,
    tube: 0.35,
    tubularSegments: 100,
    radialSegments: 16,
    path: new CustomSinCurve(10),
  };
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);
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

  //Tweak
  const gui = new dat.GUI();
  const addTweaks = (
    name: keyof IParameters,
    min: number,
    max: number,
    step: number,
  ): void => {
    gui.add(parameters, name, min, max, step).onFinishChange(generateGeometry);
  };

  useEffect(() => {
    camera.position.z = 5;
    //(0.8, 0.35, 100, 16)
    generateGeometry();
    addTweaks("tube", 0.1, 1, 0.0001);
    addTweaks("radius", 0.1, 5, 0.001);
    addTweaks("tubularSegments", 1, 100, 1);
    addTweaks("radialSegments", 1, 100, 1);

    const tick = () => {
      requestAnimationFrame(tick);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    tick();
  }, []);

  return <div></div>;
}

export default TorusKnot;