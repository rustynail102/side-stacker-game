import { NextMoveCard } from "@client/components/molecules/NextMoveCard/NextMoveCard"
import { getWinnerName } from "@client/containers/game/helpers/getWinnerName"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"

export const GameContainerNextMoveSection: React.FC = () => {
  const {
    game,
    hasPlayer1NextMove,
    hasPlayer2NextMove,
    isInitialLoading,
    player1,
    player2,
  } = useGameContainerQueries()

  const winnerName = getWinnerName(game, player1, player2)

  return (
    <NextMoveCard
      hasPlayer1NextMove={hasPlayer1NextMove}
      hasPlayer2NextMove={hasPlayer2NextMove}
      isLoading={isInitialLoading}
      winnerName={winnerName}
    />
  )
}
