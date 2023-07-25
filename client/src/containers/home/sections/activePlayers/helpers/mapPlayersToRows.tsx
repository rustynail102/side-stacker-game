import {
  TypographyVariant,
  TypographyWeight,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import { PlayerResponse } from "@server/@types/api"
import dayjs from "dayjs"

export const mapPlayersToRows = (
  authenticated_user_id?: PlayerResponse["player_id"],
  players?: PlayerResponse[],
) => {
  if (!players) {
    return []
  }

  const isAuthenticatedUser = (player_id: PlayerResponse["player_id"]) =>
    player_id === authenticated_user_id

  return players.map(({ last_active_at, username, player_id }, index) => [
    index + 1,
    <Typography
      variant={TypographyVariant.Span}
      weight={
        isAuthenticatedUser(player_id)
          ? TypographyWeight.Bold
          : TypographyWeight.Normal
      }
    >
      {username} {isAuthenticatedUser(player_id) && "(you)"}
    </Typography>,
    dayjs(last_active_at).fromNow(),
  ])
}
