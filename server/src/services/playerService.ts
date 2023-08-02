import { PlayerResponse, QueryKey } from "@server/@types/api"
import { Player } from "@server/@types/playerObject"
import { AuthenticationError } from "@server/errors/authenticationError"
import { ValidationError } from "@server/errors/validationError"
import { PlayerModel } from "@server/features/players/playerModel"
import { convertObjectToObjectWithIsoDates } from "@server/helpers/objects/convertObjectToObjectWithIsoDates"
import { PasswordService } from "@server/services/passwordService"
import { RedisService } from "@server/services/redisService"
import { WebsocketService } from "@server/services/websocketService"

/**
 * PlayerService is a class that contains static methods related to player logic.
 */
export class PlayerService {
  /**
   * parsePlayerToResponse transforms the player object to a response that can be sent to client.
   */
  static parsePlayerToResponse = (
    player: Omit<Player, "password">,
    is_online?: boolean,
  ): PlayerResponse => {
    const { created_at, deleted_at, last_active_at, player_id, username } =
      player

    return {
      is_online,
      player_id,
      username,
      ...convertObjectToObjectWithIsoDates(
        { created_at, deleted_at, last_active_at },
        ["created_at", "deleted_at", "last_active_at"],
      ),
    }
  }

  /**
    Retrieves the player with the provided username from the database, verifies that the provided password matches the one stored in the database, and returns the player object if the credentials are valid.
  */
  static validateUsernameAndPassword = async (
    username: string,
    password: string,
  ) => {
    const { players } = await PlayerModel.getAll({
      filters: {
        username,
      },
    })

    const player = players[0]

    if (!player) {
      throw new AuthenticationError("Incorrect username or password", 401)
    }

    const isPasswordValid = await PasswordService.verify(
      player.password,
      password,
    )

    if (!isPasswordValid) {
      throw new AuthenticationError("Incorrect username or password", 401)
    }

    return { player }
  }

  /**
    Updates the player's status (last active) in the database and Redis cache to 'online', sends a WebSocket message to invalidate the client's cached player list and player details.
  */
  static markAsOnline = async (
    player_id: Player["player_id"],
    emitEvents = true,
  ) => {
    const player = await PlayerModel.update(player_id, {})
    await RedisService.addOnlineUser(player.player_id)

    if (emitEvents) {
      WebsocketService.emitInvalidateQuery([QueryKey.Players, QueryKey.List])
      WebsocketService.emitInvalidateQuery(
        [QueryKey.Players, QueryKey.Detail],
        player_id,
      )
    }

    return { player }
  }

  /**
    Updates the player's status in the database and Redis cache to 'offline', and sends websocket messages to update the client's state.
  */
  static markAsOffline = async (player_id: Player["player_id"]) => {
    await PlayerModel.update(player_id, {})
    await RedisService.removeOnlineUser(player_id)

    WebsocketService.emitInvalidateQuery([QueryKey.Players, QueryKey.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKey.Players, QueryKey.Detail],
      player_id,
    )
  }

  /**
    Hashes and salts the password. Creates a new player in the database. Updates player in Redis cache to 'online', and sends websocket messages to update the client's state. Emits a toast. Returns newPlayer along with parsed
    newPlayerResponse
  */
  static createNewPlayer = async ({
    password,
    username,
  }: Pick<Player, "username" | "password">) => {
    const hashedPassword = await PasswordService.hash(password)
    const newPlayer = await PlayerModel.create({
      password: hashedPassword,
      username,
    })
    await RedisService.addOnlineUser(newPlayer.player_id)

    WebsocketService.emitInvalidateQuery([QueryKey.Players, QueryKey.List])
    WebsocketService.emitToast(`New Player - ${newPlayer.username}`)

    const newPlayerResponse = PlayerService.parsePlayerToResponse(newPlayer)

    return { newPlayer, newPlayerResponse }
  }

  /**
    Makes sure that username is available. If it's not, it throws ValidationError. 
  */
  static validateUsername = async (username: Player["username"]) => {
    const { players } = await PlayerModel.getAll({
      filters: {
        username,
      },
    })

    if (players.length > 0) {
      throw new ValidationError(`${username} is not available`)
    }
  }

  /**
    Deletes player (soft delete). Remove player from active games. Mark player as offline. 
  */
  static deletePlayer = async (player_id: Player["player_id"]) => {
    const deletedPlayer = await PlayerModel.delete(player_id)

    await PlayerService.markAsOffline(deletedPlayer.player_id)
  }

  /**
    Updates player. Parse player to response, emit toast if username is changed, emit events to invalidate players queries. 
  */
  static updatePlayer = async (
    player_id: Player["player_id"],
    { username }: Partial<Pick<Player, "username">>,
  ) => {
    // Update player
    const updatedPlayer = await PlayerModel.update(player_id, {
      username,
    })

    // Parse player to response
    const updatedPlayerResponse =
      PlayerService.parsePlayerToResponse(updatedPlayer)

    // Emit a toast if username was changed
    if (username) {
      WebsocketService.emitToast(
        `${username} changed name to ${updatedPlayerResponse.username}`,
      )
    }

    // Emit an event to all connected clients to invalidate the players query
    WebsocketService.emitInvalidateQuery([QueryKey.Players, QueryKey.List])
    WebsocketService.emitInvalidateQuery(
      [QueryKey.Players, QueryKey.Detail],
      updatedPlayer.player_id,
    )

    return { updatedPlayerResponse }
  }
}
