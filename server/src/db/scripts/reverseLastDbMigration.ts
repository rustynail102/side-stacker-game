import { connectToDb, databasePool } from "@server/db/databasePool"
import { MigrationsTableInit } from "@server/db/utils/tables/migrationTable"
import {
  getMigrationsDir,
  getMigrationFiles,
  getExecutedMigrations,
  migrationsSql,
  executeMigration,
} from "@server/db/scripts/dbMigrations"

/**
 * Reverses the last applied migration.
 * This is a script that is run from the command line. Run via `yarn db:reverse-migration`
 */
const reverseLastDbMigration = async () => {
  await connectToDb()

  await databasePool.connect(async (connection) => {
    await connection.query(MigrationsTableInit)

    const migrationsDir = getMigrationsDir("down")
    const migrationFiles = await getMigrationFiles(migrationsDir)
    const executedMigrations = await getExecutedMigrations(connection)

    const lastMigrationFile = migrationFiles[migrationFiles.length - 1]

    if (!executedMigrations.includes(lastMigrationFile)) {
      console.log(
        `Skipping reversing of a migration that wasn't executed: ${lastMigrationFile}`,
      )
      return
    }

    await connection.transaction(async (transactionConnection) => {
      await executeMigration(
        transactionConnection,
        migrationsDir,
        lastMigrationFile,
      )

      await transactionConnection.query(
        migrationsSql.typeAlias("null")`
          DELETE 
          FROM migrations 
          WHERE name = ${lastMigrationFile}
        `,
      )

      console.log(`Reversed migration: ${lastMigrationFile}`)
    })
  })
}

reverseLastDbMigration()
