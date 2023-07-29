import { GameBoardRowProps } from "@client/components/atoms/GameBoardRow/@types/GameBoardRow"

export const GameBoardRow: React.FC<GameBoardRowProps> = ({ children }) => (
  <div className="w-full flex items-center justify-center border-b-2 last:border-b-0 border-base-300">
    {children}
  </div>
)
