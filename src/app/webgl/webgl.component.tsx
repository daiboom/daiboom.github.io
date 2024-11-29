'use client'

import { Box } from '@/app/webgl/object/Box'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export default function WebGl() {
  return (
    <div className="w-screen h-screen">
      <Canvas fallback={<div>Sorry no WebGL supported!</div>}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  )
}
