import React from 'react'

const RouletteWheelPivot: React.FC = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 메인 원 */}
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="url(#pivotGradient)"
      stroke="#FF6B6B"
      strokeWidth="2"
    />

    {/* 텍스트 */}
    <text
      x="50"
      y="55"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="35"
      fontWeight="bold"
      fill="white"
      style={
        {
          // textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
        }
      }
    >
      🍀
    </text>

    <defs>
      <radialGradient id="pivotGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#32CD32" />
        <stop offset="100%" stopColor="#4169E1" />
      </radialGradient>
    </defs>
  </svg>
)

RouletteWheelPivot.displayName = 'RouletteWheelPivot'
export default RouletteWheelPivot
