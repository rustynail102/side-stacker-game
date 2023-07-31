import { GameInfoCard } from "@client/components/molecules/GameInfoCard/GameInfoCard"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"

/**
 * Section component for the game info in the game page. It displays the game info such as game name, status and number of move.
 */
export const GameContainerInfoSection: React.FC = () => {
  const { game, isInitialLoadingGame } = useGameContainerQueries()

  return <GameInfoCard game={game} isLoading={isInitialLoadingGame} />
}
