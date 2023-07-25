import { ReactNode } from "react"

export enum ColumnType {
  Auto = "flex-auto",
  Default = "",
  Grow = "flex-grow",
  Shrink = "flex-shrink",
}

export interface ColumnProps {
  children: ReactNode | ReactNode[]
  className?: string
  type?: ColumnType
}
