---
title: 'JavaScript 기초 완벽 가이드'
description: '실제 코드 예제와 함께 JavaScript의 기본 개념을 체계적으로 학습해보세요.'
author: 'daiboom'
date: '2024-01-22'
publishedAt: '2024-01-22'
updatedAt: '2024-01-22'
tags: ['JavaScript', 'Programming', 'Tutorial', 'Interactive']
category: 'Programming'
slug: 'interactive-javascript-basics'
readTime: 15
featured: true
---

# JavaScript 기초 완벽 가이드

JavaScript는 웹 개발의 핵심 언어입니다. 이 포스트에서는 실제 코드 예제와 함께 JavaScript의 기본 개념을 체계적으로 학습해보겠습니다.

## 1. 변수와 데이터 타입

JavaScript에서는 `let`, `const`, `var`를 사용하여 변수를 선언할 수 있습니다.

```javascript
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
  hobbies: hobbies,
}

console.log('학생 여부:', isStudent)
console.log('취미 목록:', hobbies)
console.log('사용자 정보:', userInfo)
```

각 코드 예제를 브라우저 개발자 도구의 콘솔에서 실행해보세요!

## 2. 함수

함수는 재사용 가능한 코드 블록입니다.

```javascript
// 함수 선언 (Function Declaration)
function greet(name, time = '오늘') {
  return `안녕하세요, ${name}님! ${time}은 어떠셨나요?`
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
  divide: (a, b) => (b !== 0 ? a / b : '0으로 나눌 수 없습니다'),
}

console.log('계산기 테스트:')
console.log('10 + 5 =', calculator.add(10, 5))
console.log('10 - 5 =', calculator.subtract(10, 5))
console.log('10 * 5 =', calculator.multiply(10, 5))
console.log('10 / 5 =', calculator.divide(10, 5))
console.log('10 / 0 =', calculator.divide(10, 0))
```

## 3. 배열과 객체

```javascript
// 배열
const fruits = ['사과', '바나나', '오렌지']
console.log('첫 번째 과일:', fruits[0])
console.log('과일 개수:', fruits.length)

// 객체
const person = {
  name: '김민수',
  age: 30,
  city: '서울',
}

console.log('이름:', person.name)
console.log('나이:', person.age)
```

## 4. 조건문과 반복문

```javascript
// 조건문
const score = 85

if (score >= 90) {
  console.log('A등급')
} else if (score >= 80) {
  console.log('B등급')
} else if (score >= 70) {
  console.log('C등급')
} else {
  console.log('D등급')
}

// 반복문
const numbers = [1, 2, 3, 4, 5]
let sum = 0

for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i]
}

console.log('합계:', sum)
```

## 5. DOM 조작

```html
<div id="demo">안녕하세요!</div>
<button onclick="changeText()">텍스트 변경</button>

<script>
  function changeText() {
    const element = document.getElementById('demo')
    element.innerHTML = '텍스트가 변경되었습니다!'
    element.style.color = 'blue'
  }
</script>
```

## 6. 비동기 프로그래밍

```javascript
// Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('데이터를 성공적으로 가져왔습니다!')
    }, 2000)
  })
}

// async/await
async function getData() {
  try {
    console.log('데이터 로딩 중...')
    const data = await fetchData()
    console.log(data)
  } catch (error) {
    console.error('오류 발생:', error)
  }
}

getData()
```

## 7. 실전 예제: 간단한 계산기

```javascript
class Calculator {
  constructor() {
    this.result = 0
  }

  add(num) {
    this.result += num
    return this
  }

  subtract(num) {
    this.result -= num
    return this
  }

  multiply(num) {
    this.result *= num
    return this
  }

  divide(num) {
    if (num !== 0) {
      this.result /= num
    } else {
      console.log('0으로 나눌 수 없습니다!')
    }
    return this
  }

  getResult() {
    return this.result
  }
}

// 사용 예제
const calc = new Calculator()
const result = calc.add(10).multiply(2).subtract(5).getResult()
console.log('계산 결과:', result)
```

## 결론

JavaScript는 강력하고 유연한 언어입니다. 이 예제들을 통해 기본 개념을 익히고, 실제 프로젝트에서 활용해보세요. 계속해서 새로운 기능과 패턴을 학습하며 성장해나가시기 바랍니다!
