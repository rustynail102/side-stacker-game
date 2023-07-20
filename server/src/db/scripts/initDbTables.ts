import { GamesTableInit } from "@app/features/games/gameModel"
import { MovesTableInit } from "@app/features/moves/moveModel"
import { PlayersTableInit } from "@app/features/players/playerModel"
import { DatabasePoolConnection } from "slonik"

export const initDbTables = async (connection: DatabasePoolConnection) => {
  await connection.query(PlayersTableInit)
  await connection.query(GamesTableInit)
  await connection.query(MovesTableInit)
}
