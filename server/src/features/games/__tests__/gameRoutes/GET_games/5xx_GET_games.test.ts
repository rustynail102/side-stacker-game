import { databasePool } from "@server/db/databasePool"
import { app, httpServer, startServer } from "@server/index"
import {
  BackendTerminatedError,
  ConnectionError,
  StatementCancelledError,
  StatementTimeoutError,
  TupleMovedToAnotherPartitionError,
  createSqlTag,
} from "slonik"
import { PlayerObject } from "@server/features/players/playerObject"
import { GameObject } from "@server/features/games/gameObject"
import session from "supertest-session"
import { websocketsServer } from "@server/clients/websocketsServer"
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

describe("5xx - GET /games", () => {
  it("500 - backend is terminated by the user - should return an error 500 (BackendTerminatedError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new BackendTerminatedError(new Error())
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 500,
      errors: ["Backend has been terminated. "],
    })
  })

  it("500 - connection cannot be established to the PostgreSQL server - should return an error 500 (ConnectionError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new ConnectionError("ConnectionError")
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 500,
      errors: ["ConnectionError"],
    })
  })

  it("500 - query is cancelled by the user - should return an error 500 (StatementCancelledError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new StatementCancelledError(new Error())
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 500,
      errors: ["Statement has been cancelled. "],
    })
  })

  it("500 - affecting tuple moved into different partition - should return an error 500 (TupleMovedToAnotherPartitionError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new TupleMovedToAnotherPartitionError(new Error())
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 500,
      errors: ["Tuple moved to another partition due to concurrent update. "],
    })
  })

  it("500 - timeout - should return an error 500 (StatementTimeoutError)", async () => {
    // Mock the database connection only for the next call
    jest.spyOn(databasePool, "connect").mockImplementationOnce(() => {
      throw new StatementTimeoutError(new Error())
    })

    const getGamesResponse = await testSession
      .get("/games")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)

    // Check the response
    expect(getGamesResponse.body).toMatchObject({
      code: 500,
      errors: ["Statement has been cancelled due to a statement_timeout. "],
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
