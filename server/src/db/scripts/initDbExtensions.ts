import { DatabasePoolConnection, sql } from "slonik"

/**
 * Initializes the required database extensions.
 * @param connection - The database connection to use.
 */
export const initDbExtensions = async (connection: DatabasePoolConnection) => {
  await connection.query(sql.unsafe`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
}
