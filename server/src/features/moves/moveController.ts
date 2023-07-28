import { AuthenticationError } from "@server/errors/authenticationError"
import { GameModel } from "@server/features/games/gameModel"
import { MoveModel } from "@server/features/moves/moveModel"
import { MoveObject } from "@server/features/moves/moveObject"
import { GameService } from "@server/services/gameService"
import { PlayerService } from "@server/services/playerService"
import { RequestValidationService } from "@server/services/requestValidationService"
import { SessionService } from "@server/services/sessionService"
import { WebsocketService } from "@server/services/websocketService"
import { Request, Response } from "express"
import isEmpty from "lodash/isEmpty"
import { z } from "zod"

export class MoveController {
  // Define method for creating a new move
  static create = async (req: Request, res: Response) => {
    // Retrieve player id from session data
    const { player_id: sessionPlayerId } = SessionService.getSessionData(req)

    // Validate request query and body, ensuring they meet the expected format
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

    // Check if the player making the request is the same as the one in the session
    if (player_id !== sessionPlayerId) {
      throw new AuthenticationError("Not allowed", 403)
    }

    // Retrieve the game by its id
    const game = await GameModel.getById(game_id)
    // Parse the game to a response-friendly format
    const parsedGame = GameService.parseGameToResponse(game)

    // Calculate the game state after the proposed move
    const { moveType, updatedGame, winningMoves } =
      GameService.calculateGameAfterNextMove(
        parsedGame,
        position_y,
        position_x,
        player_id,
      )

    // Update the game with the new state
    await GameService.updateGame(game_id, updatedGame)

    // Create the move in the database
    const move = await MoveModel.create({
      game_id,
      move_number: updatedGame.number_of_moves,
      move_type: moveType,
      player_id,
      position_x,
      position_y,
    })

    // Mark the player as active (update last_active_at)
    const { player } = await PlayerService.markActivity(player_id)

    // If there are winning moves, emit a toast notification
    if (!isEmpty(winningMoves)) {
      WebsocketService.emitToast(`${player.username} just won ${game.name}!`)
    }

    res.json(move)
  }
}
