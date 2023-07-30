import { GameBoardProps } from "@client/components/molecules/GameBoard/@types/GameBoard"

export interface GamePreviewProps {
  board?: GameBoardProps["board"]
  winningMoves?: GameBoardProps["winningMoves"]
}
