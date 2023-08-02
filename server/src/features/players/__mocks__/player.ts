import { Player } from "@server/@types/playerObject"
import { PlayerObject } from "@server/features/players/playerObject"
import { DatabasePoolConnection, createSqlTag } from "slonik"

const sql = createSqlTag({
  typeAliases: {
    player: PlayerObject,
  },
})

/**
 * Returns SQL query to insert a player mock
 */
export const playerInsertMock = ({
  username,
  password,
}: Required<Pick<Player, "username" | "password">>) => sql.typeAlias("player")`
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

/**
 * Helper function to create players
 */
export const createTestPlayers = async (connection: DatabasePoolConnection) => {
  const player1Query = await connection.query(
    playerInsertMock({
      password: "password",
      username: "user1",
    }),
  )
  const player1 = player1Query.rows[0]

  const player2Query = await connection.query(
    playerInsertMock({
      password: "password",
      username: "user2",
    }),
  )
  const player2 = player2Query.rows[0]

  const player3Query = await connection.query(
    playerInsertMock({
      password: "password",
      username: "user3",
    }),
  )
  const player3 = player3Query.rows[0]

  const player4Query = await connection.query(
    playerInsertMock({
      password: "password",
      username: "user3",
    }),
  )
  const player4 = player4Query.rows[0]

  return [player1, player2, player3, player4]
}
