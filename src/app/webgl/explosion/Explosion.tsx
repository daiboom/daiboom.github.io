'use client'

import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// 타임라인 컨트롤 컴포넌트
function TimelineControl({
  currentTime,
  duration,
  isPlaying,
  onTimeChange,
  onPlayPause,
  onReset,
}: {
  currentTime: number
  duration: number
  isPlaying: boolean
  onTimeChange: (time: number) => void
  onPlayPause: () => void
  onReset: () => void
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseLabel = (time: number) => {
    if (time < 3) return '빅뱅 폭발 단계'
    if (time < 15) return '은하 형성 중'
    return '은하 회전 단계'
  }

  return null // 이제 ControlPanel에 통합됨
}

// 빅뱅 -> 은하수 효과
function BigBangGalaxy({
  particleCount,
  controlledTime,
  coreBrightness,
}: {
  particleCount: number
  controlledTime?: number
  coreBrightness: number
}) {
  const particlesRef = useRef<THREE.InstancedMesh>(null)
  const startTimeRef = useRef<number>(0)
  const initializedRef = useRef(false)

  const particleData = useMemo(() => {
    const data = []

    for (let i = 0; i < particleCount; i++) {
      // 은하 나선팔 각도 (3개의 나선팔)
      const spiralArm = Math.floor(Math.random() * 3)
      const baseArmAngle = (spiralArm * Math.PI * 2) / 3

      // 은하 중심으로부터의 거리
      // 실제 은하 구조: 중심 bulge(구형) + 나선 원반
      const minRadius = 0 // 나선팔이 중심부터 시작 (블랙홀과 밀착)
      const maxRadius = 20
      const galaxyRadius =
        minRadius + Math.pow(Math.random(), 3) * (maxRadius - minRadius) // 지수 3으로 중심 더 집중

      // 거리 비율 (0: 블랙홀 바로 밖, 1: 외곽)
      const distanceRatio = (galaxyRadius - minRadius) / (maxRadius - minRadius)

      // 빅뱅 속도 = 은하 거리에 비례!
      // 은하 중심에 있을 파티클 → 빅뱅 때 느리게
      // 은하 외곽에 있을 파티클 → 빅뱅 때 빠르게
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const speed = 5.0 + distanceRatio * 10.0 // distanceRatio에 비례 (5.0 ~ 15.0) - 아주 멀리 퍼짐

      const initialVelocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      )

      // 나선 각도 (거리에 비례) - 나선팔 간격을 넓히기 위해 완화
      const spiralTightness = 1.0 // 나선팔 간격을 넓히기 위해 완화 (2.0 → 1.0)

      // X축 방향 흩뿌리기: 나선을 따라 앞뒤로 흩어짐 (거리에 따라 조절)
      const spiralScatter =
        (Math.random() - 0.5) * 0.3 * (0.5 + distanceRatio * 1.5)

      // 중심부에서도 나선팔이 명확하게 보이도록 최소 반지름 보장
      const effectiveRadius = Math.max(galaxyRadius, 1.0) // 최소 1.0 보장
      const spiralCenterAngle =
        baseArmAngle + (effectiveRadius + spiralScatter) * spiralTightness

      // 나선팔로부터의 각도 오프셋 (가우시안 분포로 나선 주변에 집중)
      const gaussianRandom = () => {
        let u = 0,
          v = 0
        while (u === 0) u = Math.random()
        while (v === 0) v = Math.random()
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
      }

      // 나선팔: 동그란 단면, 외곽으로 갈수록 얇아짐
      let angularOffset, radialSpread
      let finalAngle // 최종 각도
      let yPosition // Y축 위치

      if (distanceRatio < 0.25) {
        // 중심부 (0-25%): 완전한 구형 팽대부 - 3D 구형 분포
        const theta = Math.random() * Math.PI * 2 // 방위각 (0-360도)
        const phi = Math.acos(2 * Math.random() - 1) // 고도각 (균일 분포)
        const r = Math.pow(Math.random(), 1 / 3) * galaxyRadius * 0.8 // 구형 내부 균일 분포

        // 구형 좌표를 직교 좌표로 변환 (완전한 3D 구형)
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.cos(phi) // Y축도 같은 구형 좌표계에서 계산
        const z = r * Math.sin(phi) * Math.sin(theta)

        // 구형 팽대부에서는 나선팔 각도를 무시하고 완전히 구형으로
        finalAngle = theta
        angularOffset = 0
        radialSpread = Math.sqrt(x * x + z * z) - galaxyRadius

        // Y축 위치도 구형 좌표계에서 계산된 값 사용
        yPosition = y
      } else {
        // 나선팔 (25%+): 중심부에서 뻗어나가는 원통형 나선팔
        // 중심부에서 가장 두껍고 외곽으로 갈수록 얇아짐
        const armStartRadius = 0.5 // 중심부에서의 나선팔 시작 반지름 (가장 두껍게)
        const armEndRadius = 0.03 // 외곽에서의 나선팔 끝 반지름 (가장 얇게)

        // 나선팔이 중심부에서 나가는 형태로 두께 감소
        const armProgress = (distanceRatio - 0.25) / 0.75 // 0-1 (25%에서 시작)
        const armRadius =
          armStartRadius - (armStartRadius - armEndRadius) * armProgress

        // 나선팔 중심에서의 거리 (원통형 단면)
        // 중심부에서 나선팔이 뻗어나오는 효과를 강화
        const rand = Math.random()
        let scatterFactor

        // 중심부에 가까울수록 더 집중적으로
        const centerProximity = 1 - armProgress // 0에서 1로 (중심부에서 멀어질수록 감소)

        if (rand < 0.5 + centerProximity * 0.3) {
          // 50-80%는 나선팔 중심에 집중 (중심부에 가까울수록 더 집중)
          scatterFactor = 0.01 + Math.random() * (0.1 + centerProximity * 0.1) // 0.01 ~ 0.2
        } else {
          // 나머지는 나선팔 주변에 분포
          scatterFactor = 0.2 + Math.random() * 0.8 // 0.2 ~ 1.0
        }

        const effectiveRadius = armRadius * scatterFactor

        // 나선팔 중심으로부터의 각도 오프셋 (원통형 단면)
        const angleOffset = Math.random() * 2 * Math.PI
        angularOffset = effectiveRadius * Math.cos(angleOffset)
        radialSpread = effectiveRadius * Math.sin(angleOffset)

        finalAngle = spiralCenterAngle + angularOffset
      }

      // 최종 나선 각도 (중심부는 랜덤, 나선팔은 계산된 각도)
      const spiralAngle = finalAngle

      // Y축 위치 계산: 구형 팽대부와 원통형 나선팔
      if (distanceRatio < 0.25) {
        // 중심부 (구형 팽대부): 이미 위에서 구형 좌표계로 계산됨
        // yPosition은 이미 설정됨
      } else {
        // 나선팔: 중심부에서 뻗어나가는 원통형 Y축
        const yMaxArmRadius = 0.5 // 중심부에서의 최대 Y축 반지름 (가장 두껍게)
        const yMinArmRadius = 0.03 // 외곽에서의 최소 Y축 반지름 (가장 얇게)
        const yArmProgress = (distanceRatio - 0.25) / 0.75 // 0-1 (25%에서 시작)
        const yArmRadius =
          yMaxArmRadius - (yMaxArmRadius - yMinArmRadius) * yArmProgress

        // Y축도 같은 방식으로 흩뿌리기 (나선팔 중심에 집중)
        const yRand = Math.random()
        let yScatterFactor

        // 중심부에 가까울수록 더 집중적으로
        const yCenterProximity = 1 - yArmProgress // 0에서 1로 (중심부에서 멀어질수록 감소)

        if (yRand < 0.5 + yCenterProximity * 0.3) {
          // 50-80%는 나선팔 중심에 집중 (중심부에 가까울수록 더 집중)
          yScatterFactor = 0.01 + Math.random() * (0.1 + yCenterProximity * 0.1) // 0.01 ~ 0.2
        } else {
          // 나머지는 나선팔 주변에 분포
          yScatterFactor = 0.2 + Math.random() * 0.8 // 0.2 ~ 1.0
        }

        const yEffectiveRadius = yArmRadius * yScatterFactor
        const yOffsetDistance = Math.abs(gaussianRandom()) * yEffectiveRadius
        const yOffsetSign = Math.random() < 0.5 ? -1 : 1
        yPosition = yOffsetSign * yOffsetDistance
      }

      // 임시 은하 위치
      let galaxyPosition = new THREE.Vector3(
        Math.cos(spiralAngle) * (galaxyRadius + radialSpread),
        yPosition,
        Math.sin(spiralAngle) * (galaxyRadius + radialSpread)
      )

      // 3D 거리 체크: 블랙홀 중심(0,0,0)으로부터의 거리
      const distanceFromBlackHole = galaxyPosition.length()
      const minDistance3D = 0 // 나선팔이 블랙홀과 밀착 (0으로 설정)

      // 블랙홀에 너무 가까우면 최소 거리로 밀어내기
      if (distanceFromBlackHole < minDistance3D) {
        galaxyPosition.normalize().multiplyScalar(minDistance3D)
      }

      // 색상 (모두 흰색)
      const color = new THREE.Color(1, 1, 1) // 순수한 흰색

      // 나선팔 중심으로부터의 거리에 따른 밝기 감소
      // 중심부에서 나선팔이 뻗어나오는 효과를 강화
      const centerProximity =
        distanceRatio < 0.25 ? 1 : 1 - (distanceRatio - 0.25) / 0.75
      const armDistanceFactor = Math.exp(
        -Math.abs(angularOffset) * (1.5 + centerProximity * 0.5)
      )

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
      // 중심부에서 나선팔이 뻗어나오는 효과를 강화
      size =
        size * (0.4 + armDistanceFactor * 0.6) * (0.7 + centerProximity * 0.3)
      size = Math.max(size, 0.002) // 최소 크기 (매우 작게)

      data.push({
        initialVelocity,
        galaxyPosition,
        color,
        size,
        spiralAngle,
        distanceRatio, // 거리 비율 저장
        armDistanceFactor, // 나선팔 중심으로부터의 거리 저장
        glowIntensity: 2.5, // 기본 글로우 강도 (나중에 별 유형에 따라 업데이트)
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

    // controlledTime이 있으면 그것을 사용, 없으면 자동 진행
    const elapsed =
      controlledTime !== undefined
        ? controlledTime
        : state.clock.elapsedTime - startTimeRef.current
    const time = state.clock.elapsedTime

    // coreBrightness 참조 (리렌더링 트리거용)
    const currentCoreBrightness = coreBrightness

    // 단계별 전환
    // 0-3초: 태초의 한 점 (정지)
    // 3-13초: 빅뱅 폭발 (10초)
    // 13-23초: 은하 형성 (10초)
    // 23초+: 완성된 은하 회전

    const singularityPhase = Math.min(elapsed / 3, 1) // 0-1 (0-3초: 태초의 한 점)
    const explosionPhase = Math.max(0, Math.min((elapsed - 3) / 10, 1)) // 0-1 (3-13초: 빅뱅)
    const galaxyFormationPhase = Math.max(0, Math.min((elapsed - 13) / 10, 1)) // 0-1 (13-23초: 은하 형성)

    for (let i = 0; i < particleCount; i++) {
      const data = particleData[i]
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()

      if (elapsed < 3) {
        // 태초의 한 점 (0-3초): 모든 파티클이 중심에 모여있음
        position.set(0, 0, 0)
      } else if (elapsed < 13) {
        // 빅뱅 폭발 단계 (3-13초): 폭발적으로 퍼져나감 + 여러 번의 파장
        const explosionTime = elapsed - 3 // 0-10초
        const baseExplosionPos = data.initialVelocity
          .clone()
          .multiplyScalar(explosionTime)

        // 여러 번의 파장 효과
        const waveCount = 3 // 3번의 파장으로 단순화
        let waveOffset = new THREE.Vector3(0, 0, 0)

        for (let wave = 0; wave < waveCount; wave++) {
          const wavePhase = (explosionTime - wave * 3.0) / 10.0 // 각 파장은 3.0초씩 지연
          if (wavePhase > 0 && wavePhase < 1.0) {
            const waveIntensity = Math.sin(wavePhase * Math.PI) // 0~1~0
            const waveRadius = wavePhase * 15.0 // 파장 반지름 증가

            // 파장 방향을 더 단순하게 (X, Y, Z 축 방향)
            const waveDirection = new THREE.Vector3(
              Math.sin((wave * Math.PI * 2) / 3 + time * 1.5), // X축 파장
              Math.cos((wave * Math.PI * 2) / 3 + time * 1.5), // Y축 파장
              Math.sin((wave * Math.PI * 2) / 3 + time * 1.2) // Z축 파장
            )

            // 파장 오프셋 추가 (강도 대폭 증가)
            waveOffset.add(waveDirection.multiplyScalar(waveIntensity * 5.0))
          }
        }

        position.copy(baseExplosionPos).add(waveOffset)
      } else {
        // 은하 형성 단계 (13초+) - 회전하면서 수렴!
        const explosionPos = data.initialVelocity.clone().multiplyScalar(10) // 10초간 폭발한 최종 위치

        // 은하 형성 시작부터 회전 (각운동량 보존)
        // 차등 회전: 중심부가 빠르게, 외곽이 느리게 회전
        const timeSinceFormation = elapsed - 13

        // 반지름 계산
        const radius = Math.sqrt(
          data.galaxyPosition.x * data.galaxyPosition.x +
            data.galaxyPosition.z * data.galaxyPosition.z
        )

        // 차등 회전 속도: 중심부가 빠르고 외곽이 느림 (케플러 회전)
        // radius가 작을수록 rotationSpeed가 큼
        const normalizedRadius = Math.min(radius / 20, 1) // 0~1
        const differentialRotation = 1 / (1 + normalizedRadius * 3) // 중심: 1.0, 외곽: 0.25

        // galaxyFormationPhase² 사용으로 초반에는 매우 느리게, 후반에 점진적으로 증가
        const baseRotationSpeed = 0.05 * Math.pow(galaxyFormationPhase, 2)
        const rotationSpeed = baseRotationSpeed * differentialRotation
        const rotationAngle = timeSinceFormation * rotationSpeed
        const currentSpiralAngle = data.spiralAngle + rotationAngle

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
        // 태초의 한 점 (0-3초): 무한 밀도, 극초고온
        // 모든 파티클이 하나의 점에 집중되어 있음
        finalColor = new THREE.Color().setHSL(0.6, 0.8, 1.0) // 밝은 청백색
        finalColor.multiplyScalar(2.0) // 더 밝게 조정
        data.glowIntensity = 8.0 // 극강한 글로우
      } else if (elapsed < 13) {
        // 빅뱅 폭발 단계 (3-13초): 극초고온 색상 (더 강렬한 파란-흰색 글로우)
        // 중심부에서 외곽으로 온도 그라데이션
        const explosionTemp = 1 - data.distanceRatio * 0.5

        if (explosionTemp > 0.85) {
          // 극초고온 (>10^11 K): 강렬한 청백색 글로우
          const hue = 0.58 // 순수한 파란색
          const saturation = 0.6 + explosionTemp * 0.4 // 0.6-1.0 (매우 포화됨)
          const lightness = 1.0 // 최대 밝기
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
          data.glowIntensity = 7.0 // 극강한 글로우
        } else if (explosionTemp > 0.7) {
          // 초고온 (10^10-10^11 K): 밝은 청백색
          const hue = 0.55 + (1 - explosionTemp) * 0.05 // 0.55-0.58 (파란색)
          const saturation = 0.5 + explosionTemp * 0.3 // 0.5-0.8
          const lightness = 0.98 + explosionTemp * 0.02 // 0.98-1.0
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
          data.glowIntensity = 6.0 // 강한 글로우
        } else if (explosionTemp > 0.5) {
          // 고온 (10^9-10^10 K): 흰색-청백색
          const hue = 0.52 + (1 - explosionTemp) * 0.1 // 0.52-0.6 (연한 파랑)
          const saturation = 0.3 + explosionTemp * 0.3 // 0.3-0.6
          const lightness = 0.95 + explosionTemp * 0.05 // 0.95-1.0
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
          data.glowIntensity = 5.0 // 강한 글로우
        } else if (explosionTemp > 0.3) {
          // 중온 (10^8-10^9 K): 흰색
          finalColor = new THREE.Color(1, 1, 1)
          data.glowIntensity = 4.0 // 중간 글로우
        } else {
          // 온도 감소: 흰색-청백색 전환
          const hue = 0.55
          const saturation = 0.2 * explosionTemp
          const lightness = 0.9 + explosionTemp * 0.1
          finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
          data.glowIntensity = 3.0 // 약한 글로우
        }
      } else if (galaxyFormationPhase < 0.8) {
        // 은하 형성 중 (13-23초): 온도 하강
        // 뜨거운 흰색에서 일반 흰색으로
        const coolingPhase = galaxyFormationPhase
        const temp = 1 - data.distanceRatio * 0.3

        const hue = 0.6 * (1 - coolingPhase) // 파란색 → 흰색
        const saturation = 0.1 * (1 - coolingPhase)
        const lightness = 0.9 + temp * 0.1
        finalColor = new THREE.Color().setHSL(hue, saturation, lightness)
        data.glowIntensity = 3.0 + coolingPhase * 2.0 // 3.0 → 5.0
      } else {
        // 은하 형성 완료 후 (12초+): 다양한 별 색상
        // 실제 별들의 색상: O(파랑), B(청백), A(흰색), F(황백), G(노랑), K(주황), M(빨강)

        // 별의 유형을 랜덤하게 결정 (거리와 나선팔 위치에 따라 가중치 적용)
        const starTypeRandom = Math.random()
        let starType

        if (data.distanceRatio < 0.3) {
          // 중심부: 주로 고온 별들 (O, B, A형)
          if (starTypeRandom < 0.1) starType = 'O' // 10% - 파란색 거성
          else if (starTypeRandom < 0.3) starType = 'B' // 20% - 청백색
          else if (starTypeRandom < 0.6) starType = 'A' // 30% - 흰색
          else if (starTypeRandom < 0.8) starType = 'F' // 20% - 황백색
          else starType = 'G' // 20% - 노랑
        } else if (data.distanceRatio < 0.6) {
          // 중간부: 다양한 별들
          if (starTypeRandom < 0.05) starType = 'O' // 5% - 파란색
          else if (starTypeRandom < 0.15) starType = 'B' // 10% - 청백색
          else if (starTypeRandom < 0.35) starType = 'A' // 20% - 흰색
          else if (starTypeRandom < 0.55) starType = 'F' // 20% - 황백색
          else if (starTypeRandom < 0.75) starType = 'G' // 20% - 노랑
          else if (starTypeRandom < 0.9) starType = 'K' // 15% - 주황
          else starType = 'M' // 10% - 빨강
        } else {
          // 외곽부: 주로 저온 별들 (K, M형)
          if (starTypeRandom < 0.1) starType = 'F' // 10% - 황백색
          else if (starTypeRandom < 0.25) starType = 'G' // 15% - 노랑
          else if (starTypeRandom < 0.55) starType = 'K' // 30% - 주황
          else starType = 'M' // 45% - 빨강
        }

        // 별 유형에 따른 색상 및 글로우 설정 (더 밝게 조정)
        let glowIntensity = 1.0
        switch (starType) {
          case 'O': // 파란색 거성 (O형) - 매우 밝음
            finalColor = new THREE.Color().setHSL(0.6, 1.0, 1.0) // 채도와 밝기 최대
            glowIntensity = 6.0 // 매우 강한 글로우
            break
          case 'B': // 청백색 (B형) - 매우 밝음
            finalColor = new THREE.Color().setHSL(0.55, 0.8, 1.0) // 청백색 강화
            glowIntensity = 5.0 // 강한 글로우
            break
          case 'A': // 흰색 (A형) - 밝음
            finalColor = new THREE.Color().setHSL(0.0, 0.0, 1.0) // 순수 흰색
            glowIntensity = 4.0 // 강한 글로우
            break
          case 'F': // 황백색 (F형) - 중간 밝음
            finalColor = new THREE.Color().setHSL(0.12, 0.6, 1.0) // 황백색 강화
            glowIntensity = 3.5 // 중간 글로우
            break
          case 'G': // 노랑 (G형) - 우리 태양, 중간 밝음
            finalColor = new THREE.Color().setHSL(0.15, 0.9, 1.0) // 노랑 강화
            glowIntensity = 3.0 // 중간 글로우
            break
          case 'K': // 주황 (K형) - 약간 밝음
            finalColor = new THREE.Color().setHSL(0.08, 1.0, 1.0) // 주황 강화
            glowIntensity = 2.5 // 약한 글로우
            break
          case 'M': // 빨강 (M형) - 적색 거성, 약간 밝음
            finalColor = new THREE.Color().setHSL(0.02, 1.0, 1.0) // 빨강 강화
            glowIntensity = 2.0 // 약한 글로우
            break
          default:
            finalColor = new THREE.Color(1, 1, 1) // 기본 흰색
            glowIntensity = 3.0
        }

        // 모든 별의 색상을 더 밝게 조정 (bloom 효과를 위해)
        finalColor.multiplyScalar(1.5)

        // 중심부 밝기 조절 (coreBrightness 적용)
        if (data.distanceRatio < 0.3) {
          const centerBrightness = 0.3 + currentCoreBrightness * 0.7
          finalColor.multiplyScalar(centerBrightness)
          glowIntensity *= centerBrightness // 글로우도 중심부 밝기에 따라 조절
        }

        // 나선팔에서 멀수록 약간 감소
        const armFactor = 0.7 + data.armDistanceFactor * 0.3
        finalColor.multiplyScalar(armFactor)
        glowIntensity *= armFactor // 글로우도 나선팔 거리에 따라 조절

        // 글로우 강도 업데이트
        data.glowIntensity = glowIntensity
      }

      // 파티클 색상을 더 밝게 조정 (bloom 효과를 위해)
      const brightColor = finalColor.clone().multiplyScalar(2.0)
      particlesRef.current.setColorAt(i, brightColor)
    }

    particlesRef.current.instanceMatrix.needsUpdate = true
    if (particlesRef.current.instanceColor) {
      particlesRef.current.instanceColor.needsUpdate = true
    }

    // material의 emissive 색상을 흰색으로 설정하고 강도 조정
    if (particlesRef.current.material) {
      const material = particlesRef.current
        .material as THREE.MeshStandardMaterial
      material.emissive.setHex(0xffffff)
      material.emissiveIntensity = 4.0
    }
  })

  // 평균 글로우 강도 계산
  const averageGlowIntensity = useMemo(() => {
    if (particleData.length === 0) return 2.5
    const totalGlow = particleData.reduce(
      (sum, data) => sum + data.glowIntensity,
      0
    )
    return totalGlow / particleData.length
  }, [particleData])

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
        emissiveIntensity={4.0}
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

    let targetDistance = 7 // 기본값

    if (elapsed < 3) {
      // 태초의 한 점 (0-3초): 매우 가까이 (한 점을 확대해서 봄)
      targetDistance = 3
    } else if (elapsed < 13) {
      // 빅뱅 폭발 단계 (3-13초): 3에서 7로 부드럽게 줌아웃
      const transitionPhase = (elapsed - 3) / 10 // 0 ~ 1
      targetDistance = 3 + transitionPhase * 4 // 3 → 7
    } else if (elapsed < 23) {
      // 은하 형성 단계 (13-23초): 7에서 20으로 부드럽게 줌아웃
      const transitionPhase = (elapsed - 13) / 10 // 0 ~ 1
      targetDistance = 7 + transitionPhase * 13 // 7 → 20
    } else {
      // 은하 완성 후 (23초+): 거리 20으로 고정, 사용자 제어 허용
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

// 강착원반 컴포넌트
function AccretionDisk() {
  const diskRef = useRef<THREE.Mesh>(null)

  // 강착원반 회전
  useFrame((state) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += 0.005
    }
  })

  // 강착원반 링 지오메트리 생성 (온도 그라데이션)
  const diskGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(0.015, 0.025, 64, 16) // 훨씬 작게
    const positions = geometry.attributes.position
    const colors = new Float32Array(positions.count * 3)

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const distanceFromCenter = Math.sqrt(x * x + y * y)
      const normalizedDistance = (distanceFromCenter - 0.015) / (0.025 - 0.015)

      // 온도 그라데이션: 중심(뜨거움) → 외곽(차가움)
      // 중심: 청백색 → 외곽: 주황-빨강
      let r, g, b
      if (normalizedDistance < 0.3) {
        // 내부: 청백색-흰색
        const t = normalizedDistance / 0.3
        r = 0.7 + t * 0.3
        g = 0.8 + t * 0.2
        b = 1.0
      } else if (normalizedDistance < 0.6) {
        // 중간: 흰색-노랑
        const t = (normalizedDistance - 0.3) / 0.3
        r = 1.0
        g = 1.0 - t * 0.2
        b = 1.0 - t * 0.5
      } else {
        // 외곽: 주황-빨강
        const t = (normalizedDistance - 0.6) / 0.4
        r = 1.0
        g = 0.8 - t * 0.5
        b = 0.5 - t * 0.3
      }

      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geometry
  }, [])

  return (
    <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={diskGeometry} />
      <meshStandardMaterial
        vertexColors
        emissive={0x000000}
        emissiveIntensity={0}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

// 시간에 따라 블랙홀과 강착원반을 표시
function BlackHoleSystem() {
  const [showBlackHole, setShowBlackHole] = useState(false)

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime
    // 23초 이후(은하 형성 완료 후)에만 블랙홀 표시
    if (elapsed > 23 && !showBlackHole) {
      setShowBlackHole(true)
    } else if (elapsed <= 23 && showBlackHole) {
      setShowBlackHole(false)
    }
  })

  if (!showBlackHole) return null

  return (
    <>
      {/* 블랙홀 (중심의 매우 작은 검은 구체) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.01, 32, 32]} />
        <meshBasicMaterial color={0x000000} toneMapped={false} />
      </mesh>

      {/* 블랙홀 외곽 링 (이벤트 호라이즌) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.01, 0.012, 32]} />
        <meshBasicMaterial
          color={0x111111}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 강착원반 */}
      <AccretionDisk />
    </>
  )
}

function Scene({
  particleCount,
  controlledTime,
  currentTime,
  duration,
  isPlaying,
  coreBrightness,
  onParticleCountChange,
  onCoreBrightnessChange,
  onTimeChange,
  onPlayPause,
  onReset,
  getPhaseLabel,
  formatTime,
}: {
  particleCount: number
  controlledTime?: number
  currentTime: number
  duration: number
  isPlaying: boolean
  coreBrightness: number
  onParticleCountChange: (count: number) => void
  onCoreBrightnessChange: (brightness: number) => void
  onTimeChange: (time: number) => void
  onPlayPause: () => void
  onReset: () => void
  getPhaseLabel: (time: number) => string
  formatTime: (seconds: number) => string
}) {
  return (
    <>
      <color attach="background" args={['#000005']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} decay={2} />

      {/* Canvas 내부 HTML 오버레이 */}
      <Html fullscreen>
        <div className="absolute top-5 left-5">
          <ControlPanel
            particleCount={particleCount}
            onParticleCountChange={onParticleCountChange}
            coreBrightness={coreBrightness}
            onCoreBrightnessChange={onCoreBrightnessChange}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onTimeChange={onTimeChange}
            onPlayPause={onPlayPause}
            onReset={onReset}
            getPhaseLabel={getPhaseLabel}
            formatTime={formatTime}
          />
        </div>
      </Html>

      {/* 동적 카메라 거리 제어 */}
      <DynamicCamera />

      <OrbitControls
        enableDamping
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={1}
        maxDistance={20}
      />

      <BigBangGalaxy
        particleCount={particleCount}
        controlledTime={controlledTime}
        coreBrightness={coreBrightness}
      />

      {/* 은하 형성 후에만 블랙홀과 강착원반 표시 */}
      <BlackHoleSystem />

      <EffectComposer>
        <Bloom
          intensity={2.0}
          radius={0.8}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// 통합 컨트롤 패널
function ControlPanel({
  particleCount,
  onParticleCountChange,
  coreBrightness,
  onCoreBrightnessChange,
  currentTime,
  duration,
  isPlaying,
  onTimeChange,
  onPlayPause,
  onReset,
  getPhaseLabel,
  formatTime,
}: {
  particleCount: number
  onParticleCountChange: (count: number) => void
  coreBrightness: number
  onCoreBrightnessChange: (brightness: number) => void
  currentTime: number
  duration: number
  isPlaying: boolean
  onTimeChange: (time: number) => void
  onPlayPause: () => void
  onReset: () => void
  getPhaseLabel: (time: number) => string
  formatTime: (seconds: number) => string
}) {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <div
      className="bg-black/80 backdrop-blur-xl rounded-2xl text-white border border-white/10 shadow-2xl transition-all duration-300 w-[280px]"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* 헤더 - 항상 표시 */}
      <div
        className={`flex items-center justify-between p-4 ${
          !isMinimized ? 'border-b border-white/10' : ''
        }`}
      >
        <div className="text-sm font-semibold uppercase tracking-wide">
          Controls
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-all"
        >
          {isMinimized ? '▼' : '▲'}
        </button>
      </div>

      {/* 컨텐츠 - 최소화 시 숨김 */}
      {!isMinimized && (
        <div className="p-5">
          {/* 파티클 설정 */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="text-xs text-white/50 uppercase tracking-wide mb-2">
              Particles
            </div>
            <div className="text-3xl font-mono font-bold mb-3">
              {particleCount.toLocaleString()}
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="10000"
              value={particleCount}
              onChange={(e) => onParticleCountChange(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full outline-none cursor-pointer appearance-none mb-2"
            />
            <div className="flex justify-between text-xs text-white/40 font-mono">
              <span>10K</span>
              <span>200K</span>
            </div>
          </div>

          {/* 중심부 밝기 설정 */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="text-xs text-white/50 uppercase tracking-wide mb-2">
              Core Brightness
            </div>
            <div className="text-3xl font-mono font-bold mb-3">
              {Math.round(coreBrightness * 100)}%
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={coreBrightness * 100}
              onChange={(e) =>
                onCoreBrightnessChange(Number(e.target.value) / 100)
              }
              className="w-full h-2 bg-white/10 rounded-full outline-none cursor-pointer appearance-none mb-2"
            />
            <div className="flex justify-between text-xs text-white/40 font-mono">
              <span>어두움</span>
              <span>밝음</span>
            </div>
          </div>

          {/* 타임라인 */}
          <div className="mb-4">
            <div className="text-xs text-white/50 uppercase tracking-wide mb-2">
              Timeline
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-mono font-bold">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-white/40">
                {getPhaseLabel(currentTime)}
              </div>
            </div>
            <div className="relative px-1.5 mb-3">
              <div
                className="relative h-2 bg-white/10 rounded-full cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const percentage = Math.max(0, Math.min(1, x / rect.width))
                  onTimeChange(percentage * duration)
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100"
                  style={{
                    width: `${Math.min((currentTime / duration) * 100, 100)}%`,
                  }}
                />
                <div
                  className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-100"
                  style={{
                    left: `${Math.min((currentTime / duration) * 100, 100)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onPlayPause}
                className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={onReset}
                className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
              >
                ↻
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Explosion() {
  const [particleCount, setParticleCount] = useState(100000)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [duration] = useState(30) // 30초 타임라인
  const [coreBrightness, setCoreBrightness] = useState(0.5) // 중심부 밝기 (0.0 ~ 1.0)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(Date.now())

  // 자동 재생
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        const now = Date.now()
        const deltaTime = (now - lastTimeRef.current) / 1000 // 초 단위
        lastTimeRef.current = now

        setCurrentTime((prevTime) => prevTime + deltaTime)

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, duration])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    lastTimeRef.current = Date.now()
  }

  const handleReset = () => {
    setCurrentTime(0)
    setIsPlaying(false)
    lastTimeRef.current = Date.now()
  }

  const handleTimeChange = (time: number) => {
    setCurrentTime(time)
    lastTimeRef.current = Date.now()
  }

  const getPhaseLabel = (time: number) => {
    if (time < 3) return '태초의 한 점'
    if (time < 13) return '빅뱅 폭발 단계'
    if (time < 23) return '은하 형성 중'
    return '은하 회전 단계'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-screen relative">
      <Canvas
        camera={{ position: [0, 8, 15], fov: 75 }}
        gl={{
          toneMapping: THREE.ReinhardToneMapping,
        }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
      >
        <Scene
          particleCount={particleCount}
          controlledTime={currentTime}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          coreBrightness={coreBrightness}
          onParticleCountChange={setParticleCount}
          onCoreBrightnessChange={setCoreBrightness}
          onTimeChange={handleTimeChange}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          getPhaseLabel={getPhaseLabel}
          formatTime={formatTime}
        />
      </Canvas>
    </div>
  )
}
