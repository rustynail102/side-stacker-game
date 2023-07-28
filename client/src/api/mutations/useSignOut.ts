import { axiosPost } from "@client/helpers/api/axiosPost"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { useToast } from "@client/hooks/useToast"
import { MutateOptions, useMutation } from "@tanstack/react-query"
import { Path } from "@server/routes/paths"

export const useSignOut = () => {
  const { mutate, ...signOutMutation } = useMutation({
    mutationFn: () => axiosPost(Path.SignOut),
  })
  const { errorToast } = useToast()

  const signOut = (
    options?: MutateOptions<unknown, unknown, unknown, unknown>,
  ) =>
    mutate(undefined, {
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
    ...signOutMutation,
    signOut,
  }
}
