import { queryKeys } from "@app/api/queryKeys"
import { axiosGet } from "@app/helpers/api/axiosGet"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayerResponse } from "@server/@types/api"

export const useGetPlayer = (
  params?: Pick<PlayerResponse, "player_id">,
  options?: UseQueryOptions<PlayerResponse, AxiosError, PlayerResponse>,
) => {
  const useGetPlayerQuery = useQuery({
    enabled: Boolean(params?.player_id),
    queryFn: () =>
      axiosGet<PlayerResponse>(`/players/${params?.player_id || ""}`),
    queryKey: queryKeys.players.detail(params?.player_id),
    ...options,
  })

  const player = useGetPlayerQuery.data

  return {
    ...useGetPlayerQuery,
    player,
  }
}
