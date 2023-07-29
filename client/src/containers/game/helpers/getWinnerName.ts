import { GameResponse, PlayerResponse } from "@server/@types/api"

export const getWinnerName = (
  game?: GameResponse,
  player1?: PlayerResponse,
  player2?: PlayerResponse,
) => {
  if (!game?.finished_at) {
    return
  }

  const isNumberOfMovesEven = game.number_of_moves % 2 === 0

  return isNumberOfMovesEven ? player2?.username : player1?.username
}
