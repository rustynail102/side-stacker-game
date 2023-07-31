import { GameStatusCard } from "@client/components/molecules/GameStatusCard/GameStatusCard"
import { getFinalResult } from "@client/containers/game/sections/status/helpers/getFinalResult"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"
import { getGameStatusCardTitle } from "@client/containers/game/sections/status/helpers/getGameStatusCardTitle"

/**
 * Section component for the game status in the game page. It displays the game status such as next move, final result, and game status card title.
 */
export const GameContainerStatusSection: React.FC = () => {
  const {
    game,
    hasPlayer1NextMove,
    hasPlayer2NextMove,
    isInitialLoading,
    player1,
    player2,
  } = useGameContainerQueries()

  const finalResult = getFinalResult(game, player1, player2)
  const gameStatusCardTitle = getGameStatusCardTitle(game)

  return (
    <GameStatusCard
      finalResult={finalResult}
      hasPlayer1NextMove={hasPlayer1NextMove}
      hasPlayer2NextMove={hasPlayer2NextMove}
      isLoading={isInitialLoading}
      title={gameStatusCardTitle}
    />
  )
}
