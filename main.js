import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// THREE
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = 5

const container = document.getElementById("container")

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor(0x000000, 0)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

window.addEventListener("resize", onWindowResize)

document.querySelector('.green').addEventListener("click", setColor('#6dea91'))
document.querySelector('.pink').addEventListener("click", setColor('#ea6d99'))
document.querySelector('.gold').addEventListener("click", setColor('#eac76d'))

// Geometry
const particlesGeometry = new THREE.SphereGeometry(2, 64, 64)

// Material
// const particlesMaterial = new THREE.PointsMaterial({ color: 0xbbaadd })
const particlesMaterial = new THREE.PointsMaterial({ color: 0xea6d99 })
particlesMaterial.size = 0.002
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

function animate() {
  particles.rotateOnAxis(new THREE.Vector3( 0,1,0),0.005) 
  particles.geometry.attributes.position.needsUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.position.z = 5
}

function setColor(color) {
  var r = document.querySelector(':root');
  return function () {
    particlesMaterial.color.set(color)
    r.style.setProperty('--color-main', color);
  }
}

animate()

// GSAP
gsap.registerPlugin(ScrollTrigger)

const load = gsap.timeline()
load.to(".loading", {
  delay: 3,
  duration: .75,
  transform: "translateY(100%)", 
  onComplete: function () {
    document.body.classList.remove('noscroll')
  },
})
load.to(".loading", {
  duration: 0,
  display: "none", 
})

gsap.to(".title",
{ ease: "power4.out",
  scrollTrigger: { 
    trigger: ".intro",
    start: "top top",
    end: "+=30%",
    scrub: true,
  }, 
  y: '-100%',
  // opacity: 0,
  // transform: "scaleY(-1)",
  // filter: "blur(10px)",
})

gsap.fromTo('#container', 
  { x: 0 },
  { ease: "power4.out",
    scrollTrigger: { 
      trigger: ".intro",
      start: "top top",
      end: "+=100%",
      scrub: true 
    }, 
    transform: "rotate(360deg)",
    x: '-25%'
  }
)

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
      ? 5
      : 5 + (- this.progress() * 4.5)
  }
})
