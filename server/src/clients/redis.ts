import RedisStore from "connect-redis"
import { createClient } from "redis"

export const redisClient = createClient()

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
