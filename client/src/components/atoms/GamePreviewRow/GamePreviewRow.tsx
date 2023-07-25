import { GamePreviewRowProps } from "@client/components/atoms/GamePreviewRow/@types/GamePreviewRow"

export const GamePreviewRow: React.FC<GamePreviewRowProps> = ({ children }) => (
  <div className="flex items-center justify-center border-b-1 last:border-b-0 border-base-300">
    {children}
  </div>
)
