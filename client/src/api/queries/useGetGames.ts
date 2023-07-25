import { queryKeys } from "@client/api/queryKeys"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { GameResponse, GamesGetAllQueryParams } from "@server/@types/api"

export const useGetGames = (
  params?: GamesGetAllQueryParams,
  options?: UseQueryOptions<GameResponse[], AxiosError, GameResponse[]>,
) => {
  const getGamesQuery = useQuery({
    queryFn: () => axiosGet<GameResponse[]>("/games", { params }),
    queryKey: queryKeys.games.list(params),
    ...options,
  })

  const games = getGamesQuery.data

  return {
    ...getGamesQuery,
    games,
  }
}
