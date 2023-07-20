import { MoveObject } from "@app/features/moves/moveObject"
import { z } from "zod"

export type Move = z.infer<typeof MoveObject>
