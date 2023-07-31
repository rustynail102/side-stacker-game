import { GameResponse } from "@server/@types/api"

/**
 * Calculates the number of players in a game.
 * @param {Pick<GameResponse, "player1_id" | "player2_id">} game - The game to calculate the number of players for.
 * @returns {number} - The number of players in the game.
 */
export const calculateNumberOfPlayersInGame = (
  game: Pick<GameResponse, "player1_id" | "player2_id">,
) =>
  game.player1_id && game.player2_id
    ? 2
    : game.player1_id || game.player2_id
    ? 1
    : 0
