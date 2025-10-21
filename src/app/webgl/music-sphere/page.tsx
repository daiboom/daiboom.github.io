/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, Euler, ThreeElements, useFrame } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Glitch,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { DRACOLoader } from 'three-stdlib'

function Model() {
  const gltf = useGLTF(
    '/assets/snowy_mountain_-_terrain/scene.gltf',
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
    console.log('🏔️ Snowy Mountain GLTF loaded:', gltf)

    if (gltf.scene) {
      console.log('📊 Model info:', {
        children: gltf.scene.children.length,
        type: gltf.scene.type,
        name: gltf.scene.name,
        position: gltf.scene.position,
        scale: gltf.scene.scale,
        boundingBox: gltf.scene.getBoundingBox
          ? gltf.scene.getBoundingBox()
          : 'No bounding box',
      })

      // 모델을 원점으로 이동
      gltf.scene.position.set(-20, 10, 0)
      gltf.scene.scale.set(200, 200, 200)
      console.log('🎯 Model reset to origin')

      gltf.scene.traverse((child) => {
        console.log('🔍 Child:', child.type, child.name, {
          position: child.position,
          scale: child.scale,
          visible: child.visible,
        })
        if (child instanceof THREE.Mesh) {
          child.castShadow = false
          child.receiveShadow = false
          console.log('✅ Mesh shadow disabled:', child.name)
        }
      })
    } else {
      console.log('❌ GLTF scene not loaded')
    }
  }, [gltf])

  if (!gltf.scene) {
    console.log('⏳ Loading Snowy Mountain model...')
    return null
  }

  return (
    <primitive
      object={gltf.scene as any}
      scale={0.002}
      position={[0, -10, 0]}
    />
  )
}

// 프리로드 경로 수정
useGLTF.preload('/assets/snowy_mountain_-_terrain/scene.gltf')

// 눈보라 효과 컴포넌트
function SnowStorm() {
  const snowCount = 2000
  const snowRef = useRef<THREE.Points>(null!)

  // 동그란 텍스처 생성
  const snowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')!

    // 그라디언트로 동그란 모양 생성
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  const snowGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(snowCount * 3)
    const velocities = new Float32Array(snowCount * 3)
    const sizes = new Float32Array(snowCount)
    const opacities = new Float32Array(snowCount)

    for (let i = 0; i < snowCount; i++) {
      // 초기 위치 (카메라 범위 내에서 랜덤하게 분산)
      positions[i * 3] = (Math.random() - 0.5) * 100 // X축 범위 축소
      positions[i * 3 + 1] = Math.random() * 80 + 40 // Y축 높이 조정
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 // Z축 범위 축소

      // 속도 (아래로 떨어지면서 좌우로 흔들림)
      velocities[i * 3] = (Math.random() - 0.5) * 0.5 // 좌우 흔들림
      velocities[i * 3 + 1] = -Math.random() * 0.6 - 0.2 // 아래로 떨어짐
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5 // 앞뒤 흔들림

      // 크기 (다양한 크기의 눈송이)
      sizes[i] = Math.random() * 0.5 + 0.2

      // 투명도 (깊이감을 위해)
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
      // 위치 업데이트
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // 바람 효과 (시간에 따른 좌우 흔들림)
      const windStrength =
        Math.sin(state.clock.elapsedTime * 0.5 + i * 0.01) * 0.01
      positions[i * 3] += windStrength

      // 회전 효과 (눈송이가 떨어지면서 회전)
      const rotation = Math.sin(state.clock.elapsedTime + i * 0.1) * 0.005
      positions[i * 3] += rotation
      positions[i * 3 + 2] += rotation * 0.5

      // 바닥에 닿으면 다시 위로
      if (positions[i * 3 + 1] < -20) {
        positions[i * 3 + 1] = 80
        positions[i * 3] = (Math.random() - 0.5) * 100
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      }

      // 좌우 경계 체크 (카메라 범위 내에서)
      if (positions[i * 3] > 50) positions[i * 3] = -50
      if (positions[i * 3] < -50) positions[i * 3] = 50
      if (positions[i * 3 + 2] > 50) positions[i * 3 + 2] = -50
      if (positions[i * 3 + 2] < -50) positions[i * 3 + 2] = 50
    }

    snowRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={snowRef} geometry={snowGeometry}>
      <pointsMaterial
        map={snowTexture}
        color="white"
        size={1.0}
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        alphaTest={0.1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 오디오 분석 훅
function useAudioAnalyzer() {
  const [audioData, setAudioData] = useState({
    frequencyData: new Uint8Array(256),
    timeData: new Uint8Array(256),
    bass: 0,
    mid: 0,
    treble: 0,
    volume: 0,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number>()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  const startAudioAnalysis = async () => {
    try {
      console.log('오디오 분석 시작...')
      setIsLoading(true)

      // 오디오 컨텍스트 초기화
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 512
        analyserRef.current.smoothingTimeConstant = 0.8
        dataArrayRef.current = new Uint8Array(
          analyserRef.current.frequencyBinCount
        )
      }

      // 오디오 컨텍스트가 일시정지 상태라면 재개
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
        console.log('오디오 컨텍스트 재개됨')
      }

      // MP3 파일 로드 및 재생
      if (!audioRef.current) {
        audioRef.current = new Audio()
        audioRef.current.src =
          '/webgl/music-sphere/good-night-lofi-cozy-chill-music-160166.mp3'
        audioRef.current.loop = true
        audioRef.current.volume = 0.5
        audioRef.current.crossOrigin = 'anonymous'

        // 오디오 이벤트 리스너 추가
        audioRef.current.addEventListener('loadstart', () =>
          console.log('오디오 로딩 시작')
        )
        audioRef.current.addEventListener('canplay', () =>
          console.log('오디오 재생 준비됨')
        )
        audioRef.current.addEventListener('error', (e) =>
          console.error('오디오 로딩 오류:', e)
        )

        // 오디오 컨텍스트에 연결
        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current
        )
        if (analyserRef.current) {
          sourceRef.current.connect(analyserRef.current)
          analyserRef.current.connect(audioContextRef.current.destination)
        }

        console.log('오디오 파일 로드됨')
      }

      // 오디오 재생
      await audioRef.current.play()
      setIsPlaying(true)
      setIsLoading(false)
      console.log('오디오 재생 시작됨')

      const updateAudioData = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current)

          // 주파수 대역별 분석
          const bass =
            dataArrayRef.current.slice(0, 32).reduce((a, b) => a + b, 0) / 32
          const mid =
            dataArrayRef.current.slice(32, 128).reduce((a, b) => a + b, 0) / 96
          const treble =
            dataArrayRef.current.slice(128, 256).reduce((a, b) => a + b, 0) /
            128
          const volume =
            dataArrayRef.current.reduce((a, b) => a + b, 0) /
            dataArrayRef.current.length

          setAudioData({
            frequencyData: new Uint8Array(dataArrayRef.current.buffer),
            timeData: new Uint8Array(dataArrayRef.current.buffer),
            bass,
            mid,
            treble,
            volume,
          })
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioData)
      }
      updateAudioData()
    } catch (error) {
      console.error('오디오 재생 오류:', error)
      setIsLoading(false)
      alert(
        '오디오 재생에 실패했습니다. 브라우저에서 오디오 재생을 허용해주세요.'
      )
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      console.log('오디오 정지됨')
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return { audioData, startAudioAnalysis, stopAudio, isPlaying, isLoading }
}

// 오디오 시각화 컨트롤 패널
function AudioControlPanel({
  onStartAudio,
  onStopAudio,
  isPlaying,
  isLoading,
}: {
  onStartAudio: () => void
  onStopAudio: () => void
  isPlaying: boolean
  isLoading: boolean
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        gap: '8px',
      }}
    >
      <button
        onClick={isPlaying ? onStopAudio : onStartAudio}
        disabled={isLoading}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: '500',
          transition: 'all 0.2s',
          backgroundColor: isLoading
            ? '#9ca3af'
            : isPlaying
            ? '#ef4444'
            : '#8b5cf6',
          color: 'white',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = isPlaying
              ? '#dc2626'
              : '#7c3aed'
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = isPlaying
              ? '#ef4444'
              : '#8b5cf6'
          }
        }}
      >
        {isLoading ? '⏳ 로딩...' : isPlaying ? '⏸️ 정지' : '🎵 LoFi 음악 재생'}
      </button>
    </div>
  )
}

function Sphere(props: ThreeElements['mesh'] & { audioData?: any }) {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!)
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useFrame((state) => {
    if (
      ref.current &&
      glowRef.current &&
      materialRef.current &&
      glowMaterialRef.current &&
      props.audioData
    ) {
      // 오디오 볼륨에 따른 크기 변화
      const volumeScale = Math.max(1, 1 + (props.audioData.volume / 255) * 2)
      const finalScale = (clicked ? 1.5 : 1) * volumeScale

      ref.current.scale.setScalar(finalScale)
      glowRef.current.scale.setScalar(finalScale * 1.1)

      // 시간에 따른 스펙트럼 색상 변화
      const time = state.clock.elapsedTime
      const spectrumHue = (time * 0.1) % 1 // 0~1 사이의 색상값 (HSV)

      // 오디오 반응형 색상 강도
      if (props.audioData.volume > 0) {
        // 주파수에 따른 색상 강도 계산
        const bassIntensity = Math.max(0.5, props.audioData.bass / 255)
        const midIntensity = Math.max(0.5, props.audioData.mid / 255)
        const trebleIntensity = Math.max(0.5, props.audioData.treble / 255)

        // 평균 강도로 색상 밝기 조절
        const avgIntensity =
          (bassIntensity + midIntensity + trebleIntensity) / 3

        // HSV에서 RGB로 변환 (스펙트럼 색상)
        const spectrumColor = new THREE.Color().setHSL(
          spectrumHue,
          1.0,
          Math.max(0.7, avgIntensity)
        )

        // 호버 상태에 따른 색상 결정
        const finalColor = hovered
          ? spectrumColor.clone().multiplyScalar(1.2)
          : spectrumColor
        const finalEmissive = hovered
          ? spectrumColor.clone().multiplyScalar(1.1)
          : spectrumColor

        materialRef.current.color = finalColor
        materialRef.current.emissive = finalEmissive
        glowMaterialRef.current.color = finalColor
      } else {
        // 오디오가 없을 때는 기본 스펙트럼 색상
        const defaultSpectrumColor = new THREE.Color().setHSL(
          spectrumHue,
          1.0,
          0.8
        )
        materialRef.current.color = defaultSpectrumColor
        materialRef.current.emissive = defaultSpectrumColor
        glowMaterialRef.current.color = defaultSpectrumColor
      }
    }
  })

  return (
    <group>
      {/* 기본 Sphere */}
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
          ref={materialRef}
          color="#ffb366"
          emissive="#ffb366"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Glow 효과를 위한 추가 Sphere */}
      <mesh {...props} ref={glowRef} scale={clicked ? 1.5 : 1.1}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color="#ffb366"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// 마우스 이동 감지 및 바람 효과 컴포넌트
function WindEffect({
  mousePosition,
  mouseVelocity,
}: {
  mousePosition: [number, number]
  mouseVelocity: number
}) {
  const [windIntensity, setWindIntensity] = useState(0)
  const [noiseIntensity, setNoiseIntensity] = useState(0)
  const [vignetteIntensity, setVignetteIntensity] = useState(0)
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const [chromaticOffset, setChromaticOffset] = useState([0, 0])

  useFrame((state) => {
    // 마우스 속도에 따른 바람 효과
    if (mouseVelocity > 0.01) {
      // 마우스가 빠르게 움직일 때 바람 효과 활성화
      const windStrength = Math.min(mouseVelocity * 2, 1)

      // 시간에 따른 바람 파동 효과
      const windWave = Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5

      setWindIntensity(windStrength * windWave)
      setNoiseIntensity(windStrength * 0.8 * windWave)
      setVignetteIntensity(windStrength * 0.3 * windWave)
      setGlitchIntensity(windStrength * 0.2 * windWave)

      // 마우스 방향에 따른 색수차 효과
      const chromaticStrength = windStrength * 0.01
      setChromaticOffset([
        mousePosition[0] * chromaticStrength,
        mousePosition[1] * chromaticStrength,
      ])
    } else {
      // 마우스가 멈추면 효과가 서서히 사라짐
      setWindIntensity((prev) => Math.max(0, prev - 0.05))
      setNoiseIntensity((prev) => Math.max(0, prev - 0.05))
      setVignetteIntensity((prev) => Math.max(0, prev - 0.05))
      setGlitchIntensity((prev) => Math.max(0, prev - 0.05))
      setChromaticOffset([0, 0])
    }
  })

  return (
    <>
      {windIntensity > 0 && (
        <>
          <Noise opacity={noiseIntensity} premultiply />
          <Vignette eskil={false} offset={0.1} darkness={vignetteIntensity} />
          <Glitch
            delay={[1.5, 3.5]}
            duration={[0.6, 1.0]}
            strength={[0.3, 1.0]}
            mode={0}
            active={glitchIntensity > 0.1}
          />
          <ChromaticAberration offset={chromaticOffset} />
        </>
      )}
    </>
  )
}

// 오디오 반응형 Bloom 효과 컴포넌트
function AudioReactiveBloom({ audioData }: { audioData: any }) {
  const [bloomIntensity, setBloomIntensity] = useState(1.0)
  const [bloomThreshold, setBloomThreshold] = useState(0.8)
  const [bloomRadius, setBloomRadius] = useState(0.3)

  useFrame(() => {
    if (audioData.volume > 0) {
      // 오디오 볼륨에 따른 Bloom 강도 변화 (더 약하게)
      const volumeIntensity = 1.0 + (audioData.volume / 255) * 1.0 // 1.0 ~ 2.0

      // 주파수에 따른 Bloom 임계값 변화 (더 높은 임계값)
      const bassIntensity = Math.max(0.1, audioData.bass / 255)
      const midIntensity = Math.max(0.1, audioData.mid / 255)
      const trebleIntensity = Math.max(0.1, audioData.treble / 255)

      // 주파수에 따른 Bloom 반경 변화 (더 작은 반경)
      const frequencyRadius =
        0.2 + ((bassIntensity + midIntensity + trebleIntensity) / 3) * 0.3

      // 동적 임계값 (더 높은 임계값으로 바닥 빛 방지)
      const dynamicThreshold = 0.7 + (audioData.volume / 255) * 0.2

      setBloomIntensity(volumeIntensity)
      setBloomThreshold(dynamicThreshold)
      setBloomRadius(frequencyRadius)
    } else {
      // 오디오가 없을 때는 기본값 (더 약하게)
      setBloomIntensity(1.0)
      setBloomThreshold(0.8)
      setBloomRadius(0.3)
    }
  })

  return (
    <>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={bloomRadius}
      />
      {/* 주파수에 따른 색상 필터 효과 */}
      {audioData.volume > 0 && (
        <ChromaticAberration
          offset={[
            0.001 + (audioData.bass / 255) * 0.002,
            0.001 + (audioData.treble / 255) * 0.002,
          ]}
        />
      )}
    </>
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
  audioData,
  frequencyBand = 'bass', // 'bass', 'lowMid', 'mid', 'highMid', 'treble'
}: TorusProps & { audioData?: any; frequencyBand?: string }) {
  const torusRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!)
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null!)
  const [currentRotation, setCurrentRotation] = useState(rotation)

  useFrame((state) => {
    if (
      torusRef.current &&
      glowRef.current &&
      materialRef.current &&
      glowMaterialRef.current &&
      audioData
    ) {
      // 주파수 대역별 반응 강도 계산
      const getFrequencyIntensity = (band: string) => {
        switch (band) {
          case 'bass':
            return audioData.bass / 255
          case 'lowMid':
            return (audioData.bass + audioData.mid) / 2 / 255
          case 'mid':
            return audioData.mid / 255
          case 'highMid':
            return (audioData.mid + audioData.treble) / 2 / 255
          case 'treble':
            return audioData.treble / 255
          default:
            return audioData.volume / 255
        }
      }

      // 오디오 반응형 회전 속도
      const baseRotationSpeed = 0.01
      const frequencyIntensity = getFrequencyIntensity(frequencyBand)
      const rotationSpeed = baseRotationSpeed + frequencyIntensity * 0.05

      // 회전 방향 (트레블에 따라 변화)
      const rotationDirection = audioData.treble > 128 ? 1 : -1

      // 회전 업데이트
      const newRotation = [
        currentRotation[0] + rotationSpeed * rotationDirection,
        currentRotation[1] + rotationSpeed * 0.5,
        currentRotation[2] + rotationSpeed * 0.3,
      ] as [number, number, number]

      setCurrentRotation(newRotation)
      torusRef.current.rotation.set(...newRotation)
      glowRef.current.rotation.set(...newRotation)

      // 오디오 반응형 크기 변화
      const baseScale = 1 + frequencyIntensity * 0.5
      const volumeScale = 1 + (audioData.volume / 255) * 0.3
      const finalScale = baseScale * volumeScale * scale

      torusRef.current.scale.setScalar(finalScale)
      glowRef.current.scale.setScalar(finalScale * 1.1)

      // 시간에 따른 스펙트럼 색상 변화
      const time = state.clock.elapsedTime
      const spectrumHue = (time * 0.1) % 1 // 0~1 사이의 색상값 (HSV)

      // 오디오 반응형 색상 변화
      if (audioData.volume > 0) {
        // 주파수 대역별 색상 강도 계산
        const frequencyIntensity = getFrequencyIntensity(frequencyBand)

        // HSV에서 RGB로 변환 (스펙트럼 색상)
        const spectrumColor = new THREE.Color().setHSL(
          spectrumHue,
          1.0,
          Math.max(0.7, frequencyIntensity)
        )

        materialRef.current.color = spectrumColor
        materialRef.current.emissive = spectrumColor
        glowMaterialRef.current.color = spectrumColor

        // 오디오 반응형 발광 강도
        const emissiveIntensity = 0.8 + (audioData.volume / 255) * 0.8 // 0.8 ~ 1.6
        materialRef.current.emissiveIntensity = emissiveIntensity
      } else {
        // 오디오가 없을 때는 기본 스펙트럼 색상
        const defaultSpectrumColor = new THREE.Color().setHSL(
          spectrumHue,
          1.0,
          0.8
        )
        materialRef.current.color = defaultSpectrumColor
        materialRef.current.emissive = defaultSpectrumColor
        materialRef.current.emissiveIntensity = 1.2
        glowMaterialRef.current.color = defaultSpectrumColor
      }

      // 오디오 반응형 위치 변화 (파동 효과)
      const bandIndex = ['bass', 'lowMid', 'mid', 'highMid', 'treble'].indexOf(
        frequencyBand
      )
      const waveOffset =
        Math.sin(state.clock.elapsedTime * 2 + (bandIndex * Math.PI) / 2) * 0.1
      const frequencyOffset = (audioData.volume / 255) * 0.2
      const newPosition = [
        position[0] + waveOffset * frequencyOffset,
        position[1] + waveOffset * frequencyOffset * 0.5,
        position[2] + waveOffset * frequencyOffset * 0.3,
      ] as [number, number, number]

      torusRef.current.position.set(...newPosition)
      glowRef.current.position.set(...newPosition)
    }
  })

  return (
    <group>
      {/* 기본 Torus */}
      <mesh
        ref={torusRef}
        rotation={currentRotation}
        position={position}
        scale={scale}
      >
        <torusGeometry args={args} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow 효과를 위한 추가 Torus */}
      <mesh
        ref={glowRef}
        rotation={currentRotation}
        position={position}
        scale={scale}
      >
        <torusGeometry args={[args[0], args[1] * 1.2, args[2], args[3]]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
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

export default function Page() {
  console.log('process.env', process.env.NODE_ENV)
  // const fbx = useFBX('/assets/Mount_Fuji.fbx')
  // console.log(fbx)
  // const fbx = useLoader()
  const torus2 = {
    scale: 1.2,
  }

  // 마우스 위치 및 속도 상태
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0])
  const [mouseVelocity, setMouseVelocity] = useState(0)
  const lastMousePosition = useRef<[number, number]>([0, 0])
  const lastTime = useRef(Date.now())

  // 마우스 이벤트 핸들러
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    // 정규화된 좌표 (-1 ~ 1)
    const normalizedX = (x - 0.5) * 2
    const normalizedY = (y - 0.5) * 2

    const currentTime = Date.now()
    const deltaTime = (currentTime - lastTime.current) / 1000 // 초 단위

    // 마우스 속도 계산
    const deltaX = normalizedX - lastMousePosition.current[0]
    const deltaY = normalizedY - lastMousePosition.current[1]
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = deltaTime > 0 ? distance / deltaTime : 0

    setMousePosition([normalizedX, normalizedY])
    setMouseVelocity(velocity)

    lastMousePosition.current = [normalizedX, normalizedY]
    lastTime.current = currentTime
  }

  // 오디오 분석 훅 사용
  const { audioData, startAudioAnalysis, stopAudio, isPlaying, isLoading } =
    useAudioAnalyzer()

  return (
    <div className="h-screen relative" onMouseMove={handleMouseMove}>
      {/* 오디오 컨트롤 패널 */}
      <AudioControlPanel
        onStartAudio={startAudioAnalysis}
        onStopAudio={stopAudio}
        isPlaying={isPlaying}
        isLoading={isLoading}
      />
      <Canvas fallback={<div>Sorry no WebGL supported!</div>}>
        <fogExp2 attach="fog" args={['#e6f3ff', 0.002]} />

        <PerspectiveCamera makeDefault position={[20, 20, 20]} zoom={1} />
        <OrbitControls
          minDistance={15}
          maxDistance={75}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />

        <Suspense fallback={null}>
          <Model />
        </Suspense>

        <SnowStorm />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.4}
          castShadow={false}
          color="#fff8dc"
        />
        <pointLight position={[-5, -5, -5]} intensity={0.1} color="#e6f3ff" />
        <pointLight position={[0, 15, 0]} intensity={0.15} color="#f0f8ff" />
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
          <Sphere position={[0, 0, 0]} audioData={audioData} />

          <Torus
            scale={1}
            rotation={[0, 0, 0]}
            color="#ff3366"
            glowColor="#ff00ff"
            audioData={audioData}
            frequencyBand="bass"
          />

          <Torus
            scale={torus2.scale}
            rotation={[-Math.PI / 3, 0, 0]}
            color="#33ff99"
            glowColor="#00ffaa"
            audioData={audioData}
            frequencyBand="treble"
          />
        </group>

        {process.env.NODE_ENV === 'development' ? (
          <>
            <gridHelper args={[10, 10]} />
            <axesHelper args={[8]} />
          </>
        ) : null}
        <EffectComposer>
          <AudioReactiveBloom audioData={audioData} />
          <WindEffect
            mousePosition={mousePosition}
            mouseVelocity={mouseVelocity}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
