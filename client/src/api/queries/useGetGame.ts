import { queryKeys } from "@client/api/queryKeys"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { GameResponse } from "@server/@types/api"
import { useToast } from "@client/hooks/useToast"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { Path } from "@server/routes/paths"

export const useGetGame = (
  params: Partial<Pick<GameResponse, "game_id">>,
  options?: UseQueryOptions<GameResponse, AxiosError, GameResponse>,
) => {
  const { errorToast } = useToast()

  const getGameQuery = useQuery({
    enabled: Boolean(params?.game_id),
    onError: (error) => {
      const apiError = getAxiosError(error)

      if (apiError) {
        apiError.errors.forEach((message) => {
          errorToast(message)
        })
      }
    },
    queryFn: () =>
      axiosGet<GameResponse>(
        Path.Game.replace(":game_id", params.game_id || ""),
      ),
    queryKey: queryKeys.games.detail(params.game_id),
    ...options,
  })

  const game = getGameQuery.data

  return {
    ...getGameQuery,
    game,
  }
}
