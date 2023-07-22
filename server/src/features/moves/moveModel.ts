import { databasePool } from "@app/db/databasePool"
import { MoveModelGetAll } from "@app/@types/moveModel"
import { Move } from "@app/@types/moveObject"
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
    move_number,
    move_type,
    player_id,
    position_x,
    position_y,
  }: Pick<
    Move,
    | "game_id"
    | "player_id"
    | "move_number"
    | "move_type"
    | "position_x"
    | "position_y"
  >): Promise<Move> =>
    databasePool.connect(async (connection) => {
      const query = sql.typeAlias("move")`
          INSERT 
          INTO moves (move_id, game_id, player_id, move_number, move_type, position_x, position_y, created_at) 
          VALUES (
            uuid_generate_v4(), 
            ${game_id}, 
            ${player_id}, 
            ${move_number}, 
            ${move_type},
            ${position_x}, 
            ${position_y}, 
            NOW()
          )
          RETURNING *
        `

      const { rows } = await connection.query(query)

      return rows[0]
    })

  static getAll = ({ filters }: MoveModelGetAll): Promise<readonly Move[]> =>
    databasePool.connect(async (connection) => {
      const filtersFragments = []

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value) {
            filtersFragments.push(
              sql.fragment`${sql.identifier([key])} = ${value}`,
            )
          }
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
    databasePool.connect(async (connection) =>
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
  DO $$ BEGIN
    CREATE TYPE move_type AS ENUM ('X', 'O');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;


  CREATE TABLE IF NOT EXISTS moves (
    move_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(game_id),
    player_id UUID NOT NULL REFERENCES players(player_id),
    move_number INTEGER NOT NULL,
    move_type move_type NOT NULL,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`
