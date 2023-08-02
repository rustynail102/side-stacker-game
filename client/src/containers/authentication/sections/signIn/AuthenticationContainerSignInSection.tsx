import { useSignIn } from "@client/api/mutations/useSignIn"
import { queryKeys } from "@client/api/queryKeys"
import { AuthenticationFormValues } from "@client/components/organisms/AuthenticationForm/@types/AuthenticationForm"
import { AuthenticationForm } from "@client/components/organisms/AuthenticationForm/AuthenticationForm"
import { PlayerResponse } from "@server/@types/api"
import { useQueryClient } from "@tanstack/react-query"

/**
 * Section component for the sign in form in the authentication page. It handles the sign in logic, and updates the current player's data on successful sign in.
 */
export const AuthenticationContainerSignInSection: React.FC = () => {
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

  return (
    <AuthenticationForm
      dataTestId="SignInForm"
      isLoading={isSigningIn}
      onSubmit={handleSignIn}
    />
  )
}
