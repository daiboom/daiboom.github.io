'use client'

import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function DiamondCubes() {
  const numberOfDiamonds = 10
  const radius = 2
  const diamonds = []

  for (let i = 0; i < numberOfDiamonds; i++) {
    const angle = (i * 2 * Math.PI) / numberOfDiamonds
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    diamonds.push(
      <mesh
        key={i}
        position={[x, 0, z]}
        rotation={[0, -angle + Math.PI / 2, 0]}
      >
        <boxGeometry args={[1, 0.5, 1]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
    )
  }

  return <group>{diamonds}</group>
}

function Roulette() {
  const groupRef = useRef()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)

  const spinRoulette = () => {
    if (!isSpinning) {
      const targetAngle = 10 * (Math.PI * 2) // 정확히 10바퀴
      setTargetRotation(targetAngle)
      setRotationSpeed(Math.PI * 4) // 초기 회전 속도 증가
      setIsSpinning(true)
    }
  }

  useFrame((state, delta) => {
    if (isSpinning && groupRef.current) {
      const currentRotation = groupRef.current.rotation.y

      if (currentRotation < targetRotation) {
        // 감속 효과 강화
        const progress = currentRotation / targetRotation
        const deceleration = Math.max(0.95, 1 - progress) // 진행도에 따라 감속률 조정
        const newSpeed = rotationSpeed * deceleration

        groupRef.current.rotation.y += newSpeed * delta
        setRotationSpeed(newSpeed)

        if (currentRotation >= targetRotation - 0.01) {
          setIsSpinning(false)
          const finalAngle = currentRotation % (Math.PI * 2)
          const segment = Math.floor((finalAngle / (Math.PI * 2)) * 8)
          console.log('Selected segment:', segment)
        }
      }
    }
  })

  return (
    <group rotation={[Math.PI / 2, 0, 0]} onClick={spinRoulette}>
      <group ref={groupRef}>
        <mesh>
          <cylinderGeometry args={[1, 1, 0.5, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <DiamondCubes />
      </group>
    </group>
  )
}

export default function Page() {
  return (
    <div className="w-screen h-screen">
      <Canvas shadows>
        <color attach="background" args={['black']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <PerspectiveCamera makeDefault position={[0, 10, 20]} />
        <OrbitControls />

        <Roulette />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <gridHelper args={[10, 10]} />
            <axesHelper args={[8]} />
          </>
        ) : null}
        {/* <EffectComposer>
          <Bloom
            intensity={2.0}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.8}
          />
        </EffectComposer> */}
      </Canvas>
    </div>
  )
}
