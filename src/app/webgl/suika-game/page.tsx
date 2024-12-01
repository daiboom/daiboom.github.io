'use client'

import { SuikaGame } from '@/app/webgl/suika-game/suika'
import { useEffect, useRef } from 'react'

export default function Page() {
  const appRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<SuikaGame | null>(null)

  useEffect(() => {
    if (
      appRef.current &&
      appRef.current.children[0]?.constructor.name !== 'HTMLCanvasElement'
    ) {
      gameRef.current = new SuikaGame(appRef.current)
      console.log('gameRef ===>', gameRef)
      console.log('appRef ===>', appRef)
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy()
      }
    }
  }, [])

  return <div ref={appRef} id="app" />
}
