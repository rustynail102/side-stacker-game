import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { UpdateGamePutBody, GameResponse } from "@server/@types/api"
import { MutateOptions, useMutation } from "@tanstack/react-query"
import { Path } from "@server/routes/paths"
import { axiosPut } from "@client/helpers/api/axiosPut"

export const useUpdateGame = (
  params: Partial<Pick<GameResponse, "game_id">>,
) => {
  const { mutate, ...updateGameMutation } = useMutation({
    mutationFn: (body: UpdateGamePutBody) =>
      axiosPut<GameResponse>(
        Path.Game.replace(":game_id", params.game_id || ""),
        body,
      ),
  })
  const { errorToast } = useToast()

  const updateGame = (
    body: UpdateGamePutBody,
    options?: MutateOptions<GameResponse, unknown, UpdateGamePutBody, unknown>,
  ) =>
    mutate(body, {
      onError: (error) => {
        const apiError = getAxiosError(error)

        if (apiError) {
          apiError.errors.forEach((message) => {
            errorToast(message)
          })
        }
      },
      ...options,
    })

  return {
    ...updateGameMutation,
    updateGame,
  }
}
