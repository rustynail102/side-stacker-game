import { queryKeys } from "@client/api/queryKeys"
import { UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayersGetAllQueryParams, PlayersResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiQuery } from "@client/hooks/useApiQuery"

/**
 * Hook to get a list of players.
 * @param {Object} params - Parameters query params.
 * @param {Object} options - Additional options to pass to the React Query useQuery function.
 * @returns {Object} - The query object from React Query, with the players and total number of results added.
 */
export const useGetPlayers = (
  params?: PlayersGetAllQueryParams,
  options?: UseQueryOptions<PlayersResponse, AxiosError, PlayersResponse>,
) => {
  const { data, ...query } = useApiQuery<PlayersResponse, AxiosError>(
    Path.Players,
    queryKeys.players.list(params),
    options,
    { params },
  )

  const { players, total } = data || {}

  return {
    ...query,
    players,
    total,
  }
}
