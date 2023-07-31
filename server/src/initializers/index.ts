import { initDb } from "@server/initializers/db"
import { initRedis } from "@server/initializers/redis"

/**
 * Various initializers
 */
export const initializers = [initDb, initRedis]
