import { Move } from "@server/@types/moveObject"
import { convertObjectToObjectWithIsoDates } from "@server/helpers/objects/convertObjectToObjectWithIsoDates"

export class MoveService {
  static parseMoveToResponse = (move: Move) => {
    const { created_at, ...rest } = move

    return {
      ...rest,
      ...convertObjectToObjectWithIsoDates({ created_at }, ["created_at"]),
    }
  }
}
