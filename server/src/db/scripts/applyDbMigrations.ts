import { DatabasePoolConnection } from "slonik"
import { MigrationsTableInit } from "@server/db/utils/tables/migrationTable"
import {
  executeMigration,
  getExecutedMigrations,
  getMigrationFiles,
  getMigrationsDir,
  migrationsSql,
} from "@server/db/scripts/dbMigrations"

// Applies all pending migrations to the database
export const applyDbMigrations = async (connection: DatabasePoolConnection) => {
  await connection.query(MigrationsTableInit)

  const migrationsDir = getMigrationsDir("up")
  const migrationFiles = await getMigrationFiles(migrationsDir)
  const executedMigrations = await getExecutedMigrations(connection)

  for (const file of migrationFiles) {
    if (executedMigrations.includes(file)) {
      console.log(`Skipping already executed migration: ${file}`)
      continue
    }

    await connection.transaction(async (transactionConnection) => {
      await executeMigration(transactionConnection, migrationsDir, file)

      await transactionConnection.query(migrationsSql.typeAlias("migration")`
        INSERT 
        INTO migrations (executed_at, id, name, type) 
        VALUES (NOW(), uuid_generate_v4(), ${file}, ${"UP"})
        RETURNING *
      `)

      console.log(`Applied migration: ${file}`)
    })
  }
}
