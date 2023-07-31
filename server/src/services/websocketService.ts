import { QueryKeys } from "@server/@types/api"
import { websocketsServer } from "@server/clients/websocketsServer"

/**
 * WebsocketService is responsible for managing WebSocket messages.
 */
export class WebsocketService {
  /**
   * Sends an 'invalidateQuery' event to all connected clients.
   * @param entity - Entities to invalidate.
   * @param id - Optional entity ID.
   */
  static emitInvalidateQuery = (entity: QueryKeys[], id?: string): void => {
    websocketsServer.emit("invalidateQuery", id ? { entity, id } : { entity })
  }

  /**
   * Sends a 'toast' message to all connected clients.
   * @param message - Message to be displayed.
   */
  static emitToast = (message: string): void => {
    websocketsServer.emit("toast", message)
  }
}
