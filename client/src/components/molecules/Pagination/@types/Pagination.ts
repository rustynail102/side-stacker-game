export enum PaginationSize {
  Xs,
  Sm,
  Md,
}

export interface PaginationProps {
  limit: number
  offset: number
  onNextPage?: () => void
  onPreviousPage?: () => void
  size?: PaginationSize
  total: number
}
