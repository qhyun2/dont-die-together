import * as THREE from "three"

const scale = 50000;
const transX = x => (x + 80.488) * scale
const transY = y => (y - 43.448) * scale
var max = 0

// create an array with repeated values of the difference in building heights
const buildingDiffs = [...[1, 0.7, 0.6, 0.6], ...(new Array<number>(20).fill(0.5))]
let buildingHeights: number[] = [0]
let height = 0

for (const diff of buildingDiffs) {
  height += diff
  buildingHeights.push(height * scale / 6000)
}
const availableHeights = buildingHeights.length - 1

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
  if (depth > availableHeights) depth = availableHeights
  depth = buildingHeights[depth]


  var geo = new THREE.ExtrudeBufferGeometry(shape, {depth: depth, bevelEnabled: false})
  var mat = new THREE.MeshLambertMaterial({color: 0x91876b});
  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x -= Math.PI / 2;
  mesh.castShadow = true
  mesh.receiveShadow = true

  scene.add(mesh)
}