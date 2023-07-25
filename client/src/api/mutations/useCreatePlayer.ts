import { axiosPost } from "@client/helpers/api/axiosPost"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { PlayerResponse } from "@server/@types/api"
import { MutateOptions, useMutation } from "@tanstack/react-query"

export const useCreatePlayer = () => {
  const { mutate, ...createPlayerMutation } = useMutation({
    mutationFn: (body: Pick<PlayerResponse, "username">) =>
      axiosPost<PlayerResponse>("/players", body),
  })
  const { errorToast } = useToast()

  const createPlayer = (
    body: Pick<PlayerResponse, "username">,
    options?: MutateOptions<
      PlayerResponse,
      unknown,
      Pick<PlayerResponse, "username">,
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
