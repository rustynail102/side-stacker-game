import { GameResponse } from "@server/@types/api"

export const calculateNumberOfPlayersInGame = (
  game: Pick<GameResponse, "player1_id" | "player2_id">,
) =>
  game.player1_id && game.player2_id
    ? 2
    : game.player1_id || game.player2_id
    ? 1
    : 0
