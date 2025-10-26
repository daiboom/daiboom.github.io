import React from 'react'

const RouletteWheelRing: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="50"
      cy="50"
      r="49"
      fill="none"
      stroke="url(#borderGradient)"
      strokeWidth="2"
    />
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24
      const rad = (angle * Math.PI) / 180
      const x = 50 + 49 * Math.cos(rad - Math.PI / 2)
      const y = 50 + 49 * Math.sin(rad - Math.PI / 2)
      const colorIndex = i % 3
      const colors = ['#FF8C00', '#32CD32', '#4169E1']
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="0.8"
          fill={colors[colorIndex]}
          opacity="1"
        />
      )
    })}
    <defs>
      <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#32CD32" />
        <stop offset="100%" stopColor="#4169E1" />
      </linearGradient>
    </defs>
  </svg>
)

RouletteWheelRing.displayName = 'RouletteWheelRing'
export default RouletteWheelRing
