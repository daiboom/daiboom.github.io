import dynamic from 'next/dynamic'

const Explosion = dynamic(() => import('./Explosion'), {
  ssr: false,
  loading: () => <div>Loading 3D Scene...</div>,
})

export default function Page() {
  return (
    <div className="h-screen">
      <Explosion />
    </div>
  )
}

// 'use client'

// import { useEffect } from 'react'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/Addons.js'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// function main() {
//   const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
//   const scene = new THREE.Scene()

//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   )
//   camera.position.set(0, 0, 5)

//   const renderer = new THREE.WebGLRenderer({ canvas })
//   // renderer.setSize(window.innerWidth, window.innerHeight)
//   renderer.toneMapping = THREE.ReinhardToneMapping
//   renderer.setPixelRatio(window.devicePixelRatio)

//   const controls = new OrbitControls(camera, renderer.domElement)
//   controls.enableDamping = true

//   // 구체(Sphere) 설정
//   const sphereCount = 1000
//   const spheres: THREE.Mesh[] = []
//   const velocities: THREE.Vector3[] = []

//   for (let i = 0; i < sphereCount; i++) {
//     const geometry = new THREE.SphereGeometry(0.1, 16, 16) // 구체 크기 확대
//     const material = new THREE.MeshBasicMaterial({ color: 0x3399ff })
//     const sphere = new THREE.Mesh(geometry, material)

//     // 구체의 초기 위치와 속도 설정
//     sphere.position.set(0, 0, 0) // 모든 구체가 원점에서 시작하도록 설정
//     const velocity = new THREE.Vector3(
//       (Math.random() - 0.5) * 1, // 속도를 크게 설정하여 빠르게 퍼지도록 함
//       (Math.random() - 0.5) * 1,
//       (Math.random() - 0.5) * 1
//     )
//     velocities.push(velocity)

//     sphere.layers.enable(1) // Layer 1에서 Bloom 효과 적용
//     scene.add(sphere)
//     spheres.push(sphere)
//   }

//   // 포스트 프로세싱 설정
//   const composer = new EffectComposer(renderer)
//   composer.addPass(new RenderPass(scene, camera))

//   // Bloom 효과 설정
//   const bloomPass = new UnrealBloomPass(
//     new THREE.Vector2(window.innerWidth, window.innerHeight),
//     2.0, // Bloom 강도
//     0.5, // Bloom 반경
//     0.2 // Bloom Threshold
//   )
//   composer.addPass(bloomPass)

//   function animate() {
//     requestAnimationFrame(animate)

//     // 각 구체의 위치 업데이트
//     spheres.forEach((sphere, i) => {
//       sphere.position.add(velocities[i])
//       velocities[i].multiplyScalar(0.99) // 서서히 감속하도록 조정
//     })

//     controls.update()

//     // 카메라에서 Layer 1 (구체만)에 대해 Bloom 효과 적용
//     camera.layers.set(1)
//     composer.render()
//   }

//   animate()

//   window.addEventListener('resize', () => {
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     composer.setSize(window.innerWidth, window.innerHeight)
//   })
// }

// export default function Page() {
//   useEffect(() => {
//     document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <canvas id="canvas" style="width: 100vw; height: 100vh;"></canvas>
// `

//     main()
//   }, [])

//   return <div className="w-screen h-screen" id="app"></div>
// }
