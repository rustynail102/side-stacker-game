export enum WinDirection {
  Horizontal,
  Vertical,
  Diagonal,
  ReverseDiagonal,
}

export interface GameBoardCellProps {
  cell: "X" | "O" | "empty"
  isLoading?: boolean
  isNextPossibleMove?: boolean
  isWinningCell?: boolean
  nextMoveType?: "X" | "O"
  onClick?: () => void
  winDirection?: WinDirection
}
