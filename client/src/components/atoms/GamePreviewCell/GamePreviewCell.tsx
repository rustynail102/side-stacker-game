import { GamePreviewCellProps } from "@client/components/atoms/GamePreviewCell/@types/GamePreviewCell"
import { FiCircle, FiX } from "react-icons/fi"

export const GamePreviewCell: React.FC<GamePreviewCellProps> = ({ cell }) => (
  <div
    className={`
        flex items-center justify-center 
        border-r-1 last:border-r-0 border-base-300
        w-4 h-4
      `}
  >
    {cell === "X" && <FiX className="inline-block w-4 h-4 text-primary" />}
    {cell === "O" && (
      <FiCircle className="inline-block w-3 h-3 text-secondary" />
    )}
  </div>
)
