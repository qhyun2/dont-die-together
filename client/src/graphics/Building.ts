import * as THREE from "three";

const scale = 50000;
const transX = (x) => (x + 80.488) * scale;
const transY = (y) => (y - 43.448) * scale;

// create an array with repeated values of the difference in building heights
let buildingHeights: number[] = [0];
let height = 0;
[
  ...[1, 0.7, 0.6, 0.6],
  ...new Array<number>(6).fill(0.5),
  ...new Array<number>(6).fill(0.4),
].forEach((h) => {
  height += h;
  buildingHeights.push((height * scale) / 6000);
});
const availableHeights = buildingHeights.length - 1;

function hashHeight(s) {
  for (var i = 0, h = 0; i < s.length; i++) h = +s.charCodeAt(i);
  return (h % 7) - 3;
}

export function createElement(building, scene) {
  if (building.geometry.type != "Polygon") return;

  let geometry = building.geometry.coordinates[0];
  const shape = new THREE.Shape();
  geometry = geometry.map((e) => [transX(e[0]), transY(e[1])]);

  // draw shape by going point to point
  shape.moveTo(geometry[0][0], geometry[0][1]);
  geometry.forEach((element) => {
    shape.lineTo(element[0], element[1]);
  });

  // determine height to use
  var depth = building.properties["building:levels"] || 1;
  if (depth > availableHeights) depth = availableHeights;
  depth = buildingHeights[depth] || buildingHeights.slice(-1)[0];

  // use has of building id to give random but consistent variation
  depth += hashHeight(building.id) * scale * 0.000007;

  var geo = new THREE.ExtrudeBufferGeometry(shape, {
    depth: depth,
    bevelEnabled: false,
  });
  var mat = new THREE.MeshLambertMaterial({ color: 0x91876b });
  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x -= Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}
