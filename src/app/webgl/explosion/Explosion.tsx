'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// 빅뱅 -> 은하수 효과
function BigBangGalaxy({ particleCount }: { particleCount: number }) {
  const particlesRef = useRef<THREE.InstancedMesh>(null)
  const startTimeRef = useRef<number>(0)
  const initializedRef = useRef(false)

  const particleData = useMemo(() => {
    const data = []

    for (let i = 0; i < particleCount; i++) {
      // 초기 빅뱅 속도 (구형으로 퍼짐)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const speed = 0.3 + Math.random() * 1.2

      const initialVelocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      )

      // 은하 나선팔 각도 (3개의 주요 나선팔)
      const spiralArm = Math.floor(Math.random() * 3)
      const baseArmAngle = (spiralArm * Math.PI * 2) / 3

      // 은하 중심으로부터의 거리 (블랙홀 주변은 비워둠)
      const minRadius = 0.05 // 블랙홀 바로 밖부터 시작
      const galaxyRadius = minRadius + Math.pow(Math.random(), 0.5) * 11.95

      // 나선 각도 (거리에 비례)
      const spiralTightness = 0.8
      const spiralCenterAngle = baseArmAngle + galaxyRadius * spiralTightness

      // 나선팔로부터의 각도 오프셋 (가우시안 분포로 나선 주변에 집중)
      const gaussianRandom = () => {
        let u = 0,
          v = 0
        while (u === 0) u = Math.random()
        while (v === 0) v = Math.random()
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
      }

      // 나선 중심으로부터 퍼지는 정도 (거리에 비례)
      const spreadAmount = 0.3 + galaxyRadius * 0.05 // 외곽으로 갈수록 더 퍼짐
      const angularOffset = gaussianRandom() * spreadAmount

      // 최종 나선 각도
      const spiralAngle = spiralCenterAngle + angularOffset

      // 거리 비율 (0: 블랙홀 바로 밖, 1: 외곽)
      const distanceRatio = (galaxyRadius - minRadius) / (12 - minRadius)

      // 나선 중심으로부터의 거리 (파티클이 나선 주변에 퍼짐)
      const radialSpread =
        Math.abs(gaussianRandom()) * 0.5 * (1 + distanceRatio)

      // 최종 은하 위치
      const galaxyPosition = new THREE.Vector3(
        Math.cos(spiralAngle) * (galaxyRadius + radialSpread),
        (Math.random() - 0.5) * 0.15 * galaxyRadius, // 얇은 원반
        Math.sin(spiralAngle) * (galaxyRadius + radialSpread)
      )

      // 색상 (모두 흰색)
      const color = new THREE.Color(1, 1, 1) // 순수한 흰색

      // 나선팔 중심으로부터의 거리에 따른 밝기 감소
      const armDistanceFactor = Math.exp(-Math.abs(angularOffset) * 1.5)

      // 크기 (나선 중심에서 크고, 멀어질수록 작게)
      let size
      if (distanceRatio < 0.1) {
        // 중심 코어 - 중간 크기
        size = 0.05 - distanceRatio * 0.2
      } else if (distanceRatio < 0.4) {
        // 중간부 - 작은 크기
        size = 0.02 - (distanceRatio - 0.1) * 0.03
      } else {
        // 외곽부 - 극도로 미세한 파티클 (먼지처럼 작음)
        size = 0.01 - (distanceRatio - 0.4) * 0.015
      }

      // 나선팔에서 멀어질수록 파티클 크기 감소
      size = size * (0.4 + armDistanceFactor * 0.6)
      size = Math.max(size, 0.002) // 최소 크기 (매우 작게)

      data.push({
        initialVelocity,
        galaxyPosition,
        color,
        size,
        spiralAngle,
        distanceRatio, // 거리 비율 저장
        armDistanceFactor, // 나선팔 중심으로부터의 거리 저장
      })
    }

    return data
  }, [particleCount])

  useFrame((state) => {
    if (!particlesRef.current) return

    if (!initializedRef.current) {
      startTimeRef.current = state.clock.elapsedTime
      initializedRef.current = true
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current
    const time = state.clock.elapsedTime

    // 단계별 전환
    // 0-2초: 빅뱅 폭발
    // 2-6초: 은하로 수렴
    // 6초+: 은하 회전

    const explosionPhase = Math.min(elapsed / 2, 1) // 0-1
    const galaxyFormationPhase = Math.max(0, Math.min((elapsed - 2) / 4, 1)) // 0-1
    const rotationPhase = elapsed > 6 ? elapsed - 6 : 0

    for (let i = 0; i < particleCount; i++) {
      const data = particleData[i]
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()

      if (elapsed < 2) {
        // 빅뱅 폭발 단계
        const explosionPos = data.initialVelocity
          .clone()
          .multiplyScalar(elapsed)
        position.copy(explosionPos)
      } else {
        // 은하 형성 단계
        const explosionPos = data.initialVelocity.clone().multiplyScalar(2)

        // 은하 회전 각도
        const rotationAngle = rotationPhase * 0.3
        const currentSpiralAngle = data.spiralAngle + rotationAngle
        const radius = Math.sqrt(
          data.galaxyPosition.x * data.galaxyPosition.x +
            data.galaxyPosition.z * data.galaxyPosition.z
        )

        const rotatedGalaxyPos = new THREE.Vector3(
          Math.cos(currentSpiralAngle) * radius,
          data.galaxyPosition.y,
          Math.sin(currentSpiralAngle) * radius
        )

        // 폭발 위치에서 은하 위치로 부드럽게 전환
        position.lerpVectors(
          explosionPos,
          rotatedGalaxyPos,
          galaxyFormationPhase
        )

        // 약간의 흔들림 효과
        if (galaxyFormationPhase > 0.5) {
          position.x += Math.sin(time * 2 + i) * 0.05
          position.y += Math.cos(time * 1.5 + i) * 0.05
          position.z += Math.sin(time * 1.8 + i) * 0.05
        }
      }

      matrix.setPosition(position)

      // 크기 변화 (빅뱅은 밝게, 은하는 각 파티클의 고유 크기로)
      const explosionScale = 1 + (1 - explosionPhase) * 2.5

      // 은하 형성 단계에서 외곽부는 더욱 작게 (먼지처럼)
      const distanceScale = 1 - data.distanceRatio * 0.85
      const baseScale = data.size / 0.05 // 정규화된 크기 (더 작은 기준)

      const finalScale =
        explosionScale *
        baseScale *
        distanceScale *
        (0.2 + galaxyFormationPhase * 0.8)

      matrix.scale(new THREE.Vector3(finalScale, finalScale, finalScale))

      particlesRef.current.setMatrixAt(i, matrix)

      // 색상 설정 (은하 형성 후 외곽부와 나선팔에서 먼 곳은 더 어둡게)
      let brightnessMultiplier = 1

      if (galaxyFormationPhase > 0.8) {
        // 외곽부 감소
        brightnessMultiplier *= 1 - data.distanceRatio * 0.4
        // 나선팔에서 멀수록 감소
        brightnessMultiplier *= 0.6 + data.armDistanceFactor * 0.4
      }

      const adjustedColor = data.color
        .clone()
        .multiplyScalar(brightnessMultiplier)
      particlesRef.current.setColorAt(i, adjustedColor)
    }

    particlesRef.current.instanceMatrix.needsUpdate = true
    if (particlesRef.current.instanceColor) {
      particlesRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh
      ref={particlesRef}
      args={[undefined, undefined, particleCount]}
    >
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshStandardMaterial
        emissive={0x6699ff}
        emissiveIntensity={1.8}
        toneMapped={false}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  )
}

// 시간에 따라 블랙홀을 표시
function BlackHoleSystem() {
  const [showBlackHole, setShowBlackHole] = useState(false)

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime
    // 6초 이후(은하 형성 완료 후)에만 블랙홀 표시
    if (elapsed > 6 && !showBlackHole) {
      setShowBlackHole(true)
    } else if (elapsed <= 6 && showBlackHole) {
      setShowBlackHole(false)
    }
  })

  if (!showBlackHole) return null

  return (
    <>
      {/* 블랙홀 (중심의 작은 검은 구체) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.01, 32, 32]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0x000000}
          emissiveIntensity={0}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </>
  )
}

function Scene({ particleCount }: { particleCount: number }) {
  return (
    <>
      <color attach="background" args={['#000005']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} decay={2} />
      <OrbitControls
        enableDamping
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={5}
        maxDistance={30}
      />

      <BigBangGalaxy particleCount={particleCount} />

      {/* 은하 형성 후에만 블랙홀과 강착원반 표시 */}
      <BlackHoleSystem />

      <EffectComposer>
        <Bloom
          intensity={2.5}
          radius={1.0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// 컨트롤 패널 컴포넌트
function ControlPanel({
  particleCount,
  onParticleCountChange,
}: {
  particleCount: number
  onParticleCountChange: (count: number) => void
}) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-3">🌌 은하 설정</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-2">
            파티클 개수:{' '}
            <span className="font-bold text-cyan-400">
              {particleCount.toLocaleString()}
            </span>
          </label>
          <input
            type="range"
            min="10000"
            max="200000"
            step="10000"
            value={particleCount}
            onChange={(e) => onParticleCountChange(Number(e.target.value))}
            className="w-64 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10,000</span>
            <span>200,000</span>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-4 space-y-1">
          <p>💡 적은 개수: 빠른 성능</p>
          <p>✨ 많은 개수: 정교한 디테일</p>
        </div>
      </div>
    </div>
  )
}

export default function Explosion() {
  const [particleCount, setParticleCount] = useState(100000)

  return (
    <div className="h-screen relative">
      <ControlPanel
        particleCount={particleCount}
        onParticleCountChange={setParticleCount}
      />

      <Canvas
        camera={{ position: [0, 8, 15], fov: 75 }}
        gl={{
          toneMapping: THREE.ReinhardToneMapping,
        }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
      >
        <Scene particleCount={particleCount} />
      </Canvas>
    </div>
  )
}
