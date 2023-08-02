import { Game } from "@server/@types/gameObject"
import {
  GameObject,
  GameStateEnum,
  MoveTypeEnum,
} from "@server/features/games/gameObject"
import { DatabasePoolConnection, createSqlTag } from "slonik"
import random from "lodash/random"
import { MoveTypeEnum as ApiMoveTypeEnum } from "@server/@types/api"

const sql = createSqlTag({
  typeAliases: {
    game: GameObject,
  },
})

/**
 * Returns SQL query to insert a game mock
 */
export const gameInsertMock = ({
  current_board_status,
  current_game_state,
  name,
  next_possible_moves,
  number_of_moves,
  player1_id,
  player2_id,
}: Required<
  Pick<
    Game,
    | "current_board_status"
    | "current_game_state"
    | "name"
    | "next_possible_moves"
    | "number_of_moves"
    | "player1_id"
    | "player2_id"
  >
>) => {
  const current_board_status_row = new Array(7).fill(MoveTypeEnum.enum.empty)
  const current_board_status_init: ApiMoveTypeEnum[][] = new Array(7).fill(
    current_board_status_row,
  )

  return sql.typeAlias("game")`
    INSERT 
    INTO games (
      game_id, 
      player1_id, 
      player2_id, 
      current_game_state, 
      current_board_status, 
      name,
      next_possible_moves, 
      number_of_moves, 
      winner_id, 
      winning_moves, 
      created_at,
      finished_at
    ) 
    VALUES (
      uuid_generate_v4(), 
      ${player1_id}, 
      ${player2_id}, 
      ${current_game_state || GameStateEnum.enum.waiting_for_players}, 
      ${sql.json(current_board_status || current_board_status_init)}, 
      ${name || "Game"},
      ${sql.json(next_possible_moves || [])}, 
      ${number_of_moves || 1}, 
      NULL, 
      NULL, 
      NOW(),
      NOW()
    )
  `
}

/**
 * Creates a random game
 */
export const createRandomGame = (): Pick<
  Game,
  | "current_board_status"
  | "current_game_state"
  | "name"
  | "next_possible_moves"
  | "number_of_moves"
> => {
  // Define the possible values for a cell on the board
  const possibleCellValues = [
    MoveTypeEnum.enum.empty,
    MoveTypeEnum.enum.X,
    MoveTypeEnum.enum.O,
  ]

  // Define the possible game states
  const possibleGameStates = [
    GameStateEnum.enum.waiting_for_players,
    GameStateEnum.enum.in_progress,
    GameStateEnum.enum.finished,
  ]

  // Generate a random game state
  const current_game_state =
    possibleGameStates[random(possibleGameStates.length - 1)]

  // Generate a random board
  const current_board_status = Array.from({ length: 7 }, () =>
    Array.from(
      { length: 7 },
      () => possibleCellValues[random(possibleCellValues.length - 1)],
    ),
  )

  // Create a random name for the game
  const name = `Game ${random(1, 1000)}`

  // Generate a random number of moves
  const number_of_moves = random(1, 100)

  // Determine the next possible moves based on the current board status
  const next_possible_moves = current_board_status[0]
    .map((cell, i) => (cell === "empty" ? [0, i] : null))
    .filter(Boolean) as number[][]

  return {
    current_board_status,
    current_game_state,
    name,
    next_possible_moves,
    number_of_moves,
  }
}

/**
 * Helper function to insert random games into test database
 */
export const createGames = async (
  connection: DatabasePoolConnection,
  gamesData: Required<
    Pick<
      Game,
      | "current_board_status"
      | "current_game_state"
      | "name"
      | "next_possible_moves"
      | "number_of_moves"
      | "player1_id"
      | "player2_id"
    >
  >[],
) => {
  for (const gameData of gamesData) {
    await connection.query(gameInsertMock(gameData))
  }
}
