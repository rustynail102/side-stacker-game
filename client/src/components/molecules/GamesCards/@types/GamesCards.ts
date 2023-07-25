import { GameResponse } from "@server/@types/api"

export interface GamesCardsProps {
  games?: GameResponse[]
  isLoading?: boolean
}
