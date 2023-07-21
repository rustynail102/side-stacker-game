import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@app/@types/websocketsServer"
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
  })

  return websocketsServer
}

export { websocketsServer }
