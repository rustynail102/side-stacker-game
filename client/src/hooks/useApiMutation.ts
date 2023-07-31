import { axiosPost } from "@client/helpers/api/axiosPost"
import { axiosPut } from "@client/helpers/api/axiosPut"
import { getAxiosError } from "@client/helpers/api/getAxiosError"
import { ApiMutationHttpMethod } from "@client/hooks/@types/useApiMutation"
import { useToast } from "@client/hooks/useToast"
import { MutateOptions, useMutation } from "@tanstack/react-query"

/**
 * Custom hook to make API mutation requests with React Query and Axios.
 * Automatically handles error toasts.
 * @param {String} path - API path.
 * @param {Enum} method - Type of HTTP method (PUT or POST).
 * @returns {Object} - The mutation object from React Query, with an additional mutate function that includes automatic error handling.
 */
export const useApiMutation = <
  ResponseBody,
  RequestBody extends Record<string, unknown> | undefined,
>(
  path: string,
  method: ApiMutationHttpMethod,
) => {
  const { mutate, ...mutation } = useMutation({
    mutationFn: (body: RequestBody) => {
      switch (method) {
        case ApiMutationHttpMethod.PUT:
          return axiosPut<ResponseBody>(path, body)

        case ApiMutationHttpMethod.POST:
          return axiosPost<ResponseBody>(path, body)
      }
    },
  })

  const { errorToast } = useToast()

  const apiMutation = (
    body: RequestBody,
    options?: MutateOptions<ResponseBody, unknown, RequestBody, unknown>,
  ) =>
    mutate(body, {
      onError: (error: unknown) => {
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
    ...mutation,
    apiMutation,
  }
}
