import { GameInfoCard } from "@client/components/molecules/GameInfoCard/GameInfoCard"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"

export const GameContainerInfoSection: React.FC = () => {
  const { game, isInitialLoadingGame } = useGameContainerQueries()

  return <GameInfoCard game={game} isLoading={isInitialLoadingGame} />
}
