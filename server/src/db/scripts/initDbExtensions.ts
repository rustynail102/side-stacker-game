import { DatabasePoolConnection, sql } from "slonik"

export const initDbExtensions = async (connection: DatabasePoolConnection) => {
  await connection.query(sql.unsafe`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
}
