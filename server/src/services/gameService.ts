import {
  MoveTypeEnum as MoveTypeEnumType,
  Game,
} from "@server/@types/gameObject"
import { GameModel } from "@server/features/games/gameModel"
import { MoveTypeEnum, GameStateEnum } from "@server/features/games/gameObject"
import { Player } from "@server/@types/playerObject"
import { WebsocketService } from "@server/services/websocketService"
import { convertObjectToObjectWithIsoDates } from "@server/helpers/objects/convertObjectToObjectWithIsoDates"
import { convertDateISOStringToTimestamp } from "@server/helpers/dates/convertDateISOStringToTimestamp"
import { Move } from "@server/@types/moveObject"
import isEmpty from "lodash/isEmpty"
import {
  GameResponse,
  GameStateEnum as ApiGameStateEnum,
  MoveTypeEnum as ApiMoveTypeEnum,
  QueryKeys,
} from "@server/@types/api"
import {
  uniqueNamesGenerator,
  adjectives,
  starWars,
  Config,
} from "unique-names-generator"
import { PlayerService } from "@server/services/playerService"

/**
 * GameService is a class that contains static methods related to game logic
 */
export class GameService {
  // Board size
  static readonly BOARD_SIZE = 7

  /**
   * calculateBoardStatusAfterNextMove calculates the state of the board after the next move is made.
   */
  static calculateBoardStatusAfterNextMove = (
    current_board_status: MoveTypeEnumType[][],
    position_y: Move["position_y"],
    position_x: Move["position_x"],
    moveType: MoveTypeEnumType,
  ) => {
    const currentBoardStatus = [...current_board_status]

    currentBoardStatus[position_y][position_x] = moveType

    return currentBoardStatus
  }

  /**
   * calculateNextPossibleMoves calculates all the possible moves that can be made in the next turn.
   */
  static calculateNextPossibleMoves = (
    currentBoardStatus?: MoveTypeEnumType[][],
  ) => {
    const boardStatusInit: MoveTypeEnumType[][] = Array.from(
      { length: GameService.BOARD_SIZE },
      () => new Array(GameService.BOARD_SIZE).fill(MoveTypeEnum.enum.empty),
    )

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

  /**
   * calculateWinningMoves checks if there is a sequence of 4 same symbols (vertical, horizontal, diagonal).
   * If such a sequence exists, the game is won.
   */
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

  /**
   * determineCurrentGameState determines the current state of the game.
   * The game can be in three states: waiting for players, in progress, finished.
   */
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

  /**
   * calculateGameAfterNextMove calculates the new game state after the next move is made.
   * The game state is updated based on the current board status
   * and the position of the next move.
   */
  static calculateGameAfterNextMove = (
    parsedGame: GameResponse,
    position_y: number,
    position_x: number,
    player_id: string,
  ) => {
    const numberOfMoves = parsedGame.number_of_moves + 1

    const moveType =
      numberOfMoves % 2 !== 0 ? MoveTypeEnum.enum.X : MoveTypeEnum.enum.O

    const newBoardStatus = GameService.calculateBoardStatusAfterNextMove(
      parsedGame.current_board_status,
      position_y,
      position_x,
      moveType,
    )

    const nextPossibleMoves =
      GameService.calculateNextPossibleMoves(newBoardStatus)

    const winningMoves = GameService.calculateWinningMoves(newBoardStatus)

    const updatedGame: Required<
      Pick<
        Game,
        "current_board_status" | "next_possible_moves" | "number_of_moves"
      >
    > &
      Partial<
        Pick<
          Game,
          "finished_at" | "current_game_state" | "winner_id" | "winning_moves"
        >
      > = {
      current_board_status: newBoardStatus,
      next_possible_moves: nextPossibleMoves,
      number_of_moves: numberOfMoves,
    }

    if (isEmpty(nextPossibleMoves) || !isEmpty(winningMoves)) {
      updatedGame.finished_at = 1
      updatedGame.current_game_state = GameStateEnum.enum.finished

      if (!isEmpty(winningMoves)) {
        updatedGame.winner_id = player_id
        updatedGame.winning_moves = winningMoves
      }
    }

    return { moveType, updatedGame, winningMoves }
  }

  /**
   * parseRequestToGame transforms the game object to an object that can be used by models.
   */
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

  /**
   * parseGameToResponse transforms the game response object to a format that is suitable for the client.
   */
  static parseGameToResponse = (game: Game): GameResponse => {
    const {
      current_board_status,
      current_game_state,
      created_at,
      finished_at,
      winning_moves,
    } = game

    return {
      ...game,
      current_board_status: current_board_status as ApiMoveTypeEnum[][],
      current_game_state: current_game_state as ApiGameStateEnum,
      winning_moves: winning_moves ?? null,
      ...convertObjectToObjectWithIsoDates(
        { created_at, finished_at: finished_at ? finished_at : null },
        ["created_at", "finished_at"],
      ),
    }
  }

  /**
   * generateGameName generates a unique name for a game.
   */
  static generateGameName = () => {
    const config: Config = {
      dictionaries: [adjectives, starWars],
      length: 2,
      separator: " ",
      style: "capital",
    }

    try {
      return uniqueNamesGenerator(config)
    } catch (error) {
      console.error("Error generating game name: ", error)
      return "Game" // Fallback name
    }
  }

  /**
   * updateGamePlayersIfNeeded updates the game players if needed.
   */
  static updateGamePlayersIfNeeded = async (
    game: Game,
    player_id?: Player["player_id"] | null,
  ) => {
    if (player_id) {
      const { player } = await PlayerService.markAsOnline(player_id)

      WebsocketService.emitToast(`${player.username} joined ${game.name}`)
    }
  }

  /**
   * updateGame updates the game with new properties and invalidates the cached games queries.
   */
  static updateGame = async (
    game_id: Game["game_id"],
    fields: Partial<Omit<Game, "created_at" | "game_id" | "name">>,
  ) => {
    const updatedGame = await GameModel.update(game_id, fields)

    // Emit an event to all connected clients to invalidate the games query
    WebsocketService.emitInvalidateQuery([QueryKeys.Games, QueryKeys.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKeys.Games, QueryKeys.Detail],
      game_id,
    )

    return { updatedGame }
  }

  /**
   * createNewGame creates a new game, invalidates the cached games queries and emits a toast message.
   */
  static createNewGame = async ({ player1_id }: Pick<Game, "player1_id">) => {
    const newGame = await GameModel.create({
      current_game_state: GameStateEnum.enum.waiting_for_players,
      name: GameService.generateGameName(),
      next_possible_moves: GameService.calculateNextPossibleMoves(),
      player1_id,
    })

    WebsocketService.emitToast(`New Game available - ${newGame.name}`)
    // Emit an event to all connected clients to invalidate the games query
    WebsocketService.emitInvalidateQuery([QueryKeys.Games, QueryKeys.List])

    return { newGame }
  }
}
