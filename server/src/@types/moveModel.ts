import { Move } from "@server/@types/moveObject"

export interface MoveModelGetAll {
  filters?: Record<keyof Pick<Move, "game_id">, string>
}
