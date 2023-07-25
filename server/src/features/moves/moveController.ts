import { QueryKeys } from "@server/@types/api"
import { Game } from "@server/@types/gameObject"
import { GameModel } from "@server/features/games/gameModel"
import { MoveTypeEnum, GameStateEnum } from "@server/features/games/gameObject"
import { MoveModel } from "@server/features/moves/moveModel"
import { MoveObject } from "@server/features/moves/moveObject"
import { PlayerModel } from "@server/features/players/playerModel"
import { GameService } from "@server/services/gameService"
import { RequestValidationService } from "@server/services/requestValidationService"
import { WebsocketService } from "@server/services/websocketService"
import { Request } from "express"
import isEmpty from "lodash/isEmpty"
import { z } from "zod"

export class MoveController {
  static create = async (req: Request) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    const { game_id, player_id, position_x, position_y } =
      RequestValidationService.validateBody(
        req.body,
        MoveObject.pick({
          game_id: true,
          player_id: true,
          position_x: true,
          position_y: true,
        }),
      )

    const game = await GameModel.getById(game_id)
    const parsedGame = GameService.parseGameToResponse(game)
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

    const updatedGame: Partial<Game> = {
      current_board_status: JSON.stringify(newBoardStatus),
      next_possible_moves: JSON.stringify(nextPossibleMoves),
      number_of_moves: numberOfMoves,
    }

    if (isEmpty(nextPossibleMoves) || !isEmpty(winningMoves)) {
      updatedGame.finished_at = 1
      updatedGame.current_game_state = GameStateEnum.enum.finished

      if (!isEmpty(winningMoves)) {
        updatedGame.winner_id = player_id
        updatedGame.winning_moves = JSON.stringify(winningMoves)
      }
    }

    await GameModel.update(game_id, updatedGame)

    await MoveModel.create({
      game_id,
      move_number: numberOfMoves,
      move_type: moveType,
      player_id,
      position_x,
      position_y,
    })

    const updatedPlayer = await PlayerModel.update(player_id, {})

    if (!isEmpty(winningMoves)) {
      WebsocketService.emitToast(
        `${updatedPlayer.username} just won ${game.name}!`,
      )
    }

    WebsocketService.emitInvalidateQuery([QueryKeys.Games, QueryKeys.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKeys.Games, QueryKeys.Detail],
      game_id,
    )
    WebsocketService.emitInvalidateQuery([QueryKeys.Players, QueryKeys.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKeys.Players, QueryKeys.Detail],
      player_id,
    )
  }
}
