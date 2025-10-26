'use client'

import { SuikaGame } from '@/app/webgl/suika-game/suika'
import { useEffect, useRef, useState } from 'react'

export default function Page() {
  const appRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<SuikaGame | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    if (
      appRef.current &&
      appRef.current.children[0]?.constructor.name !== 'HTMLCanvasElement'
    ) {
      gameRef.current = new SuikaGame(appRef.current)
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-800">
          🍉 수박 만들기 게임 🍉
        </h1>

        <div className="flex justify-center mb-8">
          <div ref={appRef} id="app" />
        </div>

        {showInstructions && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">게임 방법</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-lg">목표</h3>
                  <p>
                    같은 과일들을 합쳐서 더 큰 과일을 만들어 최종 목표인 수박을
                    만드세요!
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">⌨️</span>
                <div>
                  <h3 className="font-semibold text-lg">조작 방법</h3>
                  <p>
                    <strong>A</strong>키: 왼쪽으로 이동
                    <br />
                    <strong>S</strong>키: 과일 떨어뜨리기
                    <br />
                    <strong>D</strong>키: 오른쪽으로 이동
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">🍒</span>
                <div>
                  <h3 className="font-semibold text-lg">과일 순서</h3>
                  <p>
                    체리 → 딸기 → 포도 → 귤 → 오렌지 → 사과 → 배 → 복숭아 →
                    파인애플 → 멜론 → 수박
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-lg">주의사항</h3>
                  <p>
                    과일이 상단 라인을 넘어가면 게임이 끝납니다. 신중하게
                    배치하세요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showInstructions && (
          <div className="text-center">
            <button
              onClick={() => setShowInstructions(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📖 게임 방법 보기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
