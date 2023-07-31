import { z } from "zod"

/**
 * Zod schema for a Count object. It includes one property: count (a string).
 */
export const CountObject = z
  .object({
    count: z.string(),
  })
  .strict()
