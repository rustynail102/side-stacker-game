import { GameBoardCellProps } from "@client/components/atoms/GameBoardCell/@types/GameBoardCell"
import { GameBoardCell } from "@client/components/atoms/GameBoardCell/GameBoardCell"
import { GameBoardRow } from "@client/components/atoms/GameBoardRow/GameBoardRow"

const boardRow = new Array(7).fill("empty") as GameBoardCellProps["cell"][]
const boardStatus = new Array(7).fill(
  boardRow,
) as GameBoardCellProps["cell"][][]

const board: Pick<
  GameBoardCellProps,
  "cell" | "isNextPossibleMove" | "onClick"
>[][] = boardStatus.map((row) =>
  row.map((cell) => ({
    cell,
    isNextPossibleMove: true,
  })),
)

export const GameBoardLoader: React.FC = () => (
  <div className="flex items-center justify-stretch flex-col bg-white shadow rounded-box w-full overflow-hidden">
    {board.map((row, rowIndex) => {
      const isRowEven = rowIndex % 2 === 0

      return (
        <GameBoardRow key={rowIndex}>
          {row.map(({ cell, isNextPossibleMove }, cellIndex) => {
            const isCellEven = cellIndex % 2 === 0

            return (
              <GameBoardCell
                cell={cell}
                isLoading={
                  (isRowEven && !isCellEven) || (!isRowEven && isCellEven)
                }
                isNextPossibleMove={isNextPossibleMove}
                key={cellIndex}
              />
            )
          })}
        </GameBoardRow>
      )
    })}
  </div>
)
