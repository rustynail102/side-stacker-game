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

export interface ErrorResponse {
  code: number
  error: string | string[]
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
