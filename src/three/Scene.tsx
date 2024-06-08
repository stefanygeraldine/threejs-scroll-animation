import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
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
}

const scene = new THREE.Scene();
// Canvas
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearAlpha(0);
//renderer.setClearColor("#778899");
// Base camera

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
  objectDistance: 4,
};

parameters.material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
});

const textureLoader = new THREE.TextureLoader();
const gradienTexture = textureLoader.load(gradienTexture3);
gradienTexture.magFilter = THREE.NearestFilter;

parameters.texture = gradienTexture;

function Scene() {
  document.body.appendChild(renderer.domElement);
  const [size, setSize] = useState<ISize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
    console.log(scrollY);
  };

  //mouse

  const mousePosition = { x: 0, y: 0 };
  const updateMousePosition = (event) => {
    mousePosition.x = event.clientX / size.width - 0.5;
    mousePosition.y = event.clientY / size.height - 0.5;
    console.log(mousePosition);
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
    const deltaTime = elapsedTime - previousTime;
    previousTime = deltaTime;

    requestAnimationFrame(tick);
    camera.position.y = (-scrollY / size.height) * parameters.objectDistance;

    //parallax
    groupCamera.position.x +=
      (mousePosition.x - groupCamera.position.x) * 0.2 * deltaTime;
    groupCamera.position.y +=
      -mousePosition.y - groupCamera.position.y * 0.2 * deltaTime;

    renderer.render(scene, camera);
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
