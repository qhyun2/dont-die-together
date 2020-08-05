import * as THREE from "three"

var transX = x => (x + 80.488) * 3000
var transY = y => (y - 43.448) * 3000

export function createElement(building, scene) {

  if (building.geometry.type != "Polygon") return

  let geometry = building.geometry.coordinates[0]
  const shape = new THREE.Shape()

  geometry = geometry.map(e => [transX(e[0]), transY(e[1])])

  shape.moveTo(geometry[0][0], geometry[0][1])
  geometry.forEach(element => {
    shape.lineTo(element[0], element[1])
  });

  var depth = building.properties['building:levels']
  depth = (depth === undefined) ? 1 : depth;
  // depth *= 7;
  depth /= 3;

  var geo = new THREE.ExtrudeBufferGeometry(shape, {depth: depth, bevelEnabled: false})
  var mat = new THREE.MeshLambertMaterial({color: 0x91876b});
  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x -= Math.PI / 2;
  mesh.castShadow = true
  mesh.receiveShadow = true

  scene.add(mesh)
}