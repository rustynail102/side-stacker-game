import { GameResponse } from "@server/@types/api"

export const mapCurrentBoardStatusToBoard = (
  game?: GameResponse,
  hasCurrentUserNextMove?: boolean,
) =>
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
        ...(hasCurrentUserNextMove &&
          isNextPossibleMove && {
            onClick: () => false,
          }),
      }
    }),
  )
