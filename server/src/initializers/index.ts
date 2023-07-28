import { initDb } from "@server/initializers/db"
import { initRedis } from "@server/initializers/redis"

export const initializers = [initDb, initRedis]
