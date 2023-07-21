import { websocketsServer } from "@app/clients/websocketsServer"

export class WebsocketService {
  static emitInvalidateQuery = (entity: string[], id?: string): void => {
    websocketsServer.emit("invalidateQuery", { entity })
    if (id) {
      websocketsServer.emit("invalidateQuery", { entity, id })
    }
  }
}
