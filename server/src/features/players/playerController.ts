import { PlayerModel } from "@server/features/players/playerModel"
import { PlayerObject } from "@server/features/players/playerObject"
import { GameService } from "@server/services/gameService"
import { RequestValidationService } from "@server/services/requestValidationService"
import { Request, Response } from "express"
import { z } from "zod"
import { OrderDirection } from "@server/@types/models"
import { PlayerService } from "@server/services/playerService"
import { WebsocketService } from "@server/services/websocketService"
import { QueryKeys } from "@server/@types/api"

export class PlayerController {
  static create = async (req: Request, res: Response) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    const body = RequestValidationService.validateBody(
      req.body,
      PlayerObject.pick({ username: true }),
    )

    const newPlayer = await PlayerModel.create({
      username: body.username,
    })

    const newPlayerResponse = PlayerService.parsePlayerToResponse(newPlayer)

    // Emit an event to all connected clients to invalidate the players query
    WebsocketService.emitInvalidateQuery([QueryKeys.Players, QueryKeys.List])

    res.json(newPlayerResponse)
  }

  static delete = async (req: Request, res: Response) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))
    const { player_id } = RequestValidationService.validateParams(
      req.params,
      PlayerObject.pick({ player_id: true }),
    )

    const deletedPlayer = await PlayerModel.delete(player_id)

    await GameService.removePlayerFromActiveGames(deletedPlayer.player_id)

    // Emit an event to all connected clients to invalidate the players query
    WebsocketService.emitInvalidateQuery([QueryKeys.Players, QueryKeys.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKeys.Players, QueryKeys.Detail],
      deletedPlayer.player_id,
    )
    // Emit an event to all connected clients to invalidate the games queries
    WebsocketService.emitInvalidateQuery([QueryKeys.Games, QueryKeys.List])

    const deletedPlayerResponse =
      PlayerService.parsePlayerToResponse(deletedPlayer)

    res.json(deletedPlayerResponse)
  }

  static getAll = async (req: Request, res: Response) => {
    const { limit, offset, orderBy, orderDirection } =
      RequestValidationService.validateQuery(
        req.query,
        z.object({
          limit: z.number().optional(),
          offset: z.number().optional(),
          orderBy: z
            .enum([
              "created_at",
              "deleted_at",
              "last_active_at",
              "player_id",
              "username",
            ])
            .optional(),
          orderDirection: z
            .enum([OrderDirection.ASC, OrderDirection.DESC])
            .optional(),
        }),
      )
    RequestValidationService.validateBody(req.body, z.object({}))

    const players = await PlayerModel.getAll({
      limit,
      offset,
      orderBy,
      orderDirection,
    })

    const playersResponse = players.map(PlayerService.parsePlayerToResponse)

    res.json(playersResponse)
  }

  static getById = async (req: Request, res: Response) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))
    const params = RequestValidationService.validateParams(
      req.params,
      PlayerObject.pick({ player_id: true }),
    )

    const player = await PlayerModel.getById(params.player_id)
    const playerResponse = PlayerService.parsePlayerToResponse(player)

    res.json(playerResponse)
  }

  // TODO - Remove if unused
  static update = async (req: Request, res: Response) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    const body = RequestValidationService.validateBody(
      req.body,
      PlayerObject.pick({
        username: true,
      }),
    )
    const params = RequestValidationService.validateParams(
      req.params,
      PlayerObject.pick({ player_id: true }),
    )

    const updatedPlayer = await PlayerModel.update(params.player_id, {
      username: body.username,
    })

    const updatedPlayerResponse =
      PlayerService.parsePlayerToResponse(updatedPlayer)

    // Emit an event to all connected clients to invalidate the players query
    WebsocketService.emitInvalidateQuery([QueryKeys.Players, QueryKeys.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKeys.Players, QueryKeys.Detail],
      updatedPlayer.player_id,
    )

    res.json(updatedPlayerResponse)
  }
}
