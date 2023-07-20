import { createSqlTag, DatabasePoolConnection } from "slonik"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { MigrationObject } from "@app/db/utils/objects/migrationObject"
import { MigrationsTableInit } from "@app/db/utils/tables/migrationTable"

const migrationsDir = path.resolve(process.cwd(), "src/db/migrations/up")

const sql = createSqlTag({
  typeAliases: {
    migration: MigrationObject,
  },
})

export const applyDbMigrations = async (connection: DatabasePoolConnection) => {
  await connection.query(MigrationsTableInit)

  const migrationFiles = await readdir(migrationsDir)
  migrationFiles.sort()

  const executedMigrations = await connection.query(
    sql.typeAlias("migration")`
      SELECT name 
      FROM migrations
    `,
  )
  const executedMigrationNames = executedMigrations.rows.map(
    (migration) => migration.name,
  )

  for (const file of migrationFiles) {
    if (executedMigrationNames.includes(file)) {
      console.log(`Skipping already executed migration: ${file}`)
      continue
    }

    await connection.transaction(async (transactionConnection) => {
      const migrationSql = await readFile(
        path.join(migrationsDir, file),
        "utf8",
      )

      await transactionConnection.query(sql.unsafe([migrationSql]))

      const migrationTableQuery = sql.typeAlias("migration")`
          INSERT 
          INTO migrations (executed_at, id, name, type) 
          VALUES (NOW(), uuid_generate_v4(), ${file}, ${"UP"})
          RETURNING *
        `
      await transactionConnection.query(migrationTableQuery)

      console.log(`Applied migration: ${file}`)
    })
  }
}
