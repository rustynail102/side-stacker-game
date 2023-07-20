import { OrderDirection } from "@app/features/@types/models"
import { Player } from "@app/features/players/@types/playerObject"

export interface PlayerModelGetAll {
  limit?: number
  offset?: number
  orderBy?: keyof Player
  orderDirection?: OrderDirection
}
