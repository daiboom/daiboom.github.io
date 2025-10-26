'use client'

import React from 'react'
import { RouletteItem } from './types'

export interface RouletteSegmentProps<T extends RouletteItem = RouletteItem> {
  item: T
  index: number
  style: React.CSSProperties
  totalItems: number
  segmentAngle: number
  startAngle: number
  endAngle: number
  radius: number
  centerX: number
  centerY: number
}

function RouletteWheelSegment<T extends RouletteItem = RouletteItem>({
  item,
  index,
  style,
  totalItems,
  segmentAngle,
  startAngle,
  endAngle,
  radius,
  centerX,
  centerY,
}: RouletteSegmentProps<T>) {
  // 각 세그먼트의 그라디언트 색상 정의 (진한 색상에서 밝은 색상으로)
  const gradientColors = [
    ['#FF4444', '#FF8888'], // 진한 빨간색 → 밝은 빨간색
    ['#00B4B4', '#44DDDD'], // 진한 청록색 → 밝은 청록색
    ['#0066CC', '#4488FF'], // 진한 파란색 → 밝은 파란색
    ['#00AA00', '#44DD44'], // 진한 초록색 → 밝은 초록색
    ['#FFAA00', '#FFCC44'], // 진한 주황색 → 밝은 주황색
    ['#AA44AA', '#CC88CC'], // 진한 보라색 → 밝은 보라색
    ['#00AA88', '#44DDAA'], // 진한 민트색 → 밝은 민트색
    ['#FF8800', '#FFAA44'], // 진한 황금색 → 밝은 황금색
    ['#8844CC', '#AA88DD'], // 진한 라벤더색 → 밝은 라벤더색
    ['#0066AA', '#4488CC'], // 진한 하늘색 → 밝은 하늘색
  ]

  const gradientId = `gradient-${index}`
  const colors = gradientColors[index % gradientColors.length]

  // 세그먼트의 실제 각도 계산 (0도부터 시작)
  const actualStartAngle = 0
  const actualEndAngle = segmentAngle

  // SVG path를 생성하는 함수
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    radius: number,
    centerX: number,
    centerY: number
  ) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return [
      'M',
      centerX,
      centerY,
      'L',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'Z',
    ].join(' ')
  }

  // 극좌표를 직교좌표로 변환
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  // 텍스트 위치 계산 (세그먼트 중앙, 더 바깥쪽)
  const textPosition = polarToCartesian(
    centerX,
    centerY,
    radius * 0.8, // 0.7에서 0.8로 변경하여 더 바깥쪽으로
    segmentAngle / 2
  )

  // 텍스트 각도 계산 (읽기 쉽도록 조정)
  const baseAngle = segmentAngle / 2
  // 텍스트가 너무 기울어지지 않도록 각도 조정
  const textAngle =
    baseAngle > 90 && baseAngle < 270 ? baseAngle + 180 : baseAngle

  // 세그먼트의 중심점 계산 (그라디언트 중심용)
  const segmentCenter = polarToCartesian(
    centerX,
    centerY,
    radius * 0.2, // 중심에서 더 가까운 지점
    segmentAngle / 2
  )

  // 세그먼트의 바깥쪽 끝점 계산 (그라디언트 끝점용)
  const segmentOuter = polarToCartesian(
    centerX,
    centerY,
    radius * 0.9, // 바깥쪽 끝점
    segmentAngle / 2
  )

  return (
    <div className="absolute inset-0" style={style}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="absolute inset-0"
        style={{ transformOrigin: 'center' }}
      >
        {/* 세그먼트 배경 */}
        <path
          d={createArcPath(
            actualStartAngle,
            actualEndAngle,
            radius,
            centerX,
            centerY
          )}
          fill={`url(#${gradientId})`}
          stroke="none"
        />

        {/* 아이콘과 텍스트 컨테이너 */}
        <g
          transform={`rotate(${textAngle}, ${textPosition.x}, ${textPosition.y})`}
        >
          {/* 아이콘 */}
          <text
            x={textPosition.x}
            y={textPosition.y + 3}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            className="select-none"
          >
            {(item as any).icon || '🎯'}
          </text>

          {/* 텍스트 */}
          <text
            x={textPosition.x}
            y={textPosition.y + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="5"
            fontWeight="bold"
            className="select-none"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {item.text}
          </text>
        </g>

        {/* 그라디언트 정의 */}
        <defs>
          <linearGradient
            id={gradientId}
            x1={`${segmentCenter.x}%`}
            y1={`${segmentCenter.y}%`}
            x2={`${segmentOuter.x}%`}
            y2={`${segmentOuter.y}%`}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default RouletteWheelSegment
export { RouletteWheelSegment }
