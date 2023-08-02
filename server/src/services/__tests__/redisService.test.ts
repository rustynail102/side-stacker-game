import { redisClient } from "@server/clients/redis"
import { websocketsServer } from "@server/clients/websocketsServer"
import { databasePool } from "@server/db/databasePool"
import { httpServer, startServer } from "@server/index"
import { RedisService } from "@server/services/redisService"

beforeAll(async () => {
  await startServer()
})

beforeEach(async () => {
  await redisClient.flushAll()
})

describe("RedisService", () => {
  it("should be able to add player_id to, remove player_id from Redis storage", async () => {
    const player1_id = "0999b114-f658-4e5f-a55e-f98736d5f4d5"
    const player2_id = "c455fb48-46a3-4e04-946d-83fa8d1c78ee"

    let onlineUsers = []

    onlineUsers = await RedisService.getOnlineUsers()
    expect(onlineUsers).toEqual([])

    await RedisService.addOnlineUser(player1_id)

    onlineUsers = await RedisService.getOnlineUsers()
    expect(onlineUsers.sort()).toEqual([player1_id])

    await RedisService.addOnlineUser(player2_id)

    onlineUsers = await RedisService.getOnlineUsers()
    expect(onlineUsers.sort()).toEqual([player1_id, player2_id].sort())

    await RedisService.removeOnlineUser(player1_id)

    onlineUsers = await RedisService.getOnlineUsers()
    expect(onlineUsers.sort()).toEqual([player2_id])

    await RedisService.removeOnlineUser(player2_id)

    onlineUsers = await RedisService.getOnlineUsers()
    expect(onlineUsers).toEqual([])
  })

  it("should be able to check if given player_id is online in Redis storage", async () => {
    const player1_id = "0999b114-f658-4e5f-a55e-f98736d5f4d5"

    let onlineUsers = [],
      isPlayerOnline = false

    onlineUsers = await RedisService.getOnlineUsers()
    expect(onlineUsers).toEqual([])

    isPlayerOnline = await RedisService.isUserOnline(player1_id)
    expect(isPlayerOnline).toEqual(false)

    await RedisService.addOnlineUser(player1_id)

    onlineUsers = await RedisService.getOnlineUsers()
    expect(onlineUsers).toEqual([player1_id])

    isPlayerOnline = await RedisService.isUserOnline(player1_id)
    expect(isPlayerOnline).toEqual(true)
  })
})

afterAll(async () => {
  await databasePool.end()
  await redisClient.disconnect()

  httpServer.close()
  websocketsServer.close()
})
