import {
  MoveTypeEnum as MoveTypeEnumType,
  Game,
} from "@server/@types/gameObject"
import { GameModel } from "@server/features/games/gameModel"
import {
  MoveTypeEnum,
  GameStateEnum,
  gameObjectKeys,
} from "@server/features/games/gameObject"
import { Player } from "@server/@types/playerObject"
import { WebsocketService } from "@server/services/websocketService"
import { convertObjectToObjectWithIsoDates } from "@server/helpers/objects/convertObjectToObjectWithIsoDates"
import { convertDateISOStringToTimestamp } from "@server/helpers/dates/convertDateISOStringToTimestamp"
import { Move } from "@server/@types/moveObject"
import isEmpty from "lodash/isEmpty"
import {
  GameResponse,
  GameStateEnum as GameStateEnumType,
  QueryKeys,
} from "@server/@types/api"
import {
  uniqueNamesGenerator,
  adjectives,
  starWars,
} from "unique-names-generator"

export class GameService {
  static readonly BOARD_SIZE = 7

  static calculateBoardStatusAfterNextMove = (
    current_board_status: MoveTypeEnumType[][],
    position_y: Move["position_y"],
    position_x: Move["position_x"],
    moveType: MoveTypeEnumType,
  ) => {
    const currentBoardStatus = { ...current_board_status }

    currentBoardStatus[position_y][position_x] = moveType

    return currentBoardStatus
  }

  static calculateNextPossibleMoves = (
    currentBoardStatus?: MoveTypeEnumType[][],
  ) => {
    const boardStatusRowInit = new Array(GameService.BOARD_SIZE).fill(
      MoveTypeEnum.enum.empty,
    )
    const boardStatusInit: MoveTypeEnumType[][] = new Array(
      GameService.BOARD_SIZE,
    ).fill(boardStatusRowInit)

    const boardStatus = currentBoardStatus || boardStatusInit

    // Check if the game has been won
    if (
      currentBoardStatus &&
      !isEmpty(GameService.calculateWinningMoves(boardStatus))
    ) {
      return []
    }

    const nextPossibleMoves: number[][] = []

    boardStatus.forEach((row, rowIndex) => {
      const leftMostEmptyIndex = row.indexOf(MoveTypeEnum.enum.empty)
      const rightMostEmptyIndex = row.lastIndexOf(MoveTypeEnum.enum.empty)

      if (leftMostEmptyIndex !== -1) {
        nextPossibleMoves.push([rowIndex, leftMostEmptyIndex])
      }

      if (
        rightMostEmptyIndex !== -1 &&
        rightMostEmptyIndex !== leftMostEmptyIndex
      ) {
        nextPossibleMoves.push([rowIndex, rightMostEmptyIndex])
      }
    })

    return nextPossibleMoves
  }

  static calculateWinningMoves = (boardStatus: MoveTypeEnumType[][]) => {
    // Vertical and horizontal checks
    for (let rowIndex = 0; rowIndex < boardStatus.length; rowIndex++) {
      for (
        let cellIndex = 0;
        cellIndex < boardStatus[rowIndex].length;
        cellIndex++
      ) {
        for (const cell of ["X", "O"]) {
          const horizontalWin = [...Array(4).keys()].every(
            (i) => boardStatus[rowIndex][cellIndex + i] === cell,
          )
          const verticalWin = [...Array(4).keys()].every(
            (i) =>
              boardStatus[rowIndex + i] &&
              boardStatus[rowIndex + i][cellIndex] === cell,
          )

          if (horizontalWin) {
            return [...Array(4).keys()].map((i) => [rowIndex, cellIndex + i])
          }
          if (verticalWin) {
            return [...Array(4).keys()].map((i) => [rowIndex + i, cellIndex])
          }
        }
      }
    }

    // Diagonal checks
    for (let rowIndex = 0; rowIndex < boardStatus.length - 3; rowIndex++) {
      for (
        let cellIndex = 0;
        cellIndex < boardStatus[rowIndex].length - 3;
        cellIndex++
      ) {
        for (const cell of [MoveTypeEnum.enum.X, MoveTypeEnum.enum.O]) {
          const diagonalWin1 = [...Array(4).keys()].every(
            (i) => boardStatus[rowIndex + i][cellIndex + i] === cell,
          )
          const diagonalWin2 = [...Array(4).keys()].every(
            (i) => boardStatus[rowIndex + 3 - i][cellIndex + i] === cell,
          )

          if (diagonalWin1) {
            return [...Array(4).keys()].map((i) => [
              rowIndex + i,
              cellIndex + i,
            ])
          }
          if (diagonalWin2) {
            return [...Array(4).keys()].map((i) => [
              rowIndex + 3 - i,
              cellIndex + i,
            ])
          }
        }
      }
    }

    return []
  }

  static determineCurrentGameState = (
    game: Pick<Game, "finished_at" | "player1_id" | "player2_id">,
  ) => {
    if (game.finished_at) {
      return GameStateEnum.enum.finished
    }

    if (game.player1_id && game.player2_id) {
      return GameStateEnum.enum.in_progress
    }

    return GameStateEnum.enum.waiting_for_players
  }

  // TODO - Remove if unused
  static parseRequestToGame = (game: Partial<GameResponse>) => {
    const {
      current_board_status,
      created_at,
      next_possible_moves,
      winning_moves,
    } = game

    return {
      ...game,
      created_at: created_at
        ? convertDateISOStringToTimestamp(created_at)
        : undefined,
      current_board_status: current_board_status
        ? JSON.stringify(current_board_status)
        : undefined,
      next_possible_moves: next_possible_moves
        ? JSON.stringify(next_possible_moves)
        : undefined,
      winning_moves: winning_moves ? JSON.stringify(winning_moves) : undefined,
    }
  }

  static parseGameToResponse = (game: Game): GameResponse => {
    const {
      current_board_status,
      current_game_state,
      created_at,
      finished_at,
      next_possible_moves,
      winning_moves,
    } = game

    return {
      ...game,
      current_board_status: JSON.parse(current_board_status),
      current_game_state: current_game_state as GameStateEnumType,
      next_possible_moves: JSON.parse(next_possible_moves),
      winning_moves: winning_moves ? JSON.parse(winning_moves) : undefined,
      ...convertObjectToObjectWithIsoDates(
        { created_at, finished_at: finished_at ? finished_at : null },
        ["created_at", "finished_at"],
      ),
    }
  }

  static removePlayerFromActiveGames = async (
    player_id: Player["player_id"],
  ) => {
    const activeGamesWithPlayer = await GameModel.getAll({
      filterType: "OR",
      filters: {
        current_game_state: [
          GameStateEnum.enum.in_progress,
          GameStateEnum.enum.waiting_for_players,
        ],
        player1_id: player_id,
        player2_id: player_id,
      },
    })

    if (activeGamesWithPlayer.length > 0) {
      await Promise.all(
        activeGamesWithPlayer.map(async (game) => {
          const fieldsToUpdate = Object.entries(game)
            .filter(
              ([key, value]) =>
                value === player_id &&
                gameObjectKeys.includes(key as keyof Game),
            )
            .map(([key]) => key)

          if (fieldsToUpdate.length > 0) {
            // Create an object with the fields to update
            const updateObject = Object.fromEntries(
              fieldsToUpdate.map((field) => [field, ""]),
            )

            // Add the current_game_state field to the update object
            updateObject.current_game_state =
              GameStateEnum.enum.waiting_for_players

            await GameModel.update(game.game_id, updateObject)

            WebsocketService.emitInvalidateQuery(
              [QueryKeys.Games, QueryKeys.Detail],
              game.game_id,
            )
          }

          return game
        }),
      )
    }
  }

  static generateGameName = () =>
    uniqueNamesGenerator({
      dictionaries: [adjectives, starWars],
      length: 2,
      separator: " ",
      style: "capital",
    })
}
