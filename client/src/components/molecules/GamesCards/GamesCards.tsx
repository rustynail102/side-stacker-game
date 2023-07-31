import { GameCard } from "@client/components/molecules/GameCard/GameCard"
import { GamesCardsProps } from "@client/components/molecules/GamesCards/@types/GamesCards"
import { GamesCardsLoader } from "@client/components/molecules/GamesCards/loader/GamesCardsLoader"

/**
 * A group of card components that each display a game.
 */
export const GamesCards: React.FC<GamesCardsProps> = ({
  games = [],
  isLoading = false,
}) => (
  <div className="flex items-start justify-start gap-4 flex-wrap">
    {isLoading ? (
      <GamesCardsLoader />
    ) : (
      games.map((game) => (
        <GameCard
          className="w-[calc(25%-12px)]"
          key={game.game_id}
          game={game}
        />
      ))
    )}
  </div>
)
