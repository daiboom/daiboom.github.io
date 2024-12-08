'use client'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'

interface RouletteItem {
  value: number
  image: string
  text: string
}

interface RouletteOption {
  border: boolean
  center: boolean
  correctionOffset: number
  cycleDuration: number
  cycleTime: number
  clockwise: boolean
}

/**
 * @interface RouletteOption
 * @type {Object}
 * @param {boolean} border - 렌더링시 룰렛 아이템의 경계선에서 시작할지 여부. 이 값이 true이면 center의 값은 무시됩니다.
 * @param {boolean} center - 렌더링시 룰렛 아이템의 센터에서부터 시작 여부
 * @param {boolean} clockwise - 시계 방향 여부
 * @param {number} correctionOffset - 0~1 값을 가집니다. 경계선에 멈출 경우 난해한 경우가 생깁니다. 이를 피하기 위해 셀 사이 경계값을 설정합니다. 0은 각 룰렛 아이템의 센터로 멈추며, 1로 가까울 수록 룰렛 아이템 경계선에 멈출 수 있습니다.
 * @param {number} cycleDuration - 몇 초 동안 돌건지 입력하세요.
 * @param {number} cycleTime - 몇 바퀴 돌건지에 대한 세팅값. 한 바퀴 돌릴거면 1로 입력하세요.
 */

const defaultOption: RouletteOption = {
  border: true,
  center: true,
  correctionOffset: 0.8,
  cycleDuration: 5000,
  cycleTime: 10,
  clockwise: true,
}

interface RouletteWheelProps {
  items: RouletteItem[]
  current: number
  count: number
  option?: RouletteOption
  onWheelStart?: Function
  onWheelEnd?: Function
  rouletteOuterStyle?: CSSProperties
  rouletteBorderStyle?: CSSProperties
  roulettePinStyle?: CSSProperties
  rouletteInnerStyle?: CSSProperties
  rouletteCenterStyle?: CSSProperties
}

type RouletteWheelFC = (props: RouletteWheelProps) => JSX.Element

const Roulette2dWheel: RouletteWheelFC = ({
  items: propItems,
  current: propCurrent,
  count: propCount,
  option: propOption = {},
  onWheelStart,
  onWheelEnd,
  rouletteOuterStyle,
  rouletteBorderStyle,
  roulettePinStyle,
  rouletteInnerStyle,
  rouletteCenterStyle,
}) => {
  const [option] = useState({ ...defaultOption, ...propOption })
  const [items, setItems] = useState(propItems)
  const [current, setCurrent] = useState(propCurrent)
  const [count, setCount] = useState(propCount)
  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([])

  useEffect(() => {
    setItems(propItems)
  }, [propItems])

  useEffect(() => {
    setCurrent(propCurrent)
  }, [propCurrent])

  useEffect(() => {
    setCount(propCount)
  }, [propCount])

  const segment = useMemo(() => 360 / items.length, [items])
  const offset = useMemo(() => segment / 2, [segment])
  const angle = useMemo(() => {
    const _current = option.clockwise ? items.length - current : current
    const temp = _current * segment

    let randomOffset = Math.floor(Math.random() * segment) - offset - 1
    let currentOffset: number
    if (
      randomOffset >= offset * option.correctionOffset ||
      randomOffset <= offset * -1 * option.correctionOffset
    ) {
      currentOffset = offset * option.correctionOffset
    } else {
      currentOffset = randomOffset
    }

    const cycle = count * 360 * option.cycleTime
    const degree = temp + cycle
    const cycleDegree =
      option.border && count === 0
        ? offset
        : option.center
        ? degree
        : degree + randomOffset

    return option.clockwise ? cycleDegree : cycleDegree * -1
  }, [current, segment, count])

  const styles: { [key: string]: CSSProperties } = {
    //룰렛
    rouletteOuter: {
      width: '100%',
      position: 'relative',
      marginTop: '48px',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: '30px',
      ...rouletteOuterStyle,
    },
    rouletteBorder: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      paddingBottom: '100%',
      margin: '0 auto',
      backgroundImage: `url(/assets/roulette/roulette-border.png)`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      ...rouletteBorderStyle,
    },
    roulette: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      margin: '0 auto',
      borderRadius: '50%',
      transition: `transform ${
        option.cycleDuration / 1000
      }s cubic-bezier(0.42, 0.96, 0.68, 1.005)`,
      overflow: 'hidden',
    },
    roulettePin: {
      position: 'absolute',
      transform: 'translate(-50%, -47%)',
      top: 0,
      left: '50%',
      paddingBottom: 'calc(100% / 5.59)',
      width: 'calc(100% / 5.59)',
      backgroundImage: `url(/assets/roulette/roulette-pin.png)`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      zIndex: 2,
      ...roulettePinStyle,
    },

    rouletteInner: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      // boxShadow: '0px 15px 18px 0px rgba(0,0,0,0.2)',
      borderRadius: 'full',
      ...rouletteInnerStyle,
    },
    rouletteCenter: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'calc(100% / 3.58)',
      height: 'calc(100% / 3.58)',
      zIndex: 1,
      backgroundImage: `url(/assets/roulette/roulette-center.png)`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      ...rouletteCenterStyle,
    },
    itemWrapper: { overflow: 'hidden' },
    item: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
    line: {
      position: 'absolute',
      top: '0',
      bottom: '50%',
      left: '50%',
      width: '2px',
      marginLeft: '-1px',
      background: 'rgba(0,0,0,0.05)',
      transformOrigin: 'bottom',
    },
  }

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
    }, option.cycleDuration)

    setTimeoutIds([...timeoutIds, timeoutId])
  }

  const rouletteStyle = useMemo(() => {
    return {
      ...styles.roulette,
      transform: `rotate(${angle}deg)`,
    }
  }, [angle])

  const itemStyles = useMemo(() => {
    return items.map((_, index) => {
      return {
        ...styles.item,
        transform: 'rotate(' + segment * index + 'deg)',
      }
    })
  }, [items])

  const borderLineStyles = useMemo(() => {
    return items.map((_, index) => {
      return {
        ...styles.item,
        transform: 'rotate(' + (segment * index + offset) + 'deg)',
      }
    })
  }, [items])

  useEffect(() => {
    if (count !== 0) {
      onWheelStart && onWheelStart()
      onWheelEnd && onWheelEndHandler()
    }
  }, [count])
  return (
    <>
      <div style={styles.rouletteOuter}>
        <div style={styles.roulettePin} />
        <div style={styles.rouletteInner}>
          <div style={styles.rouletteBorder} />
          <div style={styles.rouletteCenter} />
          <div style={rouletteStyle}>
            <div style={styles.itemWrapper}>
              {items.map((item, index) => {
                return (
                  <div key={item.value} style={itemStyles[index]}>
                    <img src={item.image} alt={''} />
                  </div>
                )
              })}
            </div>
            <div style={styles.lineWrapper}>
              {items.map((item, index) => {
                return <div key={item.value} style={borderLineStyles[index]} />
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Roulette2dWheel
