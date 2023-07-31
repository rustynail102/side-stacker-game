import { Move } from "@server/@types/moveObject"
import { convertObjectToObjectWithIsoDates } from "@server/helpers/objects/convertObjectToObjectWithIsoDates"

/**
 * MoveService is a class that contains static methods related to move logic.
 */
export class MoveService {
  /**
   * parseMoveToResponse transforms the move object to a response that can be sent to client.
   */
  static parseMoveToResponse = (move: Move) => {
    const { created_at, ...rest } = move

    return {
      ...rest,
      ...convertObjectToObjectWithIsoDates({ created_at }, ["created_at"]),
    }
  }
}
