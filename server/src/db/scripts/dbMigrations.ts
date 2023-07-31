import {
  createSqlTag,
  DatabasePoolConnection,
  DatabaseTransactionConnection,
} from "slonik"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { MigrationObject } from "@server/db/utils/objects/migrationObject"
import { z } from "zod"

/**
 * SQL tag for migrations, with type aliases for migration and null
 */
export const migrationsSql = createSqlTag({
  typeAliases: {
    migration: MigrationObject,
    null: z.null(),
  },
})

/**
 * Returns the directory path for the given migration type ("up" or "down")
 * @param {String} type - Path of migrations directory
 * @returns {String} - Migrations directory
 */
export const getMigrationsDir = (type: "up" | "down") =>
  path.resolve(process.cwd(), `src/db/migrations/${type}`)

/**
 * Reads and sorts the migration files in the given directory
 * @param {String} migrationsDir - Path of migrations directory
 * @returns {Promise<string[]>} - Array of migration files
 */
export const getMigrationFiles = async (migrationsDir: string) => {
  const migrationFiles = await readdir(migrationsDir)

  migrationFiles.sort()

  return migrationFiles
}

/**
 * Fetches the names of all executed migrations from the database
 * @param {DatabasePoolConnection} connection - The database pool connection to use.
 * @returns {Promise<string[]>} - Array of executed migrations
 */
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

/**
 * Executes the given migration file within the provided transaction.
 * @param {DatabaseTransactionConnection} transactionConnection - The database transaction connection to use.
 * @param {String} migrationsDir - The directory containing the migration files.
 * @param {String} file - The name of the migration file to execute.
 */
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
