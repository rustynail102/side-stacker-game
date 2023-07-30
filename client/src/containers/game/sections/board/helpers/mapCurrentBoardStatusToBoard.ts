import {
  CreateMovePostBody,
  GameResponse,
  MoveResponse,
} from "@server/@types/api"
import { MutateOptions } from "@tanstack/react-query"

export const mapCurrentBoardStatusToBoard = (
  createMove: (
    body: CreateMovePostBody,
    options?:
      | MutateOptions<MoveResponse, unknown, CreateMovePostBody, unknown>
      | undefined,
  ) => void,
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
            onClick: () =>
              createMove({
                game_id: game.game_id,
                position_x: cellIndex,
                position_y: rowIndex,
              }),
          }),
      }
    }),
  )
