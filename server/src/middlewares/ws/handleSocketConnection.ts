import { QueryKey } from "@server/@types/api"
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@server/@types/websocketsServer"
import { RedisService } from "@server/services/redisService"
import { WebsocketService } from "@server/services/websocketService"
import { Socket } from "socket.io"

/**
 * handleSocketConnectionMiddleware is a middleware that handles a
 * new WebSocket connection.
 */
export const handleSocketConnectionMiddleware = async (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
) => {
  const req = socket.request
  const player_id = req.session.player_id

  if (!player_id) {
    socket.disconnect()
  } else {
    // Store active players in Redis
    await RedisService.addOnlineUser(player_id)
  }

  socket.on("disconnect", async () => {
    const req = socket.request
    const player_id = req.session.player_id

    if (player_id) {
      await RedisService.removeOnlineUser(player_id)

      WebsocketService.emitInvalidateQuery([QueryKey.Players, QueryKey.List])
      WebsocketService.emitInvalidateQuery(
        [QueryKey.Players, QueryKey.Detail],
        player_id,
      )
    }
  })

  socket.use((__, next) => {
    req.session.reload((err) => {
      if (err) {
        socket.disconnect()
      } else {
        req.session.save()
        next()
      }
    })
  })
}
