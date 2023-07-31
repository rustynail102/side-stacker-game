import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@server/@types/websocketsServer"
import { config } from "@server/config"
import { IncomingMessage, Server, ServerResponse } from "http"
import { Server as SocketIOServer } from "socket.io"

let websocketsServer: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

/**
 * Creates a new WebSocket server using the provided HTTP server.
 * @param httpServer - The HTTP server to upgrade to a WebSocket server.
 * @returns The newly created WebSocket server.
 */
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
    cors: config.appConfig.cors,
  })

  return websocketsServer
}

export { websocketsServer }
