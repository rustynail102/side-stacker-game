import { Path } from "@server/routes/paths"
import { useApiMutation } from "@client/hooks/useApiMutation"
import { ApiMutationHttpMethod } from "@client/hooks/@types/useApiMutation"

/**
 * Hook used to sign out.
 * @returns {Object} - The query object from React Query, with the signOut mutation added.
 */
export const useSignOut = () => {
  const { apiMutation, ...mutation } = useApiMutation<undefined, undefined>(
    Path.SignOut,
    ApiMutationHttpMethod.POST,
  )

  return {
    ...mutation,
    signOut: apiMutation,
  }
}
