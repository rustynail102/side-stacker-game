import { PlayerObject } from "@server/features/players/playerObject"
import { RequestValidationService } from "@server/services/requestValidationService"
import { Request, Response } from "express"
import { z } from "zod"
import { PlayerService } from "@server/services/playerService"
import { SessionService } from "@server/services/sessionService"

/**
 * AuthenticationController contains methods for handling HTTP requests related to authentication.
 */
export class AuthenticationController {
  /**
   * Handles user sign-in requests by validating the provided username and password, marking the user as online, setting the user's session data, and sending a JSON response representing the signed-in player.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  static signIn = async (req: Request, res: Response) => {
    RequestValidationService.validateQuery(req.query, z.object({}))
    const { password, username } = RequestValidationService.validateBody(
      req.body,
      PlayerObject.pick({ password: true, username: true }),
    )

    const { player } = await PlayerService.validateUsernameAndPassword(
      username,
      password,
    )

    await PlayerService.markAsOnline(player.player_id)

    SessionService.setSessionData(req, {
      player_id: player.player_id,
    })

    const playerResponse = PlayerService.parsePlayerToResponse(player)

    res.json(playerResponse)
  }

  /**
    Handles user sign-out requests by marking the user as offline, and destroying the user's session data. If there's no player_id in the session, the request is ignored. This could occur if the user is already signed out.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  static signOut = async (req: Request, res: Response) => {
    const { player_id } = SessionService.getSessionData(req)

    RequestValidationService.validateQuery(req.query, z.object({}))
    RequestValidationService.validateBody(req.body, z.object({}))

    await PlayerService.markAsOffline(player_id)

    SessionService.destroySession(req, res)
  }
}
