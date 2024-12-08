export interface Move {
  row: number
  col: number
  player: 'black' | 'white'
  captured: number
}

export interface Territory {
  black: number
  white: number
  neutral: number
}

export interface Score {
  black: number
  white: number
}

export type Player = 'black' | 'white'
export type Board = (Player | null)[][]
