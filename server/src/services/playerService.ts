import { PlayerResponse } from "@server/@types/api"
import { Player } from "@server/@types/playerObject"
import { convertObjectToObjectWithIsoDates } from "@server/helpers/objects/convertObjectToObjectWithIsoDates"

export class PlayerService {
  static parsePlayerToResponse = (player: Player): PlayerResponse => {
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
  }
}
