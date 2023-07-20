import { pool } from "@app/db/pool"
import { MoveModelGetAll } from "@app/features/moves/@types/moveModel"
import { Move } from "@app/features/moves/@types/moveObject"
import { MoveObject } from "@app/features/moves/moveObject"
import { createSqlTag } from "slonik"

const sql = createSqlTag({
  typeAliases: {
    move: MoveObject,
  },
})

export class MoveModel {
  static create = ({
    game_id,
    player_id,
    move_number,
    position_x,
    position_y,
  }: Pick<
    Move,
    "game_id" | "player_id" | "move_number" | "position_x" | "position_y"
  >): Promise<Move> =>
    pool.connect(async (connection) => {
      const query = sql.typeAlias("move")`
          INSERT 
          INTO moves (move_id, game_id, player_id, move_number, position_x, position_y, created_at) 
          VALUES (uuid_generate_v4(), ${game_id}, ${player_id}, ${move_number}, ${position_x}, ${position_y}, NOW())
          RETURNING *
        `

      const { rows } = await connection.query(query)

      return rows[0]
    })

  static getAll = ({ filters }: MoveModelGetAll): Promise<readonly Move[]> =>
    pool.connect(async (connection) => {
      const filtersFragments = []

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          filtersFragments.push(
            sql.fragment`${sql.identifier([key])} = ${value}`,
          )
        }
      }

      const query = sql.typeAlias("move")`
        SELECT * 
        FROM moves 
        WHERE ${sql.join(filtersFragments, sql.unsafe`, `)}
      `

      return connection.many(query)
    })

  static getById = (move_id: Move["move_id"]): Promise<Move> =>
    pool.connect(async (connection) =>
      connection.one(
        sql.typeAlias("move")`
            SELECT * 
            FROM moves 
            WHERE move_id = ${move_id}
          `,
      ),
    )
}

export const MovesTableInit = sql.unsafe`
  CREATE TABLE IF NOT EXISTS moves (
    move_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(game_id),
    player_id UUID NOT NULL REFERENCES players(player_id),
    move_number INTEGER NOT NULL,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`
