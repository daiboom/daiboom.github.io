'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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
      // 은하 나선팔 각도 (3개의 주요 나선팔)
      const spiralArm = Math.floor(Math.random() * 3)
      const baseArmAngle = (spiralArm * Math.PI * 2) / 3

      // 은하 중심으로부터의 거리 (블랙홀부터 바로 시작)
      // 중심부에 파티클 밀도 집중 (지수 1.5 사용)
      const minRadius = -0.2 // 블랙홀부터 시작
      const maxRadius = 12
      const galaxyRadius =
        minRadius + Math.pow(Math.random(), 1) * (maxRadius - minRadius)

      // 거리 비율 (0: 블랙홀 바로 밖, 1: 외곽)
      const distanceRatio = (galaxyRadius - minRadius) / (maxRadius - minRadius)

      // 빅뱅 속도 = 은하 거리에 비례!
      // 은하 중심에 있을 파티클 → 빅뱅 때 느리게
      // 은하 외곽에 있을 파티클 → 빅뱅 때 빠르게
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const speed = 0.3 + distanceRatio * 1.2 // distanceRatio에 비례 (0.3 ~ 1.5)

      const initialVelocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      )

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

      // 나선 중심으로부터의 거리 (파티클이 나선 주변에 퍼짐)
      const radialSpread =
        Math.abs(gaussianRandom()) * 0.5 * (1 + distanceRatio)

      // 원반 두께 계산 (중심부 두껍고 외곽 얇게)
      // distanceRatio가 작을수록(중심) 두껍고, 클수록(외곽) 얇음
      const diskThickness = 0.3 * (1 - distanceRatio * 0.85) // 중심 0.3 → 외곽 0.045

      // 최종 은하 위치
      const galaxyPosition = new THREE.Vector3(
        Math.cos(spiralAngle) * (galaxyRadius + radialSpread),
        (Math.random() - 0.5) * diskThickness * galaxyRadius, // 거리에 따라 두께 변화
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
    // 0-3초: 빅뱅 폭발
    // 3-15초: 은하로 천천히 수렴 + 회전 시작 (각운동량!)
    // 15초+: 완성된 은하 회전

    const explosionPhase = Math.min(elapsed / 3, 1) // 0-1 (3초)
    const galaxyFormationPhase = Math.max(0, Math.min((elapsed - 3) / 12, 1)) // 0-1 (12초)

    for (let i = 0; i < particleCount; i++) {
      const data = particleData[i]
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()

      if (elapsed < 3) {
        // 빅뱅 폭발 단계
        const explosionPos = data.initialVelocity
          .clone()
          .multiplyScalar(elapsed)
        position.copy(explosionPos)
      } else {
        // 은하 형성 단계 - 회전하면서 수렴!
        const explosionPos = data.initialVelocity.clone().multiplyScalar(3)

        // 은하 형성 시작부터 회전 (각운동량 보존)
        // 천천히, 부드럽게 회전 증가
        const timeSinceFormation = elapsed - 3
        // galaxyFormationPhase² 사용으로 초반에는 매우 느리게, 후반에 점진적으로 증가
        const rotationSpeed = 0.05 * Math.pow(galaxyFormationPhase, 2)
        const rotationAngle = timeSinceFormation * rotationSpeed
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

      // 색상 설정 - 온도 기반 색상
      let finalColor: THREE.Color

      if (elapsed < 3) {
        // 빅뱅 단계 (0-3초): 극초고온 색상
        // 중심부에서 외곽으로 온도 그라데이션
        const explosionTemp = 1 - data.distanceRatio * 0.7

        if (explosionTemp > 0.8) {
          // 극초고온 (>10^10 K): 청백색-흰색
          const hue = 0.55 + (1 - explosionTemp) * 0.1 // 0.55-0.65 (청록-파랑)
          const saturation = 0.3 + explosionTemp * 0.3 // 0.3-0.6
          const lightness = 0.9 + explosionTemp * 0.1 // 0.9-1.0 (매우 밝음)
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
        } else if (explosionTemp > 0.6) {
          // 초고온 (10^9-10^10 K): 흰색
          finalColor = new THREE.Color(1, 1, 1)
        } else if (explosionTemp > 0.4) {
          // 고온 (10^8-10^9 K): 청백색
          const hue = 0.6
          const saturation = 0.2
          const lightness = 0.95
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
        } else {
          // 온도 감소: 흰색으로 전환
          finalColor = new THREE.Color(explosionTemp * 2, explosionTemp * 2, 1)
        }
      } else if (galaxyFormationPhase < 0.8) {
        // 은하 형성 중 (3-12초): 온도 하강
        // 뜨거운 흰색에서 일반 흰색으로
        const coolingPhase = galaxyFormationPhase
        const temp = 1 - data.distanceRatio * 0.3

        const hue = 0.6 * (1 - coolingPhase) // 파란색 → 흰색
        const saturation = 0.1 * (1 - coolingPhase)
        const lightness = 0.9 + temp * 0.1
        finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
      } else {
        // 은하 형성 완료 후 (12초+): 온도별 색상
        if (data.distanceRatio < 0.15) {
          // 중심부 (0-15%): 블랙홀 강착원반 - 극고온
          // 온도: 10^7-10^8 K → 흰색-청백색-파랑
          const centerPhase = data.distanceRatio / 0.15
          const hue = 0.55 + centerPhase * 0.05 // 0.55-0.60 (청록-파랑)
          const saturation = 0.7 - centerPhase * 0.2 // 0.7-0.5
          const lightness = 0.7 + centerPhase * 0.2 // 0.7-0.9
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
        } else if (data.distanceRatio < 0.3) {
          // 내부 (15-30%): 고온 영역 - 흰색
          // 온도: 10^6-10^7 K → 청백색-흰색
          const transitionPhase = (data.distanceRatio - 0.15) / 0.15
          const hotColor = new THREE.Color().setHSL(0.6, 0.5, 0.9)
          const whiteColor = new THREE.Color(1, 1, 1)
          finalColor = hotColor.clone().lerp(whiteColor, transitionPhase)
        } else if (data.distanceRatio < 0.6) {
          // 중간부 (30-60%): 온화 영역 - 노랑-주황
          // 온도: 10^5-10^6 K → 흰색-노랑
          const midPhase = (data.distanceRatio - 0.3) / 0.3
          const hue = 0.15 * midPhase // 0-0.15 (빨강-주황-노랑)
          const saturation = 0.3 + midPhase * 0.3 // 0.3-0.6
          const lightness = 0.9 - midPhase * 0.2 // 0.9-0.7
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
        } else {
          // 외곽부 (60%+): 저온 영역 - 빨강-어두운 빨강
          // 온도: 10^3-10^5 K → 노랑-주황-빨강
          const outerPhase = (data.distanceRatio - 0.6) / 0.4
          const hue = 0.05 - outerPhase * 0.02 // 0.05-0.03 (주황-빨강)
          const saturation = 0.6 + outerPhase * 0.2 // 0.6-0.8
          const lightness = 0.5 - outerPhase * 0.3 // 0.5-0.2 (어두워짐)
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
        }

        // 나선팔에서 멀수록 추가 감소
        const armFactor = 0.6 + data.armDistanceFactor * 0.4
        finalColor.multiplyScalar(armFactor)
      }

      particlesRef.current.setColorAt(i, finalColor)
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
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        vertexColors
        color={0xffffff}
        emissive={0xffffff}
        emissiveIntensity={2.5}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

// 동적 카메라 거리 제어
function DynamicCamera() {
  const { camera } = useThree()
  const userControlledRef = useRef(false)

  useFrame((state) => {
    // 사용자가 제어 중이면 자동 제어 중지
    if (userControlledRef.current) return

    const elapsed = state.clock.elapsedTime

    let targetDistance = 7 // 기본값 (빅뱅 시작)

    if (elapsed < 3) {
      // 빅뱅 단계 (0-3초): 거리 7로 고정
      targetDistance = 7
    } else if (elapsed < 15) {
      // 은하 형성 단계 (3-15초): 7에서 20으로 부드럽게 줌아웃
      const transitionPhase = (elapsed - 3) / 12 // 0 ~ 1
      targetDistance = 7 + transitionPhase * 13 // 7 → 20
    } else {
      // 은하 완성 후 (15초+): 거리 20으로 고정, 사용자 제어 허용
      targetDistance = 20
      userControlledRef.current = true
    }

    // 현재 카메라 거리 계산
    const currentDistance = camera.position.length()

    // 부드러운 전환 (lerp)
    if (!userControlledRef.current) {
      const newDistance =
        currentDistance + (targetDistance - currentDistance) * 0.05
      const direction = camera.position.clone().normalize()
      camera.position.copy(direction.multiplyScalar(newDistance))
    }
  })

  return null
}

// 시간에 따라 블랙홀을 표시
function BlackHoleSystem() {
  const [showBlackHole, setShowBlackHole] = useState(false)

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime
    // 15초 이후(은하 형성 완료 후)에만 블랙홀 표시
    if (elapsed > 15 && !showBlackHole) {
      setShowBlackHole(true)
    } else if (elapsed <= 15 && showBlackHole) {
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

      {/* 동적 카메라 거리 제어 */}
      <DynamicCamera />

      <OrbitControls
        enableDamping
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={1}
        maxDistance={20}
      />

      <BigBangGalaxy particleCount={particleCount} />

      {/* 은하 형성 후에만 블랙홀과 강착원반 표시 */}
      <BlackHoleSystem />

      <EffectComposer>
        <Bloom
          intensity={1.5}
          radius={0.55}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.4}
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
