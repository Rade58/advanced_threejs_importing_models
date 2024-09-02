import * as THREE from "three";
// WE WILL USE THIS LOADER
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls, GLTFLoader } from "three/examples/jsm/Addons.js";
//WE CAN NOW USE GLTFLoader
//
import GUI from "lil-gui";
import gsap from "gsap";
import CANNON from "cannon";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "Tweak it",
  closeFolders: false,
});

gui.hide();
// gui parameters
const parameters = {
  floorMaterialColor: "#89898b",
  createSphere: () => {
    //
  },
  // createBox: () => {},
  //
  // reset: () => {},
};

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  const scene = new THREE.Scene();

  // ---------------------------------------------
  // ---------------------------------------------
  // MODELS
  // ---------------------------------------------
  // ---------------------------------------------
  /**
   * Models
   */
  const gltfLoader = new GLTFLoader(); // we can also use loading manger
  //                                       like we used it when loading textures for example in some previous group of lessons

  let duck: THREE.Object3D | null = null;

  gltfLoader.load(
    "/models/Duck/glTF/Duck.gltf",
    // we can try other formats also, excluding draco because it won't work yet
    // "/models/Duck/glTF-Binary/Duck.glb",  // this one will work also
    // "/models/Duck/glTF-Embedded/Duck.gltf", // this one will work also

    (gltf) => {
      console.log({ gltf });

      // model here is loaded so we can add it to our scene
      // this is group     a      THREE.Group   instance
      // scene.add(gltf.scene); // you will see that everything is added
      // but we don't need entire group

      // we can add children also, but we won't

      // group has children, and when you open the children, you will see the array of THREE.Object3D instances
      // you will see that children of mentioned instances are Mesh and PerspectiveCamera instance

      // I don't want to add perspective camera to our scene
      // it won't have any impact since it is not working camera for our scene
      // but since it is not used, we don't need it

      // But Workshop author choosen to add an object3d

      /* duck =
        gltf.scene.children[0] &&
        gltf.scene.children[0].children[0] &&
        gltf.scene.children[0].children[0] instanceof THREE.Mesh
          ? gltf.scene.children[0].children[0]
          : null; */

      duck = gltf.scene.children[0] ? gltf.scene.children[0] : null;

      // we can check position and scale, or rotation
      // it's good to check scale because it can have sucjh a small scale
      console.log({ duck });
      if (duck) {
        // I will add our duck to the scene
        // This is still bad approach becaause we added a perspective camera also

        // it is better to use Blender to clean everything from the model
        // tht isn't needed, and then, export it from blender and
        // then use it in your scene

        scene.add(duck);

        console.log("duck position");
        console.log(duck.position);
        console.log("duck scale");
        console.log(duck.scale);
        // scale is in 0.0 in this case, and I don'y need to lower it
        // like I would if I would add only mesh

        // duck.scale.setScalar(0.02);

        // sometimes it is easy like this, but it's not that easy when it comes
        // to other models
      }
    },
    (progress) => {
      console.log({ progress });
    },
    (error) => {
      console.log({ error });
    }
  );

  // ---------------------------------------------
  // ---------------------------------------------

  // ---------------------------------------------
  // ---------------------------------------------
  // SOUNDS
  // ---------------------------------------------
  // ---------------------------------------------

  const hitSound = new Audio("/sounds/hit.mp3");

  // types are problem in cannon-es, different than in cannon
  const playHitSound = (collision: CANNON.ICollisionEvent) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();

    if (impactStrength > 1.5) {
      hitSound.volume = Math.random();

      hitSound.currentTime = 0;
      hitSound.play();
    }
  };

  // ---------------------------------------------
  // ---------------------------------------------

  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  // const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
  // gradientTexture.magFilter = THREE.NearestFilter;

  const sphereMatcap = textureLoader.load("/textures/matcaps/3.png");

  // ------ PHYSICS --------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  /**
   * Physics
   */

  const world = new CANNON.World();

  //
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  //

  world.gravity.set(0, -9.82, 0);

  //
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  const objectsToUpdate: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------

  // CANNON.Material and CANNON.ContactMaterial instancs ---------------
  // ---------------------------------------------------------
  // const concreteMaterial = new CANNON.Material("concrete");
  // const plasticMaterial = new CANNON.Material("plastic");

  const defaultMaterial = new CANNON.Material("concrete_and_plastic");

  const defaultContactMaterial = new CANNON.ContactMaterial(
    // concreteMaterial,
    // plasticMaterial,
    defaultMaterial,
    defaultMaterial,
    {
      // values above 1.0 are allowed
      friction: 0.1, // higher the number it is smoother slide like oil
      restitution: 0.7, // higher the number, the bouncing will be larger
    }
  );

  // instead of this (or you can keep this)
  world.addContactMaterial(defaultContactMaterial);
  // set defaultContactMaterial instead
  world.defaultContactMaterial = defaultContactMaterial;

  // ------------------------------------------

  // ---------------------------------------

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body();
  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  world.addBody(floorBody);

  // floorBody.material = concreteMaterial;
  floorBody.material = defaultMaterial;

  //
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
  );

  // ------ LIGHTS ---------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(7, 9, -7);
  scene.add(directionalLight);

  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // -------- GEOMETRIES AND MATERIALS
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------

  // FOR SPHERES
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphereMaterial = new THREE.MeshMatcapMaterial({
    // metalness: 0.3,
    // roughness: 0.4,
    // envMap: sphereMatcap,
    matcap: sphereMatcap,
    color: "#3bb09c",
  });
  // FOR BOXES
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshMatcapMaterial({
    // metalness: 0.3,
    // roughness: 0.4,
    // envMap: sphereMatcap,
    matcap: sphereMatcap,
    color: "#dfb3c5",
  });

  // ----------------

  const floorMaterial = new THREE.MeshStandardMaterial({
    // color: "#777777",
    color: parameters.floorMaterialColor,
    metalness: 0.3,
    roughness: 0.4,
  });

  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    // works only with light
    floorMaterial
  );

  // rotate it by -90deg
  floorMesh.rotation.x = -Math.PI * 0.5;

  scene.add(floorMesh);

  // -----------------------------------------------------------------------
  // ---------- PARTICLES --------------------------------------------------
  // -----------------------------------------------------------------------
  /**
   * Particles
   */

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  //  ---------------------- SHADOWS RELATED ----------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  directionalLight.castShadow = true;
  // sphereMesh.castShadow = true;
  floorMesh.receiveShadow = true;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 24;

  directionalLight.shadow.camera.top = 8;
  directionalLight.shadow.camera.bottom = -8;
  directionalLight.shadow.camera.right = 8;
  directionalLight.shadow.camera.left = -8;

  directionalLight.shadow.radius = 10;

  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  //  GUI

  gui.addColor(parameters, "floorMaterialColor").onChange(() => {
    floorMaterial.color.set(parameters.floorMaterialColor);
  });

  /* gui.add(parameters, "createSphere").onChange(() => {
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  });

  gui.add(parameters, "createBox").onChange(() => {
    createBox(
      {
        width: Math.random(),
        height: Math.random(),
        dept: Math.random(),
      },
      {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      }
    );
  });

  gui.add(parameters, "reset").onChange(() => {
    for (const element of objectsToUpdate) {
      element.body.removeEventListener("collide", playHitSound);

      // this is not available in cannon-es
      world.remove(element.body);

      scene.remove(element.mesh);
    }
  }); */

  /**
   * just to show that we can tweak normal html with lil gui
   */
  /* const o = { showBorders: false };
  gui.add(o, "showBorders").onChange(() => {
    const els = document.querySelectorAll(".content div");
    if (o.showBorders === false) {
      if (els) {
        els.forEach((el) => {
          el.classList.remove("show_border");
        });
      }
    } else {
      if (els) {
        els.forEach((el) => {
          el.classList.add("show_border");
        });
      }
    }
  }); */

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // we don't need this, it is from previous group of lessons to show how we can move group
  // instead of camera
  // I kept this for no reason
  const cameraGroup = new THREE.Group();
  scene.add(cameraGroup);

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 8;
  camera.position.x = 4;
  camera.position.y = 4;

  cameraGroup.add(camera);
  // scene.add(camera);

  // ------ HELPERS ----------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );
  scene.add(directionalLightCameraHelper);

  axHelp.visible = false;
  directionalLightCameraHelper.visible = false;

  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------

  // orbit controls
  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  orbit_controls.enableDamping = true;
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });

  // for shadows to work
  // ------ ACTIVATE SHADOW MAP ------
  //--------------------------------------------------
  renderer.shadowMap.enabled = true;
  // shadow algos
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //--------------------------------------------------
  //--------------------------------------------------

  // handle pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // toggle debug ui on key `h`
  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  // PHYSICS AND MESH UTILS
  // --------------------------------------------------
  // --------------------------------------------------

  function createSphere(
    radius: number,
    position: { x: number; y: number; z: number }
  ) {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

    mesh.scale.set(radius, radius, radius);

    mesh.castShadow = true;
    mesh.position.copy(position);

    scene.add(mesh);
    // -----------------------------------------------------
    // CannonJS body ---------------------------------------
    const shape = new CANNON.Sphere(radius);

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: defaultMaterial,
    });

    body.addEventListener("collide", playHitSound);

    // @ts-expect-error Vec3  Vector3 , or object with x y z
    body.position.copy(position);

    body.linearDamping = 0.1;
    body.angularDamping = 0.1;

    world.addBody(body);

    objectsToUpdate.push({
      mesh,
      body,
    });
  }

  //

  function createBox(
    size: { width: number; height: number; dept: number },

    position: { x: number; y: number; z: number }
  ) {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(size.width, size.height, size.dept);

    mesh.castShadow = true;

    mesh.position.copy(position);

    scene.add(mesh);

    const shape = new CANNON.Box(
      new CANNON.Vec3(size.width / 2, size.height / 2, size.dept / 2)
    );

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: defaultMaterial,
    });

    //
    body.addEventListener("collide", playHitSound);

    // @ts-expect-error vectors
    body.position.copy(position);

    world.addBody(body);

    objectsToUpdate.push({
      mesh,
      body,
    });
  }

  // createSphere(0.5, { x: 0, y: 4, z: 0 });

  /* createSphere(0.5, { x: 1, y: 4, z: 1 });
  createSphere(0.5, { x: 2, y: 4, z: 2 });
  createSphere(0.5, { x: 3, y: 4, z: 3 });
  createSphere(0.5, { x: 4, y: 4, z: 4 });
  */
  // console.log(objectsToUpdate);

  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();

  //
  let oldElapsedTime = 0;

  const tick = () => {
    //
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    //
    oldElapsedTime = elapsedTime;
    //

    if (duck) {
      duck.rotation.y = Math.PI * elapsedTime;
    }

    // ------ UPDATE PHYSICS WORLD ------
    // ---------------------------------------------------
    // ---------------------------------------------------
    // fixed time step for 60fps
    // to understand what are we doing
    // read this:   https://gafferongames.com/post/fix_your_timestep/
    world.step(1 / 60, deltaTime, 3); // max sub steps is 3 (read the article to understand this)

    // ---------------------------------------------------
    // ----- UPDATE THREEJS WORLD, BY TAKING COORDINATES FROM PHYSICAL WORLD

    for (const element of objectsToUpdate) {
      element.mesh.position.copy(element.body.position);

      // we allow rotation by doing this
      element.mesh.quaternion.copy(element.body.quaternion);
    }

    // same for floor, even floor is static
    floorMesh.position.copy(floorBody.position);

    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  // ------------------------------------------------------
  // --------------- handle resize ------------------------
  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ------------------------------------------------------
  // ----------------- enter fulll screen with double click

  /* window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  }); */
}
