import { queryKeys } from "@client/api/queryKeys"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayerResponse } from "@server/@types/api"
import { useToast } from "@client/hooks/useToast"
import { getAxiosError } from "@client/helpers/api/getAxiosError"

export const useGetPlayer = (
  params?: Pick<PlayerResponse, "player_id">,
  options?: UseQueryOptions<PlayerResponse, AxiosError, PlayerResponse>,
) => {
  const { errorToast } = useToast()

  const getPlayerQuery = useQuery({
    enabled: Boolean(params?.player_id),
    onError: (error) => {
      const apiError = getAxiosError(error)

      if (apiError) {
        apiError.errors.forEach((message) => {
          errorToast(message)
        })
      }
    },
    queryFn: () =>
      axiosGet<PlayerResponse>(`/players/${params?.player_id || ""}`),
    queryKey: queryKeys.players.detail(params?.player_id),
    ...options,
  })

  const player = getPlayerQuery.data

  return {
    ...getPlayerQuery,
    player,
  }
}
