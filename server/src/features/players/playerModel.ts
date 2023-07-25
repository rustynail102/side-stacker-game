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

const sql = createSqlTag({
  typeAliases: {
    null: z.null(),
    player: PlayerObject,
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

  static create = ({ username }: Pick<Player, "username">): Promise<Player> =>
    databasePool.connect(async (connection) => {
      const query = sql.typeAlias("player")`
          INSERT 
          INTO players (
            player_id, 
            username, 
            created_at, 
            last_active_at, 
            deleted_at
          ) 
          VALUES (
            uuid_generate_v4(), 
            ${username}, 
            NOW(), 
            NOW(), 
            NULL
          )
          RETURNING *
        `

      const { rows } = await connection.query(query)

      return rows[0]
    })

  static delete = (player_id: Player["player_id"]): Promise<Player> =>
    databasePool.connect(async (connection) => {
      const fragments = [sql.fragment`deleted_at = NOW()`]

      const query = sql.typeAlias("player")`
        UPDATE players
        SET ${sql.join(fragments, sql.unsafe`, `)}
        WHERE player_id = ${player_id}
        RETURNING *
      `

      return PlayerModel.executeQuery(connection, query)
    })

  static getAll = ({
    limit = 20,
    offset = 0,
    orderBy = "last_active_at",
    orderDirection = OrderDirection.DESC,
  }: PlayerModelGetAll): Promise<readonly Player[]> =>
    databasePool.connect(async (connection) => {
      const direction = orderDirection === OrderDirection.ASC ? "ASC" : "DESC"
      const query = sql.typeAlias("player")`
        SELECT * 
        FROM players 
        WHERE deleted_at IS NULL
        ORDER BY ${sql.identifier([orderBy])} ${sql.unsafe([direction])} 
        LIMIT ${limit} 
        OFFSET ${offset}
      `

      return connection.many(query)
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
  ): Promise<Player> =>
    databasePool.connect(async (connection) => {
      const fragments = [sql.fragment`last_active_at = NOW()`]

      if (username !== undefined) {
        fragments.push(sql.fragment`username = ${username}`)
      }

      const query = sql.typeAlias("player")`
          UPDATE players
          SET ${sql.join(fragments, sql.unsafe`, `)}
          WHERE player_id = ${player_id}
          RETURNING *
        `

      return PlayerModel.executeQuery(connection, query)
    })
}

export const PlayerModelSchema = sql.unsafe`
  CREATE TABLE IF NOT EXISTS players (
    player_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
  );
`
