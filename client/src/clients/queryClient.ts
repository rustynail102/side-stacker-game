import { QueryClient } from "@tanstack/react-query"

/**
 * QueryClient instance for managing data queries and mutations.
 * The QueryClient can be used to prefetch, cache, synchronize and update server state.
 */
export const queryClient = new QueryClient()
