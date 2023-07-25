import { GameResponse } from "@server/@types/api"

export interface GamePreviewProps {
  boardStatus: GameResponse["current_board_status"]
}
