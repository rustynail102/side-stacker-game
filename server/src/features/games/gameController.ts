import { GameModel } from "@server/features/games/gameModel"
import { GameObject, GameStateEnum } from "@server/features/games/gameObject"
import { RequestValidationService } from "@server/services/requestValidationService"
import { Request, Response } from "express"
import { GameService } from "@server/services/gameService"
import { z } from "zod"
import { WebsocketService } from "@server/services/websocketService"
import { OrderDirection } from "@server/@types/models"
import { QueryKeys } from "@server/@types/api"
import { PlayerModel } from "@server/features/players/playerModel"

export class GameController {
  static create = async (req: Request, res: Response) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    const { player1_id } = RequestValidationService.validateBody(
      req.body,
      GameObject.pick({
        player1_id: true,
      }),
    )

    const newGame = await GameModel.create({
      current_game_state: GameStateEnum.enum.waiting_for_players,
      name: GameService.generateGameName(),
      next_possible_moves: JSON.stringify(
        GameService.calculateNextPossibleMoves(),
      ),
      player1_id,
    })

    if (player1_id) {
      await PlayerModel.update(player1_id, {})

      // Emit an event to all connected clients to invalidate the players query
      WebsocketService.emitInvalidateQuery([QueryKeys.Players, QueryKeys.List])
      WebsocketService.emitInvalidateQuery(
        [QueryKeys.Players, QueryKeys.Detail],
        player1_id,
      )
    }

    const newGameResponse = GameService.parseGameToResponse(newGame)

    WebsocketService.emitToast(`New Game available - ${newGameResponse.name}`)
    // Emit an event to all connected clients to invalidate the games query
    WebsocketService.emitInvalidateQuery([QueryKeys.Games, QueryKeys.List])

    res.json(newGameResponse)
  }

  static getAll = async (req: Request, res: Response) => {
    const { filterType, filters, limit, offset, orderBy, orderDirection } =
      RequestValidationService.validateQuery(
        req.query,
        z.object({
          filterType: z.enum(["AND", "OR"]).optional(),
          filters: GameObject.pick({
            current_game_state: true,
            player1_id: true,
            player2_id: true,
            winner_id: true,
          }).optional(),
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

    const games = await GameModel.getAll({
      filterType,
      filters,
      limit,
      offset,
      orderBy,
      orderDirection,
    })

    const gamesResponse = games.map(GameService.parseGameToResponse)

    res.json(gamesResponse)
  }

  static getById = async (req: Request, res: Response) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))
    const { game_id } = RequestValidationService.validateParams(
      req.params,
      GameObject.pick({ game_id: true }),
    )

    const game = await GameModel.getById(game_id)

    const gameResponse = GameService.parseGameToResponse(game)

    res.json(gameResponse)
  }

  static update = async (req: Request, res: Response) => {
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

    if (player1_id) {
      await GameService.removePlayerFromActiveGames(player1_id)
      await PlayerModel.update(player1_id, {})
      WebsocketService.emitInvalidateQuery(
        [QueryKeys.Players, QueryKeys.Detail],
        player1_id,
      )
    }

    if (player2_id) {
      await GameService.removePlayerFromActiveGames(player2_id)
      await PlayerModel.update(player2_id, {})
      WebsocketService.emitInvalidateQuery(
        [QueryKeys.Players, QueryKeys.Detail],
        player2_id,
      )
    }

    const currentGame = await GameModel.getById(game_id)
    const currentGameState = GameService.determineCurrentGameState({
      finished_at: currentGame.finished_at,
      player1_id,
      player2_id,
    })

    const updatedGame = await GameModel.update(game_id, {
      current_game_state: currentGameState,
      player1_id,
      player2_id,
    })

    // Emit an event to all connected clients to invalidate the games query
    WebsocketService.emitInvalidateQuery([QueryKeys.Games, QueryKeys.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKeys.Games, QueryKeys.Detail],
      game_id,
    )

    const updatedGameResponse = GameService.parseGameToResponse(updatedGame)

    res.json(updatedGameResponse)
  }
}
