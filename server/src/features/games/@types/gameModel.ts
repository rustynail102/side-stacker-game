import { OrderDirection } from "@app/features/@types/models"
import { Game, GameStateEnum } from "@app/features/games/@types/gameObject"

export interface GameModelGetAll {
  filters?: Record<
    keyof Pick<Game, "current_player_id" | "current_game_state">,
    string | GameStateEnum
  >
  limit?: number
  offset?: number
  orderBy?: keyof Game
  orderDirection?: OrderDirection
}
