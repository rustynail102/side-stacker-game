import { Player } from "@server/@types/playerObject"
import { websocketsServer } from "@server/clients/websocketsServer"
import { AuthenticationError } from "@server/errors/authenticationError"
import { InternalServerError } from "@server/errors/internalServerError"
import { Request, Response } from "express"

// SessionService is responsible for managing the HTTP sessions
export class SessionService {
  // Stores the session data on the request
  static setSessionData = (
    req: Request,
    { player_id }: Pick<Player, "player_id">,
  ) => {
    req.session.player_id = player_id

    req.session.save((err) => {
      if (err) {
        console.log("Session was not saved", err)
      } else {
        console.log("Session was saved")
      }
    })
  }

  // Retrieves the session data from the request
  static getSessionData = (req: Request) => {
    const player_id = req.session.player_id

    if (!player_id) {
      throw new AuthenticationError("Invalid credentials")
    }

    return req.session
  }

  // Destroys the session and disconnects all sockets associated with the session
  static destroySession = (req: Request, res: Response) => {
    const sessionId = req.session.id

    req.session.destroy((err) => {
      if (err) {
        console.error("Error while destroying session", err)
        throw new InternalServerError()
      } else {
        websocketsServer.in(sessionId).disconnectSockets()

        // Clear the session cookie
        res.clearCookie("session")
        // Session is successfully destroyed
        res.sendStatus(204) // Send a "No Content" response
      }
    })
  }
}
