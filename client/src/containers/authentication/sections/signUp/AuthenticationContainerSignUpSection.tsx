import { useCreatePlayer } from "@client/api/mutations/useCreatePlayer"
import { queryKeys } from "@client/api/queryKeys"
import { AuthenticationFormValues } from "@client/components/organisms/AuthenticationForm/@types/AuthenticationForm"
import { AuthenticationForm } from "@client/components/organisms/AuthenticationForm/AuthenticationForm"
import { PlayerResponse } from "@server/@types/api"
import { useQueryClient } from "@tanstack/react-query"

/**
 * Section component for the sign up form in the authentication page. It handles the player creation logic, and updates the current player's data on successful account creation.
 */
export const AuthenticationContainerSignUpSection: React.FC = () => {
  const { createPlayer, isLoading: isCreatingPlayer } = useCreatePlayer()
  const queryClient = useQueryClient()

  const onSuccess = (player: PlayerResponse) => {
    queryClient.setQueriesData(queryKeys.players.current, player)
  }

  const handleCreatePlayer = (data: AuthenticationFormValues) => {
    createPlayer(data, {
      onSuccess,
    })
  }

  return (
    <AuthenticationForm
      buttonText="Create Account"
      isLoading={isCreatingPlayer}
      onSubmit={handleCreatePlayer}
      title="Sign Up"
    />
  )
}
