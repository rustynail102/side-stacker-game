import { config } from "@server/config"
import { DatabasePool, createPool, createTypeParserPreset } from "slonik"

/**
 * Database pool instance
 */
export let databasePool: DatabasePool

/**
 * Connects to the database using the URL from the configuration.
 */
export const connectToDb = async () => {
  if (config.dbConfig.url) {
    databasePool = await createPool(config.dbConfig.url, {
      typeParsers: [...createTypeParserPreset()],
    })
  }
}
