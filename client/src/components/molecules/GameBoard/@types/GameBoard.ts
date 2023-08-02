import { GameBoardCellProps } from "@client/components/atoms/GameBoardCell/@types/GameBoardCell"

export interface GameBoardProps {
  board?: Pick<
    GameBoardCellProps,
    "cell" | "isNextPossibleMove" | "onClick"
  >[][]
  isLoading?: boolean
  nextMoveType?: GameBoardCellProps["nextMoveType"]
  winningMoves?: number[][] | null
}
