import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@server/@types/websocketsServer"
import { IncomingMessage, Server, ServerResponse } from "http"
import { Server as SocketIOServer } from "socket.io"

let websocketsServer: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

export const createWebsocketsServer = (
  httpServer: Server<typeof IncomingMessage, typeof ServerResponse>,
) => {
  websocketsServer = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 10 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
    cors: {
      credentials: true, // allow credentials (cookies)
      origin:
        process.env.NODE_ENV === "development" ? true : process.env.ORIGIN, // allow requests from all origins - needed for testing & development
    },
  })

  return websocketsServer
}

export { websocketsServer }
