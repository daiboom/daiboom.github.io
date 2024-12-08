'use client'

import { Baduk } from '@/app/webgl/baduk/Baduk'
import { Move } from '@/app/webgl/baduk/types'
import { useEffect, useState } from 'react'
import styles from './BadukGame.module.css'

export default function BadukGame() {
  const [game, setGame] = useState<Baduk>()
  const [board, setBoard] = useState<('black' | 'white' | null)[][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black')
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 })
  const [moveHistory, setMoveHistory] = useState<Move[]>([])

  useEffect(() => {
    const baduk = new Baduk(2)
    setGame(baduk)
    setBoard(baduk.getBoard())
    setCurrentPlayer(baduk.getCurrentPlayer())
    setCapturedStones(baduk.getCapturedStones())
    setMoveHistory(baduk.getMoveHistory())
  }, [])

  const handleCellClick = (row: number, col: number) => {
    if (!game) return

    if (game.makeMove(row, col)) {
      setBoard([...game.getBoard()])
      setCurrentPlayer(game.getCurrentPlayer())
      setCapturedStones(game.getCapturedStones())
      setMoveHistory(game.getMoveHistory())
    }
  }

  const handleUndo = () => {
    if (!game) return

    if (game.undoLastMove()) {
      setBoard([...game.getBoard()])
      setCurrentPlayer(game.getCurrentPlayer())
      setCapturedStones(game.getCapturedStones())
      setMoveHistory(game.getMoveHistory())
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameInfo}>
        <div className={styles.status}>Current Player: {currentPlayer}</div>
        <div className={styles.captured}>
          <div>Black captured: {capturedStones.black}</div>
          <div>White captured: {capturedStones.white}</div>
        </div>
        <button className={styles.undoButton} onClick={handleUndo}>
          Undo
        </button>
      </div>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={styles.cell}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell && (
                  <div
                    className={`${styles.stone} ${
                      cell === 'black' ? styles.black : styles.white
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.history}>
        <h3>Move History</h3>
        <div className={styles.moves}>
          {moveHistory.map((move, index) => (
            <div key={index} className={styles.moveItem}>
              {index + 1}. {move.player} ({move.row}, {move.col})
              {move.captured > 0 && ` - Captured: ${move.captured}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
