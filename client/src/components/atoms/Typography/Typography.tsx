import {
  TypographyAlignment,
  TypographyColor,
  TypographyProps,
  TypographyVariant,
  TypographyWeight,
} from "@client/components/atoms/Typography/@types/Typography"

/**
 * A typography component. It can represent different HTML elements like `<h1>`, `<h2>`, `<p>`, and `<span>`.
 */
export const Typography: React.FC<TypographyProps> = ({
  alignment = TypographyAlignment.Left,
  children,
  color = TypographyColor.Inherit,
  dataTestId,
  className = "",
  variant,
  weight,
}) => {
  const commonClassNames = [alignment, color, className]
  const weightDefaultBold = weight || TypographyWeight.Bold
  const weightDefaultNormal = weight || TypographyWeight.Normal

  switch (variant) {
    case TypographyVariant.Title:
      return (
        <h1
          className={`text-5xl ${weightDefaultBold} ${commonClassNames.join(
            " ",
          )}`}
          data-testid={dataTestId}
        >
          {children}
        </h1>
      )

    case TypographyVariant.Callout:
      return (
        <p
          className={`text-xl ${weightDefaultNormal} ${commonClassNames.join(
            " ",
          )}`}
          data-testid={dataTestId}
        >
          {children}
        </p>
      )

    case TypographyVariant.Paragraph:
      return (
        <p
          className={`text-sm ${weightDefaultNormal} ${commonClassNames.join(
            " ",
          )}`}
          data-testid={dataTestId}
        >
          {children}
        </p>
      )

    case TypographyVariant.Subtitle:
      return (
        <h2
          className={`text-2xl ${weightDefaultBold} ${commonClassNames.join(
            " ",
          )}`}
          data-testid={dataTestId}
        >
          {children}
        </h2>
      )

    case TypographyVariant.Span:
      return (
        <span
          className={`${weightDefaultNormal} ${commonClassNames.join(" ")}`}
          data-testid={dataTestId}
        >
          {children}
        </span>
      )
  }
}
