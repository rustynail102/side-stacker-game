import { BadgeType } from "@client/components/atoms/Badge/@types/Badge"
import { GameInfoCardGame } from "@client/components/molecules/GameInfoCard/@types/GameInfoCard"

export const mapCurrentGameStateToBadgeProps: Record<
  GameInfoCardGame["current_game_state"],
  {
    type: BadgeType
  }
> = {
  finished: {
    type: BadgeType.Accent,
  },
  in_progress: {
    type: BadgeType.Secondary,
  },
  waiting_for_players: {
    type: BadgeType.Primary,
  },
}
