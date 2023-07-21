import { Game, GameStateEnum } from "@app/@types/gameObject"
import { OrderDirection } from "@app/@types/models"
import { PrimitiveValueExpression } from "slonik"

export interface GameModelGetAll {
  filters?: {
    player1_id?: string
    player2_id?: string
    current_game_state?: GameStateEnum | GameStateEnum[]
    winner_id?: string
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
