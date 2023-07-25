import { QueryKeys } from "@server/@types/api"
import { websocketsServer } from "@server/clients/websocketsServer"

export class WebsocketService {
  static emitInvalidateQuery = (entity: QueryKeys[], id?: string): void => {
    websocketsServer.emit("invalidateQuery", id ? { entity, id } : { entity })
  }

  static emitToast = (message: string): void => {
    websocketsServer.emit("toast", message)
  }
}
