export interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  category: string
  slug: string
  readTime: number
  featured: boolean
}

export interface BlogComment {
  id: number
  body: string
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
  created_at: string
  updated_at: string
}

// 샘플 블로그 포스트 데이터
export const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'React Three Fiber로 3D 웹 애플리케이션 만들기',
    description:
      'React Three Fiber를 사용하여 인터랙티브한 3D 웹 애플리케이션을 만드는 방법을 알아봅니다.',
    content: `# React Three Fiber로 3D 웹 애플리케이션 만들기

React Three Fiber는 Three.js를 React 컴포넌트로 사용할 수 있게 해주는 라이브러리입니다. 이를 통해 복잡한 3D 그래픽을 React의 선언적 방식으로 쉽게 구현할 수 있습니다.

## 주요 특징

- **선언적 3D**: JSX 문법으로 3D 객체를 정의
- **자동 리소스 관리**: 메모리 누수 방지
- **React 생태계**: hooks, context 등 React 기능 활용
- **TypeScript 지원**: 타입 안정성 보장

## 기본 사용법

\`\`\`tsx
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
\`\`\`

이렇게 간단하게 3D 큐브를 렌더링할 수 있습니다!`,
    author: 'daiboom',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    tags: ['React', 'Three.js', '3D', 'WebGL'],
    category: 'Frontend',
    slug: 'react-three-fiber-3d-web-app',
    readTime: 8,
    featured: true,
  },
  {
    id: '2',
    title: 'Next.js 14의 새로운 기능들',
    description: 'Next.js 14에서 추가된 새로운 기능들과 개선사항을 살펴봅니다.',
    content: `# Next.js 14의 새로운 기능들

Next.js 14는 성능과 개발자 경험을 크게 개선한 버전입니다.

## 주요 업데이트

### 1. App Router 안정화
App Router가 이제 안정 버전으로 출시되었습니다.

### 2. 서버 컴포넌트 개선
서버 컴포넌트의 성능이 크게 향상되었습니다.

### 3. 새로운 캐싱 전략
더 효율적인 캐싱 메커니즘이 도입되었습니다.`,
    author: 'daiboom',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    tags: ['Next.js', 'React', 'SSR'],
    category: 'Frontend',
    slug: 'nextjs-14-new-features',
    readTime: 5,
    featured: false,
  },
  {
    id: '3',
    title: 'TypeScript 고급 타입 활용하기',
    description:
      'TypeScript의 고급 타입 기능들을 활용하여 더 안전하고 유지보수하기 쉬운 코드를 작성하는 방법을 알아봅니다.',
    content: `# TypeScript 고급 타입 활용하기

TypeScript의 고급 타입 기능들을 제대로 활용하면 더 안전하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.

## 유틸리티 타입

### Partial<T>
모든 속성을 선택적으로 만듭니다.

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string; }
\`\`\`

### Pick<T, K>
특정 속성만 선택합니다.

\`\`\`typescript
type UserName = Pick<User, 'name'>
// { name: string }
\`\`\``,
    author: 'daiboom',
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-05',
    tags: ['TypeScript', 'Programming', 'Types'],
    category: 'Programming',
    slug: 'typescript-advanced-types',
    readTime: 12,
    featured: true,
  },
]

export const categories = [
  'All',
  'Frontend',
  'Backend',
  'Programming',
  'DevOps',
  'Tools',
]

export const tags = [
  'React',
  'Next.js',
  'TypeScript',
  'Three.js',
  'WebGL',
  '3D',
  'Programming',
  'SSR',
  'Frontend',
  'Backend',
]
