import { z } from "zod"

export const MoveObject = z
  .object({
    created_at: z.number(),
    game_id: z.string().uuid(),
    move_id: z.string().uuid(),
    move_number: z.number(),
    player_id: z.string().uuid(),
    position_x: z.number(),
    position_y: z.number(),
  })
  .strict()

export const moveObjectKeys = MoveObject.keyof()._def.values
