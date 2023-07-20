import { websocketsServer } from "@app/clients/websocketsServer"
import { PlayerModelGetAll } from "@app/features/players/@types/playerModel"
import { PlayerModel } from "@app/features/players/playerModel"
import { PlayerObject } from "@app/features/players/playerObject"
import { convertObjectToObjectWithIsoDates } from "@app/helpers/objects/convertObjectToObjectWithIsoDates"
import { GameService } from "@app/services/gameService"
import { RequestValidationService } from "@app/services/requestValidationService"
import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from "uuid"

export class PlayerController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      RequestValidationService.validateQuery(req.query, [], [], [])
      const { username } = RequestValidationService.validateBody(
        req.body,
        PlayerObject.pick({ username: true }),
      )

      const session_id = uuidv4()

      const newPlayer = await PlayerModel.create({
        session_id,
        username,
      })

      const newPlayerWithIsoDates = {
        ...newPlayer,
        ...convertObjectToObjectWithIsoDates(newPlayer, [
          "created_at",
          "deleted_at",
          "last_active_at",
        ]),
      }

      // Emit an event to all connected clients to invalidate the players query
      websocketsServer.emit("invalidateQuery", {
        entity: ["players", "list"],
      })

      res.json(newPlayerWithIsoDates)
    } catch (error) {
      next(error)
    }
  }

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      RequestValidationService.validateQuery(req.query, [], [], [])
      const { session_id } = RequestValidationService.validateBody(
        req.body,
        PlayerObject.omit({
          created_at: true,
          deleted_at: true,
          last_active_at: true,
          player_id: true,
          username: true,
        }),
      )
      const { player_id } = RequestValidationService.validateParams(
        req.params,
        PlayerObject.pick({ player_id: true }),
      )

      const deletedPlayer = await PlayerModel.delete(player_id, session_id)

      const deletedPlayerWithIsoDates = {
        ...deletedPlayer,
        ...convertObjectToObjectWithIsoDates(deletedPlayer, [
          "created_at",
          "deleted_at",
          "last_active_at",
        ]),
      }

      await GameService.removeDeletedPlayerFromGames(deletedPlayer)

      // Emit an event to all connected clients to invalidate the players query
      websocketsServer.emit("invalidateQuery", {
        entity: ["players", "list"],
      })
      websocketsServer.emit("invalidateQuery", {
        entity: ["players", "detail"],
        id: deletedPlayer.player_id,
      })

      res.json(deletedPlayerWithIsoDates)
    } catch (error) {
      next(error)
    }
  }

  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, orderBy, orderDirection } =
        RequestValidationService.validateQuery(
          req.query,
          ["limit", "offset", "orderDirection", "orderBy"],
          [
            "username",
            "created_at",
            "deleted_at",
            "last_active_at",
            "player_id",
          ],
          [],
        )
      RequestValidationService.validateBody(
        req.body,
        PlayerObject.omit({
          created_at: true,
          deleted_at: true,
          last_active_at: true,
          player_id: true,
          session_id: true,
          username: true,
        }),
      )

      const players = await PlayerModel.getAll({
        limit,
        offset,
        orderBy: orderBy as PlayerModelGetAll["orderBy"],
        orderDirection,
      })

      const playersWithIsoDates = players.map((player) => {
        const { created_at, deleted_at, last_active_at, player_id, username } =
          player

        return {
          player_id,
          username,
          ...convertObjectToObjectWithIsoDates(
            { created_at, deleted_at, last_active_at },
            ["created_at", "deleted_at", "last_active_at"],
          ),
        }
      })

      res.json(playersWithIsoDates)
    } catch (error) {
      next(error)
    }
  }

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      RequestValidationService.validateQuery(req.query, [], [], [])
      RequestValidationService.validateBody(
        req.body,
        PlayerObject.omit({
          created_at: true,
          deleted_at: true,
          last_active_at: true,
          player_id: true,
          session_id: true,
          username: true,
        }),
      )
      const params = RequestValidationService.validateParams(
        req.params,
        PlayerObject.pick({ player_id: true }),
      )

      const player = await PlayerModel.getById(params.player_id)
      const { created_at, deleted_at, last_active_at, player_id, username } =
        player

      const playerWithIsoDates = {
        player_id,
        username,
        ...convertObjectToObjectWithIsoDates(
          { created_at, deleted_at, last_active_at },
          ["created_at", "deleted_at", "last_active_at"],
        ),
      }

      res.json(playerWithIsoDates)
    } catch (error) {
      next(error)
    }
  }

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      RequestValidationService.validateQuery(req.query, [], [], [])
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

      const player = await PlayerModel.update(params.player_id, {
        username: body.username,
      })
      const { created_at, deleted_at, last_active_at, player_id, username } =
        player

      const playerWithIsoDates = {
        player_id,
        username,
        ...convertObjectToObjectWithIsoDates(
          { created_at, deleted_at, last_active_at },
          ["created_at", "deleted_at", "last_active_at"],
        ),
      }

      // Emit an event to all connected clients to invalidate the players query
      websocketsServer.emit("invalidateQuery", {
        entity: ["players", "list"],
      })
      websocketsServer.emit("invalidateQuery", {
        entity: ["players", "detail"],
        id: player_id,
      })

      res.json(playerWithIsoDates)
    } catch (error) {
      next(error)
    }
  }
}
