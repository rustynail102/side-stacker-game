import { OIcon } from "@client/assets/icons/OIcon"
import { XIcon } from "@client/assets/icons/XIcon"
import {
  GameBoardCellProps,
  WinDirection,
} from "@client/components/atoms/GameBoardCell/@types/GameBoardCell"
import { commonCellClassNames } from "@client/components/atoms/GameBoardCell/styles"

export const GameBoardCell: React.FC<GameBoardCellProps> = ({
  cell,
  isLoading = false,
  isNextPossibleMove = false,
  isWinningCell = false,
  nextMoveType,
  onClick,
  winDirection,
}) => (
  <div
    className={`
        flex items-center justify-center 
        border-r-2 last:border-r-0 border-base-300
        h-0 flex-[0_0_calc(100%/7)] pb-[calc(100%/7)]
        relative

        ${
          isLoading
            ? "animate-bg-gradient-slow bg-gradient-to-r bg-400% from-primary to-secondary"
            : ""
        }
        ${onClick ? "cursor-pointer transition-all" : "cursor-not-allowed"}
        ${
          !onClick && cell === "empty" && !isNextPossibleMove
            ? "diagonal-lines"
            : ""
        }
        ${onClick && nextMoveType === "X" ? "hover:shadow-inner-primary" : ""}
        ${
          onClick && nextMoveType === "O"
            ? "hover:from-secondary  hover:to-primary/50"
            : ""
        }

        ${isWinningCell ? "winning-cell" : ""}
        ${
          isWinningCell && winDirection === WinDirection.Horizontal
            ? "winning-cell-horizontal"
            : ""
        }
        ${
          isWinningCell && winDirection === WinDirection.Vertical
            ? "winning-cell-vertical"
            : ""
        }
        ${
          isWinningCell && winDirection === WinDirection.Diagonal
            ? "winning-cell-diagonal"
            : ""
        }
        ${
          isWinningCell && winDirection === WinDirection.ReverseDiagonal
            ? "winning-cell-reverse-diagonal"
            : ""
        }
      
      `}
    onClick={onClick}
  >
    {cell === "X" && (
      <XIcon
        className={`${commonCellClassNames} w-1/2 h-1/2 text-primary`}
        stroke="currentColor"
        fill="currentColor"
      />
    )}
    {cell === "O" && (
      <OIcon
        className={`${commonCellClassNames} w-1/2 h-1/2 text-secondary`}
        stroke="currentColor"
        fill="currentColor"
      />
    )}
  </div>
)
