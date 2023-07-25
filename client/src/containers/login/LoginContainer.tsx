import { LoginFormValues } from "@client/components/organisms/LoginForm/@types/LoginForm"
import { LoginForm } from "@client/components/organisms/LoginForm/LoginForm"
import { useCreatePlayer } from "@client/api/mutations/useCreatePlayer"
import { useAuthenticatedUser } from "@client/hooks/useAuthenticatedUser"

export const LoginContainer: React.FC = () => {
  const { createPlayer, isLoading } = useCreatePlayer()
  const { setAuthenticatedUser } = useAuthenticatedUser()

  const handleSubmit = (data: LoginFormValues) => {
    createPlayer(data, {
      onSuccess: (player) => {
        setAuthenticatedUser(player)
      },
    })
  }

  return <LoginForm isLoading={isLoading} onSubmit={handleSubmit} />
}
