import { databasePool } from "@server/db/databasePool"
import { app, httpServer, startServer } from "@server/index"
import { createSqlTag } from "slonik"
import { PlayerObject } from "@server/features/players/playerObject"
import { GameObject, GameStateEnum } from "@server/features/games/gameObject"
import {
  createGames,
  createRandomGame,
} from "@server/features/games/__mocks__/game"
import { createTestPlayers } from "@server/features/players/__mocks__/player"
import session from "supertest-session"
import { websocketsServer } from "@server/clients/websocketsServer"
import qs from "qs"
import { validateGamesGetResponse } from "@server/helpers/tests/validateGamesGetResponse"
import { RedisService } from "@server/services/redisService"
import { queryUser } from "@server/helpers/tests/queryUser"
import { FilterType } from "@server/@types/models"
import { redisClient } from "@server/clients/redis"

const sql = createSqlTag({
  typeAliases: {
    game: GameObject,
    player: PlayerObject,
  },
})

let testSession: session.SuperTestSession

beforeAll(async () => {
  await startServer()
})

beforeEach(async () => {
  // Clear the database before each test
  await databasePool.connect(async (connection) => {
    await connection.query(sql.unsafe`DELETE FROM games`)
    await connection.query(sql.unsafe`DELETE FROM players`)
  })

  testSession = session(app)

  await testSession
    .post("/players")
    .send({ password: "password", username: "testSession" })
    .expect(200)

  await testSession
    .post("/auth/sign-in")
    .send({ password: "password", username: "testSession" })
    .expect(200)
})

describe("2xx - GET /games", () => {
  it("200 - no params - should return an array of games", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2] = await createTestPlayers(connection)

      // Create test games
      const game1 = {
        ...createRandomGame(),
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game2 = {
        ...createRandomGame(),
        player1_id: player2.player_id,
        player2_id: player1.player_id,
      }

      await createGames(connection, [game1, game2])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Check if user making the request is online
      const authenticatedUser = await queryUser(connection, "testSession")
      const isOnline = await RedisService.isUserOnline(
        authenticatedUser.player_id,
      )
      expect(isOnline).toBe(true)

      // Check the response data
      validateGamesGetResponse(getGamesResponse, {
        games: [game2, game1],
        total: 2,
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(2)
    })
  })

  it("200 - empty database - should return empty array", async () => {
    await databasePool.connect(async (connection) => {
      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Check the response data
      validateGamesGetResponse(getGamesResponse, {
        games: [],
        total: 0,
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(0)
    })
  })

  it("200 - { limit: 1 } - should return 1 game", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2] = await createTestPlayers(connection)

      const game1 = {
        ...createRandomGame(),
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game2 = {
        ...createRandomGame(),
        player1_id: player2.player_id,
        player2_id: player1.player_id,
      }
      const game3 = {
        ...createRandomGame(),
        player1_id: player2.player_id,
        player2_id: player1.player_id,
      }

      await createGames(connection, [game1, game2, game3])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .query({ limit: 1 })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Check the response data
      validateGamesGetResponse(getGamesResponse, {
        games: [game3],
        total: 3,
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(3)
    })
  })

  it("200 - { limit: 1, offset: 1 } - should return 1 game with an offset", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2] = await createTestPlayers(connection)

      const game1 = {
        ...createRandomGame(),
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game2 = {
        ...createRandomGame(),
        player1_id: player2.player_id,
        player2_id: player1.player_id,
      }
      const game3 = {
        ...createRandomGame(),
        player1_id: player2.player_id,
        player2_id: player1.player_id,
      }

      await createGames(connection, [game1, game2, game3])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .query({ limit: 1, offset: 1 })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Check the response data
      validateGamesGetResponse(getGamesResponse, {
        games: [game2],
        total: 3,
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(3)
    })
  })

  it("200 - { filters: [{ conditions: { current_game_state: 'in_progress' } }] } - should return only games in progress", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2] = await createTestPlayers(connection)

      const game1 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.waiting_for_players,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game2 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.in_progress,
        player1_id: player2.player_id,
        player2_id: player1.player_id,
      }
      const game3 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.finished,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game4 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.in_progress,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }

      // Set up data for the test
      await createGames(connection, [game1, game2, game3, game4])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .query(
          qs.stringify({
            filters: [
              {
                conditions: {
                  current_game_state: GameStateEnum.enum.in_progress,
                },
              },
            ],
          }),
        )
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Check the response data
      validateGamesGetResponse(getGamesResponse, {
        games: [game4, game2],
        total: 2,
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(4)
    })
  })

  it("200 - complex filters - should return only games matching the filters", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2, player3, player4] = await createTestPlayers(
        connection,
      )

      const game1 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.waiting_for_players,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game2 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.in_progress,
        player1_id: player3.player_id,
        player2_id: player4.player_id,
      }
      const game3 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.finished,
        player1_id: player1.player_id,
        player2_id: player3.player_id,
      }
      const game4 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.waiting_for_players,
        player1_id: player1.player_id,
        player2_id: player4.player_id,
      }
      const game5 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.in_progress,
        player1_id: player2.player_id,
        player2_id: player3.player_id,
      }
      const game6 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.finished,
        player1_id: player2.player_id,
        player2_id: player4.player_id,
      }

      // Set up data for the test
      await createGames(connection, [game1, game2, game3, game4, game5, game6])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .query(
          qs.stringify({
            filters: [
              {
                conditions: {
                  current_game_state: GameStateEnum.enum.in_progress,
                  player1_id: player2.player_id,
                },
                filterType: FilterType.AND,
              },
              {
                conditions: {
                  current_game_state: GameStateEnum.enum.finished,
                  player2_id: player3.player_id,
                },
                filterType: FilterType.AND,
              },
            ],
          }),
        )
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Check the response data
      validateGamesGetResponse(getGamesResponse, {
        games: [game5, game3],
        total: 2,
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(6)
    })
  })

  it("200 - { orderBy: 'created_at', orderDirection: 'ASC' } - should return games from the earliest one", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2] = await createTestPlayers(connection)
      const game1 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.waiting_for_players,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game2 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.in_progress,
        player1_id: player2.player_id,
        player2_id: player1.player_id,
      }
      const game3 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.finished,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }
      const game4 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.in_progress,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }

      // Set up data for the test
      await createGames(connection, [game1, game2, game3, game4])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .query(
          qs.stringify({
            orderBy: "created_at",
            orderDirection: "ASC",
          }),
        )
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      // Check the response data
      validateGamesGetResponse(getGamesResponse, {
        games: [game1, game2, game3, game4],
        total: 4,
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(4)
    })
  })
})

afterAll(async () => {
  // Clear the database after each test
  await databasePool.connect(async (connection) => {
    await connection.query(sql.unsafe`DELETE FROM games`)
    await connection.query(sql.unsafe`DELETE FROM players`)
  })

  await databasePool.end()
  await redisClient.disconnect()

  httpServer.close()
  websocketsServer.close()
})
