import { useGetGames } from "@client/api/queries/useGetGames"
import { StatVariant } from "@client/components/atoms/Stat/@types/Stat"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { Stats } from "@client/components/molecules/Stats/Stats"
import { GameStateEnum } from "@server/@types/api"
import { IconType } from "react-icons"
import {
  FiPlay,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi"

/**
 * Section component for the stats in the home page. It displays the stats for open games, games in progress, and finished games.
 */
export const HomeContainerStatsSection: React.FC = () => {
  const {
    error: errorOpenGames,
    isInitialLoading: isInitialLoadingOpenGames,
    total: totalOpenGames,
  } = useGetGames({
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
    error: errorGamesInProgress,
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
    error: errorFinishedGames,
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

  const hasError = errorOpenGames || errorGamesInProgress || errorFinishedGames

  return hasError ? (
    <Alert icon={FiAlertCircle as IconType} type={AlertType.Error}>
      It seems that there's a problem with the service. Please try again later.
    </Alert>
  ) : (
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
