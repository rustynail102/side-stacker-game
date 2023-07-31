import { CreatePlayerPostBody, PlayerResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiMutation } from "@client/hooks/useApiMutation"
import { ApiMutationHttpMethod } from "@client/hooks/@types/useApiMutation"

/**
 * Hook to create a new player.
 * @returns {Object} - The query object from React Query, with the createPlayer mutation added.
 */
export const useCreatePlayer = () => {
  const { apiMutation, ...mutation } = useApiMutation<
    PlayerResponse,
    CreatePlayerPostBody
  >(Path.Players, ApiMutationHttpMethod.POST)

  return {
    ...mutation,
    createPlayer: apiMutation,
  }
}
