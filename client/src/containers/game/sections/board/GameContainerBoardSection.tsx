import { GameBoard } from "@client/components/molecules/GameBoard/GameBoard"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"
import { calculateNextMoveType } from "@client/containers/game/sections/board/helpers/calculateNextMoveType"
import { mapCurrentBoardStatusToBoard } from "@client/containers/game/sections/board/helpers/mapCurrentBoardStatusToBoard"

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

  const board = mapCurrentBoardStatusToBoard(game, hasCurrentUserNextMove)

  return (
    <GameBoard
      board={board}
      isLoading={isInitialLoading}
      nextMoveType={nextMoveType}
      winningMoves={game?.winning_moves}
    />
  )
}
