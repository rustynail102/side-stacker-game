import { PlayersTableInit } from "@app/features/players/playerModel"
import { DatabasePoolConnection } from "slonik"

export const initDbTables = async (connection: DatabasePoolConnection) => {
  await connection.query(PlayersTableInit)
}
