import { Player } from "@server/@types/playerObject"
import { RedisKey } from "@server/@types/redis"
import { redisClient } from "@server/clients/redis"

// RedisService is responsible for managing the online status of players in the Redis database
export class RedisService {
  // Adds the given player's ID to the set of online users in Redis
  static addOnlineUser = (player_id: Player["player_id"]) =>
    redisClient.sAdd(RedisKey.OnlineUsers, player_id)

  // Removes the given player's ID from the set of online users in Redis
  static removeOnlineUser = (player_id: Player["player_id"]) =>
    redisClient.sRem(RedisKey.OnlineUsers, player_id)

  // Retrieves the set of online users from Redis
  static getOnlineUsers = () => redisClient.sMembers(RedisKey.OnlineUsers)

  // Checks if the given player's ID is in the set of online users in Redis
  static isUserOnline = (player_id: Player["player_id"]) =>
    redisClient.sIsMember(RedisKey.OnlineUsers, player_id)
}
