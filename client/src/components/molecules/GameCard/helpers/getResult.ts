import { GameCardProps } from "@client/components/molecules/GameCard/@types/GameCard"

export const getResult = (game: GameCardProps["game"]) => {
  if (!game.finished_at) {
    return
  }

  if (game.finished_at && !game.winner_id) {
    return "Draw"
  }

  const isNumberOfMovesEven = game.number_of_moves % 2 === 0

  return isNumberOfMovesEven ? "Player 2 won" : "Player 1 won"
}
