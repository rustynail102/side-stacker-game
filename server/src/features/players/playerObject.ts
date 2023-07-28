import { z } from "zod"

export const PlayerObject = z
  .object({
    created_at: z.number(),
    deleted_at: z.number().nullable(),
    last_active_at: z.number(),
    password: z.string(),
    player_id: z.string().uuid(),
    username: z.string().max(100),
  })
  .strict()

export const playerObjectKeys = PlayerObject.keyof()._def.values
