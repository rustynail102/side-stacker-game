import {
  MoveTypeEnum,
  GameStateEnum,
  GameObject,
} from "@app/features/games/gameObject"
import { z } from "zod"

export type GameStateEnum = z.infer<typeof GameStateEnum>
export type MoveTypeEnum = z.infer<typeof MoveTypeEnum>
export type Game = z.infer<typeof GameObject>
