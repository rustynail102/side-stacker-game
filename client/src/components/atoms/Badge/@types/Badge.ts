import { ReactNode } from "react"

export enum BadgeType {
  Default = "",
  Neutral = "badge-neutral",
  Primary = "badge-primary",
  Secondary = "badge-secondary",
  Accent = "badge-accent",
  Info = "badge-info",
  Success = "badge-success",
  Error = "badge-error",
  Warning = "badge-warning",
}

export interface BadgeProps {
  children: ReactNode | ReactNode[]
  className?: string
  type?: BadgeType
}
