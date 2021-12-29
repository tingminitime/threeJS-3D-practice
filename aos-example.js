import * as THREE from './node_modules/three/build/three.module.js'
import Stats from './node_modules/stats.js/src/Stats.js'

// 場景新增
const scene = new THREE.Scene()
console.log(scene)

// 格子地板新增
const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
scene.add(gridHelper)

// 攝影機
const camera = new THREE.PerspectiveCamera(
  75, // fov : 垂直視野角度
  window.innerWidth / window.innerHeight, // aspect : 視錐體長寬比
  0.1, // near : 視錐體近端面
  1000 // far : 視錐體遠端面
)

const renderer = new THREE.WebGLRenderer() // WebGL 渲染器
renderer.setSize(window.innerWidth, window.innerHeight) // 網頁視窗渲染範圍
document.body.appendChild(renderer.domElement) // canvas

// 幾何 Box
const geometry = new THREE.BoxGeometry()
// 材質
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00, // 顏色
  wireframe: true, // 幾何線框
})

const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0.5, -10)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

// Linear interpolation : lerp
function lerp(x, y, a) {
  return (1 - a) * x + a * y
}

function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start)
}

function basicAspect() {
  camera.lookAt(cube.position)
  camera.position.set(0, 1, 2)
  cube.position.z = lerp(-10, 0, scalePercent(0, 40))
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
}

// 卷軸事件
let scrollPercent = 0
// basicAspect()

// 動畫
function animate() {
  requestAnimationFrame(animate)
  basicAspect()
  render()
  stats.update()
}

// 渲染
function render() {
  renderer.render(scene, camera)
}

const stats = new Stats()
document.body.appendChild(stats.dom)

animate()