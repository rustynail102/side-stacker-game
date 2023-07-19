import { z } from "zod"

export const MigrationObject = z
  .object({
    executed_at: z.number(),
    id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
  })
  .strict()

export const migrationObjectKeys = MigrationObject.keyof()._def.values

export type Migration = z.infer<typeof MigrationObject>
