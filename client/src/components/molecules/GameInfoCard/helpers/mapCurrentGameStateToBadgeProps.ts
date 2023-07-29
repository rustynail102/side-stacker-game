import { BadgeType } from "@client/components/atoms/Badge/@types/Badge"
import { GameInfoCardGame } from "@client/components/molecules/GameInfoCard/@types/GameInfoCard"

export const mapCurrentGameStateToBadgeProps: Record<
  GameInfoCardGame["current_game_state"],
  {
    text: string
    type: BadgeType
  }
> = {
  finished: {
    text: "Finished",
    type: BadgeType.Accent,
  },
  in_progress: {
    text: "Game in progress",
    type: BadgeType.Secondary,
  },
  waiting_for_players: {
    text: "Open spot(s)",
    type: BadgeType.Primary,
  },
}
