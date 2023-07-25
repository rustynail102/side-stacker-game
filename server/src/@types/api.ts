export enum GameStateEnum {
  waiting_for_players = "waiting_for_players",
  in_progress = "in_progress",
  finished = "finished",
}

export enum MoveTypeEnum {
  X = "X",
  O = "O",
  empty = "empty",
}

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum QueryKeys {
  Games = "games",
  Players = "players",
  List = "list",
  Detail = "detail",
}

export interface ErrorResponse {
  code: number
  errors: string[]
}

export interface PlayerResponse {
  created_at: string
  deleted_at: string | null
  last_active_at: string
  player_id: string
  username: string
}

export type GameResponse = {
  created_at: string
  current_board_status: MoveTypeEnum[][]
  current_game_state: GameStateEnum
  finished_at?: string | null
  game_id: string
  name: string
  next_possible_moves: number[][]
  number_of_moves: number
  player1_id?: string | null
  player2_id?: string | null
  winner_id?: string | null
  winning_moves?: number[][]
}

export interface MoveResponse {
  created_at: string
  game_id: string
  move_id: string
  move_number: number
  move_type: MoveTypeEnum.X | MoveTypeEnum.O
  player_id: string
  position_x: number
  position_y: number
}

export interface GamesGetAllQueryParams {
  filters?: {
    player1_id?: string | null
    player2_id?: string | null
    current_game_state?: GameStateEnum | GameStateEnum[]
    winner_id?: string | null
  }
  filterType?: "AND" | "OR"
  limit?: number
  offset?: number
  orderBy?: "created_at" | "current_game_state" | "finished_at"
  orderDirection?: OrderDirection
}

export interface PlayersGetAllQueryParams {
  limit?: number
  offset?: number
  orderBy?:
    | "created_at"
    | "deleted_at"
    | "last_active_at"
    | "player_id"
    | "username"
  orderDirection?: OrderDirection
}
