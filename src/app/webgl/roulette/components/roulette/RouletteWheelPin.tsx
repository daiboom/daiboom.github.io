import React from 'react'

const RouletteWheelPin: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: 'rotate(180deg)' }}
  >
    <path
      d="M50 5 L70 50 L50 45 L30 50 Z"
      fill="url(#pinGradient)"
      stroke="none"
    />
    <defs>
      <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#32CD32" />
        <stop offset="100%" stopColor="#4169E1" />
      </linearGradient>
    </defs>
  </svg>
)

RouletteWheelPin.displayName = 'RouletteWheelPin'
export default RouletteWheelPin
