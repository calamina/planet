import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById('container');
let toggled = false;
let timeout = 0;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize);
container.addEventListener('click', onElementClick);

// Geometry
const particlesGeometry = new THREE.SphereGeometry(1.5, 64, 64)

// Material
const particlesMaterial = new THREE.PointsMaterial({ color: 0xc0addd })
particlesMaterial.size = 0.015
particlesMaterial.sizeAttenuation = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
const count = particles.geometry.attributes.position.count

// Reference
const reference = [];
for (let i = 0; i < count; i++) {
  const x = particles.geometry.attributes.position.getX(i);
  const y = particles.geometry.attributes.position.getY(i);
  const z = particles.geometry.attributes.position.getZ(i);
  reference[i] = [x, y, z];
}
console.debug(reference)

camera.position.z = 8;

function animate() {
  if (!toggled) {
    particles.rotation.y += 0.005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    return
  }
  timeout++;
  if (timeout == 400) {
    toggled = false;
    timeout = 0
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    return
  }

  for (let i = 0; i < count; i++) {
    const x = particles.geometry.attributes.position.getX(i);
    const y = particles.geometry.attributes.position.getY(i);
    const z = particles.geometry.attributes.position.getZ(i);
    let xsin = ((Math.round(Math.random()) * 2 - 1) * Math.random() / 40) + x;
    let ysin = ((Math.round(Math.random()) * 2 - 1) * Math.random() / 40) + y;
    let zsin = ((Math.round(Math.random()) * 2 - 1) * Math.random() / 40) + z;

    const xfinal = xsin < 0 ? - xsin : xsin;
    const yfinal = ysin < 0 ? - ysin : ysin;
    const zfinal = zsin < 0 ? - zsin : zsin;

    if ((xfinal - x + yfinal - y + zfinal - z) > 2) {
      xsin = reference[i][0];
      ysin = reference[i][1];
      zsin = reference[i][2];
    };

    particles.geometry.attributes.position.setX(i, xsin)
    particles.geometry.attributes.position.setY(i, ysin)
    particles.geometry.attributes.position.setZ(i, zsin)
  }

  particles.geometry.attributes.position.needsUpdate = true

  // particles.rotation.x += 0.01;
  particles.rotation.y += 0.005;
  // particles.rotation.z += 0.0005;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onElementClick() {
  toggled = !toggled
}

animate();

// import * as THREE from 'three';

// let renderer, scene, camera;

// const pointSize = 0.005;
// const width = 50;
// const length = 50;
// const rotateY = new THREE.Matrix4().makeRotationY(0.005);
// const geometry = new THREE.BufferGeometry();

// init();
// animate();

// function generatePointCloudGeometry(color, width, length) {
//   const numPoints = width * length;

//   const positions = new Float32Array(numPoints * 3);
//   const colors = new Float32Array(numPoints * 3);

//   let k = 0;

//   for (let i = 0; i < width; i++) {
//     for (let j = 0; j < length; j++) {
//       const u = i / width;
//       const v = j / length;
//       const x = u - .5;
//       // const y = 0;
//       // const y = (Math.cos(u * Math.PI * 5) + Math.sin(v * Math.PI * 5)) / 50;
//       const y = (Math.sin(u * Math.PI * 4) + Math.cos(v * Math.PI * 4)) / 20;
//       const z = v - .5;

//       positions[3 * k] = x;
//       positions[3 * k + 1] = y;
//       positions[3 * k + 2] = z;

//       const intensity = (y + 1) * 3;
//       colors[3 * k] = color.r * intensity;
//       colors[3 * k + 1] = color.g * intensity;
//       colors[3 * k + 2] = color.b * intensity;

//       k++;
//     }
//   }

//   geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//   geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//   geometry.computeBoundingBox();

//   return geometry;
// }

// function generatePointcloud(color, width, length) {
//   const geometry = generatePointCloudGeometry(color, width, length);
//   const material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true });
//   return new THREE.Points(geometry, material);
// }

// function init() {
//   const container = document.getElementById('container');

//   scene = new THREE.Scene();

//   camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
//   camera.position.set(45, 45, 45);
//   camera.lookAt(scene.position);
//   camera.updateMatrix();

//   const pcBuffer = generatePointcloud(new THREE.Color(1, 1, 1), width, length);
//   pcBuffer.scale.set(20, 20, 20);
//   pcBuffer.position.set(0, 0, 0);
//   scene.add(pcBuffer);

//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   container.appendChild(renderer.domElement);

//   window.addEventListener('resize', onWindowResize);
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function animate() {
//   const count = geometry.attributes.position.count;
//   for (let i = 0; i < count; i++) {
//     const x = geometry.attributes.position.getX(i);
//     const y = geometry.attributes.position.getY(i);
//     const z = geometry.attributes.position.getZ(i);
//     let xsin = ((Math.round(Math.random()) * 2 - 1) * Math.random() / 40) + x;
//     let ysin = ((Math.round(Math.random()) * 2 - 1) * Math.random() / 40) + y;
//     let zsin = ((Math.round(Math.random()) * 2 - 1) * Math.random() / 40) + z;

//     // const xfinal = xsin < 0 ? - xsin : xsin;
//     // const yfinal = ysin < 0 ? - ysin : ysin;
//     // const zfinal = zsin < 0 ? - zsin : zsin;
//     // if ((xfinal - x + yfinal - y + zfinal - z) > 2) {
//     //   xsin = reference[i][0];
//     //   ysin = reference[i][1];
//     //   zsin = reference[i][2];
//     // };

//     geometry.attributes.position.setX(i, xsin)
//     geometry.attributes.position.setY(i, ysin)
//     geometry.attributes.position.setZ(i, zsin)
//   }
//   requestAnimationFrame(animate);
//   render();
// }

// function render() {
//   camera.applyMatrix4(rotateY);
//   camera.updateMatrixWorld();
//   renderer.render(scene, camera);
// }