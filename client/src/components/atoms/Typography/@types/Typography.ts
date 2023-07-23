import { ReactNode } from "react"

export enum TypographyVariant {
  H1,
}

export interface TypographyProps {
  children: ReactNode | ReactNode[]
  className?: string
  variant: TypographyVariant
}
