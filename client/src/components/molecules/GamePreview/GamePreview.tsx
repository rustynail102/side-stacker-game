import { GamePreviewCell } from "@client/components/atoms/GamePreviewCell/GamePreviewCell"
import { GamePreviewRow } from "@client/components/atoms/GamePreviewRow/GamePreviewRow"
import { GamePreviewProps } from "@client/components/molecules/GamePreview/@types/GamePreview"

export const GamePreview: React.FC<GamePreviewProps> = ({ boardStatus }) => (
  <div className="flex items-center justify-center flex-col my-4 border-1 border-base-300 bg-white rounded-md">
    {boardStatus.map((row, rowIndex) => (
      <GamePreviewRow key={rowIndex}>
        {row.map((cell, cellIndex) => (
          <GamePreviewCell cell={cell} key={cellIndex} />
        ))}
      </GamePreviewRow>
    ))}
  </div>
)
