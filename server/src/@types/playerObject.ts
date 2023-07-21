import { PlayerObject } from "@app/features/players/playerObject"
import { z } from "zod"

export type Player = z.infer<typeof PlayerObject>
