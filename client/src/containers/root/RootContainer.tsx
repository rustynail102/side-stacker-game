import { useGetPlayer } from "@client/api/queries/useGetPlayer"
import { FullScreenLoader } from "@client/components/atoms/FullScreenLoader/FullScreenLoader"
import { LoginContainer } from "@client/containers/login/LoginContainer"
import { RootContainerHeaderSection } from "@client/containers/root/sections/header/RootContainerHeaderSection"
import { useAuthenticatedUser } from "@client/hooks/useAuthenticatedUser"
import { useToast } from "@client/hooks/useToast"
import { useWebsockets } from "@client/hooks/useWebsockets"
import { Outlet } from "@tanstack/router"

export const RootContainer: React.FC = () => {
  useWebsockets()

  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser()
  const { successToast } = useToast()
  const { isInitialLoading } = useGetPlayer(authenticatedUser, {
    onError: () => {
      setAuthenticatedUser(undefined)
    },
    onSuccess: (player) => {
      successToast(`Welcome back, ${player.username}`)
      setAuthenticatedUser(player)
    },
  })

  if (isInitialLoading) {
    return <FullScreenLoader />
  }

  if (!authenticatedUser) {
    return <LoginContainer />
  }

  return (
    <div>
      <RootContainerHeaderSection />
      <Outlet /> {/* This is where child routes will render */}
    </div>
  )
}
