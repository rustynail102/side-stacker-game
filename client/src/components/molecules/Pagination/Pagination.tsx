import { ButtonVariant } from "@client/components/atoms/Button/@types/Button"
import { Button } from "@client/components/atoms/Button/Button"
import {
  PaginationProps,
  PaginationSize,
} from "@client/components/molecules/Pagination/@types/Pagination"
import { mapPaginationSizeToButtonSize } from "@client/components/molecules/Pagination/helpers/mapPaginationSizeToButtonSize"

export const Pagination: React.FC<PaginationProps> = ({
  limit,
  offset,
  onNextPage,
  onPreviousPage,
  size = PaginationSize.Md,
  total,
}) => {
  const buttonSize = mapPaginationSizeToButtonSize[size]

  return (
    <div
      className={`
        flex justify-center 
        ${size === PaginationSize.Md ? "mt-4" : "mt-2"}
      `}
    >
      <div className="join">
        <Button
          className="join-item"
          disabled={offset === 0}
          onClick={onPreviousPage}
          variant={ButtonVariant.Default}
          size={buttonSize}
        >
          «
        </Button>
        <Button
          className="join-item hover:bg-base-200 hover:border-base-200 cursor-default"
          variant={ButtonVariant.Default}
          size={buttonSize}
        >
          Page {offset / limit + 1}
        </Button>
        <Button
          className="join-item"
          disabled={offset + limit >= total}
          onClick={onNextPage}
          variant={ButtonVariant.Default}
          size={buttonSize}
        >
          »
        </Button>
      </div>
    </div>
  )
}
