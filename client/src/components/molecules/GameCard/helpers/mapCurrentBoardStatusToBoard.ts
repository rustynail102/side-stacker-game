import { GameCardProps } from "@client/components/molecules/GameCard/@types/GameCard"

export const mapCurrentBoardStatusToBoard = (game?: GameCardProps["game"]) =>
  game?.current_board_status.map((row, rowIndex) =>
    row.map((cell, cellIndex) => {
      const isNextPossibleMove = Boolean(
        game?.next_possible_moves.find(
          ([y, x]) => y === rowIndex && x === cellIndex,
        ),
      )

      return {
        cell,
        isNextPossibleMove,
      }
    }),
  )
