import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
export default function BingoBoard() {
  const [isComplete, setComplete] = useState(false)
  const [minMs] = useState(1000)
  const [maxMs] = useState(2000)
  const minWidth = 375
  const squareCount = 3
  const padding = 8
  const squareWidth = minWidth - squareCount - padding * 2

  const mss = useMemo(
    () =>
      _.reduce(
        Array.from({ length: 8 }),
        (prev, _, i) => [...prev, prev[i] + Math.floor((maxMs - minMs) / 8)],
        [minMs]
      ).sort(() => (Math.random() > 0.5 ? 1 : -1)),
    [minMs, maxMs]
  )

  const LazyCell = ({ BeforeComponent, AfterComponent, ms = 1000 }) => {
    useEffect(() => {
      if (ms === 0) {
        setComplete(true)
      } else if (!!ms) {
        setTimeout(() => {
          setComplete(true)
        }, ms)
      }
    }, [ms])

    const CallBack = useCallback(() => {
      if (isComplete) {
        return AfterComponent
      } else {
        return BeforeComponent
      }
    }, [AfterComponent, BeforeComponent, isComplete])

    return <CallBack />
  }

  const styles = {
    wrapper: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      userSelect: 'none',
      overflow: 'hidden',
      margin: '0 auto',
    },
    screenshot: {
      padding: '7.5px',
      backgroundColor: '#fff',
    },
    board: {
      display: 'flex',
      flexWrap: 'wrap',
      width: `${squareWidth}px`,
      border: '5px solid #191919',
      borderRadius: '2.5rem',
      overflow: 'hidden',
    },
    cell: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#e6e6e6',
      margin: '0px',
      width: `calc(100% / ${squareCount})`,
      height: `${(squareWidth - 10) / squareCount}px`,
      position: 'relative',
      textAlign: 'center',
      flexDirection: 'column',
    },
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.screenshot}>
        <div style={styles.board}>
          {Array.from({ length: 9 }).map((_, i) => (
            <LazyCell
              key={i}
              ms={1000 + i * 100}
              BeforeComponent={
                <img
                  style={{
                    ...styles.cell,
                    borderWidth: `0px ${
                      (i + 1) % squareCount > 0 ? 1 : 0
                    }px 1px 0px`,
                  }}
                  src={`/assets/bingo/images/change_bingoboard${i + 1}.gif`}
                  alt="bingo animation"
                />
              }
              AfterComponent={
                <div
                  style={{
                    ...styles.cell,
                    borderWidth: `0px ${
                      (i + 1) % squareCount > 0 ? 1 : 0
                    }px 1px 0px`,
                  }}
                >
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={`/assets/bingo/images/fish_default${i + 1}.jpg`}
                    alt="bingo cell"
                  />
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
