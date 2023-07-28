import { ReactNode } from "react"

export interface DropdownProps {
  children?: ReactNode | ReactNode[]
  items: {
    isLoading?: boolean
    text: string
    onClick: () => void
  }[]
}
