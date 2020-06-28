function newCube() {
    var geometry = new THREE.SphereBufferGeometry(1, 20, 20);
    var material = new THREE.MeshPhongMaterial({
      color: "purple",
      reflectivity: 1,
      shininess: 140,
    });

    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 1.7 / 2, 0);
    return cube;
  }

}