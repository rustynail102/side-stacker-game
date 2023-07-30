import { GameInfoCardProps } from "@client/components/molecules/GameInfoCard/@types/GameInfoCard"

export const getGameStateBadgeText = (game: GameInfoCardProps["game"]) => {
  if (game?.current_game_state === "finished") {
    return "Finished"
  }

  if (game?.current_game_state === "in_progress") {
    return "Game in progress"
  }

  const player1Count = game?.player1_id ? 1 : 0
  const player2Count = game?.player2_id ? 1 : 0
  const spots = 2 - player1Count - player2Count

  return `${spots} spot${spots > 1 ? "s" : ""} available`
}
