import { OrderDirection } from "@app/@types/models"
import { Player } from "@app/@types/playerObject"

export interface PlayerModelGetAll {
  limit?: number
  offset?: number
  orderBy?: keyof Player
  orderDirection?: OrderDirection
}
