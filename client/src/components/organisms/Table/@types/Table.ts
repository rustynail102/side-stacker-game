import { ReactNode } from "react"

export interface TableProps {
  className?: string
  headers: ReactNode[]
  isLoading?: boolean
  rows?: ReactNode[][]
}

export interface TableLoaderProps {
  columns: number
  rows?: number
}
