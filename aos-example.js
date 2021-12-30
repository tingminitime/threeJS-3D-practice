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
// cube 定位，three js 右手坐標系，x、z為平面，y為高度
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
// ratio 是介於 0 ~ 1 的數值，這邊用 scalePercent 這個 function 算出
function lerp(min, max, ratio) {
  return (1 - ratio) * min + ratio * max
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start)
}

// ------ 卷軸動畫腳本 ------
const animationScripts = []

function pushScript(start, end, func) {
  animationScripts.push({
    start,
    end,
    func,
  })
}

// 顏色變化腳本
pushScript(
  0,
  101,
  () => {
    let g = material.color.g // 顏色中綠色部分
    g -= 0.05
    if (g <= 0) {
      g = 1.0
    }
    material.color.g = g
  },
)

// 卷軸 0% ~ 40% 移動 cube
pushScript(
  0,
  40,
  () => {
    camera.lookAt(cube.position)
    camera.position.set(0, 1, 2)
    // z 從 -10 到 0
    cube.position.z = lerp(-10, 0, scalePercent(0, 40))
    // console.log(cube.position.z)
  }
)

// 卷軸 40% ~ 60% 旋轉 cube
pushScript(
  40,
  60,
  () => {
    camera.lookAt(cube.position)
    camera.position.set(0, 1, 2)
    cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60))
    // console.log(cube.rotation.z)
  }
)

// 卷軸 60% ~ 80% 移動相機
pushScript(
  60,
  80,
  () => {
    camera.position.x = lerp(0, 5, scalePercent(60, 80))
    camera.position.y = lerp(1, 5, scalePercent(60, 80))
    camera.lookAt(cube.position)
    // console.log(`CameraX:${camera.position.x}, CameraY:${camera.position.y}`)
  }
)

// 卷軸 80% ~ 100% 持續旋轉 cube
pushScript(
  80,
  100,
  () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }
)

// 卷軸動畫腳本依條件執行
function playScrollAnimations() {
  animationScripts.forEach(script => {
    if (scrollPercent >= script.start && scrollPercent <= script.end) {
      script.func()
    }
  })
}

// 卷軸事件監聽
// document.body.onscroll = () => {
//   scrollPercent =
//     ((document.documentElement.scrollTop || document.body.scrollTop) /
//       ((document.documentElement.scrollHeight || document.body.scrollHeight) -
//         document.documentElement.clientHeight)) * 100

//   document.querySelector('#scrollProgress').textContent = `
//     Scroll Progress : ${scrollPercent.toFixed(2)}
//   `
// }

// window.addEventListener('scroll', _.throttle(scrollHandler, 20), false)
window.addEventListener('scroll', scrollHandler, false)

function scrollHandler(e) {
  scrollPercent =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) -
        document.documentElement.clientHeight)) * 100

  document.querySelector('#scrollProgress').textContent = `
    Scroll Progress : ${scrollPercent.toFixed(2)}
  `
  // console.log(e)
}

// function basicAspect() {
//   camera.lookAt(cube.position)
//   camera.position.set(0, 1, 2)
//   // cube.position.z = lerp(-10, 0, scalePercent(0, 40))
//   cube.rotation.x += 0.01
//   cube.rotation.y += 0.01
// }

// 卷軸事件
let scrollPercent = 0
// basicAspect()

// 動畫
function animate() {
  requestAnimationFrame(animate)
  // basicAspect()
  playScrollAnimations()
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