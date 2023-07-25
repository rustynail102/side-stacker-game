import { OrderDirection } from "@server/@types/models"
import { Player } from "@server/@types/playerObject"

export interface PlayerModelGetAll {
  limit?: number
  offset?: number
  orderBy?: keyof Player
  orderDirection?: OrderDirection
}
