import { connectToDb, databasePool } from "@server/db/databasePool"
import { applyDbMigrations } from "@server/db/scripts/applyDbMigrations"
import { initDbExtensions } from "@server/db/scripts/initDbExtensions"
import { initDbSchemas } from "@server/db/scripts/initDbSchemas"

/**
 * initDb connects to the database, initializes extensions, creates tables,
 * and applies migrations.
 */
export const initDb = async () => {
  await connectToDb()

  await databasePool.connect(async (connection) => {
    // Initialize extensions
    await initDbExtensions(connection)

    // Create tables if they don't exist
    await initDbSchemas(connection)

    // Migrations
    await applyDbMigrations(connection)

    console.log("Database system is ready to accept connections")
  })
}
