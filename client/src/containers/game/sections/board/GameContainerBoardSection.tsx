import { useCreateMove } from "@client/api/mutations/useCreateMove"
import { GameBoard } from "@client/components/molecules/GameBoard/GameBoard"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"
import { calculateNextMoveType } from "@client/containers/game/sections/board/helpers/calculateNextMoveType"
import { mapCurrentBoardStatusToBoard } from "@client/containers/game/sections/board/helpers/mapCurrentBoardStatusToBoard"

/**
 * Section component for the game board in the game page. It handles the game board logic and updates the game board status.
 */
export const GameContainerBoardSection: React.FC = () => {
  const {
    game,
    isCurrentUserPlayer1,
    isCurrentUserPlayer2,
    isInitialLoading,
    hasCurrentUserNextMove,
    hasPlayer1NextMove,
    hasPlayer2NextMove,
  } = useGameContainerQueries()

  const nextMoveType = calculateNextMoveType(
    isCurrentUserPlayer1,
    hasPlayer1NextMove,
    isCurrentUserPlayer2,
    hasPlayer2NextMove,
  )

  const { createMove } = useCreateMove()

  const board = mapCurrentBoardStatusToBoard(
    createMove,
    game,
    hasCurrentUserNextMove,
  )

  return (
    <GameBoard
      board={board}
      isLoading={isInitialLoading}
      nextMoveType={nextMoveType}
      winningMoves={game?.winning_moves}
    />
  )
}
