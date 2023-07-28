import { GameCardProps } from "@client/components/molecules/GameCard/@types/GameCard"

export interface GamesCardsProps {
  games?: GameCardProps["game"][]
  isLoading?: boolean
}
