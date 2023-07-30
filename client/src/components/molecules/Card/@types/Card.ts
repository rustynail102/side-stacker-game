import { ReactNode } from "react"

export enum CardType {
  Normal,
  Link,
}

export enum CardVariant {
  Primary = "bg-white",
  Secondary = "bg-base-100",
}

export enum CardPosition {
  Default = "",
  Sticky = "sticky",
}

export interface CardProps {
  children: ReactNode | ReactNode[]
  className?: string
  contentBottom?: ReactNode | ReactNode[]
  contentTop?: ReactNode | ReactNode[]
  isLoading?: boolean
  position?: CardPosition
  title?: string
  type?: CardType
  variant?: CardVariant
}
