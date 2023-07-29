import { MoveTypeEnum } from "@server/@types/api"

export const calculateNextMoveType = (
  isCurrentUserPlayer1?: boolean,
  hasPlayer1NextMove?: boolean,
  isCurrentUserPlayer2?: boolean,
  hasPlayer2NextMove?: boolean,
) => {
  if (isCurrentUserPlayer1 && hasPlayer1NextMove) {
    return MoveTypeEnum.X
  }
  if (isCurrentUserPlayer2 && hasPlayer2NextMove) {
    return MoveTypeEnum.O
  }
}
