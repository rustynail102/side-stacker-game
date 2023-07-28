import { axiosPost } from "@client/helpers/api/axiosPost"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { CreatePlayerPostBody, PlayerResponse } from "@server/@types/api"
import { MutateOptions, useMutation } from "@tanstack/react-query"
import { Path } from "@server/routes/paths"

export const useCreatePlayer = () => {
  const { mutate, ...createPlayerMutation } = useMutation({
    mutationFn: (body: CreatePlayerPostBody) =>
      axiosPost<PlayerResponse>(Path.Players, body),
  })
  const { errorToast } = useToast()

  const createPlayer = (
    body: CreatePlayerPostBody,
    options?: MutateOptions<
      PlayerResponse,
      unknown,
      CreatePlayerPostBody,
      unknown
    >,
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
    ...createPlayerMutation,
    createPlayer,
  }
}
