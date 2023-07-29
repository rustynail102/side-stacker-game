import { Game, GameStateEnum } from "@server/@types/gameObject"
import { FilterType, OrderDirection } from "@server/@types/models"
import { PrimitiveValueExpression } from "slonik"

type Condition = {
  current_game_state?: GameStateEnum
  player1_id?: string
  player2_id?: string
  winner_id?: string
}

interface Filter {
  conditions: Condition
  filterType?: FilterType
}

export interface GameModelGetAll {
  filters?: Filter[]
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
