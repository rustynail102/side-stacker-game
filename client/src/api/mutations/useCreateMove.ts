import { axiosPost } from "@client/helpers/api/axiosPost"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { CreateMovePostBody, MoveResponse } from "@server/@types/api"
import { MutateOptions, useMutation } from "@tanstack/react-query"
import { Path } from "@server/routes/paths"

export const useCreateMove = () => {
  const { mutate, ...createMoveMutation } = useMutation({
    mutationFn: (body: CreateMovePostBody) =>
      axiosPost<MoveResponse>(Path.Moves, body),
  })
  const { errorToast } = useToast()

  const createMove = (
    body: CreateMovePostBody,
    options?: MutateOptions<MoveResponse, unknown, CreateMovePostBody, unknown>,
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
    ...createMoveMutation,
    createMove,
  }
}
