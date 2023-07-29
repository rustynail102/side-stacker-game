import { queryKeys } from "@client/api/queryKeys"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlayerResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"

export const useGetCurrentPlayer = (
  options?: UseQueryOptions<PlayerResponse, AxiosError, PlayerResponse>,
) => {
  const getCurrentPlayerQuery = useQuery({
    queryFn: () => axiosGet<PlayerResponse>(Path.CurrentPlayer),
    queryKey: queryKeys.players.current,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    ...options,
  })

  const currentPlayer = getCurrentPlayerQuery.data

  return {
    ...getCurrentPlayerQuery,
    currentPlayer,
  }
}
