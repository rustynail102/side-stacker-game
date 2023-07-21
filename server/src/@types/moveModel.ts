import { Move } from "@app/@types/moveObject"

export interface MoveModelGetAll {
  filters?: Record<keyof Pick<Move, "game_id">, string>
}
