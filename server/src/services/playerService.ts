import { PlayerResponse } from "@app/@types/api"
import { Player } from "@app/@types/playerObject"
import { convertObjectToObjectWithIsoDates } from "@app/helpers/objects/convertObjectToObjectWithIsoDates"

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
