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

/**
 * Function that maps players to rows for the players table in the home page.
 */
export const mapPlayersToRows = (
  authenticated_user_id?: PlayerResponse["player_id"],
  players?: PlayerResponse[],
) => {
  if (!players) {
    return []
  }

  return players.map(({ is_online, last_active_at, username, player_id }) => [
    <FlexRow>
      <Indicator
        type={is_online ? IndicatorType.Success : IndicatorType.Neutral}
      />
      <Typography
        variant={TypographyVariant.Span}
        weight={
          player_id === authenticated_user_id
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
