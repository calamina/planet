import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// THREE
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/2 / window.innerHeight, 0.1, 1000)
const container = document.getElementById("container")

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor(0x000000, 0)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth/2, window.innerHeight)
container.appendChild(renderer.domElement)

window.addEventListener("resize", onWindowResize)

// Geometry
const particlesGeometry = new THREE.SphereGeometry(2, 64, 64)

// Material
const particlesMaterial = new THREE.PointsMaterial({ color: 0xbbaadd })
// particlesMaterial.size = 0.005
// particlesMaterial.size = 0.02
particlesMaterial.size = 0.01
particlesMaterial.sizeAttenuation = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
const count = particles.geometry.attributes.position.count
particles.rotation.z = -.6
particles.rotation.x = .6

// Reference
const reference = []
for (let i = 0; i < count; i++) {
  const x = particles.geometry.attributes.position.getX(i)
  const y = particles.geometry.attributes.position.getY(i)
  const z = particles.geometry.attributes.position.getZ(i)
  reference[i] = [x, y, z]
}

const aspect = window.innerWidth/2 / window.innerHeight

camera.position.z = 6 * aspect

function animate() {
  particles.rotateOnAxis(new THREE.Vector3( 0,1,0),0.005) 
  particles.geometry.attributes.position.needsUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function onWindowResize() {
  camera.aspect = window.innerWidth/2 / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth/2, window.innerHeight)
  camera.position.z = 6 * aspect
}

animate()

// GSAP
gsap.registerPlugin(ScrollTrigger)

gsap.fromTo("#container", 
  { xPercent: 0 },
  { ease: "power4.out",
    scrollTrigger: { 
      trigger: ".intro",
      start: "top top",
      end: "+=100%",
      scrub: true 
    }, 
    xPercent: -50 
  }
)

gsap.fromTo("#container", 
  { xPercent: -50 },
  { ease: "power4.out",
    scrollTrigger: {
      trigger: ".intro2",
      start: "top top",
      end: "+=100%",
      scrub: true   
    }, 
    xPercent: 50
  })

gsap.to(particles.geometry, 
  { ease: "power4.out",
    scrollTrigger:
      { trigger: ".text",
        start: "top top",
        end: "bottom bottom",
        scrub: true   
      },
    onUpdate: function () {
      for (let i = 0; i < count; i++) {
        const pos = {
          x: particles.geometry.attributes.position.getX(i),
          y: particles.geometry.attributes.position.getY(i),
          z: particles.geometry.attributes.position.getZ(i)
        }

        pos.x += ((Math.round(Math.random()) * 2 - 1) * Math.random()) / 30
        pos.y += ((Math.round(Math.random()) * 2 - 1) * Math.random()) / 30
        pos.z += ((Math.round(Math.random()) * 2 - 1) * Math.random()) / 30

        if(i >= count * this.progress()){
          pos.x = reference[i][0]
          pos.y = reference[i][1]
          pos.z = reference[i][2]
        }
        
        particles.geometry.attributes.position.setX(i, pos.x)
        particles.geometry.attributes.position.setY(i, pos.y)
        particles.geometry.attributes.position.setZ(i, pos.z)      
      }

      this.scrollTrigger.direction === 1
        ? particles.rotateOnAxis(new THREE.Vector3( 0,1,0),0.01)
        : particles.rotateOnAxis(new THREE.Vector3( 0,1,0), particles.rotation.z/75 - 0.0005)
    }
  })

gsap.to(particles.geometry, {
  ease: "power4.out",
  scrollTrigger:
  {
    trigger: ".test",
    start: "top top",
    end: "bottom bottom",
    scrub: true   
  },
  onUpdate: function () {
    camera.position.z = this.progress() == 0 
      ? 6 * aspect
      : 6 * aspect + (- this.progress() * 4.5)
  }
})
