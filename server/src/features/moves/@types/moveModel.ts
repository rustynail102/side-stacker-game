import { Move } from "@app/features/moves/@types/moveObject"

export interface MoveModelGetAll {
  filters?: Record<keyof Pick<Move, "game_id">, string>
}
