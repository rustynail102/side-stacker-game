import { z } from "zod"

/**
 * GameStateEnum defines the possible states a game can be in.
 */
export const GameStateEnum = z.enum([
  "waiting_for_players",
  "in_progress",
  "finished",
])

/**
 * MoveTypeEnum defines the possible types of moves in a game.
 */
export const MoveTypeEnum = z.enum(["X", "O", "empty"])

/**
 * GameObject defines the schema for a game object.
 */
export const GameObject = z
  .object({
    created_at: z.number(),
    current_board_status: z.array(z.array(MoveTypeEnum)),
    current_game_state: GameStateEnum,
    finished_at: z.number().optional().nullable(),
    game_id: z.string().uuid(),
    name: z.string(),
    next_possible_moves: z.array(z.array(z.number())),
    number_of_moves: z.number(),
    player1_id: z.string().uuid().optional().nullable(),
    player2_id: z.string().uuid().optional().nullable(),
    winner_id: z.string().uuid().optional().nullable(),
    winning_moves: z.array(z.array(z.number())).optional().nullable(),
  })
  .strict()
