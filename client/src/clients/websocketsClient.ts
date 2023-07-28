import { config } from "@client/config"
import { io } from "socket.io-client"

export const websocketsClient = io(config.api.httpBaseUrl, {
  autoConnect: true,
  withCredentials: true,
})
