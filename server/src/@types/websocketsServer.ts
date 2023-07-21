export interface ServerToClientEvents {
  invalidateQuery: (queryKeys: {
    entity: string[]
    id?: string | number
  }) => void
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
