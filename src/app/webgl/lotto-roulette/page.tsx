'use client'

import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'

function Roulette() {
  const [
    isSpinning,
    // setIsSpinning
  ] = useState(false)
  // const [prizeNumber, setPrizeNumber] = useState(0)

  return (
    <group>
      <mesh rotation={[0, 0, isSpinning ? Math.PI * 2 : 0]}>
        <cylinderGeometry args={[5, 5, 0.5, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  )
}

export default function Page() {
  return (
    <div className="h-screen">
      <Canvas shadows>
        <color attach="background" args={['black']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <PerspectiveCamera makeDefault position={[0, 10, 20]} />
        <OrbitControls />

        <Roulette />
      </Canvas>
    </div>
  )
}
