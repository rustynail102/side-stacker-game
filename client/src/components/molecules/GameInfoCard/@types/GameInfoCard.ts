export interface GameInfoCardGame {
  current_game_state: "waiting_for_players" | "in_progress" | "finished"
  name: string
  number_of_moves: number
  player1_id?: string | null
  player2_id?: string | null
}

export interface GameInfoCardProps {
  game?: GameInfoCardGame
  isLoading?: boolean
}
