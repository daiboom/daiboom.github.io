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
import { HybridBlogStorage } from './hybrid-blog'

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
  {
    id: '4',
    title: '인터랙티브 코드 블록으로 배우는 프로그래밍',
    description:
      '블로그에서 직접 코드를 실행하고 결과를 확인할 수 있는 인터랙티브 코드 블록을 소개합니다.',
    content: `# 인터랙티브 코드 블록으로 배우는 프로그래밍

블로그에서 직접 코드를 실행하고 결과를 확인할 수 있는 인터랙티브 코드 블록을 소개합니다.

## JavaScript 예시

간단한 JavaScript 코드를 실행해보세요!

\`\`\`javascript
// 배열 조작 예시
const fruits = ['사과', '바나나', '오렌지', '포도'];
console.log('원본 배열:', fruits);

// map을 사용한 변환
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log('대문자 변환:', upperFruits);

// filter를 사용한 필터링
const longFruits = fruits.filter(fruit => fruit.length > 2);
console.log('긴 이름 과일:', longFruits);

// reduce를 사용한 집계
const totalLength = fruits.reduce((sum, fruit) => sum + fruit.length, 0);
console.log('전체 글자 수:', totalLength);

// 객체 배열 예시
const students = [
  { name: '김철수', grade: 85 },
  { name: '이영희', grade: 92 },
  { name: '박민수', grade: 78 }
];

const averageGrade = students.reduce((sum, student) => sum + student.grade, 0) / students.length;
console.log('평균 점수:', averageGrade.toFixed(2));

const topStudents = students.filter(student => student.grade >= 85);
console.log('우수 학생:', topStudents);
\`\`\`

## HTML 예시

간단한 HTML 구조를 만들어보세요!

\`\`\`html
<div style="max-width: 400px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white; text-align: center;">
  <h2 style="margin: 0 0 15px 0; font-size: 24px;">🎉 환영합니다!</h2>
  <p style="margin: 0 0 20px 0; opacity: 0.9;">이것은 실행 가능한 HTML 코드입니다.</p>
  
  <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
    <button onclick="alert('좋아요! 👍')" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: 2px solid white; color: white; border-radius: 25px; cursor: pointer; transition: all 0.3s;">
      좋아요
    </button>
    <button onclick="alert('감사합니다! 🙏')" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: 2px solid white; color: white; border-radius: 25px; cursor: pointer; transition: all 0.3s;">
      감사합니다
    </button>
  </div>
  
  <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
    <p style="margin: 0; font-size: 14px;">💡 버튼을 클릭해보세요!</p>
  </div>
</div>
\`\`\`

## CSS 예시

아름다운 CSS 애니메이션을 만들어보세요!

\`\`\`css
.example-box {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  border-radius: 50%;
  animation: gradientShift 3s ease infinite, bounce 2s ease infinite;
  margin: 20px auto;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  position: relative;
}

.example-box::before {
  content: '✨';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  animation: rotate 2s linear infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

h1 {
  color: #2c3e50;
  text-align: center;
  font-family: 'Arial', sans-serif;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

p {
  color: #34495e;
  line-height: 1.8;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 20px;
  padding: 0 20px;
}
\`\`\`

## 결론

인터랙티브 코드 블록을 통해 독자들이 직접 코드를 실행하고 결과를 확인할 수 있어 더욱 효과적인 학습이 가능합니다. 

- **즉시 피드백**: 코드 실행 결과를 바로 확인
- **실습 중심**: 이론과 실습의 결합
- **접근성**: 별도 환경 설정 없이 바로 실행

이런 방식으로 프로그래밍을 배우면 더욱 재미있고 효과적일 것입니다! 🚀`,
    author: 'daiboom',
    publishedAt: '2024-01-20',
    updatedAt: '2024-01-20',
    tags: ['JavaScript', 'HTML', 'CSS', 'Interactive', 'Learning'],
    category: 'Programming',
    slug: 'interactive-code-blocks',
    readTime: 6,
    featured: true,
  },
  {
    id: '5',
    title: 'JavaScript 기초 완벽 가이드',
    description:
      '실제 코드 예제와 함께 JavaScript의 기본 개념을 체계적으로 학습해보세요. 배열, 객체, 함수 등 핵심 개념을 단계별로 익힐 수 있습니다.',
    content: `# JavaScript 기초 완벽 가이드

JavaScript는 웹 개발의 핵심 언어입니다. 이 포스트에서는 실제 코드 예제와 함께 JavaScript의 기본 개념을 체계적으로 학습해보겠습니다.

## 1. 변수와 데이터 타입

JavaScript의 기본 데이터 타입들을 살펴보겠습니다.

\`\`\javascript
// let - 재할당 가능한 변수
let userName = '홍길동'
console.log('초기 이름:', userName)

userName = '김철수'
console.log('변경된 이름:', userName)

// const - 재할당 불가능한 상수
const userAge = 25
const birthYear = 1999
console.log('나이:', userAge)
console.log('출생년도:', birthYear)

// 데이터 타입 확인
console.log('이름 타입:', typeof userName) // string
console.log('나이 타입:', typeof userAge) // number

// 다양한 데이터 타입
const isStudent = true
const hobbies = ['독서', '영화감상', '프로그래밍']
const userInfo = {
  name: userName,
  age: userAge,
  isStudent: isStudent,
  hobbies: hobbies
}

console.log('학생 여부:', isStudent)
console.log('취미 목록:', hobbies)
console.log('사용자 정보:', userInfo)
\`\`\`

각 코드 예제를 브라우저 개발자 도구의 콘솔에서 실행해보세요!

## 2. 함수

함수는 재사용 가능한 코드 블록입니다.

\`\`\javascript
// 함수 선언 (Function Declaration)
function greet(name, time = '오늘') {
  return \`안녕하세요, \${name}님! \${time}은 어떠셨나요?\`
}

// 함수 호출
const morningGreeting = greet('이영희', '오늘 아침')
const eveningGreeting = greet('박민수') // 기본값 사용
console.log(morningGreeting)
console.log(eveningGreeting)

// 화살표 함수 (Arrow Function)
const add = (a, b) => a + b
const multiply = (a, b) => a * b
const calculate = (x, y, operation) => operation(x, y)

console.log('5 + 3 =', add(5, 3))
console.log('4 * 7 =', multiply(4, 7))
console.log('계산 결과:', calculate(10, 5, add))

// 함수를 객체의 메서드로 사용
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : '0으로 나눌 수 없습니다'
}

console.log('계산기 테스트:')
console.log('10 + 5 =', calculator.add(10, 5))
console.log('10 - 5 =', calculator.subtract(10, 5))
console.log('10 * 5 =', calculator.multiply(10, 5))
console.log('10 / 5 =', calculator.divide(10, 5))
console.log('10 / 0 =', calculator.divide(10, 0))
\`\`\`

## 3. 배열과 객체

배열과 객체는 JavaScript에서 데이터를 구조화하는 핵심 방법입니다.

\`\`\javascript
// 배열 조작
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log('원본 배열:', numbers)

// map: 각 요소를 변환
const doubled = numbers.map(n => n * 2)
console.log('2배한 배열:', doubled)

// filter: 조건에 맞는 요소만 필터링
const evenNumbers = numbers.filter(n => n % 2 === 0)
console.log('짝수만:', evenNumbers)

// reduce: 배열을 하나의 값으로 축약
const sum = numbers.reduce((total, n) => total + n, 0)
console.log('합계:', sum)

// 객체 다루기
const student = {
  name: '이영희',
  age: 30,
  city: '서울',
  hobbies: ['독서', '영화감상']
};
console.log('사람 정보:', person);
console.log('이름:', person.name);
console.log('취미:', person.hobbies);
\`\`\`

## 2. 배열 조작하기

배열의 다양한 메서드들을 사용해보겠습니다.

\`\`\`javascript
// 원본 배열
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('원본 배열:', numbers);

// map: 각 요소를 변환
const doubled = numbers.map(n => n * 2);
console.log('2배한 배열:', doubled);

// filter: 조건에 맞는 요소만 필터링
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('짝수만:', evenNumbers);

const oddNumbers = numbers.filter(n => n % 2 === 1);
console.log('홀수만:', oddNumbers);

// reduce: 배열을 하나의 값으로 축약
const sum = numbers.reduce((total, n) => total + n, 0);
console.log('합계:', sum);

const product = numbers.reduce((total, n) => total * n, 1);
console.log('곱셈:', product);

// find: 조건에 맞는 첫 번째 요소 찾기
const firstEven = numbers.find(n => n % 2 === 0);
console.log('첫 번째 짝수:', firstEven);

// some: 조건을 만족하는 요소가 있는지 확인
const hasEven = numbers.some(n => n % 2 === 0);
console.log('짝수가 있나요?', hasEven);

// every: 모든 요소가 조건을 만족하는지 확인
const allPositive = numbers.every(n => n > 0);
console.log('모든 수가 양수인가요?', allPositive);
\`\`\`

## 3. 객체와 함수

객체와 함수의 다양한 사용법을 알아보겠습니다.

\`\`\`javascript
// 함수 정의
function greet(name) {
  return \`안녕하세요, \${name}님!\`;
}

// 화살표 함수
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// 함수 사용
console.log(greet('박민수'));
console.log('5 + 3 =', add(5, 3));
console.log('4 * 7 =', multiply(4, 7));

// 객체와 메서드
const calculator = {
  add: function(a, b) {
    return a + b;
  },
  subtract: (a, b) => a - b,
  multiply(a, b) {
    return a * b;
  },
  divide: (a, b) => b !== 0 ? a / b : '0으로 나눌 수 없습니다'
};

console.log('계산기 테스트:');
console.log('10 + 5 =', calculator.add(10, 5));
console.log('10 - 5 =', calculator.subtract(10, 5));
console.log('10 * 5 =', calculator.multiply(10, 5));
console.log('10 / 5 =', calculator.divide(10, 5));
console.log('10 / 0 =', calculator.divide(10, 0));

// 고차 함수 (함수를 인자로 받는 함수)
function processArray(arr, operation) {
  return arr.map(operation);
}

const numbers = [1, 2, 3, 4, 5];
const squared = processArray(numbers, x => x * x);
const cubed = processArray(numbers, x => x * x * x);

console.log('원본:', numbers);
console.log('제곱:', squared);
console.log('세제곱:', cubed);
\`\`\`

## 4. 비동기 프로그래밍

Promise와 async/await를 사용한 비동기 처리 예제입니다.

\`\`\`javascript
// Promise를 사용한 비동기 함수
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(\`\${ms}ms 후에 완료되었습니다!\`);
    }, ms);
  });
}

// async/await 사용
async function asyncExample() {
  console.log('시작!');
  
  try {
    const result1 = await delay(1000);
    console.log('1단계:', result1);
    
    const result2 = await delay(500);
    console.log('2단계:', result2);
    
    const result3 = await delay(300);
    console.log('3단계:', result3);
    
    console.log('모든 작업 완료!');
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 비동기 함수 실행
asyncExample();

// Promise.all을 사용한 병렬 처리
async function parallelExample() {
  console.log('병렬 처리 시작!');
  
  const promises = [
    delay(1000),
    delay(800),
    delay(600)
  ];
  
  try {
    const results = await Promise.all(promises);
    console.log('병렬 처리 결과:', results);
  } catch (error) {
    console.error('병렬 처리 오류:', error);
  }
}

// 병렬 처리 실행
parallelExample();
\`\`\`

## 5. 실전 예제: 학생 성적 관리

배열과 객체를 활용한 실전 예제를 만들어보겠습니다.

\`\`\`javascript
// 학생 데이터
const students = [
  { name: '김철수', korean: 85, english: 92, math: 78 },
  { name: '이영희', korean: 95, english: 88, math: 92 },
  { name: '박민수', korean: 78, english: 85, math: 88 },
  { name: '최지영', korean: 92, english: 95, math: 85 },
  { name: '정수현', korean: 88, english: 78, math: 95 }
];

console.log('=== 학생 성적 관리 시스템 ===');
console.log('전체 학생 수:', students.length);

// 각 학생의 평균 점수 계산
const studentsWithAverage = students.map(student => {
  const average = (student.korean + student.english + student.math) / 3;
  return {
    ...student,
    average: Math.round(average * 10) / 10
  };
});

console.log('\\n=== 학생별 평균 점수 ===');
studentsWithAverage.forEach(student => {
  console.log(\`\${student.name}: \${student.average}점\`);
});

// 평균 점수 기준으로 정렬
const sortedStudents = studentsWithAverage.sort((a, b) => b.average - a.average);

console.log('\\n=== 평균 점수 순위 ===');
sortedStudents.forEach((student, index) => {
  console.log(\`\${index + 1}등: \${student.name} (\${student.average}점)\`);
});

// 전체 평균 계산
const totalAverage = studentsWithAverage.reduce((sum, student) => sum + student.average, 0) / students.length;
console.log('\\n전체 평균:', Math.round(totalAverage * 10) / 10);

// 90점 이상인 학생들
const topStudents = studentsWithAverage.filter(student => student.average >= 90);
console.log('\\n90점 이상 학생들:', topStudents.map(s => s.name));

// 과목별 평균
const subjectAverages = {
  korean: students.reduce((sum, s) => sum + s.korean, 0) / students.length,
  english: students.reduce((sum, s) => sum + s.english, 0) / students.length,
  math: students.reduce((sum, s) => sum + s.math, 0) / students.length
};

console.log('\\n=== 과목별 평균 ===');
console.log('국어:', Math.round(subjectAverages.korean * 10) / 10);
console.log('영어:', Math.round(subjectAverages.english * 10) / 10);
console.log('수학:', Math.round(subjectAverages.math * 10) / 10);
\`\`\`

## 6. HTML과 CSS 예제

간단한 HTML 구조와 CSS 스타일링을 만들어보겠습니다.

\`\`\`html
<div style="max-width: 500px; margin: 0 auto; padding: 20px; font-family: 'Arial', sans-serif;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
    <h1 style="margin: 0 0 10px 0; font-size: 28px;">🎓 JavaScript 학습</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 16px;">인터랙티브 코드러너로 배우는 프로그래밍</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <h3 style="color: #333; margin: 0 0 15px 0;">📚 학습 내용</h3>
    <ul style="margin: 0; padding-left: 20px; color: #555;">
      <li>변수와 데이터 타입</li>
      <li>배열 조작</li>
      <li>객체와 함수</li>
      <li>비동기 프로그래밍</li>
      <li>실전 예제</li>
    </ul>
  </div>
  
  <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
    <button onclick="alert('좋아요! 👍')" style="padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 14px; transition: all 0.3s;">
      👍 좋아요
    </button>
    <button onclick="alert('감사합니다! 🙏')" style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 14px; transition: all 0.3s;">
      🙏 감사합니다
    </button>
    <button onclick="alert('화이팅! 💪')" style="padding: 12px 24px; background: #ffc107; color: #333; border: none; border-radius: 25px; cursor: pointer; font-size: 14px; transition: all 0.3s;">
      💪 화이팅
    </button>
  </div>
</div>
\`\`\`

## 7. CSS 애니메이션 예제

아름다운 CSS 애니메이션을 만들어보겠습니다.

\`\`\`css
.learning-card {
  width: 200px;
  height: 150px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  border-radius: 20px;
  animation: gradientShift 4s ease infinite, float 3s ease-in-out infinite;
  margin: 20px auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.learning-card::before {
  content: '💻';
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  animation: rotate 2s linear infinite;
}

.learning-card::after {
  content: '✨';
  position: absolute;
  bottom: 15px;
  left: 15px;
  font-size: 20px;
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

h1 {
  color: #2c3e50;
  text-align: center;
  font-family: 'Arial', sans-serif;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  animation: fadeIn 2s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

p {
  color: #34495e;
  line-height: 1.8;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 20px;
  padding: 0 20px;
  animation: slideIn 1.5s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
\`\`\`

## 결론

인터랙티브 코드러너를 통해 JavaScript의 핵심 개념들을 실제로 실행해보며 학습했습니다. 

### 🎯 학습한 내용:
- **변수와 데이터 타입**: Number, String, Boolean, Array, Object
- **배열 메서드**: map, filter, reduce, find, some, every
- **함수와 객체**: 함수 정의, 메서드, 고차 함수
- **비동기 프로그래밍**: Promise, async/await, Promise.all
- **실전 예제**: 학생 성적 관리 시스템
- **HTML/CSS**: 구조와 스타일링, 애니메이션

### 💡 학습 팁:
1. **실행해보기**: 각 코드 블록을 실행하여 결과를 확인하세요
2. **수정해보기**: 코드를 수정하여 다른 결과를 만들어보세요
3. **이해하기**: 각 메서드와 개념의 동작 원리를 파악하세요
4. **응용하기**: 배운 내용을 바탕으로 새로운 코드를 작성해보세요

이런 방식으로 프로그래밍을 배우면 더욱 재미있고 효과적입니다! 🚀✨`,
    author: 'daiboom',
    publishedAt: '2024-01-25',
    updatedAt: '2024-01-25',
    tags: [
      'JavaScript',
      'Interactive',
      'Learning',
      'Programming',
      'CodeRunner',
    ],
    category: 'Programming',
    slug: 'interactive-javascript-basics',
    readTime: 15,
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

// 실제 사용할 포스트 데이터 (GitHub Contents API에서 로드)
export const getPosts = async (): Promise<BlogPost[]> => {
  if (typeof window === 'undefined') return samplePosts // SSR 시에는 샘플 데이터 반환

  try {
    // GitHub Contents API에서 포스트 로드
    const storedPosts = await HybridBlogStorage.getPosts()
    return storedPosts.length > 0 ? storedPosts : samplePosts
  } catch (error) {
    console.error('Failed to load posts:', error)
    return samplePosts
  }
}
