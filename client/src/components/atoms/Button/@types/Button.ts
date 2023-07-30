import { ReactNode } from "react"

export enum ButtonSize {
  Xs = "btn-xs",
  Sm = "btn-sm",
  Md = "btn-md",
  Lg = "btn-lg",
}

export enum ButtonFill {
  Full = "",
  Outline = "btn-outline",
}

export enum ButtonVariant {
  Default = "",
  Neutral = "btn-neutral",
  Primary = "btn-primary",
  Secondary = "btn-secondary",
  Accent = "btn-accent",
  Info = "btn-info",
  Success = "btn-success",
  Warning = "btn-warning",
  Error = "btn-error",
  Ghost = "btn-ghost",
  Link = "btn-link",
}

export enum ButtonShape {
  Default = "",
  Circle = "btn-circle",
}

export interface ButtonProps {
  children: ReactNode | ReactNode[]
  className?: string
  disabled?: boolean
  fill?: ButtonFill
  isLoading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  shape?: ButtonShape
  size?: ButtonSize
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
  variant?: ButtonVariant
}
