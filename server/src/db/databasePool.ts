import { config } from "@server/config"
import { DatabasePool, createPool, createTypeParserPreset } from "slonik"

export let databasePool: DatabasePool

export const connectToDb = async () => {
  if (config.dbConfig.url) {
    databasePool = await createPool(config.dbConfig.url, {
      typeParsers: [...createTypeParserPreset()],
    })
  }
}
