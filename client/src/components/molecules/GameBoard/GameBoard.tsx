import { GameBoardCell } from "@client/components/atoms/GameBoardCell/GameBoardCell"
import { GameBoardRow } from "@client/components/atoms/GameBoardRow/GameBoardRow"
import { GameBoardProps } from "@client/components/molecules/GameBoard/@types/GameBoard"
import { determineWinDirection } from "@client/components/molecules/GameBoard/helpers/determineWinDirection"
import { GameBoardLoader } from "@client/components/molecules/GameBoard/loaders/GameBoardLoader"

/**
 * A game board component that displays the current state of a game.
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  board = [],
  isLoading,
  nextMoveType,
  winningMoves = [],
}) => {
  const winningMovesSet = new Set(
    winningMoves?.map(([row, col]) => `${row},${col}`), // Convert the moves to strings for easy comparison
  )

  const winDirection =
    winningMoves && winningMoves.length > 0
      ? determineWinDirection(winningMoves)
      : undefined

  return isLoading ? (
    <GameBoardLoader />
  ) : (
    <div
      className="flex items-center justify-stretch flex-col bg-white shadow rounded-box w-full overflow-hidden"
      data-testid="GameBoard"
    >
      {board.map((row, rowIndex) => (
        <GameBoardRow key={rowIndex}>
          {row.map(({ cell, isNextPossibleMove, onClick }, cellIndex) => {
            const isWinningCell = winningMovesSet.has(
              `${rowIndex},${cellIndex}`,
            )

            return (
              <GameBoardCell
                cell={cell}
                isNextPossibleMove={isNextPossibleMove}
                isWinningCell={isWinningCell}
                onClick={onClick}
                key={cellIndex}
                nextMoveType={nextMoveType}
                winDirection={winDirection}
              />
            )
          })}
        </GameBoardRow>
      ))}
    </div>
  )
}
