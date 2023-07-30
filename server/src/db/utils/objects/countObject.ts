import { z } from "zod"

export const CountObject = z
  .object({
    count: z.string(),
  })
  .strict()

export const countObjectKeys = CountObject.keyof()._def.values

export type Count = z.infer<typeof CountObject>
