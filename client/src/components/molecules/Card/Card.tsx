import {
  TypographyVariant,
  TypographyWeight,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import {
  CardProps,
  CardType,
  CardVariant,
} from "@client/components/molecules/Card/@types/Card"

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  contentBottom,
  contentTop,
  title,
  type = CardType.Normal,
  variant = CardVariant.Primary,
}) => (
  <div
    className={`
      card z-[1] compact shadow ${variant} rounded-box
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
      {title && (
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
