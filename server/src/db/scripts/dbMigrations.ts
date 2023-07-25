import {
  createSqlTag,
  DatabasePoolConnection,
  DatabaseTransactionConnection,
} from "slonik"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { MigrationObject } from "@server/db/utils/objects/migrationObject"
import { z } from "zod"

// SQL tag for migrations, with type aliases for migration and null
export const migrationsSql = createSqlTag({
  typeAliases: {
    migration: MigrationObject,
    null: z.null(),
  },
})

// Returns the directory path for the given migration type ("up" or "down")
export const getMigrationsDir = (type: "up" | "down") =>
  path.resolve(process.cwd(), `src/db/migrations/${type}`)

// Reads and sorts the migration files in the given directory
export const getMigrationFiles = async (migrationsDir: string) => {
  const migrationFiles = await readdir(migrationsDir)

  migrationFiles.sort()

  return migrationFiles
}

// Fetches the names of all executed migrations from the database
export const getExecutedMigrations = async (
  connection: DatabasePoolConnection,
) => {
  const executedMigrations = await connection.query(
    migrationsSql.typeAlias("migration")`
      SELECT name 
      FROM migrations
    `,
  )
  return executedMigrations.rows.map((migration) => migration.name)
}

// Executes the given migration file within the provided transaction
export const executeMigration = async (
  transactionConnection: DatabaseTransactionConnection,
  migrationsDir: string,
  file: string,
) => {
  const migrationFileSql = await readFile(
    path.join(migrationsDir, file),
    "utf8",
  )

  await transactionConnection.query(migrationsSql.unsafe([migrationFileSql]))
}
