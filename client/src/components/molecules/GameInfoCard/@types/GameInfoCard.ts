export interface GameInfoCardGame {
  current_game_state: "waiting_for_players" | "in_progress" | "finished"
  name: string
  number_of_moves: number
}

export interface GameInfoCardProps {
  game?: GameInfoCardGame
  isLoading?: boolean
}
