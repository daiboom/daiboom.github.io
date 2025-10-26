'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { RouletteSegmentProps } from './RouletteWheelSegment'

import {
  RouletteWheelPin,
  RouletteWheelPivot,
  RouletteWheelRing,
  RouletteWheelSegment,
} from '@/app/webgl/roulette/components/roulette'
import { defaultOption } from '@/app/webgl/roulette/components/roulette/data'
import { RouletteItem, RouletteWheelProps } from './types'

function RouletteWheel<T extends RouletteItem = RouletteItem>({
  items,
  current,

  count,
  option = {},
  onWheelStart,
  onWheelEnd,
  className = '',
  WheelPinComponent = RouletteWheelPin,
  WheelRingComponent = RouletteWheelRing,
  WheelPivotComponent = RouletteWheelPivot,
  WheelSegmentComponent = RouletteWheelSegment,
}: RouletteWheelProps<T>) {
  const mergedOption = { ...defaultOption, ...option }
  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([])

  const segment = useMemo(() => 360 / items.length, [items])
  const offset = useMemo(() => segment / 2, [segment])
  const angle = useMemo(() => {
    const _current = mergedOption.clockwise ? items.length - current : current
    const temp = _current * segment

    const randomOffset = Math.floor(Math.random() * segment) - offset - 1
    let currentOffset: number
    if (
      randomOffset >= offset * mergedOption.correctionOffset ||
      randomOffset <= offset * -1 * mergedOption.correctionOffset
    ) {
      currentOffset = offset * mergedOption.correctionOffset
    } else {
      currentOffset = randomOffset
    }

    const cycle = count * 360 * mergedOption.cycleTime
    const degree = temp + cycle
    const cycleDegree =
      mergedOption.border && count === 0
        ? offset
        : mergedOption.center
        ? degree
        : degree + randomOffset

    // 첫 번째 세그먼트가 휠핀 정중앙에 오도록 조정
    const adjustedDegree = mergedOption.center
      ? cycleDegree - offset
      : cycleDegree

    return mergedOption.clockwise ? adjustedDegree : adjustedDegree * -1
  }, [current, segment, count, mergedOption, offset])

  useEffect(() => {
    return () => {
      clearTimeoutIds()
    }
  }, [])

  const clearTimeoutId = (timeoutId: NodeJS.Timeout) => {
    clearTimeout(timeoutId)
    setTimeoutIds(timeoutIds.filter((t) => t !== timeoutId))
  }

  const clearTimeoutIds = useCallback(() => {
    timeoutIds.forEach((t) => {
      clearTimeout(t)
    })
  }, [timeoutIds])

  const onWheelEndHandler = () => {
    const timeoutId = setTimeout(() => {
      clearTimeoutId(timeoutId)
      onWheelEnd && onWheelEnd()
    }, mergedOption.cycleDuration)

    setTimeoutIds([...timeoutIds, timeoutId])
  }

  const itemStyles = useMemo(() => {
    return items.map((_, index) => ({
      transform: 'rotate(' + segment * index + 'deg)',
    }))
  }, [items])

  const borderLineStyles = useMemo(() => {
    return items.map((_, index) => ({
      transform: 'rotate(' + (segment * index + offset) + 'deg)',
    }))
  }, [items])

  useEffect(() => {
    if (count !== 0) {
      onWheelStart && onWheelStart()
      onWheelEnd && onWheelEndHandler()
    }
  }, [count])

  return (
    <div className={`relative mt-12 mx-auto text-[30px] ${className}`}>
      {/* SVG Pin (Arrow) */}
      <div
        className="absolute z-[2] top-[-13%] left-1/2 w-[calc(100%/6)] pb-[calc(100%/5)]"
        style={{ transform: 'translate(-50%, 0%)' }}
      >
        <WheelPinComponent />
      </div>

      <div className="relative w-full overflow-hidden rounded-full shadow-[0px_15px_18px_0px_rgba(0,0,0,0.2)]">
        {/* SVG Border Ring */}
        <div className="relative z-[1] w-full pb-[100%] my-0 mx-auto">
          <WheelRingComponent />
        </div>

        {/* SVG Center */}
        <div
          className="absolute top-1/2 left-1/2 z-[1] w-[calc(100%/3.58)] h-[calc(100%/3.58)]"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <WheelPivotComponent />
        </div>

        {/* Roulette Items */}
        <div
          className="absolute top-0 left-0 right-0 bottom-0 my-0 mx-auto rounded-full overflow-hidden"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: `transform ${
              mergedOption.cycleDuration / 1000
            }s cubic-bezier(0.42, 0.96, 0.68, 1.005)`,
          }}
        >
          <div className="overflow-hidden">
            {items.map((item, index) => {
              const segmentAngle = 360 / items.length
              // 각 세그먼트는 0도부터 시작해서 segmentAngle만큼의 각도를 가짐
              const startAngle = 0
              const endAngle = segmentAngle
              // SVG viewBox가 0 0 100 100이므로 중심은 50, 50
              const radius = 50 // 뷰포트 크기에 맞게 조정
              const centerX = 50
              const centerY = 50

              const segmentProps: RouletteSegmentProps<T> = {
                item,
                index,
                style: itemStyles[index],
                totalItems: items.length,
                segmentAngle,
                startAngle,
                endAngle,
                radius,
                centerX,
                centerY,
              }

              const isFunctionComponent = (
                component: any
              ): component is (
                props: RouletteSegmentProps<T>
              ) => React.ReactNode => {
                return (
                  typeof component === 'function' &&
                  !component.prototype?.render
                )
              }

              return (
                <div key={String(item.value)}>
                  {isFunctionComponent(WheelSegmentComponent) ? (
                    WheelSegmentComponent(segmentProps)
                  ) : (
                    <WheelSegmentComponent {...segmentProps} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouletteWheel
