import { OIcon } from "@client/assets/icons/OIcon"
import { XIcon } from "@client/assets/icons/XIcon"
import { BadgeType } from "@client/components/atoms/Badge/@types/Badge"
import { Badge } from "@client/components/atoms/Badge/Badge"
import {
  TypographyAlignment,
  TypographyVariant,
  TypographyWeight,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import { Card } from "@client/components/molecules/Card/Card"
import { NextMoveCardProps } from "@client/components/molecules/NextMoveCard/@types/NextMoveCard"

export const NextMoveCard: React.FC<NextMoveCardProps> = ({
  hasPlayer1NextMove,
  hasPlayer2NextMove,
  isLoading,
  winnerName,
}) => (
  <Card isLoading={isLoading} title={winnerName ? "Winner" : "Next Move"}>
    <div className="mt-2 flex items-center justify-center">
      {isLoading ? (
        <Badge
          className={
            "w-[48px] h-[48px] animate-bg-gradient-slow bg-gradient-to-r bg-400% from-primary to-secondary"
          }
          children=" "
          type={BadgeType.Default}
        />
      ) : (
        <>
          {hasPlayer1NextMove && (
            <XIcon
              className="block w-12 h-12 text-primary"
              stroke="currentColor"
              fill="currentColor"
            />
          )}
          {hasPlayer2NextMove && (
            <OIcon
              className="block w-12 h-12 text-secondary"
              stroke="currentColor"
              fill="currentColor"
            />
          )}

          {winnerName && (
            <Typography
              alignment={TypographyAlignment.Center}
              variant={TypographyVariant.Callout}
              weight={TypographyWeight.Bold}
            >
              {winnerName}
            </Typography>
          )}
        </>
      )}
    </div>
  </Card>
)
