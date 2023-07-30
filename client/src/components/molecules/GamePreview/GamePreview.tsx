import { GameBoard } from "@client/components/molecules/GameBoard/GameBoard"
import { GamePreviewProps } from "@client/components/molecules/GamePreview/@types/GamePreview"

export const GamePreview: React.FC<GamePreviewProps> = ({
  board,
  winningMoves,
}) => (
  <div className="flex items-center justify-center flex-col my-4 w-3/4">
    <GameBoard board={board} winningMoves={winningMoves} />
  </div>
)
