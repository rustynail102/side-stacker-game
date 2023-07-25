import { useGetGames } from "@client/api/queries/useGetGames"
import { StatVariant } from "@client/components/atoms/Stat/@types/Stat"
import { Stats } from "@client/components/molecules/Stats/Stats"
import { GameStateEnum } from "@server/@types/api"
import { IconType } from "react-icons"
import { FiPlay, FiRefreshCw, FiCheckCircle } from "react-icons/fi"

export const HomeContainerStatsSection: React.FC = () => {
  const { games: openGames, isInitialLoading: isInitialLoadingOpenGames } =
    useGetGames({
      filters: {
        current_game_state: GameStateEnum.waiting_for_players,
      },
      limit: 100,
    })

  const {
    games: gamesInProgress,
    isInitialLoading: isInitialLoadingGamesInProgress,
  } = useGetGames({
    filters: {
      current_game_state: GameStateEnum.in_progress,
    },
    limit: 100,
  })

  const {
    games: finishedGames,
    isInitialLoading: isInitialLoadingFinishedGames,
  } = useGetGames({
    filters: {
      current_game_state: GameStateEnum.finished,
    },
    limit: 100,
  })

  return (
    <Stats
      stats={[
        {
          icon: FiPlay as IconType,
          isLoading: isInitialLoadingOpenGames,
          title: "Open Games",
          value: openGames?.length ?? 0,
          variant: StatVariant.Primary,
        },
        {
          icon: FiRefreshCw as IconType,
          isLoading: isInitialLoadingGamesInProgress,
          title: "Games In Progress",
          value: gamesInProgress?.length ?? 0,
          variant: StatVariant.Secondary,
        },
        {
          icon: FiCheckCircle as IconType,
          isLoading: isInitialLoadingFinishedGames,
          title: "Finished Games",
          value: finishedGames?.length ?? 0,
          variant: StatVariant.Accent,
        },
      ]}
    />
  )
}
