import { useGetGames } from "@client/api/queries/useGetGames"
import { StatVariant } from "@client/components/atoms/Stat/@types/Stat"
import { Stats } from "@client/components/molecules/Stats/Stats"
import { GameStateEnum } from "@server/@types/api"
import { IconType } from "react-icons"
import { FiPlay, FiRefreshCw, FiCheckCircle } from "react-icons/fi"

export const HomeContainerStatsSection: React.FC = () => {
  const { isInitialLoading: isInitialLoadingOpenGames, total: totalOpenGames } =
    useGetGames({
      filters: [
        {
          conditions: {
            current_game_state: GameStateEnum.waiting_for_players,
          },
        },
      ],
      limit: 1,
    })

  const {
    total: totalGamesInProgress,
    isInitialLoading: isInitialLoadingGamesInProgress,
  } = useGetGames({
    filters: [
      {
        conditions: {
          current_game_state: GameStateEnum.in_progress,
        },
      },
    ],
    limit: 1,
  })

  const {
    total: totalFinishedGames,
    isInitialLoading: isInitialLoadingFinishedGames,
  } = useGetGames({
    filters: [
      {
        conditions: {
          current_game_state: GameStateEnum.finished,
        },
      },
    ],
    limit: 1,
  })

  return (
    <Stats
      stats={[
        {
          icon: FiPlay as IconType,
          isLoading: isInitialLoadingOpenGames,
          title: "Open Games",
          value: totalOpenGames ?? 0,
          variant: StatVariant.Primary,
        },
        {
          icon: FiRefreshCw as IconType,
          isLoading: isInitialLoadingGamesInProgress,
          title: "Games In Progress",
          value: totalGamesInProgress ?? 0,
          variant: StatVariant.Secondary,
        },
        {
          icon: FiCheckCircle as IconType,
          isLoading: isInitialLoadingFinishedGames,
          title: "Finished Games",
          value: totalFinishedGames ?? 0,
          variant: StatVariant.Accent,
        },
      ]}
    />
  )
}
