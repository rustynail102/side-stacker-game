import { PlayerModel } from "@server/features/players/playerModel"
import { PlayerObject } from "@server/features/players/playerObject"
import { RequestValidationService } from "@server/services/requestValidationService"
import { Request, Response } from "express"
import { z } from "zod"
import { OrderDirection } from "@server/@types/models"
import { PlayerService } from "@server/services/playerService"
import { SessionService } from "@server/services/sessionService"
import { RedisService } from "@server/services/redisService"
import { AuthenticationError } from "@server/errors/authenticationError"

export class PlayerController {
  // Creates a new player
  static create = async (req: Request, res: Response) => {
    // Validation of query and body of the request
    RequestValidationService.validateQuery(req.query, z.object({}))
    const body = RequestValidationService.validateBody(
      req.body,
      z.object({ password: z.string().min(8), username: z.string().max(100) }),
    )

    // Validation of username
    await PlayerService.validateUsername(body.username)

    // Create new player
    const { newPlayer, newPlayerResponse } =
      await PlayerService.createNewPlayer({
        password: body.password,
        username: body.username,
      })

    // Create new session
    SessionService.setSessionData(req, {
      player_id: newPlayer.player_id,
    })

    res.json(newPlayerResponse)
  }

  // Deletes an existing player (soft delete)
  static delete = async (req: Request, res: Response) => {
    // Retrieve player id from session data
    const { player_id: sessionPlayerId } = SessionService.getSessionData(req)

    // Validation of query and body of the request
    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))
    const { player_id } = RequestValidationService.validateParams(
      req.params,
      PlayerObject.pick({ player_id: true }),
    )

    // Throw an error if user attempts to delete another user
    if (player_id !== sessionPlayerId) {
      throw new AuthenticationError("Not allowed", 403)
    }

    // Delete player
    await PlayerService.deletePlayer(player_id)

    // Destroy session
    SessionService.destroySession(req, res)
  }

  // Gets all players
  static getAll = async (req: Request, res: Response) => {
    // Validate session data
    const { player_id: sessionPlayerId } = SessionService.getSessionData(req)
    await PlayerService.markAsOnline(sessionPlayerId, false)

    // Validation of query and body of the request
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

    // Get players
    const { players, total } = await PlayerModel.getAll({
      limit,
      offset,
      orderBy,
      orderDirection,
    })

    // Get current online users
    const onlineUsers = await RedisService.getOnlineUsers()

    // Map players to response
    const playersResponse = players.map((player) => {
      const is_online = onlineUsers.includes(player.player_id)
      return PlayerService.parsePlayerToResponse(player, is_online)
    })

    res.json({
      players: playersResponse,
      total,
    })
  }

  // Gets a player by id
  static getById = async (req: Request, res: Response) => {
    // Validate session data
    const { player_id: sessionPlayerId } = SessionService.getSessionData(req)
    await PlayerService.markAsOnline(sessionPlayerId, false)

    // Validation of query and body of the request
    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))
    const params = RequestValidationService.validateParams(
      req.params,
      PlayerObject.pick({ player_id: true }),
    )

    // Get player from database
    const player = await PlayerModel.getById(params.player_id)

    // Check if player is online
    const is_online = await RedisService.isUserOnline(player.player_id)

    // Parse player to response
    const playerResponse = PlayerService.parsePlayerToResponse(
      player,
      is_online,
    )

    res.json(playerResponse)
  }

  // Gets the current player (the one in session)
  static getCurrent = async (req: Request, res: Response) => {
    // Retrieve player id from session data
    const { player_id } = SessionService.getSessionData(req)

    // Validation of query and body of the request
    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))

    // Get player by player_id from session data
    const player = await PlayerModel.getById(player_id)

    // Mark player as "online"
    await PlayerService.markAsOnline(player.player_id)

    // Parse player to response
    const playerResponse = PlayerService.parsePlayerToResponse(player, true)

    res.json(playerResponse)
  }

  // Updates a player's data
  static update = async (req: Request, res: Response) => {
    // Retrieve player id from session data
    const { player_id: sessionPlayerId } = SessionService.getSessionData(req)
    await PlayerService.markAsOnline(sessionPlayerId)

    // Validation of query and body of the request
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

    // Throw an error if user attempts to update another user
    if (params.player_id !== sessionPlayerId) {
      throw new AuthenticationError("Not allowed", 403)
    }

    // Update player
    const { updatedPlayerResponse } = await PlayerService.updatePlayer(
      params.player_id,
      {
        username: body.username,
      },
    )

    res.json(updatedPlayerResponse)
  }
}
