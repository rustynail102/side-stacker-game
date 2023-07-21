import { BoardMoveTypeEnum, Game } from "@app/@types/gameObject"

export type GameResponse = Omit<
  Game,
  "current_board_status" | "created_at" | "next_possible_moves"
> & {
  current_board_status: BoardMoveTypeEnum[][]
  created_at: string
  next_possible_moves: number[][]
}
