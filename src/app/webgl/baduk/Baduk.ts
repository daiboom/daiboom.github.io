import { DIRECTIONS } from './constants'
import { Board, Move, Player } from './types'

export class Baduk {
  private board: Board
  private currentPlayer: Player
  private size: number
  private moveHistory: Move[]
  private capturedStones: Record<Player, number>

  constructor(size: number = 19) {
    this.size = size
    this.board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null))
    this.currentPlayer = 'black'
    this.moveHistory = []
    this.capturedStones = { black: 0, white: 0 }
  }

  public makeMove(row: number, col: number): boolean {
    if (!this.isValidPosition(row, col) || this.board[row][col] !== null) {
      return false
    }

    this.board[row][col] = this.currentPlayer
    const capturedCount = this.checkCapture(row, col)

    this.moveHistory.push({
      row,
      col,
      player: this.currentPlayer,
      captured: capturedCount,
    })

    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black'
    return true
  }

  public isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size
  }

  private checkCapture(row: number, col: number): number {
    let capturedCount = 0
    const opponent: Player = this.currentPlayer === 'black' ? 'white' : 'black'

    for (const [dx, dy] of DIRECTIONS) {
      const newRow = row + dx
      const newCol = col + dy

      if (
        this.isValidPosition(newRow, newCol) &&
        this.board[newRow][newCol] === opponent
      ) {
        const captured = this.captureGroup(newRow, newCol)
        if (captured > 0) {
          capturedCount += captured
          this.capturedStones[this.currentPlayer] += captured
        }
      }
    }
    return capturedCount
  }

  private captureGroup(row: number, col: number): number {
    const visited = new Set<string>()
    const group = new Set<string>()
    const color = this.board[row][col]

    const hasLiberty = this.findGroup(row, col, color, visited, group)

    if (!hasLiberty) {
      for (const pos of group) {
        const [r, c] = pos.split(',').map(Number)
        this.board[r][c] = null
      }
      return group.size
    }
    return 0
  }

  private findGroup(
    row: number,
    col: number,
    color: Player | null,
    visited: Set<string>,
    group: Set<string>
  ): boolean {
    const pos = `${row},${col}`
    if (visited.has(pos)) return false
    visited.add(pos)

    if (!this.isValidPosition(row, col)) return false
    if (this.board[row][col] === null) return true
    if (this.board[row][col] !== color) return false

    group.add(pos)

    return DIRECTIONS.some(([dx, dy]) =>
      this.findGroup(row + dx, col + dy, color, visited, group)
    )
  }

  public getBoard(): Board {
    return this.board
  }

  public getCurrentPlayer(): Player {
    return this.currentPlayer
  }

  public getCapturedStones(): Record<Player, number> {
    return { ...this.capturedStones }
  }

  public getMoveHistory(): Move[] {
    return [...this.moveHistory]
  }

  public undoLastMove(): boolean {
    if (this.moveHistory.length === 0) return false

    const lastMove = this.moveHistory.pop()!
    this.board[lastMove.row][lastMove.col] = null
    this.currentPlayer = lastMove.player

    if (lastMove.captured > 0) {
      this.capturedStones[lastMove.player] -= lastMove.captured
    }

    return true
  }
}
