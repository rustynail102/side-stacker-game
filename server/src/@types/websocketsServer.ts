import { QueryKey } from "@server/@types/api"

export interface InvalidateQueryPayload {
  entity: QueryKey[]
  id?: string | number
}
export interface ServerToClientEvents {
  invalidateQuery: (queryKeys: InvalidateQueryPayload) => void
  toast: (message: string) => void
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
