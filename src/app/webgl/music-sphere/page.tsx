'use client'

import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, Euler, ThreeElements } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'

function Model() {
  const gltf = useGLTF(
    '/assets/vallee_de_nevache_france/scene.gltf',
    true,
    undefined,
    (loader) => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
      )
      loader.setDRACOLoader(dracoLoader)
    }
  )

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // 기존 재질 유지하면서 속성만 수정
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])

  return <primitive object={gltf.scene} scale={0.002} position={[0, -10, 0]} />
}

// 프리로드 경로도 수정
useGLTF.preload('/assets/vallee_de_nevache_france/scene.gltf')

function Sphere(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // useFrame((state, delta) => (ref.current.rotation.x += delta))

  return (
    <group>
      {/* 기본 Sphere */}
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        // geometry={sphere}
      >
        <sphereGeometry args={[1.1, 28, 28]} />
        <meshStandardMaterial
          color={hovered ? '#ff00ff' : '#ff9933'}
          emissive={hovered ? '#ff00ff' : '#ff9933'}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow 효과를 위한 추가 Sphere */}
      <mesh {...props} scale={clicked ? 1.5 : 1.1}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial
          color={hovered ? '#ff00ff' : '#ff9933'}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

interface TorusProps {
  rotation?: Euler | [number, number, number]
  position?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
  args?: [number, number, number, number]
  glowColor?: string
}

function Torus({
  rotation = [-Math.PI / 2, 0, 0],
  position = [0, 0, 0],
  scale = 1,
  color = '#ff88cc',
  glowColor = '#ff00ff',
  args = [2, 0.02, 16, 100],
}: TorusProps) {
  const torusRef = useRef<THREE.Mesh>(null!)

  return (
    <group>
      {/* 기본 Torus */}
      <mesh
        ref={torusRef}
        rotation={rotation}
        position={position}
        scale={scale}
      >
        <torusGeometry args={args} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow 효과를 위한 추가 Torus */}
      <mesh rotation={rotation} position={position} scale={scale}>
        <torusGeometry args={[args[0], args[1] * 1.2, args[2], args[3]]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function Page() {
  console.log('process.env', process.env.NODE_ENV)
  // const fbx = useFBX('/assets/Mount_Fuji.fbx')
  // console.log(fbx)
  // const fbx = useLoader()
  const torus2 = {
    scale: 1.2,
  }

  return (
    <div className="h-screen">
      <Canvas shadows fallback={<div>Sorry no WebGL supported!</div>}>
        <color attach="background" args={['black']} />

        <PerspectiveCamera makeDefault position={[45, 45, 45]} zoom={3} />
        <OrbitControls />

        <Suspense fallback={null}>
          <Model />
        </Suspense>

        <ambientLight intensity={Math.PI / 2} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <group scale={1}>
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Sphere position={[0, 0, 0]} />
          <Torus
            scale={1}
            rotation={[0, 0, 0]}
            color="#ff3366"
            glowColor="#ff00ff"
          />

          <Torus
            scale={torus2.scale}
            rotation={[-Math.PI / 3, 0, 0]}
            color="#33ff99"
            glowColor="#00ffaa"
          />
        </group>

        {process.env.NODE_ENV === 'development' ? (
          <>
            <gridHelper args={[10, 10]} />
            <axesHelper args={[8]} />
          </>
        ) : null}
        <EffectComposer>
          <Bloom
            intensity={2.0}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
