import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { FullScreenLoader } from "@client/components/atoms/FullScreenLoader/FullScreenLoader"
import { AuthenticationContainer } from "@client/containers/authentication/AuthenticationContainer"
import { RootContainerHeaderSection } from "@client/containers/root/sections/header/RootContainerHeaderSection"
import { useToast } from "@client/hooks/useToast"
import { useWebsockets } from "@client/hooks/useWebsockets"
import { Outlet } from "@tanstack/router"

export const RootContainer: React.FC = () => {
  useWebsockets()

  const { successToast } = useToast()
  const { currentPlayer, isInitialLoading } = useGetCurrentPlayer({
    onSuccess: (player) => {
      successToast(`Welcome back, ${player.username}`)
    },
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (isInitialLoading) {
    return <FullScreenLoader />
  }

  if (!currentPlayer) {
    return <AuthenticationContainer />
  }

  return (
    <div>
      <RootContainerHeaderSection />
      <Outlet /> {/* This is where child routes will render */}
    </div>
  )
}
