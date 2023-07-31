import { config } from "@client/config"
import { io } from "socket.io-client"

/**
 * WebSocket client to enable real-time communication with the server.
 * @property {string} url - The base URL for the API endpoints.
 * @property {boolean} autoConnect - Specifies whether the socket should automatically connect upon instantiation.
 * @property {boolean} withCredentials - Tells the client to send cookies from the origin.
 */
export const websocketsClient = io(config.api.httpBaseUrl, {
  autoConnect: true,
  withCredentials: true,
})
