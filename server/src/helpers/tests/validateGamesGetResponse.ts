import { Game } from "@server/@types/gameObject"
import supertest from "supertest"

/**
 * Helper function to validate `GET /games` response
 */
export const validateGamesGetResponse = (
  getGamesResponse: supertest.Response,
  expectedData: {
    games: Pick<
      Game,
      | "current_board_status"
      | "current_game_state"
      | "name"
      | "next_possible_moves"
      | "number_of_moves"
      | "player1_id"
      | "player2_id"
    >[]
    total: number
  },
) => {
  expect(getGamesResponse.body.total).toEqual(expectedData.total)
  expect(getGamesResponse.body.games).toHaveLength(expectedData.games.length)

  for (let i = 0; i < expectedData.games.length; i++) {
    expect(getGamesResponse.body.games[i]).toMatchObject(expectedData.games[i])
  }

  getGamesResponse.body.games.forEach((game: Game) => {
    expect(Object.keys(game).sort()).toEqual(
      [
        "game_id",
        "player1_id",
        "player2_id",
        "current_game_state",
        "current_board_status",
        "name",
        "next_possible_moves",
        "number_of_moves",
        "winner_id",
        "created_at",
        "finished_at",
        "winning_moves",
      ].sort(),
    )
  })
}
