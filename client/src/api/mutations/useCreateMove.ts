import { CreateMovePostBody, MoveResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiMutation } from "@client/hooks/useApiMutation"
import { ApiMutationHttpMethod } from "@client/hooks/@types/useApiMutation"

/**
 * Hook to create a new move.
 * @returns {Object} - The query object from React Query, with the createMove mutation added.
 */
export const useCreateMove = () => {
  const { apiMutation, ...mutation } = useApiMutation<
    MoveResponse,
    CreateMovePostBody
  >(Path.Moves, ApiMutationHttpMethod.POST)

  return {
    ...mutation,
    createMove: apiMutation,
  }
}
