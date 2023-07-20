import { z } from "zod"

export const GameStateEnum = z.enum([
  "waiting_for_players",
  "in_progress",
  "finished",
])

export const BoardMoveTypeEnum = z.enum(["X", "O", "empty"])

export const GameObject = z
  .object({
    created_at: z.number(),
    current_board_status: z.array(z.array(BoardMoveTypeEnum)),
    current_game_state: GameStateEnum,
    current_player_id: z.string().uuid().optional(),
    finished_at: z.number().optional(),
    game_id: z.string().uuid(),
    next_possible_moves: z.array(z.array(z.number())),
    player1_id: z.string().uuid().optional(),
    player2_id: z.string().uuid().optional(),
    winner_id: z.string().uuid().optional(),
  })
  .strict()

export const gameObjectKeys = GameObject.keyof()._def.values
