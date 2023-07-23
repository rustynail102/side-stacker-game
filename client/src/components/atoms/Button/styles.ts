import { ButtonSize } from "@app/components/atoms/Button/@types/Button"

export const mapButtonSizeToSpinnerSize: Record<ButtonSize, string> = {
  [ButtonSize.Xs]: "loading-xs",
  [ButtonSize.Sm]: "loading-sm",
  [ButtonSize.Md]: "loading-md",
  [ButtonSize.Lg]: "loading-lg",
}
