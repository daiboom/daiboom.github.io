'use client'

import {
  ExtendedRouletteItem,
  ROULETTE_ITEMS_DEFAULT,
  RouletteStartBtn,
  RouletteWheel,
} from '@/app/webgl/roulette/components/roulette'
import { useState } from 'react'

export default function RoulettePage() {
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningResult, setWinningResult] = useState<
    (typeof ROULETTE_ITEMS_DEFAULT)[0] | null
  >(null)

  const handleSpin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const randomIndex = Math.floor(
      Math.random() * ROULETTE_ITEMS_DEFAULT.length
    )
    setCurrent(randomIndex)
    setCount((prev) => prev + 1)
  }

  const handleWheelEnd = () => {
    const result = ROULETTE_ITEMS_DEFAULT[current]
    setWinningResult(result)
    setShowModal(true)
    setIsSpinning(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setWinningResult(null)
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
          🌊 트로피컬 룰렛 🌺
        </h1>
        <RouletteWheel<ExtendedRouletteItem>
          items={ROULETTE_ITEMS_DEFAULT}
          current={current}
          count={count}
          onWheelEnd={handleWheelEnd}
          option={{ border: false, center: true }}
        />
        <RouletteStartBtn onClick={handleSpin} isDisabled={isSpinning} />
      </div>

      {showModal && winningResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 max-w-lg mx-4 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                축하합니다!
              </h2>
              <p className="text-lg text-gray-600">당첨을 축하드립니다!</p>
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{winningResult.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-4">
                {winningResult.text}
              </div>
              <div
                className="inline-block px-6 py-3 rounded-full text-white font-bold text-lg"
                style={{ backgroundColor: winningResult.color }}
              >
                {winningResult.text.split('*')[0]}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="px-10 py-4 bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white font-bold rounded-full hover:from-orange-600 hover:via-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
