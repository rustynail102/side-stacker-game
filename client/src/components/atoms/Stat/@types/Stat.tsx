import { IconType } from "react-icons"

export enum StatVariant {
  Primary = "text-primary-focus",
  Secondary = "text-secondary-focus",
  Accent = "text-accent-focus",
}

export interface StatProps {
  icon: IconType
  isLoading?: boolean
  title: string
  value?: string | number
  variant?: StatVariant
}
