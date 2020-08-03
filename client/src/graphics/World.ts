import * as THREE from "three";
import { Player } from "./Player";

export class World {
  players: { [sessionId: string]: Player } = {};
  scene = new THREE.Scene();
  private ground: THREE.Mesh;
  private dirLight: THREE.DirectionalLight;

  constructor() {
    this.scene.add(new THREE.AxesHelper(10));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // sun
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.color.setHSL(0.1, 1, 0.95);
    this.dirLight.position.set(-500, 40, -30);
    this.dirLight.castShadow = true;

    var d = 250;
    this.dirLight.shadow.mapSize.width = 4096;
    this.dirLight.shadow.mapSize.height = 4096;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.camera.far = 3000;
    this.scene.add(this.dirLight);
    this.scene.add(new THREE.DirectionalLightHelper(this.dirLight, 20));

    // ground
    const ground_tex = new THREE.TextureLoader().load(
      require("../../res/dirt.png").default
    );
    ground_tex.repeat.set(1000, 1000);
    ground_tex.wrapS = THREE.RepeatWrapping;
    ground_tex.wrapT = THREE.RepeatWrapping;
    const ground_mat = new THREE.MeshPhongMaterial({
      map: ground_tex,
      dithering: true,
    });
    const ground_geo = new THREE.PlaneBufferGeometry(1000, 1000);
    this.ground = new THREE.Mesh(ground_geo, ground_mat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // skybox
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      require("../../res/skybox/pos-x.png").default,
      require("../../res/skybox/neg-x.png").default,
      require("../../res/skybox/pos-y.png").default,
      require("../../res/skybox/neg-y.png").default,
      require("../../res/skybox/pos-z.png").default,
      require("../../res/skybox/neg-z.png").default,
    ]);
    this.scene.background = texture;
  }

  update() {
    // update every player
    for (const [_, value] of Object.entries(this.players)) {
      value.update();
    }
  }
}
