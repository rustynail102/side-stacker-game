import { databasePool } from "@server/db/databasePool"
import { Move } from "@server/@types/moveObject"
import { MoveObject } from "@server/features/moves/moveObject"
import { createSqlTag } from "slonik"

const sql = createSqlTag({
  typeAliases: {
    move: MoveObject,
  },
})

/**
 * The MoveModel class provides methods for performing database operations on the moves table.
 */
export class MoveModel {
  /**
   * Inserts a new move record into the database.
   * @param move - An object containing the details of the move to create.
   * @returns A Promise that resolves with the created move.
   */
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
}

/**
 * SQL query to create the moves table in the database if it does not already exist.
 */
export const MoveModelSchema = sql.unsafe`
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
