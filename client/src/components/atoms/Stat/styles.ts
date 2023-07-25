import { StatVariant } from "@client/components/atoms/Stat/@types/Stat"

export const mapStatVariantToLoaderStyles: Record<StatVariant, string> = {
  [StatVariant.Primary]: "from-primary-focus to-warning",
  [StatVariant.Secondary]: "from-secondary-focus to-success",
  [StatVariant.Accent]: "from-accent-focus to-success",
}
