import { GameModelSchema } from "@server/features/games/gameModel"
import { MoveModelSchema } from "@server/features/moves/moveModel"
import { PlayerModelSchema } from "@server/features/players/playerModel"
import { DatabasePoolConnection } from "slonik"

/**
 * Initializes the database schemas.
 * @param connection - The database connection to use.
 */
export const initDbSchemas = async (connection: DatabasePoolConnection) => {
  await connection.query(PlayerModelSchema)
  await connection.query(GameModelSchema)
  await connection.query(MoveModelSchema)
}
