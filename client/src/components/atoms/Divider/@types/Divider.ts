import { ReactNode } from "react"

export enum DividerType {
  Horizontal,
  Vertical,
}

export interface DividerProps {
  children: ReactNode
  type?: DividerType
}
