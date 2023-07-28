import { queryKeys } from "@client/api/queryKeys"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayerResponse, PlayersGetAllQueryParams } from "@server/@types/api"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { Path } from "@server/routes/paths"

export const useGetPlayers = (
  params?: PlayersGetAllQueryParams,
  options?: UseQueryOptions<PlayerResponse[], AxiosError, PlayerResponse[]>,
) => {
  const { errorToast } = useToast()

  const getPlayersQuery = useQuery({
    onError: (error) => {
      const apiError = getAxiosError(error)

      if (apiError) {
        apiError.errors.forEach((message) => {
          errorToast(message)
        })
      }
    },
    queryFn: () => axiosGet<PlayerResponse[]>(Path.Players, { params }),
    queryKey: queryKeys.players.list(params),
    ...options,
  })

  const players = getPlayersQuery.data

  return {
    ...getPlayersQuery,
    players,
  }
}
