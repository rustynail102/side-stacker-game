import { config } from "@server/config"
import RedisStore from "connect-redis"
import { createClient } from "redis"

/**
 * Redis instance
 */
export const redisClient = createClient({
  url: config.redisConfig.url,
})

/**
 * Sets up a connection to a Redis instance and logs errors.
 */
export const connectToRedis = async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error", err))

  await redisClient.connect()

  if (redisClient.isReady && redisClient.isOpen) {
    console.log("Redis is ready to accept connections")
  } else {
    connectToRedis()
  }
}

export const redisStore = new RedisStore({
  client: redisClient,
  prefix: "server:",
})
