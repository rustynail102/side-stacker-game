import { connectToRedis } from "@server/clients/redis"

export const initRedis = async () => {
  await connectToRedis()
}
