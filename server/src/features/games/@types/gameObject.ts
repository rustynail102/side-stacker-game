import {
  BoardMoveTypeEnum,
  GameStateEnum,
  GameObject,
} from "@app/features/games/gameObject"
import { z } from "zod"

export type GameStateEnum = z.infer<typeof GameStateEnum>
export type BoardMoveTypeEnum = z.infer<typeof BoardMoveTypeEnum>
export type Game = z.infer<typeof GameObject>
