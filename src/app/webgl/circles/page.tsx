'use client'

import { useEffect } from 'react'

// interface Data {
//   label: string
//   value: string | number
// }

// interface DataCircle extends Data, Circle {
//   x: number
//   y: number
//   id: string
//   index: number
// }

// interface Circle {
//   x: number
//   y: number
// }

interface Ellipse {
  cx: number
  cy: number
  rx: number
  ry: number
  rotation: number // 회전 각도 (degree)
}

class ThreeCircles {
  private context: CanvasRenderingContext2D | null = null
  private ellipse: Ellipse = {
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
    rotation: 0, // 기본 각도 0 (degree)
  }
  private angles: number[] = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3] // 0도, 120도, 240도에서 시작하는 각도 배열
  private animationId: number | null = null
  private isDragging = false
  private lastMousePosition: { x: number; y: number } | null = null

  // 최소, 최대 원의 반지름
  private minRadius = 5
  private maxRadius = 20

  constructor(private container: HTMLElement) {}

  animate() {
    if (!this.context || this.isDragging) return // 드래그 중일 때는 애니메이션 중지

    // 화면을 지우기
    this.context.clearRect(
      0,
      0,
      this.container.clientWidth,
      this.container.clientHeight
    )

    // 타원과 세 개의 서클 그리기
    this.drawEllipse()
    this.angles.forEach((angle, index) => {
      this.drawCircleOnEllipse(angle, index)
      this.angles[index] += 0.01 // 각도를 조금씩 변경 (속도 조절)
    })

    // 0도, 90도, 180도, 270도 표시
    this.drawAngleLabels()

    // 애니메이션 프레임 요청
    this.animationId = requestAnimationFrame(() => this.animate())
  }

  init() {
    console.log('Initialization completed')
    console.log(this.container.getBoundingClientRect())

    // 캔버스 생성 및 추가
    this.container.innerHTML = "<canvas id='ThreeCircles'></canvas>"
    const canvas =
      this.container.querySelector<HTMLCanvasElement>('#ThreeCircles')

    if (!canvas) {
      throw new Error('캔버스를 찾지 못하였습니다.')
    }

    // 캔버스 크기 설정 (스타일 크기와 렌더링 크기 모두 설정)
    const { width, height } = this.container.getBoundingClientRect()
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('캔버스 컨텍스트를 찾지 못하였습니다.')
    }

    this.context = context

    // 타원 궤도 크기 및 위치 설정
    this.ellipse = {
      cx: width / 2,
      cy: height / 2,
      rx: width / 4,
      ry: height / 4,
      rotation: 45, // 타원의 회전 각도 (degrees)
    }

    // 마우스 이벤트 추가
    this.addMouseListeners(canvas)

    // 애니메이션 시작
    this.animate()
  }

  // 타원 그리기 함수
  drawEllipse() {
    if (!this.context) return

    const { cx, cy, rx, ry, rotation } = this.ellipse

    // 회전 각도를 라디안으로 변환
    const rotationInRadians = (rotation * Math.PI) / 180

    // 회전 변환 저장
    this.context.save()

    // 타원의 중심점을 기준으로 회전
    this.context.translate(cx, cy) // 타원 중심점으로 이동
    this.context.rotate(rotationInRadians) // 타원 회전

    // 타원 그리기
    this.context.beginPath()
    this.context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    this.context.strokeStyle = 'blue' // 선 색상 설정
    this.context.lineWidth = 2 // 선 두께 설정
    this.context.stroke()

    // 변환을 이전 상태로 복구
    this.context.restore()
  }

  // 타원 위에 원을 그리기
  drawCircleOnEllipse(angle: number, index: number) {
    if (!this.context) return

    const { cx, cy, rx, ry, rotation } = this.ellipse

    // 타원의 중심을 기준으로 회전 각도 반영
    const rotationInRadians = (rotation * Math.PI) / 180

    // 각도에 따른 원의 위치 계산 (극 좌표계 변환)
    const x =
      cx +
      rx * Math.cos(angle) * Math.cos(rotationInRadians) -
      ry * Math.sin(angle) * Math.sin(rotationInRadians)
    const y =
      cy +
      rx * Math.cos(angle) * Math.sin(rotationInRadians) +
      ry * Math.sin(angle) * Math.cos(rotationInRadians)

    // 각도를 기반으로 원의 반지름 계산
    const radius = this.interpolateRadius(angle)

    // 원 그리기
    this.context.beginPath()
    this.context.arc(x, y, radius, 0, Math.PI * 2) // 보간된 반지름으로 원 그리기
    this.context.fillStyle = ['red', 'green', 'yellow'][index] // 각 원에 색상 설정
    this.context.fill()

    // 원의 위치 표시 (디버깅용)
    this.context.font = '12px Arial'
    this.context.fillStyle = 'black'
    this.context.fillText(`(${x.toFixed(2)}, ${y.toFixed(2)})`, x + 10, y)
  }

  // 각도에 따라 원의 크기를 보간하는 함수
  interpolateRadius(angle: number): number {
    // -1 ~ 1 사이의 값을 구하기 위해 cos 사용
    const scale = (Math.cos(angle) + 1) / 2 // 0 ~ 1 사이 값
    return this.minRadius + scale * (this.maxRadius - this.minRadius) // 크기를 보간
  }

  // 0도, 90도, 180도, 270도 각도 위치 표시
  drawAngleLabels() {
    if (!this.context) return

    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2] // 0도, 90도, 180도, 270도
    const labels = ['0°', '90°', '180°', '270°']
    const { cx, cy, rx, ry, rotation } = this.ellipse

    // 타원의 중심을 기준으로 회전 각도 반영
    const rotationInRadians = (rotation * Math.PI) / 180

    angles.forEach((angle, index) => {
      const x =
        cx +
        rx * Math.cos(angle) * Math.cos(rotationInRadians) -
        ry * Math.sin(angle) * Math.sin(rotationInRadians)
      const y =
        cy +
        rx * Math.cos(angle) * Math.sin(rotationInRadians) +
        ry * Math.sin(angle) * Math.cos(rotationInRadians)

      if (!this.context) {
        return
      }

      // 각도 위치에 텍스트 그리기
      this.context.font = '14px Arial'
      this.context.fillStyle = 'blue'
      this.context.fillText(labels[index], x, y)
    })
  }

  // 드래그 관련 마우스 이벤트 추가
  addMouseListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', (event) => this.onMouseDown(event))
    canvas.addEventListener('mousemove', (event) => this.onMouseMove(event))
    canvas.addEventListener('mouseup', () => this.onMouseUp())
    canvas.addEventListener('mouseleave', () => this.onMouseLeave())
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true
    this.lastMousePosition = { x: event.clientX, y: event.clientY }
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId) // 애니메이션 중지
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.lastMousePosition) return

    const dx = event.clientX - this.lastMousePosition.x // 마우스 이동 거리 (x축)
    // const dy = event.clientY - this.lastMousePosition.y // 마우스 이동 거리 (y축)

    // x축 드래그 시 각도를 변경하여 원을 움직임
    this.angles = this.angles.map((angle) => angle + dx * 0.005) // 작은 변화량으로 각도 조정

    // 현재 마우스 위치 저장
    this.lastMousePosition = { x: event.clientX, y: event.clientY }

    // 화면 다시 그리기
    this.context?.clearRect(
      0,
      0,
      this.container.clientWidth,
      this.container.clientHeight
    )
    this.drawEllipse()
    this.angles.forEach((angle, index) =>
      this.drawCircleOnEllipse(angle, index)
    )
    this.drawAngleLabels() // 각도 표시 다시 그리기
  }

  onMouseUp() {
    this.isDragging = false
    this.lastMousePosition = null
    this.animate() // 애니메이션 재개
  }

  onMouseLeave() {
    if (this.isDragging) {
      this.isDragging = false // 마우스가 캔버스를 벗어났을 때 드래그를 중지
      this.lastMousePosition = null
      this.animate() // 애니메이션 재개
    }
  }

  update() {}

  draw() {
    console.log('Drawing', this)
  }

  // 애니메이션 정지
  stopAnimation() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }
  }
}

export default function Page() {
  useEffect(() => {
    const app = document.querySelector('#app')

    if (app instanceof HTMLElement) {
      const threeCircles = new ThreeCircles(app)
      threeCircles.init()
      threeCircles.draw()
    } else {
      throw new Error('엘리먼트를 찾지 못하였습니다.')
    }
  }, [])

  return <div className="w-screen h-screen" id="app"></div>
}
