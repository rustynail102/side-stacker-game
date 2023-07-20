import { OrderDirection } from "@app/features/@types/models"
import { Game, GameStateEnum } from "@app/features/games/@types/gameObject"

export interface GameModelGetAll {
  filters?: Partial<
    Record<
      keyof Pick<
        Game,
        | "player1_id"
        | "player2_id"
        | "current_player_id"
        | "current_game_state"
        | "winner_id"
      >,
      string | GameStateEnum
    >
  >
  filterType?: "AND" | "OR"
  limit?: number
  offset?: number
  orderBy?: keyof Game
  orderDirection?: OrderDirection
}
