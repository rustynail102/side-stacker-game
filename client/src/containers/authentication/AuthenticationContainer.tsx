import { AuthenticationFormValues } from "@client/components/organisms/AuthenticationForm/@types/AuthenticationForm"
import { AuthenticationForm } from "@client/components/organisms/AuthenticationForm/AuthenticationForm"
import { useCreatePlayer } from "@client/api/mutations/useCreatePlayer"
import { useQueryClient } from "@tanstack/react-query"
import { PlayerResponse } from "@server/@types/api"
import { AuthenticationTemplate } from "@client/components/templates/AuthenticationTemplate/AuthenticationTemplate"
import { useSignIn } from "@client/api/mutations/useSignIn"
import { queryKeys } from "@client/api/queryKeys"

export const AuthenticationContainer: React.FC = () => {
  const { createPlayer, isLoading: isCreatingPlayer } = useCreatePlayer()
  const { signIn, isLoading: isSigningIn } = useSignIn()
  const queryClient = useQueryClient()

  const onSuccess = (player: PlayerResponse) => {
    queryClient.setQueriesData(queryKeys.players.current, player)
  }

  const handleSignIn = (data: AuthenticationFormValues) => {
    signIn(data, {
      onSuccess,
    })
  }

  const handleCreatePlayer = (data: AuthenticationFormValues) => {
    createPlayer(data, {
      onSuccess,
    })
  }

  return (
    <AuthenticationTemplate>
      <AuthenticationForm isLoading={isSigningIn} onSubmit={handleSignIn} />
      <AuthenticationForm
        buttonText="Create Account"
        isLoading={isCreatingPlayer}
        onSubmit={handleCreatePlayer}
        title="Sign Up"
      />
    </AuthenticationTemplate>
  )
}
