import { GameResponse } from "@server/@types/api"

export const getGameStatusCardTitle = (game?: GameResponse) =>
  game?.finished_at ? "Result" : "Next Move"
