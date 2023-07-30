import { GameModel } from "@server/features/games/gameModel"
import { GameObject, GameStateEnum } from "@server/features/games/gameObject"
import { RequestValidationService } from "@server/services/requestValidationService"
import { Request, Response } from "express"
import { GameService } from "@server/services/gameService"
import { z } from "zod"
import { FilterType, OrderDirection } from "@server/@types/models"
import { SessionService } from "@server/services/sessionService"
import { AuthenticationError } from "@server/errors/authenticationError"
import { PlayerService } from "@server/services/playerService"

export class GameController {
  // Create a new game
  static create = async (req: Request, res: Response) => {
    // Get player ID from session
    const { player_id: sessionPlayerId } = SessionService.getSessionData(req)

    // Validate request
    RequestValidationService.validateQuery(req.query, z.object({}))
    const { player1_id } = RequestValidationService.validateBody(
      req.body,
      GameObject.pick({
        player1_id: true,
      }),
    )

    // Check if player is authorized
    if (player1_id && player1_id !== sessionPlayerId) {
      throw new AuthenticationError("Not allowed", 403)
    }

    // Create new game
    const { newGame } = await GameService.createNewGame({
      player1_id,
    })

    // Mark player activity
    if (player1_id) {
      await PlayerService.markAsOnline(player1_id)
    }

    // Prepare response
    const newGameResponse = GameService.parseGameToResponse(newGame)

    res.json(newGameResponse)
  }

  // Get all games
  static getAll = async (req: Request, res: Response) => {
    // Validate session
    const { player_id } = SessionService.getSessionData(req)
    await PlayerService.markAsOnline(player_id)

    // Validate and extract request parameters
    const { filters, limit, offset, orderBy, orderDirection } =
      RequestValidationService.validateQuery(
        req.query,
        z.object({
          filters: z
            .array(
              z.object({
                conditions: z.object({
                  current_game_state: GameStateEnum.optional(),
                  player1_id: z.string().optional(),
                  player2_id: z.string().optional(),
                  winner_id: z.string().optional(),
                }),
                filterType: z.enum([FilterType.AND, FilterType.OR]).optional(),
              }),
            )
            .optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
          orderBy: z
            .enum(["created_at", "current_game_state", "finished_at"])
            .optional(),
          orderDirection: z
            .enum([OrderDirection.ASC, OrderDirection.DESC])
            .optional(),
        }),
      )
    RequestValidationService.validateBody(req.body, z.object({}))

    // Get all games
    const { games, total } = await GameModel.getAll({
      filters,
      limit,
      offset,
      orderBy,
      orderDirection,
    })

    // Prepare response
    const gamesResponse = games.map(GameService.parseGameToResponse)

    res.json({
      games: gamesResponse,
      total,
    })
  }

  // Get game by ID
  static getById = async (req: Request, res: Response) => {
    // Validate session
    const { player_id } = SessionService.getSessionData(req)
    await PlayerService.markAsOnline(player_id)

    // Validate request
    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))
    const { game_id } = RequestValidationService.validateParams(
      req.params,
      GameObject.pick({ game_id: true }),
    )

    // Get game by ID
    const game = await GameModel.getById(game_id)

    // Prepare response
    const gameResponse = GameService.parseGameToResponse(game)

    res.json(gameResponse)
  }

  // Update game
  static update = async (req: Request, res: Response) => {
    // Get player ID from session
    const { player_id: sessionPlayerId } = SessionService.getSessionData(req)
    await PlayerService.markAsOnline(sessionPlayerId)

    // Validate request
    RequestValidationService.validateQuery(req.query, z.object({}))
    const { player1_id, player2_id } = RequestValidationService.validateBody(
      req.body,
      GameObject.pick({
        player1_id: true,
        player2_id: true,
      }),
    )
    const { game_id } = RequestValidationService.validateParams(
      req.params,
      GameObject.pick({ game_id: true }),
    )

    // Get game by ID
    const currentGame = await GameModel.getById(game_id)

    // Check if player is authorized to update the game
    if (
      // Cannot remove other player from the game
      (player1_id === null && currentGame.player1_id !== sessionPlayerId) ||
      (player2_id === null && currentGame.player2_id !== sessionPlayerId) ||
      // The same player cannot join 2 spots
      (player1_id && currentGame.player2_id === player1_id) ||
      (player2_id && currentGame.player1_id === player2_id) ||
      // Cannot add himself to the game if the spot is not available
      (player1_id && currentGame.player1_id) ||
      (player2_id && currentGame.player2_id) ||
      // Updating a finished game is not allowed
      currentGame.finished_at
    ) {
      throw new AuthenticationError("Not allowed", 403)
    }

    // Update game players if necessary
    await GameService.updateGamePlayersIfNeeded(currentGame, player1_id)
    await GameService.updateGamePlayersIfNeeded(currentGame, player2_id)

    // Determine current game state
    const currentGameState = GameService.determineCurrentGameState({
      finished_at: currentGame.finished_at,
      player1_id:
        player1_id !== undefined ? player1_id : currentGame.player1_id,
      player2_id:
        player2_id !== undefined ? player2_id : currentGame.player2_id,
    })

    // Update game
    const { updatedGame } = await GameService.updateGame(game_id, {
      current_game_state: currentGameState,
      player1_id,
      player2_id,
    })

    // Prepare response
    const updatedGameResponse = GameService.parseGameToResponse(updatedGame)

    res.json(updatedGameResponse)
  }
}
