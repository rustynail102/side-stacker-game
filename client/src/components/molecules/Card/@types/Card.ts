import { ReactNode } from "react"

export enum CardType {
  Normal,
  Link,
}

export enum CardVariant {
  Primary = "bg-white",
  Secondary = "bg-base-100",
}

export interface CardProps {
  children: ReactNode | ReactNode[]
  className?: string
  contentBottom?: ReactNode | ReactNode[]
  contentTop?: ReactNode | ReactNode[]
  title?: string
  type?: CardType
  variant?: CardVariant
}
