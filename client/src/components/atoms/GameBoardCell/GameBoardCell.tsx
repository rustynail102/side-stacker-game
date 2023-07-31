import { OIcon } from "@client/assets/icons/OIcon"
import { XIcon } from "@client/assets/icons/XIcon"
import {
  GameBoardCellProps,
  WinDirection,
} from "@client/components/atoms/GameBoardCell/@types/GameBoardCell"
import { commonCellClassNames } from "@client/components/atoms/GameBoardCell/styles"

/**
 * A cell component for the game board. It can represent an "X", an "O", or an empty cell.
 */
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
    aria-label={cell}
    className={`
        flex items-center justify-center 
        border-r-2 last:border-r-0 border-base-300
        h-0 flex-[0_0_calc(100%/7)] pb-[calc(100%/7)]
        relative group

        ${
          isLoading
            ? "animate-bg-gradient-slow bg-gradient-to-r bg-400% from-primary to-secondary"
            : ""
        }
        ${onClick ? "cursor-pointer transition-all" : ""}
        ${
          !onClick && cell === "empty" && !isNextPossibleMove
            ? "diagonal-lines"
            : ""
        }
        ${onClick && nextMoveType === "X" ? "hover:shadow-inner-primary" : ""}
        ${onClick && nextMoveType === "O" ? "hover:shadow-inner-secondary" : ""}
      
      `}
    onClick={onClick}
  >
    {isWinningCell && (
      <div
        className={`
          absolute left-0 top-0 z-50
          w-full h-full
          winning-cell
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
      />
    )}
    {cell === "X" && (
      <XIcon
        className={`
          ${commonCellClassNames} 
          text-primary
        `}
        stroke="currentColor"
        fill="currentColor"
      />
    )}
    {cell === "O" && (
      <OIcon
        className={`
          ${commonCellClassNames} 
          text-secondary
        `}
        stroke="currentColor"
        fill="currentColor"
      />
    )}
  </div>
)
