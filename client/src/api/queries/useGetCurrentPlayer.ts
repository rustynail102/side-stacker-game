import { queryKeys } from "@client/api/queryKeys"
import { UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayerResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiQuery } from "@client/hooks/useApiQuery"

/**
 * Hook to get the current player.
 * @param {Object} options - Additional options to pass to the React Query useQuery function.
 * @returns {Object} - The query object from React Query, with the current player added.
 */
export const useGetCurrentPlayer = (
  options?: UseQueryOptions<PlayerResponse, AxiosError, PlayerResponse>,
) => {
  const { data, ...query } = useApiQuery<PlayerResponse, AxiosError>(
    Path.CurrentPlayer,
    queryKeys.players.current,
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
      ...options,
    },
  )

  return {
    ...query,
    currentPlayer: data,
  }
}
