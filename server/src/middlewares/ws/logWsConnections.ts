import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@server/@types/websocketsServer"
import { Socket } from "socket.io"

export const logWsConnectionsMiddleware = (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
) => {
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
    console.log("websocketsServer recovery was successful")
  } else {
    console.log("websocketsServer connection")
  }

  console.log("websocketsServer handshake", socket.handshake)
}
