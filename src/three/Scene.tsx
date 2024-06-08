import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Particles from "./Particles.tsx";
import Galaxy from "./Galaxy.tsx";
import TorusKnot from "./TorusKnot.tsx";
import Tube from "./Tube.tsx";
import gradienTexture3 from "../assets/textures/gradients/3.jpg";

export interface ISize {
  width: number;
  height: number;
}

export interface IInitialParameters {
  materialColor: string;
  objectDistance: number;
  material?: THREE.MeshToonMaterial;
  texture?: THREE.Texture;
  currentSection: number;
}

const scene = new THREE.Scene();
// Canvas
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearAlpha(0);
//renderer.setClearColor("#778899");
// Base camera
document.body.appendChild(renderer.domElement);
const groupCamera = new THREE.Group();
scene.add(groupCamera);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

camera.position.z = 5;
groupCamera.add(camera);

const parameters: IInitialParameters = {
  materialColor: "#445567",
  objectDistance: 5,
  currentSection: 0,
};

parameters.material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
});

const textureLoader = new THREE.TextureLoader();
const gradienTexture = textureLoader.load(gradienTexture3);
gradienTexture.magFilter = THREE.NearestFilter;

parameters.texture = gradienTexture;

function Scene() {
  const [size, setSize] = useState<ISize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  console.log("render");
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const updateSize = useCallback(() => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);
  let scrollY: number = 0;
  const updateScrollPositions = () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / size.height);

    if (newSection != parameters.currentSection) {
      parameters.currentSection = newSection;
    }
  };

  //mouse

  const mousePosition = { x: 0, y: 0 };
  const updateMousePosition = (event: any) => {
    mousePosition.x = event.clientX / size.width - 0.5;
    mousePosition.y = event.clientY / size.height - 0.5;
  };

  useEffect(() => {
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [size.width, size.height]);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    window.addEventListener("scroll", updateScrollPositions);
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("scroll", updateScrollPositions);
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const clock = new THREE.Clock();
  let previousTime = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const normalizeTimeDevice = elapsedTime - previousTime;
    previousTime = elapsedTime;

    camera.position.y = (-scrollY / size.height) * parameters.objectDistance;

    //parallax
    const parallaxX = mousePosition.x;
    const parallaxY = -mousePosition.y;
    const smoothSpeed = 5;
    groupCamera.position.x +=
      (parallaxX - groupCamera.position.x) * smoothSpeed * normalizeTimeDevice;
    groupCamera.position.y +=
      (parallaxY - groupCamera.position.y) * smoothSpeed * normalizeTimeDevice;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    tick();
  }, []);

  return (
    <>
      <Particles
        camera={camera}
        size={size}
        scene={scene}
        renderer={renderer}
        initialParameters={parameters}
      />
      <Galaxy camera={camera} size={size} scene={scene} renderer={renderer} />
      <Tube
        initialParameters={parameters}
        camera={camera}
        size={size}
        scene={scene}
        renderer={renderer}
      />
      <TorusKnot
        initialParameters={parameters}
        camera={camera}
        size={size}
        scene={scene}
        renderer={renderer}
      />
    </>
  );
}

export default Scene;
