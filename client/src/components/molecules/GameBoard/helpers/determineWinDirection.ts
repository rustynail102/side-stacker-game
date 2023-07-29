import { WinDirection } from "@client/components/atoms/GameBoardCell/@types/GameBoardCell"

export const determineWinDirection = (
  winningMoves: number[][],
): WinDirection => {
  const [firstMove, secondMove] = winningMoves
  const rowDifference = secondMove[0] - firstMove[0]
  const colDifference = secondMove[1] - firstMove[1]

  if (rowDifference === 0) {
    return WinDirection.Horizontal
  } else if (colDifference === 0) {
    return WinDirection.Vertical
  } else if (rowDifference === colDifference) {
    return WinDirection.Diagonal
  } else {
    return WinDirection.ReverseDiagonal
  }
}
