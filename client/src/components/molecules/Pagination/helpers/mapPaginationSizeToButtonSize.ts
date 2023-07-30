import { ButtonSize } from "@client/components/atoms/Button/@types/Button"
import { PaginationSize } from "@client/components/molecules/Pagination/@types/Pagination"

export const mapPaginationSizeToButtonSize: Record<PaginationSize, ButtonSize> =
  {
    [PaginationSize.Xs]: ButtonSize.Xs,
    [PaginationSize.Sm]: ButtonSize.Sm,
    [PaginationSize.Md]: ButtonSize.Md,
  }
