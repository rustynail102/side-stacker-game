import { GameResponse, PlayerResponse } from "@server/@types/api"

export const getFinalResult = (
  game?: GameResponse,
  player1?: PlayerResponse,
  player2?: PlayerResponse,
) => {
  if (!game?.finished_at) {
    return
  }

  if (game.finished_at && !game.winner_id) {
    return "Draw"
  }

  const isNumberOfMovesEven = game.number_of_moves % 2 === 0
  const winningPlayer = isNumberOfMovesEven
    ? player2?.username ?? "Player 2"
    : player1?.username ?? "Player 1"

  return `${winningPlayer} won`
}
