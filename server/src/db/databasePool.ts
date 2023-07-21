import { config } from "@app/config"
import { DatabasePool, createPool, createTypeParserPreset } from "slonik"

export let databasePool: DatabasePool

export const connectToDb = async () => {
  databasePool = await createPool(config.dbConfig.url, {
    typeParsers: [...createTypeParserPreset()],
  })
}
