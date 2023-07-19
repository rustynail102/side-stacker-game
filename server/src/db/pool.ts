import { config } from "@app/config"
import { DatabasePool, createPool, createTypeParserPreset } from "slonik"

export let pool: DatabasePool

export const connectToDb = async () => {
  pool = await createPool(config.dbConfig.url, {
    typeParsers: [...createTypeParserPreset()],
  })
}
