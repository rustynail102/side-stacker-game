import { Game, GameStateEnum } from "@server/@types/gameObject"
import { OrderDirection } from "@server/@types/models"
import { PrimitiveValueExpression } from "slonik"

export interface GameModelGetAll {
  filters?: {
    player1_id?: string | null
    player2_id?: string | null
    current_game_state?: GameStateEnum | GameStateEnum[]
    winner_id?: string | null
  }
  filterType?: "AND" | "OR"
  limit?: number
  offset?: number
  orderBy?: keyof Game
  orderDirection?: OrderDirection
}

export type GameModelUpdateFieldsReturnType = Readonly<{
  type: "SLONIK_TOKEN_FRAGMENT"
  sql: string
  values: PrimitiveValueExpression[]
}>[]
