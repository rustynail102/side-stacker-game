import { appConfig } from "@server/config/app"
import { dbConfig } from "@server/config/db"
import { redisConfig } from "@server/config/redis"

/**
 * Consolidated configuration settings for the application and database.
 */
export const config = {
  appConfig,
  dbConfig,
  redisConfig,
}
