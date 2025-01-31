'use client'

import { SCALE, SOLAR_SYSTEM_DATA } from '@/app/webgl/solar-system/constants'
import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface OrbitProps {
  radius: number
  visible: boolean
  inclination: number
  ascendingNode: number
}

interface PlanetProps {
  radius: number
  distance: number
  color: string
  speed: number
  name: string
  orbitalPeriod: number
  inclination: number
  ascendingNode: number
}

interface SolarSystemProps {
  showOrbits: boolean
}

interface ControlPanelProps {
  showOrbits: boolean
  setShowOrbits: (show: boolean) => void
}

const Orbit = ({ radius, visible, inclination, ascendingNode }: OrbitProps) => {
  // 타원 궤도를 위한 포인트 생성
  const points = []
  const segments = 128 // 더 부드러운 궤도를 위해 세그먼트 수 증가

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * (radius / SCALE.DISTANCE)
    const z = Math.sin(angle) * (radius / SCALE.DISTANCE)
    points.push(new THREE.Vector3(x, 0, z))
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  // 궤도의 회전을 위한 그룹 생성
  return (
    <group rotation={[0, THREE.MathUtils.degToRad(ascendingNode), 0]}>
      <group rotation={[THREE.MathUtils.degToRad(inclination), 0, 0]}>
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
      </group>
    </group>
  )
}
const Planet = ({
  radius,
  distance,
  color,
  speed,
  name,
  orbitalPeriod,
  inclination,
  ascendingNode,
}: PlanetProps) => {
  const ref = useRef<THREE.Group>(null!)
  const startTime = useRef(Date.now() / 1000)

  useFrame(() => {
    const currentTime = Date.now() / 1000
    const elapsedTime = currentTime - startTime.current
    const velocityFactor = speed / 30

    // 경과 시간을 기반으로 각도 계산
    const t =
      (((elapsedTime * velocityFactor) % orbitalPeriod) / orbitalPeriod) *
      (2 * Math.PI)

    // 기본 위치 계산
    const baseX = Math.cos(t) * (distance / SCALE.DISTANCE)
    const baseZ = Math.sin(t) * (distance / SCALE.DISTANCE)

    // 궤도 기울기(inclination)와 승교점 경도(ascendingNode) 적용
    const inclinationRad = THREE.MathUtils.degToRad(inclination)
    const ascendingNodeRad = THREE.MathUtils.degToRad(ascendingNode)

    // 회전 행렬 생성
    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeRotationY(ascendingNodeRad)
    rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(inclinationRad))

    // 위치 벡터 생성 및 회전 적용
    const position = new THREE.Vector3(baseX, 0, baseZ)
    position.applyMatrix4(rotationMatrix)

    ref.current.position.copy(position)
  })

  return (
    <group>
      <group ref={ref}>
        <Sphere args={[radius / SCALE.SIZE, 32, 32]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.5}
            metalness={0.5}
          />
        </Sphere>
        <Html
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '4px 8px',
            borderRadius: '4px',
            color: color,
            transform: 'translate3d(-50%, -100%, 0)',
            fontSize: '18px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          occlude={false}
          center
        >
          <div className="planet-label">{name}</div>
        </Html>
      </group>
    </group>
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
          inclination={planet.inclination}
          ascendingNode={planet.ascendingNode}
        />
      ))}

      {/* 행성들 */}
      {SOLAR_SYSTEM_DATA.PLANETS.map((planet) => {
        console.log('planet ===>', planet)
        return (
          <Planet
            key={planet.name}
            radius={planet.radius}
            color={planet.color}
            distance={planet.distance}
            speed={planet.speed}
            name={planet.name}
            orbitalPeriod={planet.orbitalPeriod}
            inclination={planet.inclination}
            ascendingNode={planet.ascendingNode}
          />
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
          fov: 45, // 시야각 추가
        }}
      >
        <color attach="background" args={['black']} />
        <ambientLight intensity={0.5} /> {/* 환경광 강도 증가 */}
        <pointLight position={[0, 0, 0]} intensity={5} distance={1000000} />
        <hemisphereLight intensity={0.3} groundColor="black" color={'#fffff'} />
        <PerspectiveCamera
          makeDefault
          position={[0, 100, 400]} // 위치 조정
          fov={45} // 시야각 설정
        />
        <OrbitControls />
        <SolarSystem showOrbits={showOrbits} />
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
