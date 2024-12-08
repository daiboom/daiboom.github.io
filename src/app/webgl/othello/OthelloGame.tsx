'use client'

import { useEffect, useState } from 'react'

type CellValue = null | 'black' | 'white'
type Board = CellValue[][]

interface GameState {
  board: Board
  currentPlayer: 'black' | 'white'
}

interface BoardProps {
  board: Board
  onCellClick: (row: number, col: number) => void
  validMoves: [number, number][]
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, validMoves }) => {
  return (
    <div className="grid grid-cols-8 gap-1 bg-green-800 p-2">
      {board.map((row, i) =>
        row.map((cell, j) => (
          <Cell
            key={`${i}-${j}`}
            value={cell}
            onClick={() => onCellClick(i, j)}
            isValidMove={validMoves.some(([r, c]) => r === i && c === j)}
          />
        ))
      )}
    </div>
  )
}

interface CellProps {
  value: CellValue
  onClick: () => void
  isValidMove: boolean
}

const Cell: React.FC<CellProps> = ({ value, onClick, isValidMove }) => {
  return (
    <div
      className={`w-16 h-16 bg-green-600 flex items-center justify-center cursor-pointer
        ${isValidMove ? 'hover:bg-green-500' : ''}`}
      onClick={onClick}
    >
      {value && (
        <div
          className={`w-14 h-14 rounded-full transition-all duration-300
          ${value === 'black' ? 'bg-black' : 'bg-white'}
          ${isValidMove ? 'opacity-20' : 'opacity-100'}`}
        />
      )}
      {isValidMove && !value && (
        <div className="w-14 h-14 rounded-full border-2 border-gray-400 opacity-50" />
      )}
    </div>
  )
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(8)
      .fill(null)
      .map(() => Array(8).fill(null)),
    currentPlayer: 'black',
  })
  const [validMoves, setValidMoves] = useState<[number, number][]>([])

  useEffect(() => {
    // 초기 보드 설정
    const initialBoard = gameState.board
    initialBoard[3][3] = 'white'
    initialBoard[3][4] = 'black'
    initialBoard[4][3] = 'black'
    initialBoard[4][4] = 'white'
    setGameState({ ...gameState, board: initialBoard })
    updateValidMoves()
  }, [])

  const updateValidMoves = () => {
    // 유효한 수 계산 로직
    const moves: [number, number][] = []
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (isValidMove(i, j)) {
          moves.push([i, j])
        }
      }
    }
    setValidMoves(moves)
  }

  const isValidMove = (row: number, col: number): boolean => {
    if (gameState.board[row][col] !== null) return false
    // 유효한 수 확인 로직 구현
    return true
  }

  const handleCellClick = (row: number, col: number) => {
    if (!isValidMove(row, col)) return

    const newBoard = [...gameState.board.map((row) => [...row])]
    newBoard[row][col] = gameState.currentPlayer

    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
    })

    updateValidMoves()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-8">오델로</h1>
      <Board
        board={gameState.board}
        onCellClick={handleCellClick}
        validMoves={validMoves}
      />
      <div className="mt-4 text-white">
        현재 차례: {gameState.currentPlayer}
      </div>
    </div>
  )
}

export default Game
