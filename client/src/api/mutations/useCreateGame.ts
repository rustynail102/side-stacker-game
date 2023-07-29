import { axiosPost } from "@client/helpers/api/axiosPost"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { CreateGamePostBody, GameResponse } from "@server/@types/api"
import { MutateOptions, useMutation } from "@tanstack/react-query"
import { Path } from "@server/routes/paths"

export const useCreateGame = () => {
  const { mutate, ...createGameMutation } = useMutation({
    mutationFn: (body: CreateGamePostBody) =>
      axiosPost<GameResponse>(Path.Games, body),
  })
  const { errorToast } = useToast()

  const createGame = (
    body: CreateGamePostBody,
    options?: MutateOptions<GameResponse, unknown, CreateGamePostBody, unknown>,
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
    ...createGameMutation,
    createGame,
  }
}
