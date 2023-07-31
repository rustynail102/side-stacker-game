import { CreateGamePostBody, GameResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiMutation } from "@client/hooks/useApiMutation"
import { ApiMutationHttpMethod } from "@client/hooks/@types/useApiMutation"

/**
 * Hook to create a new game.
 * @returns {Object} - The query object from React Query, with the createGame mutation added.
 */
export const useCreateGame = () => {
  const { apiMutation, ...mutation } = useApiMutation<
    GameResponse,
    CreateGamePostBody
  >(Path.Games, ApiMutationHttpMethod.POST)

  return {
    ...mutation,
    createGame: apiMutation,
  }
}
