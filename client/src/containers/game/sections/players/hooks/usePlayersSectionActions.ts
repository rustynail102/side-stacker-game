import { useUpdateGame } from "@client/api/mutations/useUpdateGame"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"

/**
 * Custom hook that provides game players section actions such as isUpdatingGame, joinAsPlayer1, joinAsPlayer2, leaveAsPlayer1, and leaveAsPlayer2.
 */
export const usePlayersSectionActions = () => {
  const {
    currentPlayer,
    game,
    isCurrentUserPlayer1,
    isCurrentUserPlayer2,
    isInitialLoading,
    isUserPlaying,
    player1,
    player2,
  } = useGameContainerQueries()

  const { isLoading: isUpdatingGame, updateGame } = useUpdateGame({
    game_id: game?.game_id,
  })

  const isGameFinished = game?.finished_at

  const joinAsPlayer1 =
    !isInitialLoading && !isUserPlaying && !player1 && !isGameFinished
      ? () => updateGame({ player1_id: currentPlayer?.player_id })
      : undefined

  const leaveAsPlayer1 =
    !isInitialLoading && isCurrentUserPlayer1 && !isGameFinished
      ? () => updateGame({ player1_id: null })
      : undefined

  const joinAsPlayer2 =
    !isInitialLoading && !isUserPlaying && !player2 && !isGameFinished
      ? () => updateGame({ player2_id: currentPlayer?.player_id })
      : undefined

  const leaveAsPlayer2 =
    !isInitialLoading && isCurrentUserPlayer2 && !isGameFinished
      ? () => updateGame({ player2_id: null })
      : undefined

  return {
    isUpdatingGame,
    joinAsPlayer1,
    joinAsPlayer2,
    leaveAsPlayer1,
    leaveAsPlayer2,
  }
}
