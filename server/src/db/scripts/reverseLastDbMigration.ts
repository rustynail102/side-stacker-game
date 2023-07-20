import { createSqlTag } from "slonik"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { MigrationObject } from "@app/db/utils/objects/migrationObject"
import { connectToDb, pool } from "@app/db/pool"
import { MigrationsTableInit } from "@app/db/utils/tables/migrationTable"
import { z } from "zod"

const migrationsDir = path.resolve(process.cwd(), "src/db/migrations/down")

const sql = createSqlTag({
  typeAliases: {
    migration: MigrationObject,
    null: z.null(),
  },
})

const reverseLastDbMigration = async () => {
  await connectToDb()

  await pool.connect(async (connection) => {
    await connection.query(MigrationsTableInit)

    const migrationFiles = await readdir(migrationsDir)
    migrationFiles.sort()

    const executedMigrations = await connection.query(
      sql.typeAlias("migration")`SELECT name FROM migrations`,
    )
    const executedMigrationNames = executedMigrations.rows.map(
      (migration) => migration.name,
    )

    const lastMigrationFile = migrationFiles[migrationFiles.length - 1]

    if (!executedMigrationNames.includes(lastMigrationFile)) {
      console.log(
        `Skipping reversing of a migration that wasn't executed: ${lastMigrationFile}`,
      )
      return
    }

    await connection.transaction(async (transactionConnection) => {
      const migrationSql = await readFile(
        path.join(migrationsDir, lastMigrationFile),
        "utf8",
      )

      await transactionConnection.query(sql.unsafe([migrationSql]))

      const migrationTableQuery = sql.typeAlias("null")`
                DELETE 
                FROM migrations 
                WHERE name = ${lastMigrationFile}
              `
      await transactionConnection.query(migrationTableQuery)

      console.log(`Reversed migration: ${lastMigrationFile}`)
    })
  })
}

reverseLastDbMigration()
