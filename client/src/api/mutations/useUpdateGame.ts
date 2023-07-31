import { UpdateGamePutBody, GameResponse } from "@server/@types/api"
import { Path } from "@server/routes/paths"
import { useApiMutation } from "@client/hooks/useApiMutation"
import { ApiMutationHttpMethod } from "@client/hooks/@types/useApiMutation"

/**
 * Hook used to update a particular game.
 * @param {Object} params - Parameters for the game to update.
 * @returns {Object} - The query object from React Query, with the updateGame mutation added.
 */
export const useUpdateGame = (
  params: Partial<Pick<GameResponse, "game_id">>,
) => {
  const { apiMutation, ...mutation } = useApiMutation<
    GameResponse,
    UpdateGamePutBody
  >(
    Path.Game.replace(":game_id", params.game_id || ""),
    ApiMutationHttpMethod.PUT,
  )

  return {
    ...mutation,
    updateGame: apiMutation,
  }
}
