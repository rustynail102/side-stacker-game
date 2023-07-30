import { databasePool } from "@server/db/databasePool"
import { OrderDirection } from "@server/@types/models"
import { PlayerModelGetAll } from "@server/@types/playerModel"
import { Player } from "@server/@types/playerObject"
import { PlayerObject } from "@server/features/players/playerObject"
import {
  DatabasePoolConnection,
  NotFoundError,
  QuerySqlToken,
  createSqlTag,
} from "slonik"
import { ZodTypeAny, z } from "zod"
import { CountObject } from "@server/db/utils/objects/countObject"

const sql = createSqlTag({
  typeAliases: {
    count: CountObject,
    null: z.null(),
    player: PlayerObject,
    playerWithoutPassword: PlayerObject.omit({ password: true }),
  },
})

export class PlayerModel {
  private static async executeQuery(
    connection: DatabasePoolConnection,
    query: QuerySqlToken<ZodTypeAny>,
  ) {
    const { rowCount, rows } = await connection.query(query)

    if (rowCount === 0) {
      throw new NotFoundError(query)
    }

    return rows[0]
  }

  static create = ({
    password,
    username,
  }: Pick<Player, "username" | "password">): Promise<
    Omit<Player, "password">
  > =>
    databasePool.connect(async (connection) => {
      const query = sql.typeAlias("playerWithoutPassword")`
          INSERT 
          INTO players (
            player_id, 
            username,
            password, 
            created_at, 
            last_active_at, 
            deleted_at
          ) 
          VALUES (
            uuid_generate_v4(), 
            ${username}, 
            ${password},
            NOW(), 
            NOW(), 
            NULL
          )
          RETURNING player_id, username, created_at, last_active_at, deleted_at
        `

      const { rows } = await connection.query(query)

      return rows[0]
    })

  static delete = (
    player_id: Player["player_id"],
  ): Promise<Omit<Player, "password">> =>
    databasePool.connect(async (connection) => {
      const fragments = [sql.fragment`deleted_at = NOW()`]

      const query = sql.typeAlias("playerWithoutPassword")`
        UPDATE players
        SET ${sql.join(fragments, sql.unsafe`, `)}
        WHERE player_id = ${player_id}
        RETURNING player_id, username, created_at, last_active_at, deleted_at
      `

      return PlayerModel.executeQuery(connection, query)
    })

  static getAll = ({
    filters,
    filterType = "AND",
    limit = 20,
    offset = 0,
    orderBy = "last_active_at",
    orderDirection = OrderDirection.DESC,
  }: PlayerModelGetAll): Promise<{
    players: readonly Player[]
    total: number
  }> =>
    databasePool.connect(async (connection) => {
      const filtersFragments = []

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((val) => {
                filtersFragments.push(
                  sql.fragment`${sql.identifier([key])} = ${val}`,
                )
              })
            } else {
              filtersFragments.push(
                sql.fragment`${sql.identifier([key])} = ${value}`,
              )
            }
          }
        }
      }

      const direction = orderDirection === OrderDirection.ASC ? "ASC" : "DESC"

      const whereFragment =
        filtersFragments.length > 0
          ? sql.fragment`WHERE deleted_at IS NULL AND (${sql.join(
              filtersFragments,
              filterType === "AND" ? sql.unsafe`, ` : sql.unsafe` OR `,
            )})`
          : sql.fragment`WHERE deleted_at IS NULL`

      const query = sql.typeAlias("player")`
        SELECT * 
        FROM players
        ${whereFragment} 
        ORDER BY ${sql.identifier([orderBy])} ${sql.unsafe([direction])} 
        LIMIT ${limit} 
        OFFSET ${offset}
      `

      const countQuery = sql.typeAlias("count")`
        SELECT COUNT(*)
        FROM players
        ${whereFragment} 
      `

      const { rows } = await connection.query(query)
      const countResult = await connection.query(countQuery)
      const total = parseInt(countResult.rows[0].count, 10)

      return {
        players: rows,
        total,
      }
    })

  static getById = (player_id: Player["player_id"]): Promise<Player> =>
    databasePool.connect(async (connection) =>
      connection.one(
        sql.typeAlias("player")`
            SELECT * 
            FROM players 
            WHERE player_id = ${player_id}
          `,
      ),
    )

  static update = (
    player_id: Player["player_id"],
    { username }: Partial<Pick<Player, "username">>,
  ): Promise<Omit<Player, "password">> =>
    databasePool.connect(async (connection) => {
      const fragments = [sql.fragment`last_active_at = NOW()`]

      if (username !== undefined) {
        fragments.push(sql.fragment`username = ${username}`)
      }

      const query = sql.typeAlias("playerWithoutPassword")`
          UPDATE players
          SET ${sql.join(fragments, sql.unsafe`, `)}
          WHERE player_id = ${player_id}
          RETURNING player_id, username, created_at, last_active_at, deleted_at
        `

      return PlayerModel.executeQuery(connection, query)
    })
}

export const PlayerModelSchema = sql.unsafe`
  CREATE TABLE IF NOT EXISTS players (
    player_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
  );
`
