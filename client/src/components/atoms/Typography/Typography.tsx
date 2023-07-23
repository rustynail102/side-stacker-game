import {
  TypographyProps,
  TypographyVariant,
} from "@app/components/atoms/Typography/@types/Typography"

export const Typography: React.FC<TypographyProps> = ({
  children,
  className = "",
  variant,
}) => {
  switch (variant) {
    case TypographyVariant.H1:
      return <h1 className={`text-5xl font-bold ${className}`}>{children}</h1>
  }
}
