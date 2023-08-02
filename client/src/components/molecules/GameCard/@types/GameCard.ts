export interface GameCardProps {
  className?: string
  game: {
    created_at: string
    current_board_status: ("X" | "O" | "empty")[][]
    current_game_state: "waiting_for_players" | "in_progress" | "finished"
    finished_at?: string | null
    game_id: string
    name: string
    next_possible_moves: number[][]
    number_of_moves: number
    player1_id?: string | null
    player2_id?: string | null
    winner_id?: string | null
    winning_moves?: number[][] | null
  }
}
