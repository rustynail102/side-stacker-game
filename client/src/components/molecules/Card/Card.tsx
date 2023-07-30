import { BadgeType } from "@client/components/atoms/Badge/@types/Badge"
import { Badge } from "@client/components/atoms/Badge/Badge"
import {
  TypographyVariant,
  TypographyWeight,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import {
  CardPosition,
  CardProps,
  CardType,
  CardVariant,
} from "@client/components/molecules/Card/@types/Card"

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  contentBottom,
  contentTop,
  isLoading = false,
  position = CardPosition.Default,
  title,
  type = CardType.Normal,
  variant = CardVariant.Primary,
}) => (
  <div
    className={`
      card z-[1] compact shadow ${variant} rounded-box ${position}
      ${position === CardPosition.Sticky ? "top-0" : ""}
      ${
        type === CardType.Link
          ? "transition-all ease-in-out duration-150 hover:shadow-xl active:shadow cursor-pointer"
          : ""
      }
      ${className}
    `}
  >
    {contentTop}

    <div className="card-body">
      {isLoading && (
        <Badge
          className={
            "w-3/4 h-[28px] animate-bg-gradient-slow bg-gradient-to-r bg-400% from-secondary-focus to-success"
          }
          type={BadgeType.Default}
        >
          {" "}
        </Badge>
      )}

      {title && !isLoading && (
        <Typography
          className="truncate max-w-full"
          variant={TypographyVariant.Callout}
          weight={TypographyWeight.Bold}
        >
          {title}
        </Typography>
      )}

      {children}
    </div>

    {contentBottom}
  </div>
)
