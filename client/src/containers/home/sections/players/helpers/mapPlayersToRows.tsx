import { FlexRow } from "@client/components/atoms/FlexRow/FlexRow"
import { IndicatorType } from "@client/components/atoms/Indicator/@types/Indicator"
import { Indicator } from "@client/components/atoms/Indicator/Indicator"
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

  return players.map(({ is_online, last_active_at, username, player_id }) => [
    <FlexRow>
      <Indicator
        type={is_online ? IndicatorType.Success : IndicatorType.Neutral}
      />
      <Typography
        variant={TypographyVariant.Span}
        weight={
          isAuthenticatedUser(player_id)
            ? TypographyWeight.Bold
            : TypographyWeight.Normal
        }
      >
        {username}
      </Typography>
    </FlexRow>,
    dayjs(last_active_at).fromNow(),
  ])
}
