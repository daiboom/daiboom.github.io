---
title: 'React Three Fiber로 3D 웹 애플리케이션 만들기'
description: 'React Three Fiber를 사용하여 인터랙티브한 3D 웹 애플리케이션을 만드는 방법을 알아봅니다.'
author: 'daiboom'
date: '2024-01-20'
publishedAt: '2024-01-20'
updatedAt: '2024-01-20'
tags: ['React', 'Three.js', '3D', 'WebGL', 'Frontend']
category: 'Frontend'
slug: 'react-three-fiber-3d-web-app'
readTime: 8
featured: true
---

# React Three Fiber로 3D 웹 애플리케이션 만들기

React Three Fiber는 Three.js를 React 컴포넌트로 사용할 수 있게 해주는 라이브러리입니다. 이를 통해 선언적이고 직관적인 방식으로 3D 웹 애플리케이션을 만들 수 있습니다.

## 설치 및 설정

```bash
npm install @react-three/fiber @react-three/drei three
```

## 기본 사용법

```javascript
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
```

## 인터랙티브 요소 추가

```javascript
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function RotatingBox() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
```

## 조명과 카메라

```javascript
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <OrbitControls />
      <RotatingBox />
    </Canvas>
  )
}
```

## 성능 최적화

- `useMemo`를 사용하여 기하학적 객체 메모이제이션
- `InstancedMesh`를 사용하여 대량의 객체 렌더링
- `useFrame`에서 불필요한 계산 최소화

## 결론

React Three Fiber는 3D 웹 개발을 더욱 접근하기 쉽게 만들어줍니다. React의 선언적 패러다임과 Three.js의 강력한 3D 기능을 결합하여 놀라운 사용자 경험을 제공할 수 있습니다.
