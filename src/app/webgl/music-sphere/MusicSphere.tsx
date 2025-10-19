'use client'

import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, Euler, ThreeElements, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { DRACOLoader } from 'three-stdlib'

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
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])

  return <primitive object={gltf.scene} scale={0.003} position={[0, -5, 0]} />
}

useGLTF.preload('/assets/vallee_de_nevache_france/scene.gltf')

// 눈보라 효과 컴포넌트
function SnowStorm() {
  const snowCount = 3000
  const snowRef = useRef<THREE.Points>(null!)

  const snowGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(snowCount * 3)
    const velocities = new Float32Array(snowCount * 3)
    const sizes = new Float32Array(snowCount)
    const opacities = new Float32Array(snowCount)

    for (let i = 0; i < snowCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300
      positions[i * 3 + 1] = Math.random() * 150 + 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300

      velocities[i * 3] = (Math.random() - 0.5) * 0.8
      velocities[i * 3 + 1] = -Math.random() * 0.8 - 0.2
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.8

      sizes[i] = Math.random() * 1.0 + 0.2
      opacities[i] = Math.random() * 0.8 + 0.2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))

    return geometry
  }, [snowCount])

  useFrame((state) => {
    if (!snowRef.current) return

    const positions = snowRef.current.geometry.attributes.position
      .array as Float32Array
    const velocities = snowRef.current.geometry.attributes.velocity
      .array as Float32Array

    for (let i = 0; i < snowCount; i++) {
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      const windStrength =
        Math.sin(state.clock.elapsedTime * 0.5 + i * 0.01) * 0.02
      positions[i * 3] += windStrength

      const rotation = Math.sin(state.clock.elapsedTime + i * 0.1) * 0.01
      positions[i * 3] += rotation
      positions[i * 3 + 2] += rotation * 0.5

      if (positions[i * 3 + 1] < -50) {
        positions[i * 3 + 1] = 150
        positions[i * 3] = (Math.random() - 0.5) * 300
        positions[i * 3 + 2] = (Math.random() - 0.5) * 300
      }

      if (positions[i * 3] > 150) positions[i * 3] = -150
      if (positions[i * 3] < -150) positions[i * 3] = 150
      if (positions[i * 3 + 2] > 150) positions[i * 3 + 2] = -150
      if (positions[i * 3 + 2] < -150) positions[i * 3 + 2] = 150
    }

    snowRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={snowRef} geometry={snowGeometry}>
      <pointsMaterial
        color="white"
        size={1.0}
        transparent
        opacity={0.9}
        sizeAttenuation
        alphaTest={0.1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Sphere(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  return (
    <group>
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <sphereGeometry args={[1.1, 28, 28]} />
        <meshStandardMaterial
          color={hovered ? '#ff00ff' : '#ff9933'}
          emissive={hovered ? '#ff00ff' : '#ff9933'}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

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

export default function MusicSphere() {
  const torus2 = {
    scale: 1.2,
  }

  return (
    <div className="h-screen">
      <Canvas shadows fallback={<div>Sorry no WebGL supported!</div>}>
        <color attach="background" args={['#1a1a2e']} />

        <PerspectiveCamera
          makeDefault
          position={[0, 15, 25]}
          zoom={1}
          fov={60}
        />
        <OrbitControls />

        <Suspense fallback={null}>
          <Model />
        </Suspense>

        <SnowStorm />

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
