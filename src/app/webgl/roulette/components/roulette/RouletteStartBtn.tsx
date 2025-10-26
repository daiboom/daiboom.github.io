'use client'

import { useCallback, useState } from 'react'

interface RouletteStartBtnProps {
  isDone?: boolean
  isDisabled?: boolean
  isStartDimmed?: boolean
  onClick?: () => void
  className?: string
  label?: string
}

const RouletteStartBtn: React.FC<RouletteStartBtnProps> = ({
  onClick,
  isDisabled,
  isDone,
  isStartDimmed,
  className = '',
  label = '룰렛 돌리기',
}) => {
  const [effect, setEffect] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  )

  const onClickHandler = useCallback(() => {
    if (debounceTimer) return

    if (onClick) {
      onClick()
    }
    if (!isDisabled && effect !== true) {
      setEffect(true)
      setTimeout(() => {
        setEffect(false)
      }, 700)
    }

    const timer = setTimeout(() => {
      setDebounceTimer(null)
    }, 3000)
    setDebounceTimer(timer)
  }, [onClick, isDisabled, effect, debounceTimer])

  const getButtonStyles = () => {
    if (isDone) return 'bg-gray-500 cursor-not-allowed'
    if (isStartDimmed) return 'bg-gray-400'
    if (isPressed)
      return 'bg-gradient-to-r from-orange-600 via-green-600 to-blue-600'
    return 'bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 hover:from-orange-600 hover:via-green-600 hover:to-blue-600'
  }

  return (
    <div
      className={`relative mt-[41px] flex flex-col items-center ${className}`}
    >
      <button
        disabled={isDisabled}
        onClick={onClickHandler}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        className={`
          relative w-[261px] h-[58px] rounded-full
          text-white text-xl font-bold
          shadow-lg transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${getButtonStyles()}
        `}
        aria-label="룰렛돌리기 버튼"
      >
        {/* Button Text */}
        <span className="relative z-10 drop-shadow-lg">{label}</span>

        {/* Particle Effect */}
        {effect && (
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-orange-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 30}deg) translateY(-40px)`,
                  animation: `particle 0.8s cubic-bezier(0.33, 1, 0.68, 1) forwards ${
                    i * 0.05
                  }s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Shine Effect */}
        {!isDisabled && !isDone && !isStartDimmed && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                animation: 'shine 2s infinite',
                transform: 'translateX(-100%)',
              }}
            />
          </div>
        )}
      </button>

      <style jsx>{`
        @keyframes particle {
          0% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateY(-40px) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--rotation)) translateY(-80px) scale(0);
          }
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  )
}

export default RouletteStartBtn
