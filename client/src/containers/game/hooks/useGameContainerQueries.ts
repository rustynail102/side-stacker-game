import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { useGetGame } from "@client/api/queries/useGetGame"
import { useGetPlayer } from "@client/api/queries/useGetPlayer"
import { useParams } from "@tanstack/router"

export const useGameContainerQueries = () => {
  const { game_id } = useParams()
  const { game, isInitialLoading: isInitialLoadingGame } = useGetGame({
    game_id,
  })
  const { isInitialLoading: isInitialLoadingPlayer1, player: player1 } =
    useGetPlayer(
      { player_id: game?.player1_id ?? "" },
      {
        enabled: Boolean(game?.player1_id),
      },
    )
  const { isInitialLoading: isInitialLoadingPlayer2, player: player2 } =
    useGetPlayer(
      { player_id: game?.player2_id ?? "" },
      {
        enabled: Boolean(game?.player2_id),
      },
    )

  const isInitialLoading =
    isInitialLoadingGame || isInitialLoadingPlayer1 || isInitialLoadingPlayer2

  const { currentPlayer } = useGetCurrentPlayer()

  const currentUserId = currentPlayer?.player_id
  const isCurrentUserPlayer1 = player1?.player_id === currentUserId
  const isCurrentUserPlayer2 = player2?.player_id === currentUserId
  const isUserPlaying = isCurrentUserPlayer1 || isCurrentUserPlayer2

  const hasPlayer1NextMove =
    game && game.number_of_moves % 2 === 0 && !game.finished_at
  const hasPlayer2NextMove =
    game && game.number_of_moves % 2 !== 0 && !game.finished_at

  const hasCurrentUserNextMove =
    (isCurrentUserPlayer1 && hasPlayer1NextMove) ||
    (isCurrentUserPlayer2 && hasPlayer2NextMove)

  return {
    currentPlayer,
    game,
    hasCurrentUserNextMove,
    hasPlayer1NextMove,
    hasPlayer2NextMove,
    isCurrentUserPlayer1,
    isCurrentUserPlayer2,
    isInitialLoading,
    isInitialLoadingGame,
    isInitialLoadingPlayer1,
    isInitialLoadingPlayer2,
    isUserPlaying,
    player1,
    player2,
  }
}
