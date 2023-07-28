import { axiosPost } from "@client/helpers/api/axiosPost"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { PlayerResponse, SignInPostBody } from "@server/@types/api"
import { MutateOptions, useMutation } from "@tanstack/react-query"
import { Path } from "@server/routes/paths"

export const useSignIn = () => {
  const { mutate, ...signInMutation } = useMutation({
    mutationFn: (body: SignInPostBody) =>
      axiosPost<PlayerResponse>(Path.SignIn, body),
  })
  const { errorToast } = useToast()

  const signIn = (
    body: SignInPostBody,
    options?: MutateOptions<PlayerResponse, unknown, SignInPostBody, unknown>,
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
    ...signInMutation,
    signIn,
  }
}
