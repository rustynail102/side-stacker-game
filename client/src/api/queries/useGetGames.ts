import { queryKeys } from "@client/api/queryKeys"
import { UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { GamesGetAllQueryParams, GamesResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiQuery } from "@client/hooks/useApiQuery"

/**
 * Hook to get a list of games.
 * @param {Object} params - Parameters query params.
 * @param {Object} options - Additional options to pass to the React Query useQuery function.
 * @returns {Object} - The query object from React Query, with the games and total number of results added.
 */
export const useGetGames = (
  params?: GamesGetAllQueryParams,
  options?: UseQueryOptions<GamesResponse, AxiosError, GamesResponse>,
) => {
  const { data, ...query } = useApiQuery<GamesResponse, AxiosError>(
    Path.Games,
    queryKeys.games.list(params),
    options,
    { params },
  )

  const { games, total } = data || {}

  return {
    ...query,
    games,
    total,
  }
}
