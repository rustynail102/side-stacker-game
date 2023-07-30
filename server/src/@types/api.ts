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

export enum FilterType {
  AND = "AND",
  OR = "OR",
}

export type GamesGetAllCondition = {
  current_game_state?: GameStateEnum
  player1_id?: string
  player2_id?: string
  winner_id?: string
}

export interface GamesGetAllFilter {
  conditions: GamesGetAllCondition
  filterType?: FilterType
}

export enum QueryKeys {
  Games = "games",
  Players = "players",
  List = "list",
  Detail = "detail",
  Current = "current",
}

export interface ErrorResponse {
  code: number
  errors: string[]
}

export interface PlayerResponse {
  created_at: string
  deleted_at: string | null
  is_online?: boolean
  last_active_at: string
  player_id: string
  username: string
}

export type PlayersResponse = {
  players: PlayerResponse[]
  total: number
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

export type GamesResponse = {
  games: GameResponse[]
  total: number
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
  filters?: GamesGetAllFilter[]
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

export type SignInPostBody = Pick<PlayerResponse, "username"> & {
  password: string
}

export type CreatePlayerPostBody = SignInPostBody

export type CreateGamePostBody = {
  player1_id: PlayerResponse["player_id"]
}

export type UpdateGamePutBody = Pick<GameResponse, "player1_id" | "player2_id">

export type CreateMovePostBody = {
  game_id: GameResponse["game_id"]
  position_x: number
  position_y: number
}
