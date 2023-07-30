import {
  GamePlayerRowProps,
  GamePlayerRowType,
} from "@client/components/molecules/GamePlayerRow/@types/GamePlayerRow"
import { OIcon } from "@client/assets/icons/OIcon"
import { XIcon } from "@client/assets/icons/XIcon"
import { Button } from "@client/components/atoms/Button/Button"
import { Indicator } from "@client/components/atoms/Indicator/Indicator"
import { IndicatorType } from "@client/components/atoms/Indicator/@types/Indicator"
import { Typography } from "@client/components/atoms/Typography/Typography"
import {
  TypographyColor,
  TypographyVariant,
  TypographyWeight,
} from "@client/components/atoms/Typography/@types/Typography"
import {
  ButtonFill,
  ButtonSize,
  ButtonVariant,
} from "@client/components/atoms/Button/@types/Button"
import { ReactNode } from "react"
import { FaMedal } from "react-icons/fa"

export const GamePlayerRow = ({
  hasNextMove,
  isCurrentUser,
  isDisabled,
  isWinner,
  onJoin,
  onLeave,
  player,
  type,
}: GamePlayerRowProps): ReactNode[] => {
  const Icon = type === GamePlayerRowType.Player1 ? XIcon : OIcon

  return [
    <Icon
      className={`block w-3 h-3 ${
        type === GamePlayerRowType.Player1 ? "text-primary" : "text-secondary"
      } mx-auto`}
      stroke="currentColor"
      fill="currentColor"
    />,
    <>
      {player ? (
        <div className="flex items-baseline gap-2">
          <Indicator
            type={
              player.is_online ? IndicatorType.Success : IndicatorType.Neutral
            }
          />

          <Typography
            variant={TypographyVariant.Span}
            weight={
              hasNextMove ? TypographyWeight.Bold : TypographyWeight.Normal
            }
          >
            {player.username}
          </Typography>

          {isWinner && <FaMedal className="text-accent self-center" />}
        </div>
      ) : (
        <Typography
          color={TypographyColor.Neutral}
          variant={TypographyVariant.Span}
        >
          Open spot
        </Typography>
      )}
    </>,
    <>
      {player && isCurrentUser && onLeave && (
        <Button
          fill={ButtonFill.Outline}
          disabled={isDisabled}
          onClick={onLeave}
          variant={ButtonVariant.Error}
          size={ButtonSize.Xs}
        >
          Leave
        </Button>
      )}
      {!player && onJoin && (
        <Button disabled={isDisabled} onClick={onJoin} size={ButtonSize.Xs}>
          Join
        </Button>
      )}
    </>,
  ]
}
