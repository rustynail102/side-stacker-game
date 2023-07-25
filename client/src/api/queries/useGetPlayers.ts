import { queryKeys } from "@client/api/queryKeys"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayerResponse, PlayersGetAllQueryParams } from "@server/@types/api"

export const useGetPlayers = (
  params?: PlayersGetAllQueryParams,
  options?: UseQueryOptions<PlayerResponse[], AxiosError, PlayerResponse[]>,
) => {
  const getPlayersQuery = useQuery({
    queryFn: () => axiosGet<PlayerResponse[]>("/players", { params }),
    queryKey: queryKeys.players.list(params),
    ...options,
  })

  const players = getPlayersQuery.data

  return {
    ...getPlayersQuery,
    players,
  }
}
