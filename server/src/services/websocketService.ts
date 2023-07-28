import { QueryKeys } from "@server/@types/api"
import { websocketsServer } from "@server/clients/websocketsServer"

// WebsocketService is responsible for managing WebSocket messages
export class WebsocketService {
  // Sends an 'invalidateQuery' event to all connected clients
  static emitInvalidateQuery = (entity: QueryKeys[], id?: string): void => {
    websocketsServer.emit("invalidateQuery", id ? { entity, id } : { entity })
  }

  // Sends a 'toast' message to all connected clients
  static emitToast = (message: string): void => {
    websocketsServer.emit("toast", message)
  }
}
