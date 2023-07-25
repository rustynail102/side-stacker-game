import { ReactNode } from "react"

export interface DropdownProps {
  children?: ReactNode | ReactNode[]
  items: {
    text: string
    onClick: () => void
  }[]
}
