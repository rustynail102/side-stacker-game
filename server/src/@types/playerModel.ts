import { OrderDirection } from "@server/@types/models"
import { Player } from "@server/@types/playerObject"

export interface PlayerModelGetAll {
  filters?: {
    username?: string | null
  }
  filterType?: "AND" | "OR"
  limit?: number
  offset?: number
  orderBy?: keyof Omit<Player, "password">
  orderDirection?: OrderDirection
}
