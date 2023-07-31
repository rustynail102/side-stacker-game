import { MoveTypeEnum } from "@server/features/games/gameObject"
import { z } from "zod"

/**
 * MoveObject defines the schema for a move object.
 */
export const MoveObject = z
  .object({
    created_at: z.number(),
    game_id: z.string().uuid(),
    move_id: z.string().uuid(),
    move_number: z.number(),
    move_type: z.enum([MoveTypeEnum.enum.X, MoveTypeEnum.enum.O]),
    player_id: z.string().uuid(),
    position_x: z.number(),
    position_y: z.number(),
  })
  .strict()
