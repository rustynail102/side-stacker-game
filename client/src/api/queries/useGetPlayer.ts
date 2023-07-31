import { queryKeys } from "@client/api/queryKeys"
import { UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayerResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiQuery } from "@client/hooks/useApiQuery"

/**
 * Hook to get a specific player.
 * @param {Object} params - Parameters for the player to get.
 * @param {Object} options - Additional options to pass to the React Query useQuery function.
 * @returns {Object} - The query object from React Query, with the player response added.
 */
export const useGetPlayer = (
  params?: Pick<PlayerResponse, "player_id">,
  options?: UseQueryOptions<PlayerResponse, AxiosError, PlayerResponse>,
) => {
  const { data, ...query } = useApiQuery<PlayerResponse, AxiosError>(
    Path.Player.replace(":player_id", params?.player_id || ""),
    queryKeys.players.detail(params?.player_id),
    {
      enabled: Boolean(params?.player_id),
      ...options,
    },
  )

  return {
    ...query,
    player: data,
  }
}
