import React from 'react'
import { RouletteSegmentProps } from './RouletteWheelSegment'

// 기본 필수 속성
export interface RouletteItem {
  value: string | number
  text: string
}

export interface RouletteOption {
  border?: boolean
  center?: boolean
  correctionOffset?: number
  cycleDuration?: number
  cycleTime?: number
  clockwise?: boolean
}

const defaultOption: Required<RouletteOption> = {
  border: true,
  center: true,
  correctionOffset: 0.8,
  cycleDuration: 5000,
  cycleTime: 10,
  clockwise: true,
}

// 제네릭을 사용하여 확장 가능한 Props
export interface RouletteWheelProps<T extends RouletteItem = RouletteItem> {
  items: T[]
  current: number
  count: number
  option?: RouletteOption
  onWheelStart?: () => void
  onWheelEnd?: () => void
  className?: string
  // SVG 컴포넌트
  WheelPinComponent?: React.ComponentType
  WheelRingComponent?: React.ComponentType
  WheelPivotComponent?: React.ComponentType
  WheelSegmentComponent?:
    | React.ComponentType<RouletteSegmentProps<T>>
    | ((props: RouletteSegmentProps<T>) => React.ReactNode)
  // 세그먼트 설정
  segmentConfig?: any
  // 커스텀 아이템 렌더러 (deprecated - WheelSegmentComponent 사용 권장)
  renderItem?: (item: T, index: number) => React.ReactNode
}

export { defaultOption }
