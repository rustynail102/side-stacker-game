import { connectToRedis } from "@server/clients/redis"

/**
 * initRedis connects to the Redis server.
 */
export const initRedis = async () => {
  await connectToRedis()
}
