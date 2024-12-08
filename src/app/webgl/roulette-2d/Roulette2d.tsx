'use client'

import Roulette2dWheel from '@/app/webgl/roulette-2d/Roulette2dWheel'
import { useCallback, useState } from 'react'

export default function Roulette2d() {
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const items = [
    {
      value: 0,
      type: 'fishing-150',
      image: '/assets/roulette/2-1@3x.png',
      text: '피싱코인*150%',
    },
    {
      value: 1,
      type: 'fishing-200',
      image: '/assets/roulette/2-2@3x.png',
      text: '피싱코인*200%',
    },
    {
      value: 2,
      type: 'fishing-1000',
      image: '/assets/roulette/2-3@3x.png',
      text: '피싱코인*1000%',
    },
    {
      value: 3,
      type: 'shopping-150',
      image: '/assets/roulette/2-4@3x.png',
      text: '쇼핑코인*150%',
    },
    {
      value: 4,
      type: 'shopping-200',
      image: '/assets/roulette/2-5@3x.png',
      text: '쇼핑코인*200%',
    },
    {
      value: 5,
      type: 'shopping-1000',
      image: '/assets/roulette/2-6@3x.png',
      text: '쇼핑코인*1000%',
    },
  ]

  const handleStart = useCallback(() => {
    if (!isSpinning) {
      setIsSpinning(true)
      const randomIndex = Math.floor(Math.random() * items.length)
      setCurrent(randomIndex)
      setCount((prev) => prev + 1)
    }
  }, [isSpinning, items.length])

  const handleEnd = useCallback(() => {
    setIsSpinning(false)
    setSelectedItem(items[current])
  }, [current, items])

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
    },
    button: {
      padding: '15px 30px',
      fontSize: '16px',
      borderRadius: '999px',
      border: 'none',
      background: '#191919',
      color: '#fff',
      cursor: 'pointer',
      marginTop: '20px',
    },
    result: {
      marginTop: '20px',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  }

  return (
    <div style={styles.container}>
      <Roulette2dWheel
        items={items}
        current={current}
        count={count}
        onWheelStart={() => setIsSpinning(true)}
        onWheelEnd={handleEnd}
        option={{
          cycleDuration: 5000,
          cycleTime: 5,
          clockwise: true,
          border: true,
          center: true,
          correctionOffset: 0.8,
        }}
      />

      <button style={styles.button} onClick={handleStart} disabled={isSpinning}>
        {isSpinning ? '룰렛 돌아가는 중...' : '룰렛 돌리기'}
      </button>

      {selectedItem && !isSpinning && (
        <div style={styles.result}>🎉 당첨: {selectedItem.text}</div>
      )}
    </div>
  )
}
