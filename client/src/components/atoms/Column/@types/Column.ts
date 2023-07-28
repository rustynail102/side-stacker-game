import { ReactNode } from "react"

export enum ColumnFlexBasis {
  Basis0 = "basis-0",
  Basis25 = "basis-1/4",
  Basis50 = "basis-1/2",
  Basis75 = "basis-3/4",
}

export enum ColumnFlexGrow {
  Grow = "grow",
  Grow0 = "grow-0",
}

export interface ColumnProps {
  children: ReactNode | ReactNode[]
  className?: string
  flexBasis?: ColumnFlexBasis
  flexGrow?: ColumnFlexGrow
}
