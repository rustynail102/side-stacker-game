import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@app/@types/websocketsServer"
import { logWsConnectionsMiddleware } from "@app/middlewares/ws/logWsConnections"
import { logWsErrorsMiddleware } from "@app/middlewares/ws/logWsErrors"
import { Server as SocketIOServer } from "socket.io"

export const useWsMiddlewares = (
  websocketsServer: SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
) => {
  // Websockets errors
  websocketsServer.engine.on("connection_error", logWsErrorsMiddleware)

  // Websockets logging
  websocketsServer.on("connection", logWsConnectionsMiddleware)
}
