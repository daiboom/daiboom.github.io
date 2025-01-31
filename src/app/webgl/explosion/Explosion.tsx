'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Spheres() {
  const sphereCount = 1000
  const spheresRef = useRef<THREE.InstancedMesh>(null)

  const velocities = useMemo(() => {
    return Array.from(
      { length: sphereCount },
      () =>
        new THREE.Vector3(
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1
        )
    )
  }, [])

  useFrame(() => {
    if (!spheresRef.current) return

    for (let i = 0; i < sphereCount; i++) {
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()

      spheresRef.current.getMatrixAt(i, matrix)
      position.setFromMatrixPosition(matrix)
      position.add(velocities[i])
      velocities[i].multiplyScalar(0.99)

      matrix.setPosition(position)
      spheresRef.current.setMatrixAt(i, matrix)
    }

    spheresRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={spheresRef} args={[undefined, undefined, sphereCount]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={0x3399ff}
        emissive={0x3399ff}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls enableDamping />
      <Spheres />
      <EffectComposer>
        <Bloom
          intensity={2.0}
          radius={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.025}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

export default function Explosion() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{
        toneMapping: THREE.ReinhardToneMapping,
        pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      }}
    >
      <Scene />
    </Canvas>
  )
}
