import { GameModelSchema } from "@server/features/games/gameModel"
import { MoveModelSchema } from "@server/features/moves/moveModel"
import { PlayerModelSchema } from "@server/features/players/playerModel"
import { DatabasePoolConnection } from "slonik"

export const initDbSchemas = async (connection: DatabasePoolConnection) => {
  await connection.query(PlayerModelSchema)
  await connection.query(GameModelSchema)
  await connection.query(MoveModelSchema)
}
