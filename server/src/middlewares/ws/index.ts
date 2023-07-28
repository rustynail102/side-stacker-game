import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@server/@types/websocketsServer"
import { httpSessionMiddleware } from "@server/middlewares/http/httpSession"
import { handleSocketConnectionMiddleware } from "@server/middlewares/ws/handleSocketConnection"
import { logWsErrorsMiddleware } from "@server/middlewares/ws/logWsErrors"
import { Server as SocketIOServer } from "socket.io"

export const useWsMiddlewares = (
  websocketsServer: SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
) => {
  // Use express-session middleware
  websocketsServer.engine.use(httpSessionMiddleware)

  // Websockets errors middleware
  websocketsServer.engine.on("connection_error", logWsErrorsMiddleware)

  // Handle socket connection middleware
  websocketsServer.on("connection", handleSocketConnectionMiddleware)
}
