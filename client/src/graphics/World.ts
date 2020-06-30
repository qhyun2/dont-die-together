import * as THREE from "three";
import { Player } from "./Player";

export class World {
  players: { [sessionId: string]: Player } = {};
  scene = new THREE.Scene();
  private axesHelper = new THREE.AxesHelper(10);
  private ground_tex = new THREE.TextureLoader().load(
    require("../../res/dirt.png").default
  );
  private ground_geo = new THREE.PlaneBufferGeometry(1000, 1000);
  private ground: THREE.Mesh;
  private spotLight = new THREE.SpotLight();

  constructor() {
    this.scene.add(this.axesHelper);

    // ground
    this.ground_tex.repeat.set(1000, 1000);
    this.ground_tex.wrapS = THREE.RepeatWrapping;
    this.ground_tex.wrapT = THREE.RepeatWrapping;
    const ground_mat = new THREE.MeshPhongMaterial({
      map: this.ground_tex,
      dithering: true,
    });
    this.ground = new THREE.Mesh(this.ground_geo, ground_mat);
    this.ground.rotation.x = -Math.PI / 2;
    this.scene.add(this.ground);

    // ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);

    // spotlight
    this.spotLight.position.set(2, 10, 2);
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.2;
    this.spotLight.decay = 4;
    this.spotLight.distance = 100;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 10;
    this.spotLight.shadow.camera.far = 200;
    this.scene.add(this.spotLight);

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
