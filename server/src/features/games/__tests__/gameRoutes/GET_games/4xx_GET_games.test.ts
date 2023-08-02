import { databasePool } from "@server/db/databasePool"
import { app, httpServer, startServer } from "@server/index"
import {
  DataIntegrityError,
  ForeignKeyIntegrityConstraintViolationError,
  NotNullIntegrityConstraintViolationError,
  UniqueIntegrityConstraintViolationError,
  createSqlTag,
} from "slonik"
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
import supertest from "supertest"
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

describe("4xx - GET /games", () => {
  it("400 - { filters: 'Test', limit: 'ASC', offset: 'ABC', orderBy: 1, orderDirection: 'Lorem' } - should return an error 400 (Bad Request)", async () => {
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

      // Set up data for the test
      await createGames(connection, [game1, game2])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .query(
          qs.stringify({
            filters: "Test",
            limit: "ASC",
            offset: "ABC",
            orderBy: 1,
            orderDirection: "Lorem",
          }),
        )
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)

      // Check the response
      expect(getGamesResponse.body).toMatchObject({
        code: 400,
        errors: [
          "filters - Expected array, received string",
          "limit - Expected number, received nan",
          "offset - Expected number, received nan",
          "orderBy - Invalid enum value. Expected 'created_at' | 'current_game_state' | 'finished_at', received '1'",
          "orderDirection - Invalid enum value. Expected 'ASC' | 'DESC', received 'Lorem'",
        ],
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(2)
    })
  })

  it("400 - body request - should return an error 400 (Bad Request)", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2] = await createTestPlayers(connection)

      const game1 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.waiting_for_players,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }

      // Set up data for the test
      await createGames(connection, [game1])

      // Make a request to the app
      const getGamesResponse = await testSession
        .get("/games")
        .send({ random: "data" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)

      // Check the response
      expect(getGamesResponse.body).toMatchObject({
        code: 400,
        errors: ["random"],
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(1)
    })
  })

  it("401 - no session - should return an error 401 (AuthenticationError)", async () => {
    await databasePool.connect(async (connection) => {
      // Create test players
      const [player1, player2] = await createTestPlayers(connection)

      const game1 = {
        ...createRandomGame(),
        current_game_state: GameStateEnum.enum.waiting_for_players,
        player1_id: player1.player_id,
        player2_id: player2.player_id,
      }

      // Set up data for the test
      await createGames(connection, [game1])

      // Make a request to the app
      const getGamesResponse = await supertest(app)
        .get("/games")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(401)

      // Check the response
      expect(getGamesResponse.body).toMatchObject({
        code: 401,
        errors: ["Invalid credentials"],
      })

      // Check the state of the database
      const result = await connection.query(sql.unsafe`SELECT * FROM games`)
      expect(result.rows).toHaveLength(1)
    })
  })

  it("400 - data result does not match the expectations - should return an error 400 (DataIntegrityError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new DataIntegrityError({
        sql: "SELECT * FROM games LIMIT ${limit}",
        values: ["ABC_123"],
      })
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 400,
      errors: ["Query returns an unexpected result."],
    })
  })

  it("400 - foreign key violation - should return an error 400 (ForeignKeyIntegrityConstraintViolationError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new ForeignKeyIntegrityConstraintViolationError(
        new Error(),
        "update or delete on table 'games' violates foreign key constraint 'player1_id' on table 'players'",
      )
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 400,
      errors: ["Query violates a foreign key integrity constraint. "],
    })
  })

  it("400 - attempt to insert a null value into a non-nullable column - should return an error 400 (NotNullIntegrityConstraintViolationError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new NotNullIntegrityConstraintViolationError(
        new Error(),
        "null value in column 'current_board_status' violates not-null constraint JSONB",
      )
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 400,
      errors: ["Query violates a not NULL integrity constraint. "],
    })
  })

  it("400 - duplicate key violates unique constraint - should return an error 400 (UniqueIntegrityConstraintViolationError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new UniqueIntegrityConstraintViolationError(
        new Error(),
        "duplicate key violates unique constraint",
      )
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 400,
      errors: ["Query violates a unique integrity constraint. "],
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
