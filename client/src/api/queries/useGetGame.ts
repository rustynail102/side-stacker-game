import { queryKeys } from "@client/api/queryKeys"
import { UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { GameResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiQuery } from "@client/hooks/useApiQuery"

/**
 * Hook to get a specific game.
 * @param {Object} params - Parameters for the game to get.
 * @param {Object} options - Additional options to pass to the React Query useQuery function.
 * @returns {Object} - The query object from React Query, with the game added.
 */
export const useGetGame = (
  params: Partial<Pick<GameResponse, "game_id">>,
  options?: UseQueryOptions<GameResponse, AxiosError, GameResponse>,
) => {
  const { data, ...query } = useApiQuery<GameResponse, AxiosError>(
    Path.Game.replace(":game_id", params.game_id || ""),
    queryKeys.games.detail(params.game_id),
    {
      enabled: Boolean(params?.game_id),
      ...options,
    },
  )

  return {
    ...query,
    game: data,
  }
}
