// BadukWithVictory.ts
import { Baduk } from './Baduk'
import { DIRECTIONS, KOMI } from './constants'
import { Board, Player, Score, Territory } from './types'

export class BadukWithVictory {
  constructor(private baduk: Baduk) {}

  private calculateTerritory(): Territory {
    const visited = new Set<string>()
    const territory: Territory = { black: 0, white: 0, neutral: 0 }

    const dfs = (row: number, col: number): [string, number[][]] => {
      const stack: [number, number][] = [[row, col]]
      const localTerritory: number[][] = []
      let territoryColor: string | null = null

      while (stack.length > 0) {
        const [r, c] = stack.pop()!
        const pos = `${r},${c}`

        if (visited.has(pos) || !this.baduk.isValidPosition(r, c)) continue

        visited.add(pos)
        const board = this.baduk.getBoard()
        const currentCell = board[r][c]

        if (currentCell !== null) {
          if (territoryColor === null) {
            territoryColor = currentCell
          } else if (territoryColor !== currentCell) {
            return ['neutral', []]
          }
        } else {
          localTerritory.push([r, c])
          for (const [dr, dc] of DIRECTIONS) {
            stack.push([r + dr, c + dc])
          }
        }
      }

      return [territoryColor || 'neutral', localTerritory]
    }

    const board = this.baduk.getBoard()
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        const pos = `${row},${col}`
        if (!visited.has(pos) && board[row][col] === null) {
          const [color, localTerritory] = dfs(row, col)
          territory[color as keyof Territory] += localTerritory.length
        }
      }
    }

    return territory
  }

  public calculateScore(): Score {
    const territory = this.calculateTerritory()
    const capturedStones = this.baduk.getCapturedStones()

    return {
      black: territory.black + capturedStones.black,
      white: territory.white + capturedStones.white + KOMI,
    }
  }

  public checkVictory(): Player | 'tie' {
    const scores = this.calculateScore()
    if (scores.black > scores.white) return 'black'
    if (scores.white > scores.black) return 'white'
    return 'tie'
  }

  public makeMoveWithVictoryCheck(
    row: number,
    col: number
  ): {
    board: Board
    winner: Player | 'tie' | null
  } {
    if (this.baduk.makeMove(row, col)) {
      return {
        board: this.baduk.getBoard(),
        winner: this.checkVictory(),
      }
    }
    return {
      board: this.baduk.getBoard(),
      winner: null,
    }
  }
}
