import { connectToDb, pool } from "@app/db/pool"
import { applyDbMigrations } from "@app/db/scripts/applyDbMigrations"
import { initDbExtensions } from "@app/db/scripts/initDbExtensions"

export const initDb = async () => {
  await connectToDb()

  await pool.connect(async (connection) => {
    // Initialize extensions
    await initDbExtensions(connection)

    // Migrations
    await applyDbMigrations(connection)

    console.log("Database system is ready to accept connections")
  })
}
