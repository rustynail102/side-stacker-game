import { PlayerObject } from "@server/features/players/playerObject"
import { z } from "zod"

export type Player = z.infer<typeof PlayerObject>
