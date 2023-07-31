import { z } from "zod"

/**
 * Zod schema for a Migration object.
 */
export const MigrationObject = z
  .object({
    executed_at: z.number(),
    id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
  })
  .strict()
