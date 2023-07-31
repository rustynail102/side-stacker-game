import { PlayerResponse, SignInPostBody } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiMutation } from "@client/hooks/useApiMutation"
import { ApiMutationHttpMethod } from "@client/hooks/@types/useApiMutation"

/**
 * Hook used to sign in.
 * @returns {Object} - The query object from React Query, with the signIn mutation added.
 */
export const useSignIn = () => {
  const { apiMutation, ...mutation } = useApiMutation<
    PlayerResponse,
    SignInPostBody
  >(Path.SignIn, ApiMutationHttpMethod.POST)

  return {
    ...mutation,
    signIn: apiMutation,
  }
}
