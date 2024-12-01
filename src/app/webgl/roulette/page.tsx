'use client'

import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function ArcSegments() {
  const numberOfSegments = 10
  const segments = []
  const outerRadius = 2
  const innerRadius = 1.1 // 이 값을 조절하여 안쪽 호의 크기 변경
  const gap = 0.1

  for (let i = 0; i < numberOfSegments; i++) {
    const startAngle = (i * 2 * Math.PI) / numberOfSegments + gap / 2
    const endAngle = ((i + 1) * 2 * Math.PI) / numberOfSegments - gap / 2

    const shape = new THREE.Shape()
    // 외부 호
    shape.moveTo(
      Math.cos(startAngle) * innerRadius,
      Math.sin(startAngle) * innerRadius
    )
    shape.lineTo(
      Math.cos(startAngle) * outerRadius,
      Math.sin(startAngle) * outerRadius
    )
    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false)
    shape.lineTo(
      Math.cos(endAngle) * innerRadius,
      Math.sin(endAngle) * innerRadius
    )
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true)

    segments.push(
      <mesh key={i} position={[0, 0, 0]}>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.5,
              bevelEnabled: false,
            },
          ]}
        />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
    )
  }

  return <group rotation={[Math.PI / 2, 0, 0]}>{segments}</group>
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
        <ArcSegments />
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
