'use client'

import { OrbitControls, PerspectiveCamera, Sphere } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import * as THREE from 'three'

const SCALE = {
  SIZE: 1000,
  DISTANCE: 10000,
}

const SOLAR_SYSTEM_DATA = {
  SUN: {
    radius: 696.34,
    color: 'yellow',
  },
  PLANETS: [
    {
      name: 'Mercury',
      radius: 2.44,
      color: 'gray',
      distance: 57900,
      speed: 47.87,
    },
    {
      name: 'Venus',
      radius: 6.052,
      color: 'orange',
      distance: 108200,
      speed: 35.02,
    },
    {
      name: 'Earth',
      radius: 6.371,
      color: 'blue',
      distance: 149600,
      speed: 29.78,
    },
    {
      name: 'Mars',
      radius: 3.39,
      color: 'red',
      distance: 227900,
      speed: 24.13,
    },
    {
      name: 'Jupiter',
      radius: 69.911,
      color: 'brown',
      distance: 778500,
      speed: 13.07,
    },
    {
      name: 'Saturn',
      radius: 58.232,
      color: 'gold',
      distance: 1434000,
      speed: 9.68,
    },
    {
      name: 'Uranus',
      radius: 25.362,
      color: 'lightblue',
      distance: 2871000,
      speed: 6.8,
    },
    {
      name: 'Neptune',
      radius: 24.622,
      color: 'blue',
      distance: 4495000,
      speed: 5.43,
    },
  ],
}

interface OrbitProps {
  radius: number
  visible: boolean
}

interface PlanetProps {
  radius: number
  distance: number
  color: string
  speed: number
}

interface SolarSystemProps {
  showOrbits: boolean
}

interface ControlPanelProps {
  showOrbits: boolean
  setShowOrbits: (show: boolean) => void
}

const Orbit = ({ radius, visible }: OrbitProps) => {
  const points = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * 2 * Math.PI
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * (radius / SCALE.DISTANCE),
        0,
        Math.sin(angle) * (radius / SCALE.DISTANCE)
      )
    )
  }
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <primitive
      object={
        new THREE.Line(
          lineGeometry,
          new THREE.LineBasicMaterial({
            color: 'white',
            opacity: 0.3,
            transparent: true,
            visible: visible,
          })
        )
      }
    />
  )
}

const Planet = ({ radius, distance, color, speed }: PlanetProps) => {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (speed / 30)
    ref.current.position.x = Math.cos(t) * (distance / SCALE.DISTANCE)
    ref.current.position.z = Math.sin(t) * (distance / SCALE.DISTANCE)
  })

  return (
    <Sphere ref={ref} args={[radius / SCALE.SIZE, 32, 32]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.5}
        metalness={0.5}
      />
    </Sphere>
  )
}

const SolarSystem = ({ showOrbits }: SolarSystemProps) => {
  return (
    <>
      {/* 태양 */}
      <Sphere args={[SOLAR_SYSTEM_DATA.SUN.radius / SCALE.SIZE, 32, 32]}>
        <meshStandardMaterial
          color={SOLAR_SYSTEM_DATA.SUN.color}
          emissive={SOLAR_SYSTEM_DATA.SUN.color}
          emissiveIntensity={2}
        />
      </Sphere>

      {/* 궤도 */}
      {SOLAR_SYSTEM_DATA.PLANETS.map((planet) => (
        <Orbit
          key={`orbit-${planet.name}`}
          radius={planet.distance}
          visible={showOrbits}
        />
      ))}

      {/* 행성들 */}
      {SOLAR_SYSTEM_DATA.PLANETS.map((planet) => {
        console.log('rendering planet ===>', planet)
        return (
          <>
            <Planet
              key={planet.name}
              radius={planet.radius}
              color={planet.color}
              distance={planet.distance}
              speed={planet.speed}
            />
          </>
        )
      })}
    </>
  )
}

// 컨트롤 패널 컴포넌트
const ControlPanel = ({ showOrbits, setShowOrbits }: ControlPanelProps) => {
  return (
    <div className="absolute top-4 left-4 bg-black/50 p-4 rounded-lg text-white">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showOrbits}
          onChange={(e) => setShowOrbits(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Show Orbits</span>
      </label>
    </div>
  )
}

export default function Page() {
  const [showOrbits, setShowOrbits] = useState(true)

  return (
    <div className="h-screen relative">
      <ControlPanel showOrbits={showOrbits} setShowOrbits={setShowOrbits} />
      <Canvas
        shadows
        camera={{
          near: 0.1,
          far: 10000,
        }}
      >
        <color attach="background" args={['black']} />
        <ambientLight intensity={0.5} /> {/* 환경광 강도 증가 */}
        <pointLight position={[0, 0, 0]} intensity={5} distance={1000} />
        <hemisphereLight intensity={0.3} groundColor="black" color={'#fffff'} />
        <PerspectiveCamera makeDefault position={[0, 200, 300]} />
        <OrbitControls />
        <SolarSystem showOrbits={showOrbits} />
        {/* {process.env.NODE_ENV === 'development' ? (
          <>
            <gridHelper args={[1000, 100]} />
            <axesHelper args={[500]} />
          </>
        ) : null} */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
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
